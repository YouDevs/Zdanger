<?php

namespace App\Http\Controllers;

use App\Enums\IncidentStatus;
use App\Enums\IncidentVoteType;
use App\Models\Incident;
use App\Models\IncidentVote;
use App\PublicIncidentMapData;
use Inertia\Inertia;
use Inertia\Response;

class PublicIncidentShowController extends Controller
{
    private const PUBLIC_STATUSES = [
        IncidentStatus::Pending->value,
        IncidentStatus::VisibleUnverified->value,
        IncidentStatus::CommunityValidated->value,
        IncidentStatus::EvidenceValidated->value,
        IncidentStatus::ExternallyConfirmed->value,
    ];

    /**
     * Handle the incoming request.
     */
    public function __invoke(Incident $incident, PublicIncidentMapData $publicIncidentMapData): Response
    {
        $incident = Incident::query()
            ->with(['votes', 'evidences' => fn ($query) => $query->where('status', 'approved')])
            ->whereKey($incident->getKey())
            ->where('is_public', true)
            ->whereIn('status', self::PUBLIC_STATUSES)
            ->firstOrFail();

        $payload = $publicIncidentMapData->incidentPayload($incident);
        $publicCoordinates = $publicIncidentMapData->publicCoordinatesFor($incident);

        return Inertia::render('reports/show', [
            'incident' => [
                ...$payload,
                'public_coordinates' => $publicCoordinates,
                'false_reports_count' => $incident->votes
                    ->filter(fn (IncidentVote $vote): bool => $vote->vote_type === IncidentVoteType::FalseReport)
                    ->count(),
                'approved_evidences' => $incident->evidences
                    ->map(fn ($evidence): array => [
                        'id' => $evidence->id,
                        'file_type' => $evidence->file_type,
                        'original_filename' => $evidence->original_filename,
                        'mime_type' => $evidence->mime_type,
                        'size' => $evidence->size,
                        'created_at' => $evidence->created_at?->toIso8601String(),
                    ])
                    ->values()
                    ->all(),
            ],
        ]);
    }
}
