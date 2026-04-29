<?php

namespace Database\Factories;

use App\Models\Incident;
use App\Models\IncidentEvidence;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<IncidentEvidence>
 */
class IncidentEvidenceFactory extends Factory
{
    protected $model = IncidentEvidence::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'incident_id' => Incident::factory(),
            'file_path' => 'incident-evidences/demo/'.fake()->uuid().'.jpg',
            'file_type' => 'image',
            'original_filename' => fake()->randomElement([
                'evidencia-zona-comercial.jpg',
                'reporte-parada-transporte.png',
                'incidente-estacionamiento.jpg',
            ]),
            'mime_type' => 'image/jpeg',
            'size' => fake()->numberBetween(150_000, 2_500_000),
            'status' => 'pending',
        ];
    }

    public function approved(): static
    {
        return $this->state(fn () => [
            'status' => 'approved',
        ]);
    }
}
