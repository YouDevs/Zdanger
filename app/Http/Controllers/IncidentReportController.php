<?php

namespace App\Http\Controllers;

use App\Enums\IncidentStatus;
use App\Http\Requests\StoreIncidentReportRequest;
use App\Models\Incident;
use App\Models\IncidentStatusLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class IncidentReportController extends Controller
{
    /**
     * Store a newly created incident report.
     */
    public function store(StoreIncidentReportRequest $request): RedirectResponse
    {
        $incident = DB::transaction(function () use ($request): Incident {
            $incident = Incident::create([
                'user_id' => $this->resolveUserId($request->boolean('is_anonymous', true), $request->user()?->id),
                'type' => $request->string('type')->value(),
                'title' => $request->string('title')->value() ?: null,
                'description' => $request->string('description')->value(),
                'latitude' => $request->input('latitude'),
                'longitude' => $request->input('longitude'),
                'approximate_address' => $request->string('approximate_address')->value() ?: null,
                'neighborhood' => $request->string('neighborhood')->value() ?: null,
                'city' => $request->string('city')->value() ?: null,
                'state' => $request->string('state')->value() ?: null,
                'occurred_at' => $this->resolveOccurredAt(
                    $request->string('occurred_on')->value(),
                    $request->string('occurred_time')->value(),
                ),
                'status' => IncidentStatus::Pending,
                'visibility_radius' => $request->integer('visibility_radius') ?: 250,
                'is_anonymous' => $this->resolveAnonymousFlag($request),
                'is_public' => false,
            ]);

            if ($request->hasFile('evidence')) {
                $this->storeEvidence($incident, $request->file('evidence'));
            }

            IncidentStatusLog::create([
                'incident_id' => $incident->id,
                'previous_status' => null,
                'new_status' => IncidentStatus::Pending,
                'changed_by' => null,
                'reason' => 'Reporte ciudadano creado desde formulario publico.',
            ]);

            $incident->refreshConfidenceScore();

            return $incident;
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Tu reporte fue recibido y quedo pendiente de revision.',
        ]);

        return to_route('report_incident_form')
            ->with('created_incident_id', $incident->id);
    }

    private function resolveAnonymousFlag(StoreIncidentReportRequest $request): bool
    {
        if (! $request->user()) {
            return true;
        }

        return $request->boolean('is_anonymous', true);
    }

    private function resolveUserId(bool $isAnonymous, ?int $userId): ?int
    {
        if ($isAnonymous || $userId === null) {
            return null;
        }

        return $userId;
    }

    private function resolveOccurredAt(?string $occurredOn, ?string $occurredTime): ?string
    {
        if (! $occurredOn && ! $occurredTime) {
            return null;
        }

        $date = $occurredOn ?: now()->toDateString();
        $time = $occurredTime ?: '00:00';

        return "{$date} {$time}:00";
    }

    private function storeEvidence(Incident $incident, UploadedFile $file): void
    {
        $path = $file->store("incident-evidences/{$incident->id}", 'local');

        $incident->evidences()->create([
            'file_path' => $path,
            'file_type' => str_starts_with($file->getMimeType() ?? '', 'video/') ? 'video' : 'image',
            'original_filename' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'status' => 'pending',
        ]);
    }
}
