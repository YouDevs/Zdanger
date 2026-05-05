<?php

use App\Actions\Incidents\RegisterIncidentVote;
use App\Actions\Incidents\UpdateIncidentStatus;
use App\Enums\IncidentStatus;
use App\Enums\IncidentVoteType;
use App\Models\Incident;
use App\Models\IncidentEvidence;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('update incident status toggles visibility logs moderation and refreshes confidence', function () {
    $moderator = User::factory()->create();

    $incident = Incident::factory()->reportedByUser()->create([
        'status' => IncidentStatus::Pending,
        'is_public' => false,
    ]);

    IncidentEvidence::factory()->approved()->create([
        'incident_id' => $incident->id,
    ]);

    $updatedIncident = app(UpdateIncidentStatus::class)->execute(
        $incident,
        IncidentStatus::EvidenceValidated,
        $moderator,
        'Moderacion manual con evidencia aprobada.',
    );

    expect($updatedIncident->status)->toBe(IncidentStatus::EvidenceValidated);
    expect($updatedIncident->is_public)->toBeTrue();
    expect($updatedIncident->reviewed_by)->toBe($moderator->id);
    expect($updatedIncident->confidence_score)->toBe(60);
    expect($updatedIncident->statusLogs)->toHaveCount(1);
    expect($updatedIncident->statusLogs->first()?->reason)->toBe('Moderacion manual con evidencia aprobada.');
});

test('update incident status can mark a report as duplicated and hide it from public map', function () {
    $moderator = User::factory()->create();

    $originalIncident = Incident::factory()->publicVisible()->create();
    $duplicatedIncident = Incident::factory()->publicVisible()->create();

    $updatedIncident = app(UpdateIncidentStatus::class)->execute(
        $duplicatedIncident,
        IncidentStatus::Duplicated,
        $moderator,
        'Se detecto duplicado del mismo hecho.',
        $originalIncident,
    );

    expect($updatedIncident->status)->toBe(IncidentStatus::Duplicated);
    expect($updatedIncident->is_public)->toBeFalse();
    expect($updatedIncident->duplicate_of_id)->toBe($originalIncident->id);
});

test('register incident vote reuses domain rules to promote community validation', function () {
    $user = User::factory()->create();

    $incident = Incident::factory()->create([
        'status' => IncidentStatus::VisibleUnverified,
        'is_public' => true,
    ]);

    $action = app(RegisterIncidentVote::class);

    $action->execute($incident, IncidentVoteType::Confirm, null, '127.0.0.1');
    $updatedIncident = $action->execute($incident, IncidentVoteType::Confirm, $user);

    expect($updatedIncident->status)->toBe(IncidentStatus::CommunityValidated);
    expect($updatedIncident->confidence_score)->toBe(40);
    expect($updatedIncident->statusLogs)->toHaveCount(1);
});
