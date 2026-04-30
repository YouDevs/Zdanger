<?php

namespace App\Http\Controllers;

use App\Enums\IncidentStatus;
use App\Http\Requests\ViewIncidentMapRequest;
use App\Models\Incident;
use App\PublicIncidentMapData;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class PublicIncidentMapController extends Controller
{
    private const PUBLIC_STATUSES = [
        IncidentStatus::Pending->value,
        IncidentStatus::VisibleUnverified->value,
        IncidentStatus::CommunityValidated->value,
        IncidentStatus::EvidenceValidated->value,
        IncidentStatus::ExternallyConfirmed->value,
    ];

    private const INCIDENT_TYPE_OPTIONS = ['robo' => 'Robo', 'intento_robo' => 'Intento de robo', 'robo_vehiculo' => 'Robo de vehiculo', 'cristalazo' => 'Cristalazo', 'agresion' => 'Agresion', 'acoso' => 'Acoso', 'vandalismo' => 'Vandalismo', 'zona_riesgo' => 'Zona de riesgo', 'otro' => 'Otro'];

    /**
     * Display the public incident map.
     */
    public function __invoke(ViewIncidentMapRequest $request, PublicIncidentMapData $publicIncidentMapData): Response
    {
        $filters = $this->normalizedFilters($request);

        $incidents = Incident::query()
            ->with(['votes', 'evidences'])
            ->where('is_public', true)
            ->whereIn('status', self::PUBLIC_STATUSES)
            ->when(
                $filters['types'] !== [],
                fn (Builder $query) => $query->whereIn('type', $filters['types']),
            )
            ->when(
                $filters['date_range'] !== 'all',
                fn (Builder $query) => $query->where('occurred_at', '>=', $this->cutoffForRange($filters['date_range'])),
            )
            ->when(
                $filters['neighborhood'] !== null,
                fn (Builder $query) => $query->where('neighborhood', $filters['neighborhood']),
            )
            ->when(
                $filters['status'] !== null,
                fn (Builder $query) => $query->where('status', $filters['status']),
            )
            ->when(
                $filters['min_confidence'] > 0,
                fn (Builder $query) => $query->where('confidence_score', '>=', $filters['min_confidence']),
            )
            ->orderByDesc('occurred_at')
            ->orderByDesc('created_at')
            ->get();

        $mapPayload = $publicIncidentMapData->build($incidents->all());

        return Inertia::render('view_map', [
            'incidents' => $mapPayload['incidents'],
            'selectedIncidentId' => $mapPayload['incidents'][0]['id'] ?? null,
            'filters' => $filters,
            'map' => $mapPayload['map'],
            'filterOptions' => [
                'types' => collect(self::INCIDENT_TYPE_OPTIONS)
                    ->map(fn (string $label, string $value) => ['value' => $value, 'label' => $label])
                    ->values(),
                'dateRanges' => [
                    ['value' => '24h', 'label' => 'Ultimas 24h'],
                    ['value' => '7d', 'label' => '7 dias'],
                    ['value' => '30d', 'label' => '30 dias'],
                    ['value' => 'all', 'label' => 'Todo'],
                ],
                'neighborhoods' => Incident::query()
                    ->where('is_public', true)
                    ->whereIn('status', self::PUBLIC_STATUSES)
                    ->whereNotNull('neighborhood')
                    ->distinct()
                    ->orderBy('neighborhood')
                    ->pluck('neighborhood')
                    ->values(),
                'statuses' => [
                    ['value' => IncidentStatus::Pending->value, 'label' => 'Pendiente'],
                    ['value' => IncidentStatus::VisibleUnverified->value, 'label' => 'No verificado'],
                    ['value' => IncidentStatus::CommunityValidated->value, 'label' => 'Validado por comunidad'],
                    ['value' => IncidentStatus::EvidenceValidated->value, 'label' => 'Validado con evidencia'],
                    ['value' => IncidentStatus::ExternallyConfirmed->value, 'label' => 'Confirmado'],
                ],
            ],
        ]);
    }

    /**
     * @return array{types: array<int, string>, date_range: string, neighborhood: ?string, status: ?string, min_confidence: int}
     */
    private function normalizedFilters(ViewIncidentMapRequest $request): array
    {
        return [
            'types' => array_values(array_filter($request->array('types'))),
            'date_range' => $request->string('date_range')->value() ?: 'all',
            'neighborhood' => $request->string('neighborhood')->value() ?: null,
            'status' => $request->string('status')->value() ?: null,
            'min_confidence' => $request->integer('min_confidence'),
        ];
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
