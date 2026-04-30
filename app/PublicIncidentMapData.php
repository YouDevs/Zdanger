<?php

namespace App;

use App\Enums\IncidentStatus;
use App\Enums\IncidentVoteType;
use App\Models\Incident;
use App\Models\IncidentEvidence;
use App\Models\IncidentVote;
use Illuminate\Support\Collection;

class PublicIncidentMapData
{
    private const DEFAULT_CENTER = [
        'latitude' => 21.8853,
        'longitude' => -102.2916,
    ];

    /**
     * @param  array<int, Incident>  $incidents
     * @return array{
     *     incidents: array<int, array<string, mixed>>,
     *     map: array{
     *         center: array{latitude: float, longitude: float},
     *         bounds: array{
     *             southWest: array{latitude: float, longitude: float},
     *             northEast: array{latitude: float, longitude: float}
     *         },
     *         incidentsGeoJson: array<string, mixed>,
     *         heatmapGeoJson: array<string, mixed>
     *     }
     * }
     */
    public function build(array $incidents): array
    {
        $mappedIncidents = collect($incidents)
            ->map(fn (Incident $incident): array => $this->mapIncident($incident))
            ->values();

        $mapFeatures = $mappedIncidents
            ->pluck('map_feature')
            ->filter()
            ->values();

        return [
            'incidents' => $mappedIncidents
                ->map(fn (array $incident): array => $incident['incident'])
                ->all(),
            'map' => [
                'center' => $this->resolveCenter($mapFeatures),
                'bounds' => $this->resolveBounds($mapFeatures),
                'incidentsGeoJson' => $this->featureCollection($mapFeatures),
                'heatmapGeoJson' => $this->featureCollection($mapFeatures),
            ],
        ];
    }

    /**
     * @return array{latitude: float, longitude: float}|null
     */
    public function publicCoordinatesFor(Incident $incident): ?array
    {
        if ($incident->latitude === null || $incident->longitude === null) {
            return null;
        }

        $latitude = (float) $incident->latitude;
        $longitude = (float) $incident->longitude;
        $visibilityRadius = max((int) $incident->visibility_radius, 25);
        $maxOffsetMeters = max(
            min($visibilityRadius * 0.45, 120.0),
            min((float) $visibilityRadius, 25.0),
        );
        $minOffsetMeters = min($maxOffsetMeters, max($visibilityRadius * 0.12, 8.0));
        $angle = deg2rad($this->hashValue("incident-angle-{$incident->id}") % 360);
        $distanceSeed = ($this->hashValue("incident-distance-{$incident->id}") % 1000) / 1000;
        $distanceMeters = $minOffsetMeters + (($maxOffsetMeters - $minOffsetMeters) * $distanceSeed);

        $latitudeOffset = ($distanceMeters * cos($angle)) / 111_320;
        $metersPerLongitudeDegree = max(cos(deg2rad($latitude)) * 111_320, 1.0);
        $longitudeOffset = ($distanceMeters * sin($angle)) / $metersPerLongitudeDegree;

        return [
            'latitude' => round($latitude + $latitudeOffset, 7),
            'longitude' => round($longitude + $longitudeOffset, 7),
        ];
    }

