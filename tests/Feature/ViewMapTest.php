<?php

use App\Enums\IncidentStatus;
use App\Models\Incident;
use App\Models\IncidentEvidence;
use App\Models\IncidentVote;
use App\Models\User;
use App\PublicIncidentMapData;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('public map displays visible incidents through inertia', function () {
    $moderator = User::factory()->create();

    $publicIncident = Incident::factory()->create([
        'type' => 'robo',
        'status' => IncidentStatus::VisibleUnverified,
        'is_public' => true,
        'reviewed_by' => $moderator->id,
        'reviewed_at' => now(),
        'neighborhood' => 'Zona Centro',
        'occurred_at' => now()->subHour(),
    ]);

    $privateIncident = Incident::factory()->create([
        'type' => 'acoso',
        'status' => IncidentStatus::Pending,
        'is_public' => false,
    ]);

    $publicIncident->refreshConfidenceScore();
    $privateIncident->refreshConfidenceScore();

    $this->get(route('view_map'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('view_map')
            ->has('incidents', 1)
            ->has('incidents.0', fn (Assert $incident) => $incident
                ->where('id', $publicIncident->id)
                ->missing('latitude')
                ->missing('longitude')
                ->missing('marker')
                ->etc())
            ->where('selectedIncidentId', $publicIncident->id)
            ->where('filters.date_range', 'all')
            ->where('filters.min_confidence', 0)
            ->where('map.incidentsGeoJson.type', 'FeatureCollection')
            ->where('map.heatmapGeoJson.type', 'FeatureCollection')
            ->has('map.incidentsGeoJson.features', 1)
            ->where('map.incidentsGeoJson.features.0.properties.id', $publicIncident->id)
            ->where('filterOptions.neighborhoods.0', 'Zona Centro'),
        );
});

test('public map applies type neighborhood and confidence filters', function () {
    $moderator = User::factory()->create();

    $matchingIncident = Incident::factory()->reportedByUser()->create([
        'type' => 'cristalazo',
        'status' => IncidentStatus::EvidenceValidated,
        'is_public' => true,
        'reviewed_by' => $moderator->id,
        'reviewed_at' => now(),
        'neighborhood' => 'San Marcos',
        'occurred_at' => now()->subHours(2),
    ]);

    IncidentEvidence::factory()->approved()->create([
        'incident_id' => $matchingIncident->id,
    ]);

    IncidentVote::factory()->count(2)->create([
        'incident_id' => $matchingIncident->id,
        'vote_type' => 'confirm',
    ]);

    $matchingIncident->refreshConfidenceScore();

    $filteredOutIncident = Incident::factory()->create([
        'type' => 'robo',
        'status' => IncidentStatus::VisibleUnverified,
        'is_public' => true,
        'reviewed_by' => $moderator->id,
        'reviewed_at' => now(),
        'neighborhood' => 'Zona Centro',
        'occurred_at' => now()->subHours(3),
    ]);

    $filteredOutIncident->refreshConfidenceScore();

    $this->get(route('view_map', [
        'types' => ['cristalazo'],
        'neighborhood' => 'San Marcos',
        'min_confidence' => 40,
    ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('view_map')
            ->has('incidents', 1)
            ->where('incidents.0.id', $matchingIncident->id)
            ->where('filters.types.0', 'cristalazo')
            ->where('filters.neighborhood', 'San Marcos')
            ->where('filters.min_confidence', 40),
        );
});

test('public map exposes obfuscated public coordinates instead of exact incident coordinates', function () {
    $moderator = User::factory()->create();

    $incident = Incident::factory()->create([
        'type' => 'robo',
        'status' => IncidentStatus::VisibleUnverified,
        'is_public' => true,
        'reviewed_by' => $moderator->id,
        'reviewed_at' => now(),
        'latitude' => 21.8891234,
        'longitude' => -102.2884321,
        'visibility_radius' => 250,
    ]);

    $projector = app(PublicIncidentMapData::class);
    $publicCoordinates = $projector->publicCoordinatesFor($incident);

    expect($publicCoordinates)->not->toBeNull();

    $this->get(route('view_map'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('map.incidentsGeoJson.features.0.geometry.coordinates.0', $publicCoordinates['longitude'])
            ->where('map.incidentsGeoJson.features.0.geometry.coordinates.1', $publicCoordinates['latitude'])
            ->where('map.incidentsGeoJson.features.0.properties.id', $incident->id),
        );

    expect($publicCoordinates['latitude'])->not->toBe((float) $incident->latitude);
    expect($publicCoordinates['longitude'])->not->toBe((float) $incident->longitude);
});
