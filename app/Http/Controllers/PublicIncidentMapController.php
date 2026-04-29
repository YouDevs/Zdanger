<?php

namespace App\Http\Controllers;

use App\Enums\IncidentStatus;
use App\Http\Requests\ViewIncidentMapRequest;
use App\Models\Incident;
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

    private const INCIDENT_TYPE_OPTIONS = [
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

    /**
     * Display the public incident map.
     */
    public function __invoke(ViewIncidentMapRequest $request): Response
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

        $mappedIncidents = $this->mapIncidentsForPage($incidents->all());

        return Inertia::render('view_map', [
            'incidents' => $mappedIncidents,
            'selectedIncidentId' => $mappedIncidents[0]['id'] ?? null,
            'filters' => $filters,
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

    /**
     * @param  array<int, Incident>  $incidents
     * @return array<int, array<string, mixed>>
     */
    private function mapIncidentsForPage(array $incidents): array
    {
        $latitudes = collect($incidents)->pluck('latitude')->filter()->map(fn ($value) => (float) $value)->values();
        $longitudes = collect($incidents)->pluck('longitude')->filter()->map(fn ($value) => (float) $value)->values();

        $minLatitude = $latitudes->min() ?? 21.86;
        $maxLatitude = $latitudes->max() ?? 21.92;
        $minLongitude = $longitudes->min() ?? -102.33;
        $maxLongitude = $longitudes->max() ?? -102.25;

        return collect($incidents)->values()->map(
            fn (Incident $incident, int $index) => [
                'id' => $incident->id,
                'type' => $incident->type,
                'type_label' => self::INCIDENT_TYPE_OPTIONS[$incident->type] ?? ucfirst(str_replace('_', ' ', $incident->type)),
                'title' => $incident->title,
                'description' => $incident->description,
                'approximate_address' => $incident->approximate_address,
                'neighborhood' => $incident->neighborhood,
                'city' => $incident->city,
                'state' => $incident->state,
                'occurred_at' => $incident->occurred_at?->toIso8601String(),
                'occurred_at_human' => $incident->occurred_at?->diffForHumans(),
                'occurred_at_display' => $incident->occurred_at?->translatedFormat('d M Y, h:i a'),
                'status' => $incident->status->value,
                'status_label' => $this->statusLabel($incident->status),
                'confidence_score' => $incident->confidence_score,
                'confirmations_count' => $incident->votes->filter(
                    fn ($vote) => $vote->vote_type->value === 'confirm'
                )->count(),
                'approved_evidence_count' => $incident->evidences->where('status', 'approved')->count(),
                'has_approved_evidence' => $incident->evidences->where('status', 'approved')->isNotEmpty(),
                'marker' => $this->markerPosition(
                    $incident,
                    $index,
                    $minLatitude,
                    $maxLatitude,
                    $minLongitude,
                    $maxLongitude,
                ),
            ],
        )->all();
    }

    /**
     * @return array{top: string, left: string}
     */
    private function markerPosition(
        Incident $incident,
        int $index,
        float $minLatitude,
        float $maxLatitude,
        float $minLongitude,
        float $maxLongitude,
    ): array {
        if ($incident->latitude === null || $incident->longitude === null) {
            $left = 22 + (($index * 13) % 56);
            $top = 22 + (($index * 11) % 56);

            return [
                'top' => "{$top}%",
                'left' => "{$left}%",
            ];
        }

        $latitude = (float) $incident->latitude;
        $longitude = (float) $incident->longitude;

        $latitudeSpan = max($maxLatitude - $minLatitude, 0.0001);
        $longitudeSpan = max($maxLongitude - $minLongitude, 0.0001);

        $top = 75 - ((($latitude - $minLatitude) / $latitudeSpan) * 50);
        $left = 18 + ((($longitude - $minLongitude) / $longitudeSpan) * 64);

        return [
            'top' => round($top, 2).'%',
            'left' => round($left, 2).'%',
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
}
