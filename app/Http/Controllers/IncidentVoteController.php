<?php

namespace App\Http\Controllers;

use App\Enums\IncidentStatus;
use App\Enums\IncidentVoteType;
use App\Http\Requests\StoreIncidentVoteRequest;
use App\Models\Incident;
use App\Models\IncidentStatusLog;
use App\Models\IncidentVote;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class IncidentVoteController extends Controller
{
    private const VOTABLE_STATUSES = [
        IncidentStatus::Pending->value,
        IncidentStatus::VisibleUnverified->value,
        IncidentStatus::CommunityValidated->value,
        IncidentStatus::EvidenceValidated->value,
        IncidentStatus::ExternallyConfirmed->value,
    ];

    /**
     * Store or update a vote for a public incident.
     */
    public function store(StoreIncidentVoteRequest $request, Incident $incident): RedirectResponse
    {
        $incident = Incident::query()
            ->whereKey($incident->getKey())
            ->where('is_public', true)
            ->whereIn('status', self::VOTABLE_STATUSES)
            ->firstOrFail();

        DB::transaction(function () use ($request, $incident): void {
            $attributes = ['incident_id' => $incident->id];

            if ($request->user() !== null) {
                $attributes['user_id'] = $request->user()->id;
            } else {
                $attributes['user_id'] = null;
                $attributes['ip_hash'] = $this->hashedIp($request->ip());
            }

            $values = [
                'vote_type' => $request->enum('vote_type', IncidentVoteType::class),
            ];

            if (array_key_exists('ip_hash', $attributes)) {
                $values['ip_hash'] = $attributes['ip_hash'];
            }

            IncidentVote::query()->updateOrCreate($attributes, $values);

            $freshIncident = $incident->fresh(['votes', 'evidences']);

            if ($freshIncident === null) {
                return;
            }

            if (
                $freshIncident->confirmationsCount() >= 2 &&
                in_array($freshIncident->status, [IncidentStatus::Pending, IncidentStatus::VisibleUnverified], true)
            ) {
                $previousStatus = $freshIncident->status;

                $freshIncident->forceFill([
                    'status' => IncidentStatus::CommunityValidated,
                    'reviewed_at' => now(),
                ])->save();

                IncidentStatusLog::create([
                    'incident_id' => $freshIncident->id,
                    'previous_status' => $previousStatus,
                    'new_status' => IncidentStatus::CommunityValidated,
                    'changed_by' => null,
                    'reason' => 'El reporte alcanzo validacion por comunidad mediante votos publicos.',
                ]);
            }

            $freshIncident->refreshConfidenceScore();
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $request->string('vote_type')->value() === IncidentVoteType::FalseReport->value
                ? 'Tu observacion fue registrada para revision.'
                : 'Tu confirmacion fue registrada.',
        ]);

        return back();
    }

    private function hashedIp(?string $ipAddress): string
    {
        return hash_hmac('sha256', $ipAddress ?? 'unknown-ip', (string) config('app.key'));
    }
}
