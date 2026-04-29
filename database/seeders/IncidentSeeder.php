<?php

namespace Database\Seeders;

use App\Enums\IncidentStatus;
use App\Models\Incident;
use App\Models\IncidentEvidence;
use App\Models\IncidentStatusLog;
use App\Models\IncidentVote;
use App\Models\User;
use Illuminate\Database\Seeder;

class IncidentSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $moderator = User::firstOrCreate(
            ['email' => 'moderacion@alertazona.test'],
            ['name' => 'Moderacion AlertaZona', 'password' => 'password']
        );

        $publicIncidents = Incident::factory()
            ->count(3)
            ->publicVisible()
            ->create([
                'reviewed_by' => $moderator->id,
            ]);

        $communityValidated = Incident::factory()
            ->reportedByUser()
            ->create([
                'status' => IncidentStatus::CommunityValidated,
                'is_public' => true,
                'reviewed_by' => $moderator->id,
                'reviewed_at' => now()->subHours(6),
            ]);

        IncidentVote::factory()->count(2)->create([
            'incident_id' => $communityValidated->id,
            'vote_type' => 'confirm',
        ]);

        $evidenceValidated = Incident::factory()
            ->reportedByUser()
            ->create([
                'status' => IncidentStatus::EvidenceValidated,
                'is_public' => true,
                'reviewed_by' => $moderator->id,
                'reviewed_at' => now()->subHours(2),
            ]);

        IncidentEvidence::factory()->approved()->create([
            'incident_id' => $evidenceValidated->id,
        ]);

        $external = Incident::factory()
            ->reportedByUser()
            ->create([
                'status' => IncidentStatus::ExternallyConfirmed,
                'is_public' => true,
                'reviewed_by' => $moderator->id,
                'reviewed_at' => now()->subHour(),
            ]);

        IncidentEvidence::factory()->approved()->create([
            'incident_id' => $external->id,
        ]);

        IncidentVote::factory()->count(2)->create([
            'incident_id' => $external->id,
            'vote_type' => 'confirm',
        ]);

        $allReviewed = $publicIncidents
            ->concat([$communityValidated, $evidenceValidated, $external]);

        foreach ($allReviewed as $incident) {
            IncidentStatusLog::factory()->create([
                'incident_id' => $incident->id,
                'previous_status' => IncidentStatus::Pending,
                'new_status' => $incident->status,
                'changed_by' => $moderator->id,
                'reason' => 'Carga inicial de datos demo sobrios para moderacion.',
            ]);

            $incident->refreshConfidenceScore();
        }

        Incident::factory()->count(2)->create();
    }
}
