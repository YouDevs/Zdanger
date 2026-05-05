<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Incidents\UpdateIncidentStatus;
use App\Enums\IncidentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateIncidentStatusRequest;
use App\Http\Requests\Admin\ViewModerationReportsRequest;
use App\Models\Incident;
use App\Models\IncidentEvidence;
use App\Models\IncidentStatusLog;
use App\Models\IncidentVote;
use App\PublicIncidentMapData;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class ModerationReportController extends Controller
{
    public function index(
        ViewModerationReportsRequest $request,
        PublicIncidentMapData $publicIncidentMapData,
    ): Response {
        return $this->renderPage($request, $publicIncidentMapData);
    }

    public function show(
        ViewModerationReportsRequest $request,
        Incident $incident,
        PublicIncidentMapData $publicIncidentMapData,
    ): Response {
        return $this->renderPage($request, $publicIncidentMapData, $incident->id);
    }

    public function updateStatus(
        UpdateIncidentStatusRequest $request,
        Incident $incident,
        UpdateIncidentStatus $updateIncidentStatus,
    ): RedirectResponse {
        $duplicateOf = null;

        if ($request->integer('duplicate_of_id') > 0) {
            $duplicateOf = Incident::query()->find($request->integer('duplicate_of_id'));
        }

        $updateIncidentStatus->execute(
            $incident,
            IncidentStatus::from($request->string('status')->value()),
            $request->user(),
            $request->string('reason')->value() ?: null,
            $duplicateOf,
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'El estado del reporte fue actualizado.',
        ]);

        return to_route('admin.reports.show', $incident);
    }

    private function renderPage(
        ViewModerationReportsRequest $request,
        PublicIncidentMapData $publicIncidentMapData,
        ?int $selectedIncidentId = null,
    ): Response {
        $filters = $this->normalizedFilters($request);

        $incidents = Incident::query()
            ->with(['user', 'reviewer', 'evidences', 'votes'])
            ->when(
                $filters['status'] !== null,
                fn (Builder $query) => $query->where('status', $filters['status']),
            )
            ->when(
                $filters['type'] !== null,
                fn (Builder $query) => $query->where('type', $filters['type']),
            )
            ->when(
                $filters['city'] !== null,
                fn (Builder $query) => $query->where('city', $filters['city']),
            )
            ->when(
                $filters['date_range'] !== 'all',
                fn (Builder $query) => $query->where('occurred_at', '>=', $this->cutoffForRange($filters['date_range'])),
            )
            ->orderByRaw("case when status = 'pending' then 0 else 1 end")
            ->orderByDesc('created_at')
            ->get();

        $selectedIncident = $selectedIncidentId === null
            ? $incidents->first()
            : Incident::query()
                ->with(['user', 'reviewer', 'duplicateOf', 'evidences', 'votes', 'statusLogs.changedBy'])
                ->findOrFail($selectedIncidentId);

        return Inertia::render('admin/reports/index', [
            'reports' => $incidents
                ->map(fn (Incident $incident): array => $this->reportRow($incident, $publicIncidentMapData))
                ->values(),
            'selectedReport' => $selectedIncident === null
                ? null
                : $this->selectedReportPayload($selectedIncident, $publicIncidentMapData),
            'filters' => $filters,
            'filterOptions' => [
                'statuses' => collect(IncidentStatus::cases())
                    ->map(fn (IncidentStatus $status): array => [
                        'value' => $status->value,
                        'label' => $this->statusLabel($status),
                    ])
                    ->values(),
                'types' => collect($this->typeOptions())
                    ->map(fn (string $label, string $value): array => ['value' => $value, 'label' => $label])
                    ->values(),
                'cities' => Incident::query()
                    ->whereNotNull('city')
                    ->distinct()
                    ->orderBy('city')
                    ->pluck('city')
                    ->values(),
                'dateRanges' => [
                    ['value' => '24h', 'label' => 'Ultimas 24h'],
                    ['value' => '7d', 'label' => '7 dias'],
                    ['value' => '30d', 'label' => '30 dias'],
                    ['value' => 'all', 'label' => 'Todo'],
                ],
            ],
            'summary' => [
                'total' => Incident::count(),
                'pending' => Incident::where('status', IncidentStatus::Pending)->count(),
                'public' => Incident::where('is_public', true)->count(),
                'approvedEvidence' => IncidentEvidence::where('status', 'approved')->count(),
            ],
        ]);
    }

    /**
     * @return array{status: ?string, type: ?string, city: ?string, date_range: string}
     */
    private function normalizedFilters(ViewModerationReportsRequest $request): array
    {
        return [
            'status' => $request->string('status')->value() ?: null,
            'type' => $request->string('type')->value() ?: null,
            'city' => $request->string('city')->value() ?: null,
            'date_range' => $request->string('date_range')->value() ?: 'all',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function reportRow(Incident $incident, PublicIncidentMapData $publicIncidentMapData): array
    {
        $payload = $publicIncidentMapData->incidentPayload($incident);

        return [
            ...$payload,
            'is_public' => $incident->is_public,
            'is_anonymous' => $incident->is_anonymous,
            'evidence_total' => $incident->evidences->count(),
            'pending_evidence_count' => $incident->evidences->where('status', 'pending')->count(),
            'false_reports_count' => $incident->votes
                ->filter(fn (IncidentVote $vote): bool => $vote->vote_type->value === 'false_report')
                ->count(),
            'reporter_label' => $incident->is_anonymous || $incident->user === null
                ? 'Anonimo'
                : $incident->user->name,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function selectedReportPayload(Incident $incident, PublicIncidentMapData $publicIncidentMapData): array
    {
        $payload = $this->reportRow($incident, $publicIncidentMapData);

        return [
            ...$payload,
            'reporter' => $incident->user === null ? null : [
                'id' => $incident->user->id,
                'name' => $incident->user->name,
                'email' => $incident->user->email,
            ],
            'reviewer' => $incident->reviewer === null ? null : [
                'id' => $incident->reviewer->id,
                'name' => $incident->reviewer->name,
                'email' => $incident->reviewer->email,
            ],
            'duplicate_of' => $incident->duplicateOf === null ? null : [
                'id' => $incident->duplicateOf->id,
                'title' => $incident->duplicateOf->title,
            ],
            'evidences' => $incident->evidences
                ->map(fn (IncidentEvidence $evidence): array => [
                    'id' => $evidence->id,
                    'status' => $evidence->status,
                    'file_type' => $evidence->file_type,
                    'original_filename' => $evidence->original_filename,
                    'mime_type' => $evidence->mime_type,
                    'size' => $evidence->size,
                    'created_at' => $evidence->created_at?->toIso8601String(),
                ])
                ->values()
                ->all(),
            'status_logs' => $incident->statusLogs
                ->sortByDesc('created_at')
                ->map(fn (IncidentStatusLog $log): array => [
                    'id' => $log->id,
                    'previous_status' => $log->previous_status?->value,
                    'previous_status_label' => $log->previous_status === null ? null : $this->statusLabel($log->previous_status),
                    'new_status' => $log->new_status->value,
                    'new_status_label' => $this->statusLabel($log->new_status),
                    'reason' => $log->reason,
                    'changed_by' => $log->changedBy?->name,
                    'created_at' => $log->created_at?->translatedFormat('d M Y, h:i a'),
                ])
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array<string, string>
     */
    private function typeOptions(): array
    {
        return [
            'robo' => 'Robo',
            'intento_robo' => 'Intento de robo',
            'robo_vehiculo' => 'Robo de vehiculo',
            'cristalazo' => 'Cristalazo',
            'agresion' => 'Agresion',
            'acoso' => 'Acoso',
            'vandalismo' => 'Vandalismo',
            'zona_riesgo' => 'Zona de riesgo',
            'otro' => 'Otro',
        ];
    }

    private function statusLabel(IncidentStatus $status): string
    {
        return match ($status) {
            IncidentStatus::Pending => 'Pendiente',
            IncidentStatus::VisibleUnverified => 'No verificado',
            IncidentStatus::CommunityValidated => 'Validado por comunidad',
            IncidentStatus::EvidenceValidated => 'Validado con evidencia',
            IncidentStatus::ExternallyConfirmed => 'Confirmado',
            IncidentStatus::Rejected => 'Rechazado',
            IncidentStatus::Duplicated => 'Duplicado',
            IncidentStatus::Hidden => 'Oculto',
        };
    }

    private function cutoffForRange(string $range): Carbon
    {
        return match ($range) {
            '24h' => now()->subDay(),
            '7d' => now()->subDays(7),
            '30d' => now()->subDays(30),
            default => now()->subYears(5),
        };
    }
}
