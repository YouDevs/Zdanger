<?php

namespace App\Models;

use App\Enums\IncidentStatus;
use App\Enums\IncidentVoteType;
use Database\Factories\IncidentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'user_id',
    'type',
    'title',
    'description',
    'latitude',
    'longitude',
    'approximate_address',
    'neighborhood',
    'city',
    'state',
    'occurred_at',
    'status',
    'confidence_score',
    'visibility_radius',
    'is_anonymous',
    'is_public',
    'duplicate_of_id',
    'reviewed_by',
    'reviewed_at',
])]
class Incident extends Model
{
    /** @use HasFactory<IncidentFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::saving(function (self $incident): void {
            $incident->confidence_score = $incident->calculateConfidenceScore();
        });
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'occurred_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'is_anonymous' => 'boolean',
            'is_public' => 'boolean',
            'status' => IncidentStatus::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function duplicateOf(): BelongsTo
    {
        return $this->belongsTo(self::class, 'duplicate_of_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function evidences(): HasMany
    {
        return $this->hasMany(IncidentEvidence::class);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(IncidentVote::class);
    }

    public function statusLogs(): HasMany
    {
        return $this->hasMany(IncidentStatusLog::class);
    }

    #[Scope]
    protected function publiclyVisible(Builder $query): void
    {
        $query->where('is_public', true);
    }

    public function calculateConfidenceScore(): int
    {
        $score = 0;

        if ($this->hasApprovedEvidence()) {
            $score += 20;
        }

        if ($this->user_id !== null) {
            $score += 20;
        }

        if ($this->confirmationsCount() >= 2) {
            $score += 20;
        }

        if ($this->hasModeratorValidation()) {
            $score += 20;
        }

        if ($this->status === IncidentStatus::ExternallyConfirmed) {
            $score += 20;
        }

        return min($score, 100);
    }

    public function refreshConfidenceScore(): void
    {
        $this->forceFill([
            'confidence_score' => $this->calculateConfidenceScore(),
        ])->save();
    }

    public function hasApprovedEvidence(): bool
    {
        if (! $this->exists && ! $this->relationLoaded('evidences')) {
            return false;
        }

        if ($this->relationLoaded('evidences')) {
            return $this->evidences->contains(
                fn (IncidentEvidence $evidence): bool => $evidence->status === 'approved'
            );
        }

        return $this->evidences()->where('status', 'approved')->exists();
    }

    public function confirmationsCount(): int
    {
        if (! $this->exists && ! $this->relationLoaded('votes')) {
            return 0;
        }

        if ($this->relationLoaded('votes')) {
            return $this->votes
                ->where('vote_type', IncidentVoteType::Confirm->value)
                ->count();
        }

        return $this->votes()
            ->where('vote_type', IncidentVoteType::Confirm->value)
            ->count();
    }

    public function hasModeratorValidation(): bool
    {
        if ($this->reviewed_by === null && $this->reviewed_at === null) {
            return false;
        }

        return in_array(
            $this->status,
            [
                IncidentStatus::VisibleUnverified,
                IncidentStatus::CommunityValidated,
                IncidentStatus::EvidenceValidated,
                IncidentStatus::ExternallyConfirmed,
            ],
            true,
        );
    }
}
