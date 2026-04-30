<?php

use App\Enums\IncidentStatus;
use App\Models\Incident;
use App\PublicIncidentMapData;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Tests\TestCase;

uses(TestCase::class);

test('public coordinates are deterministic and stay within visibility radius', function () {
    $incident = Incident::factory()->make([
        'id' => 42,
        'status' => IncidentStatus::VisibleUnverified,
        'latitude' => 21.8891234,
        'longitude' => -102.2884321,
        'visibility_radius' => 250,
    ]);

    $projector = new PublicIncidentMapData;
    $firstCoordinates = $projector->publicCoordinatesFor($incident);
    $secondCoordinates = $projector->publicCoordinatesFor($incident);

    expect($firstCoordinates)->toBe($secondCoordinates);
    expect($firstCoordinates)->not->toBeNull();
    expect(distanceBetweenMeters(
        21.8891234,
        -102.2884321,
        $firstCoordinates['latitude'],
        $firstCoordinates['longitude'],
    ))->toBeLessThanOrEqual(250.0);
});

test('public coordinates return null when the incident has no location', function () {
    $incident = Incident::factory()->make([
        'id' => 7,
        'latitude' => null,
        'longitude' => null,
    ]);

    $projector = new PublicIncidentMapData;

    expect($projector->publicCoordinatesFor($incident))->toBeNull();
});

test('build returns valid geojson and skips incidents without coordinates', function () {
    $projector = new PublicIncidentMapData;
    $locatedIncident = Incident::factory()->make([
        'id' => 101,
        'status' => IncidentStatus::CommunityValidated,
        'latitude' => 21.8923456,
        'longitude' => -102.2812345,
    ]);
    $locatedIncident->setRelation('votes', new EloquentCollection);
    $locatedIncident->setRelation('evidences', new EloquentCollection);

    $locationlessIncident = Incident::factory()->make([
        'id' => 102,
        'status' => IncidentStatus::Pending,
        'latitude' => null,
        'longitude' => null,
    ]);
    $locationlessIncident->setRelation('votes', new EloquentCollection);
    $locationlessIncident->setRelation('evidences', new EloquentCollection);

    $payload = $projector->build([$locatedIncident, $locationlessIncident]);

    expect($payload['incidents'])->toHaveCount(2);
    expect($payload['map']['incidentsGeoJson']['type'])->toBe('FeatureCollection');
    expect($payload['map']['heatmapGeoJson']['type'])->toBe('FeatureCollection');
    expect($payload['map']['incidentsGeoJson']['features'])->toHaveCount(1);
    expect($payload['map']['incidentsGeoJson']['features'][0]['properties']['id'])->toBe(101);
});

function distanceBetweenMeters(
    float $originLatitude,
    float $originLongitude,
    float $targetLatitude,
    float $targetLongitude,
): float {
    $earthRadius = 6_371_000.0;
    $latitudeDelta = deg2rad($targetLatitude - $originLatitude);
    $longitudeDelta = deg2rad($targetLongitude - $originLongitude);
    $originLatitudeRadians = deg2rad($originLatitude);
    $targetLatitudeRadians = deg2rad($targetLatitude);
    $haversine = sin($latitudeDelta / 2) ** 2
        + cos($originLatitudeRadians) * cos($targetLatitudeRadians) * sin($longitudeDelta / 2) ** 2;

    return 2 * $earthRadius * asin(min(1.0, sqrt($haversine)));
}
