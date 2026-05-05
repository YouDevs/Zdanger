<?php

use App\Enums\IncidentStatus;
use App\Enums\IncidentVoteType;
use App\Models\Incident;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guest vote is stored once per incident and can be updated', function () {
    $moderator = User::factory()->create();

    $incident = Incident::factory()->create([
        'status' => IncidentStatus::VisibleUnverified,
        'is_public' => true,
        'reviewed_by' => $moderator->id,
        'reviewed_at' => now(),
    ]);

    $this->from(route('reports.show', $incident))
        ->post(route('reports.votes.store', $incident), [
            'vote_type' => IncidentVoteType::Confirm->value,
        ])
        ->assertRedirect(route('reports.show', $incident));

    $this->from(route('reports.show', $incident))
        ->post(route('reports.votes.store', $incident), [
            'vote_type' => IncidentVoteType::FalseReport->value,
        ])
        ->assertRedirect(route('reports.show', $incident));

    expect($incident->votes()->count())->toBe(1);
    expect($incident->votes()->first()?->vote_type)->toBe(IncidentVoteType::FalseReport);
});

test('second distinct confirmation promotes a public incident to community validated', function () {
    $moderator = User::factory()->create();
    $user = User::factory()->create();

    $incident = Incident::factory()->create([
        'status' => IncidentStatus::VisibleUnverified,
        'is_public' => true,
        'reviewed_by' => $moderator->id,
        'reviewed_at' => now(),
    ]);

    $this->post(route('reports.votes.store', $incident), [
        'vote_type' => IncidentVoteType::Confirm->value,
    ])->assertRedirect();

    $this->actingAs($user)
        ->post(route('reports.votes.store', $incident), [
            'vote_type' => IncidentVoteType::Confirm->value,
        ])
        ->assertRedirect();

    $incident->refresh();

    expect($incident->status)->toBe(IncidentStatus::CommunityValidated);
    expect($incident->confidence_score)->toBe(40);
    expect($incident->votes()->count())->toBe(2);
    expect($incident->statusLogs)->toHaveCount(1);
    expect($incident->statusLogs->first()?->new_status)->toBe(IncidentStatus::CommunityValidated);
});

test('votes are rejected for non public incidents', function () {
    $incident = Incident::factory()->create([
        'is_public' => false,
        'status' => IncidentStatus::Pending,
    ]);

    $this->post(route('reports.votes.store', $incident), [
        'vote_type' => IncidentVoteType::Confirm->value,
    ])->assertNotFound();
});
