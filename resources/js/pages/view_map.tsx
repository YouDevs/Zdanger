import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    AlertTriangle,
    ChevronRight,
    Filter,
    MapPin,
    ShieldAlert,
    TriangleAlert,
    X,
} from 'lucide-react';
import IncidentMap from '@/components/public/incident-map';
import ConfidenceBadge from '@/components/public/confidence-badge';
import StatusBadge from '@/components/public/status-badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { view_map } from '@/routes';
import reports from '@/routes/reports';
import type {
    FilterOption,
    IncidentMapFilters,
    MapIncident,
    PublicIncidentMapPayload,
} from '@/types';

type ViewMapProps = {
    incidents: MapIncident[];
    selectedIncidentId: number | null;
    filters: IncidentMapFilters;
    map: PublicIncidentMapPayload;
    filterOptions: {
        types: FilterOption[];
        dateRanges: FilterOption[];
        neighborhoods: string[];
        statuses: FilterOption[];
    };
};

export default function ViewMap({
    incidents,
    selectedIncidentId,
    filters,
    map,
    filterOptions,
}: ViewMapProps) {
    const [activeIncidentId, setActiveIncidentId] = useState<number | null>(selectedIncidentId);
    const [submittingVoteType, setSubmittingVoteType] = useState<string | null>(null);

    useEffect(() => {
        setActiveIncidentId(selectedIncidentId);
    }, [selectedIncidentId]);

    const activeIncident =
        incidents.find((incident) => incident.id === activeIncidentId) ?? incidents[0] ?? null;

    const submitFilters = (nextFilters: Partial<IncidentMapFilters>) => {
        const merged: IncidentMapFilters = {
            ...filters,
            ...nextFilters,
        };

        router.get(
            view_map.url(),
            {
                types: merged.types.length > 0 ? merged.types : undefined,
                date_range: merged.date_range !== 'all' ? merged.date_range : undefined,
                neighborhood: merged.neighborhood || undefined,
                status: merged.status || undefined,
                min_confidence: merged.min_confidence > 0 ? merged.min_confidence : undefined,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const toggleIncidentType = (value: string) => {
        const types = filters.types.includes(value)
            ? filters.types.filter((type) => type !== value)
            : [...filters.types, value];

        submitFilters({ types });
    };

    const submitVote = (voteType: 'confirm' | 'false_report') => {
        if (!activeIncident) {
            return;
        }

        setSubmittingVoteType(voteType);

        router.post(
            reports.votes.store.url(activeIncident.id),
            { vote_type: voteType },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setSubmittingVoteType(null),
            },
        );
    };

    return (
        <>
            <Head title="Mapa" />

            <main className="flex h-[calc(100vh-64px)] overflow-hidden bg-surface">
                <aside className="hidden w-80 shrink-0 flex-col overflow-y-auto border-r border-outline-variant bg-surface-container-lowest shadow-xl lg:flex">
                    <div className="space-y-8 p-6">
                        <div>
                            <h1 className="mb-2 text-2xl font-semibold text-on-surface">
                                Filtros de seguridad
                            </h1>
                            <p className="text-sm text-outline">
                                Ajusta los parametros para explorar reportes ciudadanos.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                                Tipo de incidente
                            </label>
                            <div className="grid gap-2">
                                {filterOptions.types.map((type) => {
                                    const tone =
                                        type.value === 'robo' || type.value === 'agresion'
                                            ? 'text-error'
                                            : 'text-on-surface-variant';

                                    return (
                                        <label
                                            key={type.value}
                                            className="group flex cursor-pointer items-center rounded-xl border border-outline-variant p-3 transition-colors hover:bg-surface-container-low"
                                        >
                                            <Checkbox
                                                checked={filters.types.includes(type.value)}
                                                onCheckedChange={() => toggleIncidentType(type.value)}
                                            />
                                            <span className="ml-3 text-sm text-on-surface">
                                                {type.label}
                                            </span>
                                            <ShieldAlert
                                                className={cn(
                                                    'ml-auto h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100',
                                                    tone,
                                                )}
                                            />
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                                Rango de fecha
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {filterOptions.dateRanges.map((range) => (
                                    <button
                                        key={range.value}
                                        type="button"
                                        onClick={() => submitFilters({ date_range: range.value })}
                                        className={cn(
                                            'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                                            filters.date_range === range.value
                                                ? 'bg-primary-container text-on-primary-container'
                                                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest',
                                        )}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                                Colonia
                            </label>
                            <Select
                                value={filters.neighborhood ?? 'todas'}
                                onValueChange={(value) =>
                                    submitFilters({ neighborhood: value === 'todas' ? null : value })
                                }
                            >
                                <SelectTrigger className="h-12 w-full rounded-xl border-outline-variant bg-surface-container-lowest">
                                    <SelectValue placeholder="Selecciona una colonia" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todas">Todas las colonias</SelectItem>
                                    {filterOptions.neighborhoods.map((neighborhood) => (
                                        <SelectItem key={neighborhood} value={neighborhood}>
                                            {neighborhood}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                                Estado publico
                            </label>
                            <Select
                                value={filters.status ?? 'todos'}
                                onValueChange={(value) =>
                                    submitFilters({ status: value === 'todos' ? null : value })
                                }
                            >
                                <SelectTrigger className="h-12 w-full rounded-xl border-outline-variant bg-surface-container-lowest">
                                    <SelectValue placeholder="Selecciona un estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos los estados</SelectItem>
                                    {filterOptions.statuses.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                                Validacion y confianza
                            </label>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm text-outline">
                                    <span>Confianza minima</span>
                                    <span>{filters.min_confidence}%</span>
                                </div>
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    step={10}
                                    value={filters.min_confidence}
                                    onChange={(event) =>
                                        submitFilters({
                                            min_confidence: Number(event.target.value),
                                        })
                                    }
                                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-surface-container-high accent-primary"
                                />
                                <div className="flex justify-between gap-2 text-xs">
                                    <StatusBadge tone="pending" className="rounded-md">
                                        Pendiente
                                    </StatusBadge>
                                    <StatusBadge tone="community" className="rounded-md">
                                        Validado
                                    </StatusBadge>
                                    <ConfidenceBadge
                                        value={Math.max(filters.min_confidence, 10)}
                                        className="rounded-md"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto border-t border-outline-variant bg-surface-container-low p-6">
                        <button
                            type="button"
                            onClick={() =>
                                submitFilters({
                                    types: [],
                                    date_range: 'all',
                                    neighborhood: null,
                                    status: null,
                                    min_confidence: 0,
                                })
                            }
                            className="flex w-full items-center justify-center gap-2 font-medium text-primary hover:underline"
                        >
                            <Filter className="h-4 w-4" />
                            Reiniciar filtros
                        </button>
                    </div>
                </aside>

                <section className="relative flex-1 overflow-hidden bg-[#e2e8f0]">
                    <IncidentMap
                        mapData={map}
                        activeIncidentId={activeIncident?.id ?? null}
                        onSelectIncident={setActiveIncidentId}
                    />

                    {incidents.length === 0 ? (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-8">
                            <div className="max-w-md rounded-3xl border border-outline-variant bg-white/90 p-8 text-center shadow-xl backdrop-blur-sm">
                                <TriangleAlert className="mx-auto h-10 w-10 text-primary" />
                                <h2 className="mt-4 text-2xl font-semibold text-on-surface">
                                    Sin reportes para estos filtros
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-outline">
                                    Ajusta el rango, la colonia o la confianza minima para volver a
                                    explorar reportes ciudadanos visibles.
                                </p>
                            </div>
                        </div>
                    ) : null}
                </section>

                <aside className="hidden w-[400px] shrink-0 flex-col border-l border-outline-variant bg-surface-container-lowest shadow-[-10px_0_20px_rgba(0,0,0,0.05)] xl:flex">
                    {activeIncident ? (
                        <>
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="mb-6 flex items-start justify-between">
                                    <div>
                                        <StatusBadge
                                            tone={statusTone(activeIncident.status)}
                                            className="rounded-md uppercase tracking-wider"
                                        >
                                            {activeIncident.status_label}
                                        </StatusBadge>
                                        <h2 className="mt-3 text-2xl font-semibold text-on-surface">
                                            {activeIncident.title ??
                                                activeIncident.neighborhood ??
                                                activeIncident.type_label}
                                        </h2>
                                        <p className="text-sm text-outline">
                                            {locationLabel(activeIncident)}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setActiveIncidentId(null)}
                                        className="rounded-full p-2 transition-colors hover:bg-surface-container-high"
                                    >
                                        <X className="h-5 w-5 text-outline" />
                                    </button>
                                </div>

                                <div className="relative mb-6 overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-high p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-2xl bg-white p-3 shadow-sm">
                                            <AlertTriangle className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-on-surface">
                                                Evidencia y revision
                                            </p>
                                            <p className="text-sm leading-6 text-outline">
                                                {activeIncident.has_approved_evidence
                                                    ? `Este reporte cuenta con ${activeIncident.approved_evidence_count} evidencia(s) aprobada(s).`
                                                    : 'Aun no hay evidencia aprobada visible para este reporte.'}
                                            </p>
                                        </div>
                                    </div>
                                    {activeIncident.has_approved_evidence ? (
                                        <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold shadow-sm backdrop-blur-sm">
                                            Evidencia aprobada
                                        </div>
                                    ) : null}
                                </div>

                                <div className="mb-8 grid grid-cols-2 gap-4">
                                    <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-4">
                                        <p className="mb-1 text-xs font-bold uppercase text-outline">
                                            Confianza
                                        </p>
                                        <p className="text-2xl font-semibold text-primary">
                                            {activeIncident.confidence_score}%
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-4">
                                        <p className="mb-1 text-xs font-bold uppercase text-outline">
                                            Fecha aproximada
                                        </p>
                                        <p className="text-sm font-semibold text-on-surface">
                                            {activeIncident.occurred_at_display ?? 'No especificada'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="flex items-center text-sm font-bold text-on-surface-variant">
                                        <AlertTriangle className="mr-2 h-5 w-5" />
                                        Detalle del reporte
                                    </h3>
                                    <p className="border-l-4 border-error-container pl-4 text-sm leading-7 text-on-surface italic">
                                        "{activeIncident.description}"
                                    </p>
                                </div>

                                <div className="mt-10 space-y-3">
                                    <Button
                                        type="button"
                                        disabled={submittingVoteType !== null}
                                        onClick={() => submitVote('confirm')}
                                        className="h-14 w-full rounded-2xl text-sm font-medium shadow-md"
                                    >
                                        Yo tambien lo vi
                                    </Button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            disabled={submittingVoteType !== null}
                                            onClick={() => submitVote('false_report')}
                                            className="flex items-center justify-center gap-2 rounded-2xl bg-surface-container-high py-3 text-sm font-medium text-on-surface-variant transition-all hover:bg-surface-container-highest active:scale-95"
                                        >
                                            Marcar falso
                                        </button>
                                        <Link
                                            href={reports.show(activeIncident.id).url}
                                            className="flex items-center justify-center gap-2 rounded-2xl bg-surface-container-high py-3 text-sm font-medium text-on-surface-variant transition-all hover:bg-surface-container-highest active:scale-95"
                                        >
                                            Ver detalles
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-low p-6">
                                <div className="flex items-center gap-2">
                                    <ConfidenceBadge value={activeIncident.confidence_score} />
                                </div>
                                <p className="text-sm text-outline">
                                    {activeIncident.confirmations_count} persona(s) confirmaron este
                                    reporte
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="flex h-full items-center justify-center p-8">
                            <div className="max-w-xs text-center">
                                <MapPin className="mx-auto h-10 w-10 text-outline" />
                                <p className="mt-4 text-sm leading-6 text-outline">
                                    Selecciona un marcador para ver el detalle del reporte ciudadano.
                                </p>
                            </div>
                        </div>
                    )}
                </aside>
            </main>
        </>
    );
}

function statusTone(status: string): 'pending' | 'unverified' | 'community' | 'evidence' | 'confirmed' {
    switch (status) {
        case 'visible_unverified':
            return 'unverified';
        case 'community_validated':
            return 'community';
        case 'evidence_validated':
            return 'evidence';
        case 'externally_confirmed':
            return 'confirmed';
        default:
            return 'pending';
    }
}

function locationLabel(incident: MapIncident): string {
    const parts = [incident.neighborhood, incident.city].filter(Boolean);

    if (incident.approximate_address) {
        return incident.approximate_address;
    }

    if (parts.length > 0) {
        return parts.join(', ');
    }

    return 'Ubicacion aproximada no especificada';
}
