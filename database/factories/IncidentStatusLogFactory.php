<?php

namespace Database\Factories;

use App\Enums\IncidentStatus;
use App\Models\Incident;
use App\Models\IncidentStatusLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<IncidentStatusLog>
 */
class IncidentStatusLogFactory extends Factory
{
    protected $model = IncidentStatusLog::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'incident_id' => Incident::factory(),
            'previous_status' => IncidentStatus::Pending,
            'new_status' => IncidentStatus::VisibleUnverified,
            'changed_by' => User::factory(),
            'reason' => fake()->sentence(),
        ];
    }
}
