<?php

namespace App\Http\Requests;

use App\Enums\IncidentStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ViewIncidentMapRequest extends FormRequest
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
            'types' => ['nullable', 'array'],
            'types.*' => ['string', Rule::in([
                'robo',
                'intento_robo',
                'robo_vehiculo',
                'cristalazo',
                'agresion',
                'acoso',
                'vandalismo',
                'zona_riesgo',
                'otro',
            ])],
            'date_range' => ['nullable', Rule::in(['24h', '7d', '30d', 'all'])],
            'neighborhood' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::in(IncidentStatus::values())],
            'min_confidence' => ['nullable', 'integer', 'min:0', 'max:100'],
        ];
    }
}
