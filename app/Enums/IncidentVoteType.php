<?php

namespace App\Enums;

enum IncidentVoteType: string
{
    case Confirm = 'confirm';
    case FalseReport = 'false_report';

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_map(static fn (self $type) => $type->value, self::cases());
    }
}
