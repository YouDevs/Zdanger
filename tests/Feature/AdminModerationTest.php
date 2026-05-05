<?php

use App\Enums\IncidentStatus;
use App\Models\Incident;
use App\Models\IncidentEvidence;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests are redirected away from admin moderation routes', function () {
    $incident = Incident::factory()->create();

    $this->get(route('admin.reports.index'))->assertRedirect(route('login'));
    $this->get(route('admin.reports.show', $incident))->assertRedirect(route('login'));
});

test('authenticated users can view the moderation queue and selected report detail', function () {
    $user = User::factory()->create();

    $selectedIncident = Incident::factory()->reportedByUser($user)->create([
        'status' => IncidentStatus::Pending,
        'is_public' => false,
        'city' => 'Guadalajara',
        'neighborhood' => 'Americana',
    ]);

    IncidentEvidence::factory()->create([
        'incident_id' => $selectedIncident->id,
        'status' => 'pending',
    ]);

    $secondIncident = Incident::factory()->publicVisible()->create([
        'city' => 'Merida',
    ]);

    $this->actingAs($user)
        ->get(route('admin.reports.show', $selectedIncident))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/reports/index')
            ->has('reports', 2)
            ->where('selectedReport.id', $selectedIncident->id)
            ->where('selectedReport.city', 'Guadalajara')
            ->has('selectedReport.evidences', 1)
            ->has('filterOptions.statuses')
            ->has('summary'),
        );
});

test('authenticated users can update incident moderation status', function () {
    $moderator = User::factory()->create();
    $incident = Incident::factory()->reportedByUser()->create([
        'status' => IncidentStatus::Pending,
        'is_public' => false,
    ]);

    $response = $this->actingAs($moderator)
        ->patch(route('admin.reports.status.update', $incident), [
            'status' => IncidentStatus::Hidden->value,
            'reason' => 'Oculto para evitar publicacion prematura.',
        ]);

    $response->assertRedirect(route('admin.reports.show', $incident));

    $incident->refresh();

    expect($incident->status)->toBe(IncidentStatus::Hidden);
    expect($incident->is_public)->toBeFalse();
    expect($incident->reviewed_by)->toBe($moderator->id);
    expect($incident->statusLogs)->toHaveCount(1);
    expect($incident->statusLogs->first()?->reason)->toBe('Oculto para evitar publicacion prematura.');
});

test('authenticated users can approve evidence from moderation and refresh confidence', function () {
    $moderator = User::factory()->create();
    $incident = Incident::factory()->reportedByUser()->create([
        'status' => IncidentStatus::Pending,
        'is_public' => false,
    ]);

    $evidence = IncidentEvidence::factory()->create([
        'incident_id' => $incident->id,
        'status' => 'pending',
    ]);

    $response = $this->actingAs($moderator)
        ->patch(route('admin.evidences.status.update', $evidence), [
            'status' => 'approved',
        ]);

    $response->assertRedirect(route('admin.reports.show', $incident));

    expect($evidence->fresh()?->status)->toBe('approved');
    expect($incident->fresh()?->confidence_score)->toBe(40);
});
