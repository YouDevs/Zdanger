<?php

namespace App\Actions\Incidents;

use App\Models\IncidentEvidence;
use Illuminate\Support\Facades\DB;

class UpdateIncidentEvidenceStatus
{
    public function execute(IncidentEvidence $evidence, string $status): IncidentEvidence
    {
        return DB::transaction(function () use ($evidence, $status): IncidentEvidence {
            $evidence->forceFill([
                'status' => $status,
            ])->save();

            $incident = $evidence->incident()->with(['votes', 'evidences'])->first();

            if ($incident !== null) {
                $incident->refreshConfidenceScore();
            }

            return $evidence->fresh('incident') ?? $evidence;
        });
    }
}
