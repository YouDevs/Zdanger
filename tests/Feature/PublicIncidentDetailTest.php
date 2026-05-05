<?php

use App\Enums\IncidentStatus;
use App\Models\Incident;
use App\Models\IncidentEvidence;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('public incident detail page shows approved evidence only', function () {
    $moderator = User::factory()->create();

    $incident = Incident::factory()->reportedByUser()->create([
        'status' => IncidentStatus::EvidenceValidated,
        'is_public' => true,
        'reviewed_by' => $moderator->id,
        'reviewed_at' => now(),
        'city' => 'Guadalajara',
        'state' => 'Jalisco',
        'neighborhood' => 'Americana',
    ]);

    IncidentEvidence::factory()->approved()->create([
        'incident_id' => $incident->id,
        'original_filename' => 'evidencia-aprobada.jpg',
    ]);

    IncidentEvidence::factory()->create([
        'incident_id' => $incident->id,
        'original_filename' => 'evidencia-pendiente.jpg',
        'status' => 'pending',
    ]);

    $incident->refreshConfidenceScore();

    $this->get(route('reports.show', $incident))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/show')
            ->where('incident.id', $incident->id)
            ->where('incident.status', IncidentStatus::EvidenceValidated->value)
            ->where('incident.approved_evidence_count', 1)
            ->has('incident.approved_evidences', 1)
            ->where('incident.approved_evidences.0.original_filename', 'evidencia-aprobada.jpg')
            ->where('incident.city', 'Guadalajara')
            ->where('incident.state', 'Jalisco'),
        );
});

test('non public incident detail is not accessible', function () {
    $incident = Incident::factory()->create([
        'is_public' => false,
        'status' => IncidentStatus::Pending,
    ]);

    $this->get(route('reports.show', $incident))->assertNotFound();
});
