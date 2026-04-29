<?php

namespace App\Models;

use Database\Factories\IncidentEvidenceFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'incident_id',
    'file_path',
    'file_type',
    'original_filename',
    'mime_type',
    'size',
    'status',
])]
class IncidentEvidence extends Model
{
    /** @use HasFactory<IncidentEvidenceFactory> */
    use HasFactory;

    protected $table = 'incident_evidences';

    public function incident(): BelongsTo
    {
        return $this->belongsTo(Incident::class);
    }
}
