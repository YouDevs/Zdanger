import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    MapPin,
    MessageSquareWarning,
    ShieldCheck,
    Siren,
    TriangleAlert,
} from 'lucide-react';
import ConfidenceBadge from '@/components/public/confidence-badge';
import StatusBadge from '@/components/public/status-badge';
import { Button } from '@/components/ui/button';
import reports from '@/routes/reports';
import { view_map } from '@/routes';
import type { PublicIncidentDetail } from '@/types';

type ReportShowProps = {
    incident: PublicIncidentDetail;
};

export default function ReportShow({ incident }: ReportShowProps) {
    const [submittingVoteType, setSubmittingVoteType] = useState<string | null>(null);

    const submitVote = (voteType: 'confirm' | 'false_report') => {
        setSubmittingVoteType(voteType);

        router.post(
            reports.votes.store.url(incident.id),
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
            <Head title="Detalle del reporte" />

            <main className="px-6 py-10 md:py-14">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <Link
                            href={view_map()}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver al mapa
                        </Link>

                        <div className="flex items-center gap-3">
                            <StatusBadge tone={statusTone(incident.status)}>
                                {incident.status_label}
                            </StatusBadge>
                            <ConfidenceBadge value={incident.confidence_score} />
                        </div>
                    </div>

                    <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                        <article className="rounded-[1.75rem] border border-outline-variant bg-surface-container-lowest p-8 shadow-sm">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="max-w-3xl">
                                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                                        {incident.type_label}
                                    </p>
                                    <h1 className="mt-3 text-4xl font-semibold text-on-surface">
                                        {incident.title ?? incident.neighborhood ?? 'Reporte ciudadano'}
                                    </h1>
                                    <p className="mt-4 text-base leading-7 text-outline">
                                        {incident.description}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-surface-container-low p-4 text-sm text-outline">
                                    <p className="font-semibold text-on-surface">Ubicacion publica</p>
                                    <p className="mt-2">
                                        {locationLabel(incident)}
                                    </p>
                                    {incident.public_coordinates ? (
                                        <p className="mt-2 text-xs">
                                            Punto aproximado: {incident.public_coordinates.latitude},{' '}
                                            {incident.public_coordinates.longitude}
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="mt-8 grid gap-4 md:grid-cols-3">
                                <MetricCard
                                    icon={MapPin}
                                    label="Fecha aproximada"
                                    value={incident.occurred_at_display ?? 'No especificada'}
                                />
                                <MetricCard
                                    icon={CheckCircle2}
                                    label="Confirmaciones"
                                    value={`${incident.confirmations_count} reporte(s) coincidente(s)`}
                                />
                                <MetricCard
                                    icon={ShieldCheck}
                                    label="Evidencia aprobada"
                                    value={`${incident.approved_evidence_count} archivo(s) revisado(s)`}
                                />
                            </div>

                            <div className="mt-8 rounded-[1.5rem] border border-primary/10 bg-primary/5 p-6">
                                <div className="flex items-start gap-4">
                                    <div className="rounded-2xl bg-white p-3 shadow-sm">
                                        <Siren className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-on-surface">
                                            Contexto del reporte
                                        </h2>
                                        <p className="mt-2 text-sm leading-7 text-outline">
                                            Este registro es ciudadano y puede seguir en proceso de validacion.
                                            La plataforma protege la ubicacion exacta y no publica identidad de quien reporta.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </article>

                        <aside className="space-y-6">
                            <section className="rounded-[1.75rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
                                <h2 className="text-xl font-semibold text-on-surface">
                                    Interaccion comunitaria
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-outline">
                                    Si viste algo similar en la zona, puedes fortalecer o cuestionar este reporte.
                                </p>

                                <div className="mt-6 space-y-3">
                                    <Button
                                        type="button"
                                        disabled={submittingVoteType !== null}
                                        onClick={() => submitVote('confirm')}
                                        className="h-12 w-full rounded-2xl text-sm font-medium shadow-md"
                                    >
                                        Yo tambien lo vi
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={submittingVoteType !== null}
                                        onClick={() => submitVote('false_report')}
                                        className="h-12 w-full rounded-2xl"
                                    >
                                        Marcar como falso
                                    </Button>
                                </div>

                                <div className="mt-6 space-y-3 text-sm">
                                    <InfoRow
                                        icon={CheckCircle2}
                                        label="Confirmaciones ciudadanas"
                                        value={String(incident.confirmations_count)}
                                    />
                                    <InfoRow
                                        icon={MessageSquareWarning}
                                        label="Marcado para revision"
                                        value={String(incident.false_reports_count)}
                                    />
                                </div>
                            </section>

                            <section className="rounded-[1.75rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
                                <h2 className="text-xl font-semibold text-on-surface">
                                    Evidencias aprobadas
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-outline">
                                    Solo se muestra el registro de evidencias aprobadas para este reporte.
                                </p>

                                <div className="mt-5 space-y-3">
                                    {incident.approved_evidences.length > 0 ? (
                                        incident.approved_evidences.map((evidence) => (
                                            <div
                                                key={evidence.id}
                                                className="rounded-2xl border border-outline-variant bg-surface-container-low p-4"
                                            >
                                                <p className="font-medium text-on-surface">
                                                    {evidence.original_filename ?? 'Archivo aprobado'}
                                                </p>
                                                <p className="mt-1 text-xs text-outline">
                                                    {evidence.file_type ?? 'archivo'} · {evidence.mime_type ?? 'sin mime'}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="rounded-2xl border border-dashed border-outline-variant p-4 text-sm text-outline">
                                            Aun no hay evidencia visible para este reporte.
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6">
                                <div className="flex items-start gap-3">
                                    <TriangleAlert className="mt-0.5 h-5 w-5 text-amber-600" />
                                    <p className="text-sm leading-6 text-amber-900">
                                        Este reporte no sustituye una denuncia oficial ni confirma automaticamente un delito.
                                    </p>
                                </div>
                            </section>
                        </aside>
                    </section>
                </div>
            </main>
        </>
    );
}

function MetricCard({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof AlertTriangle;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-[1.5rem] border border-outline-variant bg-surface-container-low p-5">
            <Icon className="h-5 w-5 text-primary" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-outline">
                {label}
            </p>
            <p className="mt-2 text-sm font-medium leading-6 text-on-surface">{value}</p>
        </div>
    );
}

function InfoRow({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof AlertTriangle;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between rounded-2xl bg-surface-container-low px-4 py-3">
            <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-on-surface">{label}</span>
            </div>
            <span className="font-semibold text-on-surface">{value}</span>
        </div>
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

function locationLabel(incident: PublicIncidentDetail): string {
    const parts = [incident.neighborhood, incident.city, incident.state].filter(Boolean);

    if (incident.approximate_address) {
        return incident.approximate_address;
    }

    if (parts.length > 0) {
        return parts.join(', ');
    }

    return 'Ubicacion aproximada no especificada';
}
