<?php

namespace App\Enums;

enum IncidentStatus: string
{
    case Pending = 'pending';
    case VisibleUnverified = 'visible_unverified';
    case CommunityValidated = 'community_validated';
    case EvidenceValidated = 'evidence_validated';
    case ExternallyConfirmed = 'externally_confirmed';
    case Rejected = 'rejected';
    case Duplicated = 'duplicated';
    case Hidden = 'hidden';

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_map(static fn (self $status) => $status->value, self::cases());
    }
}
