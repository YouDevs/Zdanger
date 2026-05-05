<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Incidents\UpdateIncidentEvidenceStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateIncidentEvidenceStatusRequest;
use App\Models\IncidentEvidence;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ModerationEvidenceStatusController extends Controller
{
    public function update(
        UpdateIncidentEvidenceStatusRequest $request,
        IncidentEvidence $evidence,
        UpdateIncidentEvidenceStatus $updateIncidentEvidenceStatus,
    ): RedirectResponse {
        $updatedEvidence = $updateIncidentEvidenceStatus->execute(
            $evidence,
            $request->string('status')->value(),
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'El estado de la evidencia fue actualizado.',
        ]);

        return to_route('admin.reports.show', $updatedEvidence->incident_id);
    }
}
