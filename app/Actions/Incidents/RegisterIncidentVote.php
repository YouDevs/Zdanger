<?php

namespace App\Actions\Incidents;

use App\Enums\IncidentStatus;
use App\Enums\IncidentVoteType;
use App\Models\Incident;
use App\Models\IncidentVote;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class RegisterIncidentVote
{
    public function __construct(private UpdateIncidentStatus $updateIncidentStatus) {}

    public function execute(
        Incident $incident,
        IncidentVoteType $voteType,
        ?User $user = null,
        ?string $ipAddress = null,
    ): Incident {
        return DB::transaction(function () use ($incident, $voteType, $user, $ipAddress): Incident {
            $attributes = [
                'incident_id' => $incident->id,
                'user_id' => $user?->id,
            ];

            $values = [
                'vote_type' => $voteType,
            ];

            if ($user === null) {
                $attributes['ip_hash'] = $this->hashedIp($ipAddress);
                $values['ip_hash'] = $attributes['ip_hash'];
            }

            IncidentVote::query()->updateOrCreate($attributes, $values);

            $freshIncident = $incident->fresh(['votes', 'evidences']);

            if ($freshIncident === null) {
                return $incident;
            }

            if (
                $voteType === IncidentVoteType::Confirm &&
                $freshIncident->confirmationsCount() >= 2 &&
                in_array($freshIncident->status, [IncidentStatus::Pending, IncidentStatus::VisibleUnverified], true)
            ) {
                return $this->updateIncidentStatus->execute(
                    $freshIncident,
                    IncidentStatus::CommunityValidated,
                    null,
                    'El reporte alcanzo validacion por comunidad mediante votos publicos.',
                );
            }

            $freshIncident->refreshConfidenceScore();

            return $freshIncident->fresh(['votes', 'evidences', 'statusLogs']) ?? $freshIncident;
        });
    }

    private function hashedIp(?string $ipAddress): string
    {
        return hash_hmac('sha256', $ipAddress ?? 'unknown-ip', (string) config('app.key'));
    }
}
