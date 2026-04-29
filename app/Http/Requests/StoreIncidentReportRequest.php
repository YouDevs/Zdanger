<?php

namespace App\Http\Requests;

use App\Enums\IncidentVoteType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreIncidentReportRequest extends FormRequest
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
            'type' => ['required', 'string', Rule::in([
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
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['required', 'string', 'min:20', 'max:4000'],
            'occurred_on' => ['nullable', 'date'],
            'occurred_time' => ['nullable', 'date_format:H:i'],
            'approximate_address' => ['nullable', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'neighborhood' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'visibility_radius' => ['nullable', 'integer', 'min:100', 'max:1000'],
            'is_anonymous' => ['nullable', 'boolean'],
            'evidence' => ['nullable', 'file', 'mimetypes:image/jpeg,image/png,image/webp,video/mp4', 'max:25600'],
        ];
    }
}
