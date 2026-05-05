<?php

namespace App\Http\Controllers;

use App\Actions\Incidents\RegisterIncidentVote;
use App\Enums\IncidentStatus;
use App\Enums\IncidentVoteType;
use App\Http\Requests\StoreIncidentVoteRequest;
use App\Models\Incident;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class IncidentVoteController extends Controller
{
    private const VOTABLE_STATUSES = [
        IncidentStatus::Pending->value,
        IncidentStatus::VisibleUnverified->value,
        IncidentStatus::CommunityValidated->value,
        IncidentStatus::EvidenceValidated->value,
        IncidentStatus::ExternallyConfirmed->value,
    ];

    /**
     * Store or update a vote for a public incident.
     */
    public function store(
        StoreIncidentVoteRequest $request,
        Incident $incident,
        RegisterIncidentVote $registerIncidentVote,
    ): RedirectResponse {
        $incident = Incident::query()
            ->whereKey($incident->getKey())
            ->where('is_public', true)
            ->whereIn('status', self::VOTABLE_STATUSES)
            ->firstOrFail();

        $registerIncidentVote->execute(
            $incident,
            $request->enum('vote_type', IncidentVoteType::class),
            $request->user(),
            $request->ip(),
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $request->string('vote_type')->value() === IncidentVoteType::FalseReport->value
                ? 'Tu observacion fue registrada para revision.'
                : 'Tu confirmacion fue registrada.',
        ]);

        return back();
    }
}
