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
     * @var array<int, array{
     *     state: string,
     *     city: string,
     *     latitude_range: array{min: float, max: float},
     *     longitude_range: array{min: float, max: float},
     *     neighborhoods: array<int, string>,
     *     addresses: array<int, string>
     * }>
     */
    private const REGIONS = [
        [
            'state' => 'Jalisco',
            'city' => 'Guadalajara',
            'latitude_range' => ['min' => 20.6400, 'max' => 20.7050],
            'longitude_range' => ['min' => -103.3950, 'max' => -103.3000],
            'neighborhoods' => ['Americana', 'Providencia', 'Oblatos', 'Chapalita', 'Centro'],
            'addresses' => [
                'Cerca de corredor comercial y paradas de transporte',
                'Cruce cercano a zona restaurantera',
                'Exterior de estacionamiento publico',
                'A una cuadra de plaza barrial',
            ],
        ],
        [
            'state' => 'Nuevo Leon',
            'city' => 'Monterrey',
            'latitude_range' => ['min' => 25.6400, 'max' => 25.7200],
            'longitude_range' => ['min' => -100.3700, 'max' => -100.2600],
            'neighborhoods' => ['Centro', 'Obispado', 'Mitras Centro', 'Contry', 'Cumbres'],
            'addresses' => [
                'Tramo cercano a avenida principal',
                'Zona de ascenso y descenso de transporte',
                'Frente a comercios de barrio',
                'Cruce con flujo peatonal alto',
            ],
        ],
        [
            'state' => 'Ciudad de Mexico',
            'city' => 'Ciudad de Mexico',
            'latitude_range' => ['min' => 19.3800, 'max' => 19.4600],
            'longitude_range' => ['min' => -99.2100, 'max' => -99.1200],
            'neighborhoods' => ['Roma Norte', 'Del Valle', 'Narvarte', 'Centro', 'Doctores'],
            'addresses' => [
                'Cerca de vialidad de alta afluencia',
                'Entorno de estacionamiento y comercios',
                'Esquina proxima a transporte publico',
                'Frente a parque vecinal',
            ],
        ],
        [
            'state' => 'Puebla',
            'city' => 'Puebla',
            'latitude_range' => ['min' => 19.0000, 'max' => 19.0900],
            'longitude_range' => ['min' => -98.2500, 'max' => -98.1600],
            'neighborhoods' => ['Centro', 'La Paz', 'Analco', 'Huexotitla', 'Santiago'],
            'addresses' => [
                'Zona cercana a mercado y vialidad secundaria',
                'Cruce cercano a equipamiento urbano',
                'Exterior de estacionamiento compartido',
                'Tramo peatonal con comercios locales',
            ],
        ],
        [
            'state' => 'Yucatan',
            'city' => 'Merida',
            'latitude_range' => ['min' => 20.9300, 'max' => 21.0300],
            'longitude_range' => ['min' => -89.6800, 'max' => -89.5600],
            'neighborhoods' => ['Centro', 'Garcia Gineres', 'Itzimna', 'Francisco de Montejo', 'Chuburna'],
            'addresses' => [
                'Tramo proximo a zona habitacional',
                'Frente a pequenos comercios y estacionamiento',
                'Esquina cercana a avenida barrial',
                'Cerca de parada de ruta urbana',
            ],
        ],
    ];

    /**
     * @var array<int, array{type: string, title: string, description: string}>
     */
    private const INCIDENT_SCENARIOS = [
        [
            'type' => 'robo',
            'title' => 'Robo reportado cerca de corredor comercial',
            'description' => 'Reporte ciudadano de robo de telefono en un tramo con flujo peatonal alto y comercios alrededor.',
        ],
        [
            'type' => 'intento_robo',
            'title' => 'Intento de robo en zona de transporte',
            'description' => 'Personas de la zona reportaron un intento de robo cerca de una parada de transporte en horario vespertino.',
        ],
        [
            'type' => 'robo_vehiculo',
            'title' => 'Robo de vehiculo reportado en via publica',
            'description' => 'Se reporto el robo de un vehiculo en una calle con actividad comercial moderada y vigilancia comunitaria.',
        ],
        [
            'type' => 'cristalazo',
            'title' => 'Cristalazo reportado en estacionamiento publico',
            'description' => 'Vecinos reportaron danos a un vehiculo estacionado en un espacio de uso publico sin exponer datos personales.',
        ],
        [
            'type' => 'acoso',
            'title' => 'Acoso reportado en vialidad concurrida',
            'description' => 'Se registro un reporte de acoso verbal en una vialidad con alto flujo peatonal durante horario nocturno.',
        ],
        [
            'type' => 'vandalismo',
            'title' => 'Vandalismo observado cerca de parque vecinal',
            'description' => 'Habitantes de la zona reportaron actos de vandalismo en mobiliario urbano cercano a un parque vecinal.',
        ],
        [
            'type' => 'zona_riesgo',
            'title' => 'Zona de riesgo reportada por residentes',
            'description' => 'La comunidad reporto un patron recurrente de incidentes en un cruce con baja iluminacion y poca presencia peatonal.',
        ],
        [
            'type' => 'agresion',
            'title' => 'Agresion reportada en espacio publico',
            'description' => 'Se recibio un reporte ciudadano sobre una agresion en espacio publico sin identificar personas especificas.',
        ],
    ];

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $moderator = User::firstOrCreate(
            ['email' => 'moderacion@alertazona.test'],
            ['name' => 'Moderacion AlertaZona', 'password' => 'password']
        );

        foreach (self::REGIONS as $regionIndex => $region) {
            $this->seedRegion($moderator, $region, $regionIndex);
        }

        Incident::factory()->count(5)->create();
    }

    /**
     * @param  array{
     *     state: string,
     *     city: string,
     *     latitude_range: array{min: float, max: float},
     *     longitude_range: array{min: float, max: float},
     *     neighborhoods: array<int, string>,
     *     addresses: array<int, string>
     * }  $region
     */
    private function seedRegion(User $moderator, array $region, int $regionIndex): void
    {
        $statusSequence = [
            IncidentStatus::VisibleUnverified,
            IncidentStatus::VisibleUnverified,
            IncidentStatus::CommunityValidated,
            IncidentStatus::CommunityValidated,
            IncidentStatus::CommunityValidated,
            IncidentStatus::EvidenceValidated,
            IncidentStatus::EvidenceValidated,
            IncidentStatus::EvidenceValidated,
            IncidentStatus::ExternallyConfirmed,
            IncidentStatus::ExternallyConfirmed,
        ];

        foreach ($statusSequence as $incidentIndex => $status) {
            $scenario = self::INCIDENT_SCENARIOS[($regionIndex * 2 + $incidentIndex) % count(self::INCIDENT_SCENARIOS)];
            $reportedByUser = in_array(
                $status,
                [
                    IncidentStatus::CommunityValidated,
                    IncidentStatus::EvidenceValidated,
                    IncidentStatus::ExternallyConfirmed,
                ],
                true,
            );

            $factory = Incident::factory();

            if ($reportedByUser) {
                $factory = $factory->reportedByUser();
            }

            $incident = $factory->create([
                'type' => $scenario['type'],
                'title' => $scenario['title'],
                'description' => $scenario['description'],
                'latitude' => fake()->randomFloat(
                    7,
                    $region['latitude_range']['min'],
                    $region['latitude_range']['max'],
                ),
                'longitude' => fake()->randomFloat(
                    7,
                    $region['longitude_range']['min'],
                    $region['longitude_range']['max'],
                ),
                'approximate_address' => fake()->randomElement($region['addresses']),
                'neighborhood' => fake()->randomElement($region['neighborhoods']),
                'city' => $region['city'],
                'state' => $region['state'],
                'occurred_at' => now()->subHours(fake()->numberBetween(4, 240)),
                'status' => $status,
                'is_public' => true,
                'reviewed_by' => $moderator->id,
                'reviewed_at' => now()->subHours(fake()->numberBetween(1, 72)),
            ]);

            $this->attachPublicSignals($incident, $status);
            $this->logReviewedIncident($incident, $moderator);
            $incident->refreshConfidenceScore();
        }
    }

    private function attachPublicSignals(Incident $incident, IncidentStatus $status): void
    {
        if (in_array($status, [IncidentStatus::CommunityValidated, IncidentStatus::ExternallyConfirmed], true)) {
            IncidentVote::factory()->count(2)->create([
                'incident_id' => $incident->id,
                'vote_type' => 'confirm',
            ]);
        }

        if (in_array($status, [IncidentStatus::EvidenceValidated, IncidentStatus::ExternallyConfirmed], true)) {
            IncidentEvidence::factory()->approved()->create([
                'incident_id' => $incident->id,
            ]);
        }

        if ($status === IncidentStatus::ExternallyConfirmed) {
            IncidentVote::factory()->falseReport()->create([
                'incident_id' => $incident->id,
            ]);
        }
    }

    private function logReviewedIncident(Incident $incident, User $moderator): void
    {
        IncidentStatusLog::factory()->create([
            'incident_id' => $incident->id,
            'previous_status' => IncidentStatus::Pending,
            'new_status' => $incident->status,
            'changed_by' => $moderator->id,
            'reason' => 'Carga inicial de datos demo sobrios para moderacion y mapa publico.',
        ]);
    }
}
