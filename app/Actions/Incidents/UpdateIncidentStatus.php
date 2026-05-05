<?php

namespace App\Actions\Incidents;

use App\Enums\IncidentStatus;
use App\Models\Incident;
use App\Models\IncidentStatusLog;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UpdateIncidentStatus
{
    /**
     * @var array<int, IncidentStatus>
     */
    private const PUBLIC_STATUSES = [
        IncidentStatus::VisibleUnverified,
        IncidentStatus::CommunityValidated,
        IncidentStatus::EvidenceValidated,
        IncidentStatus::ExternallyConfirmed,
    ];

    public function execute(
        Incident $incident,
        IncidentStatus $newStatus,
        ?User $reviewer = null,
        ?string $reason = null,
        ?Incident $duplicateOf = null,
    ): Incident {
        return DB::transaction(function () use ($incident, $newStatus, $reviewer, $reason, $duplicateOf): Incident {
            $incident->refresh();

            $previousStatus = $incident->status;

            $incident->forceFill([
                'status' => $newStatus,
                'is_public' => in_array($newStatus, self::PUBLIC_STATUSES, true),
                'duplicate_of_id' => $newStatus === IncidentStatus::Duplicated ? $duplicateOf?->id : null,
                'reviewed_by' => $reviewer?->id ?? $incident->reviewed_by,
                'reviewed_at' => now(),
            ])->save();

            if ($previousStatus !== $newStatus) {
                IncidentStatusLog::create([
                    'incident_id' => $incident->id,
                    'previous_status' => $previousStatus,
                    'new_status' => $newStatus,
                    'changed_by' => $reviewer?->id,
                    'reason' => $reason,
                ]);
            }

            $incident->refreshConfidenceScore();

            return $incident->fresh(['votes', 'evidences', 'statusLogs']) ?? $incident;
        });
    }
}
