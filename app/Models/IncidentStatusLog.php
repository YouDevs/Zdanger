<?php

namespace App\Models;

use App\Enums\IncidentStatus;
use Database\Factories\IncidentStatusLogFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'incident_id',
    'previous_status',
    'new_status',
    'changed_by',
    'reason',
])]
class IncidentStatusLog extends Model
{
    /** @use HasFactory<IncidentStatusLogFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'previous_status' => IncidentStatus::class,
            'new_status' => IncidentStatus::class,
        ];
    }

    public function incident(): BelongsTo
    {
        return $this->belongsTo(Incident::class);
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
