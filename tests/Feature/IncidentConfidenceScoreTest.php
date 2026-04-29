<?php

use App\Enums\IncidentStatus;
use App\Models\Incident;
use App\Models\IncidentEvidence;
use App\Models\IncidentVote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('calculates confidence score from the configured signals', function () {
    $moderator = User::factory()->create();

    $incident = Incident::factory()->create([
        'status' => IncidentStatus::EvidenceValidated,
        'reviewed_at' => now(),
        'reviewed_by' => $moderator->id,
    ]);

    IncidentEvidence::factory()->approved()->create([
        'incident_id' => $incident->id,
    ]);

    IncidentVote::factory()->count(2)->create([
        'incident_id' => $incident->id,
        'vote_type' => 'confirm',
    ]);

    $incident->refresh();
    $incident->refreshConfidenceScore();

    expect($incident->fresh()->confidence_score)->toBe(60);
});

test('caps confidence score at one hundred', function () {
    $moderator = User::factory()->create();

    $incident = Incident::factory()->reportedByUser()->create([
        'status' => IncidentStatus::ExternallyConfirmed,
        'is_public' => true,
        'reviewed_at' => now(),
        'reviewed_by' => $moderator->id,
    ]);

    IncidentEvidence::factory()->approved()->create([
        'incident_id' => $incident->id,
    ]);

    IncidentVote::factory()->count(2)->create([
        'incident_id' => $incident->id,
        'vote_type' => 'confirm',
    ]);

    $incident->refresh();
    $incident->refreshConfidenceScore();

    expect($incident->fresh()->confidence_score)->toBe(100);
});
