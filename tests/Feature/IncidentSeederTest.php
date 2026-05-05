<?php

use App\Models\Incident;
use Database\Seeders\IncidentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('incident seeder creates a public map distribution across five states', function () {
    $this->seed(IncidentSeeder::class);

    expect(Incident::query()->where('is_public', true)->count())->toBe(50);
    expect(Incident::query()->where('is_public', true)->distinct('state')->count('state'))->toBe(5);
    expect(Incident::query()->where('is_public', true)->where('confidence_score', '>=', 40)->count())->toBeGreaterThan(20);
});
