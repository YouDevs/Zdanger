<?php

use App\Enums\IncidentStatus;
use App\Models\Incident;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('guest can submit an anonymous incident report', function () {
    $response = $this->post(route('reports.store'), [
        'type' => 'robo',
        'description' => 'Reporte de robo de telefono cerca de zona comercial durante la noche.',
        'occurred_on' => '2026-04-27',
        'occurred_time' => '21:30',
        'approximate_address' => 'Cerca del corredor comercial principal',
        'latitude' => '21.8853000',
        'longitude' => '-102.2916000',
        'neighborhood' => 'Zona Centro',
        'city' => 'Aguascalientes',
    ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('report_incident_form'));

    $incident = Incident::first();

    expect($incident)->not->toBeNull();
    expect($incident->user_id)->toBeNull();
    expect($incident->is_anonymous)->toBeTrue();
    expect($incident->status)->toBe(IncidentStatus::Pending);
    expect($incident->is_public)->toBeFalse();
    expect($incident->occurred_at?->format('Y-m-d H:i:s'))->toBe('2026-04-27 21:30:00');
    expect($incident->statusLogs)->toHaveCount(1);
});

test('authenticated user can submit a non anonymous report with evidence', function () {
    Storage::fake('local');

    $user = \App\Models\User::factory()->create();
    $file = UploadedFile::fake()->image('evidencia.jpg');

    $response = $this
        ->actingAs($user)
        ->post(route('reports.store'), [
            'type' => 'cristalazo',
            'description' => 'Cristalazo reportado en estacionamiento publico con afectacion a un vehiculo.',
            'is_anonymous' => false,
            'evidence' => $file,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('report_incident_form'));

    $incident = Incident::with('evidences')->first();

    expect($incident->user_id)->toBe($user->id);
    expect($incident->is_anonymous)->toBeFalse();
    expect($incident->evidences)->toHaveCount(1);
    expect($incident->evidences->first()->status)->toBe('pending');

    Storage::disk('local')->assertExists($incident->evidences->first()->file_path);
});

test('report validation rejects invalid incident type', function () {
    $response = $this->from(route('report_incident_form'))->post(route('reports.store'), [
        'type' => 'secuestro',
        'description' => 'Descripcion suficientemente larga para superar validaciones minimas.',
    ]);

    $response
        ->assertSessionHasErrors('type')
        ->assertRedirect(route('report_incident_form'));

    expect(Incident::count())->toBe(0);
});
