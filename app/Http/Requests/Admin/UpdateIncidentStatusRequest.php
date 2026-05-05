<?php

namespace App\Http\Requests\Admin;

use App\Enums\IncidentStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateIncidentStatusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in([
                IncidentStatus::VisibleUnverified->value,
                IncidentStatus::CommunityValidated->value,
                IncidentStatus::EvidenceValidated->value,
                IncidentStatus::ExternallyConfirmed->value,
                IncidentStatus::Rejected->value,
                IncidentStatus::Duplicated->value,
                IncidentStatus::Hidden->value,
            ])],
            'reason' => ['nullable', 'string', 'max:1000'],
            'duplicate_of_id' => [
                'nullable',
                'integer',
                Rule::exists('incidents', 'id'),
                Rule::requiredIf(
                    $this->string('status')->value() === IncidentStatus::Duplicated->value
                ),
            ],
        ];
    }
}
