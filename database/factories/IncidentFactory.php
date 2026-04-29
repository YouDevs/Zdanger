<?php

namespace Database\Factories;

use App\Enums\IncidentStatus;
use App\Models\Incident;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Incident>
 */
class IncidentFactory extends Factory
{
    protected $model = Incident::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => null,
            'type' => fake()->randomElement([
                'robo',
                'intento_robo',
                'robo_vehiculo',
                'cristalazo',
                'agresion',
                'acoso',
                'vandalismo',
                'zona_riesgo',
                'otro',
            ]),
            'title' => fake()->optional()->sentence(4),
            'description' => fake()->randomElement([
                'Reporte de robo de telefono cerca de zona comercial.',
                'Intento de robo reportado cerca de parada de transporte.',
                'Cristalazo reportado en estacionamiento publico.',
                'Acoso verbal reportado en una vialidad concurrida.',
                'Vandalismo observado cerca de un parque vecinal.',
            ]),
            'latitude' => fake()->randomFloat(7, 21.8700000, 21.9100000),
            'longitude' => fake()->randomFloat(7, -102.3200000, -102.2600000),
            'approximate_address' => fake()->randomElement([
                'Cerca del corredor comercial principal',
                'A una cuadra de la parada de transporte',
                'Zona de estacionamiento publico',
                'Cruce cercano a plaza vecinal',
            ]),
            'neighborhood' => fake()->randomElement([
                'Zona Centro',
                'San Marcos',
                'Jardines',
                'Del Valle',
            ]),
            'city' => 'Aguascalientes',
            'state' => 'Aguascalientes',
            'occurred_at' => fake()->dateTimeBetween('-10 days', 'now'),
            'status' => IncidentStatus::Pending,
            'visibility_radius' => 250,
            'is_anonymous' => true,
            'is_public' => false,
            'duplicate_of_id' => null,
            'reviewed_by' => null,
            'reviewed_at' => null,
        ];
    }

    public function reportedByUser(?User $user = null): static
    {
        return $this->state(fn () => [
            'user_id' => $user?->id ?? User::factory(),
            'is_anonymous' => false,
        ]);
    }

    public function publicVisible(): static
    {
        return $this->state(fn () => [
            'status' => IncidentStatus::VisibleUnverified,
            'is_public' => true,
            'reviewed_at' => now(),
            'reviewed_by' => User::factory(),
        ]);
    }
}