    /**
     * @return array{incident: array<string, mixed>, map_feature: ?array<string, mixed>}
     */
    private function mapIncident(Incident $incident): array
    {
        $publicCoordinates = $this->publicCoordinatesFor($incident);
        $confirmationsCount = $this->confirmationsCount($incident);
        $approvedEvidenceCount = $this->approvedEvidenceCount($incident);
        $hasApprovedEvidence = $approvedEvidenceCount > 0;
        $incidentPayload = [
            'id' => $incident->id,
            'type' => $incident->type,
            'type_label' => $this->typeLabel($incident->type),
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
            'confirmations_count' => $confirmationsCount,
            'approved_evidence_count' => $approvedEvidenceCount,
            'has_approved_evidence' => $hasApprovedEvidence,
        ];

        return [
            'incident' => $incidentPayload,
            'map_feature' => $publicCoordinates === null ? null : [
                'type' => 'Feature',
                'geometry' => [
                    'type' => 'Point',
                    'coordinates' => [
                        $publicCoordinates['longitude'],
                        $publicCoordinates['latitude'],
                    ],
                ],
                'properties' => [
                    ...$incidentPayload,
                    'heat_weight' => round(0.8 + ($incident->confidence_score / 100) * 0.7, 2),
                ],
            ],
        ];
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $features
     * @return array{latitude: float, longitude: float}
     */
    private function resolveCenter(Collection $features): array
    {
        if ($features->isEmpty()) {
            return self::DEFAULT_CENTER;
        }

        $coordinates = $this->coordinatesFromFeatures($features);

        return [
            'latitude' => round(($coordinates['minLatitude'] + $coordinates['maxLatitude']) / 2, 7),
            'longitude' => round(($coordinates['minLongitude'] + $coordinates['maxLongitude']) / 2, 7),
        ];
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $features
     * @return array{
     *     southWest: array{latitude: float, longitude: float},
     *     northEast: array{latitude: float, longitude: float}
     * }
     */
    private function resolveBounds(Collection $features): array
    {
        if ($features->isEmpty()) {
            return [
                'southWest' => [
                    'latitude' => self::DEFAULT_CENTER['latitude'] - 0.03,
                    'longitude' => self::DEFAULT_CENTER['longitude'] - 0.03,
                ],
                'northEast' => [
                    'latitude' => self::DEFAULT_CENTER['latitude'] + 0.03,
                    'longitude' => self::DEFAULT_CENTER['longitude'] + 0.03,
                ],
            ];
        }

        $coordinates = $this->coordinatesFromFeatures($features);
        $latitudePadding = max(($coordinates['maxLatitude'] - $coordinates['minLatitude']) * 0.15, 0.01);
        $longitudePadding = max(($coordinates['maxLongitude'] - $coordinates['minLongitude']) * 0.15, 0.01);

        return [
            'southWest' => [
                'latitude' => round($coordinates['minLatitude'] - $latitudePadding, 7),
                'longitude' => round($coordinates['minLongitude'] - $longitudePadding, 7),
            ],
            'northEast' => [
                'latitude' => round($coordinates['maxLatitude'] + $latitudePadding, 7),
                'longitude' => round($coordinates['maxLongitude'] + $longitudePadding, 7),
            ],
        ];
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $features
     * @return array{type: string, features: array<int, array<string, mixed>>}
     */
    private function featureCollection(Collection $features): array
    {
        return [
            'type' => 'FeatureCollection',
            'features' => $features->all(),
        ];
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $features
     * @return array{
     *     minLatitude: float,
     *     maxLatitude: float,
     *     minLongitude: float,
     *     maxLongitude: float
     * }
     */
    private function coordinatesFromFeatures(Collection $features): array
    {
        $latitudes = $features
            ->map(fn (array $feature): float => (float) $feature['geometry']['coordinates'][1]);
        $longitudes = $features
            ->map(fn (array $feature): float => (float) $feature['geometry']['coordinates'][0]);

        return [
            'minLatitude' => (float) $latitudes->min(),
            'maxLatitude' => (float) $latitudes->max(),
            'minLongitude' => (float) $longitudes->min(),
            'maxLongitude' => (float) $longitudes->max(),
        ];
    }

    private function confirmationsCount(Incident $incident): int
    {
        if ($incident->relationLoaded('votes')) {
            return $incident->votes
                ->filter(fn (IncidentVote $vote): bool => $vote->vote_type->value === IncidentVoteType::Confirm->value)
                ->count();
        }

        return $incident->confirmationsCount();
    }

    private function approvedEvidenceCount(Incident $incident): int
    {
        if ($incident->relationLoaded('evidences')) {
            return $incident->evidences
                ->filter(fn (IncidentEvidence $evidence): bool => $evidence->status === 'approved')
                ->count();
        }

        return $incident->evidences()->where('status', 'approved')->count();
    }

    private function typeLabel(string $type): string
    {
        return match ($type) {
            'robo' => 'Robo',
            'intento_robo' => 'Intento de robo',
            'robo_vehiculo' => 'Robo de vehiculo',
            'cristalazo' => 'Cristalazo',
            'agresion' => 'Agresion',
            'acoso' => 'Acoso',
            'vandalismo' => 'Vandalismo',
            'zona_riesgo' => 'Zona de riesgo',
            default => 'Otro',
        };
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

    private function hashValue(string $value): int
    {
        return abs((int) crc32($value));
    }
}
