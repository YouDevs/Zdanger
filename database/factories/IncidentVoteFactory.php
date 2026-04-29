<?php

namespace Database\Factories;

use App\Enums\IncidentVoteType;
use App\Models\Incident;
use App\Models\IncidentVote;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<IncidentVote>
 */
class IncidentVoteFactory extends Factory
{
    protected $model = IncidentVote::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'incident_id' => Incident::factory(),
            'user_id' => null,
            'vote_type' => IncidentVoteType::Confirm,
            'ip_hash' => fake()->sha256(),
        ];
    }

    public function byUser(?User $user = null): static
    {
        return $this->state(fn () => [
            'user_id' => $user?->id ?? User::factory(),
            'ip_hash' => null,
        ]);
    }

    public function falseReport(): static
    {
        return $this->state(fn () => [
            'vote_type' => IncidentVoteType::FalseReport,
        ]);
    }
}
