import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import {
    CheckCircle2,
    CircleHelp,
    EyeOff,
    FileImage,
    FileSearch,
    Filter,
    MapPin,
    Paperclip,
    ShieldAlert,
    TimerReset,
} from 'lucide-react';
import ConfidenceBadge from '@/components/public/confidence-badge';
import StatusBadge from '@/components/public/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

type FilterOption = {
    value: string;
    label: string;
};

type ModerationReportRow = {
    id: number;
    type: string;
    type_label: string;
    title: string | null;
    description: string;
    approximate_address: string | null;
    neighborhood: string | null;
    city: string | null;
    state: string | null;
    occurred_at_display: string | null;
    status: string;
    status_label: string;
    confidence_score: number;
    confirmations_count: number;
    approved_evidence_count: number;
    has_approved_evidence: boolean;
    is_public: boolean;
    is_anonymous: boolean;
    evidence_total: number;
    pending_evidence_count: number;
    false_reports_count: number;
    reporter_label: string;
};

type ModerationReportDetail = ModerationReportRow & {
    reporter: { id: number; name: string; email: string } | null;
    reviewer: { id: number; name: string; email: string } | null;
    duplicate_of: { id: number; title: string | null } | null;
    evidences: Array<{
        id: number;
        status: string;
        file_type: string | null;
        original_filename: string | null;
        mime_type: string | null;
        size: number | null;
        created_at: string | null;
    }>;
    status_logs: Array<{
        id: number;
        previous_status: string | null;
        previous_status_label: string | null;
        new_status: string;
        new_status_label: string;
        reason: string | null;
        changed_by: string | null;
        created_at: string | null;
    }>;
};

type Filters = {
    status: string | null;
    type: string | null;
    city: string | null;
    date_range: string;
};

type Props = {
    reports: ModerationReportRow[];
    selectedReport: ModerationReportDetail | null;
    filters: Filters;
    filterOptions: {
        statuses: FilterOption[];
        types: FilterOption[];
        cities: string[];
        dateRanges: FilterOption[];
    };
    summary: {
        total: number;
        pending: number;
        public: number;
        approvedEvidence: number;
    };
};

const statusActionOptions = [
    { value: 'visible_unverified', label: 'Hacer visible como no verificado' },
    { value: 'community_validated', label: 'Marcar como validado por comunidad' },
    { value: 'evidence_validated', label: 'Validar con evidencia' },
    { value: 'externally_confirmed', label: 'Confirmar por fuente externa' },
    { value: 'rejected', label: 'Rechazar' },
    { value: 'duplicated', label: 'Marcar como duplicado' },
    { value: 'hidden', label: 'Ocultar' },
] as const;

export default function AdminModerationReports({
    reports,
    selectedReport,
    filters,
    filterOptions,
    summary,
}: Props) {
    const [statusAction, setStatusAction] = useState<string>(selectedReport?.status ?? 'visible_unverified');
    const [reason, setReason] = useState<string>('');
    const [duplicateOfId, setDuplicateOfId] = useState<string>('');

    const duplicateCandidates = useMemo(
        () => reports.filter((report) => report.id !== selectedReport?.id),
        [reports, selectedReport?.id],
    );

    useEffect(() => {
        const nextStatusAction = statusActionOptions.some((option) => option.value === selectedReport?.status)
            ? (selectedReport?.status ?? 'visible_unverified')
            : 'visible_unverified';

        setStatusAction(nextStatusAction);
        setReason('');
        setDuplicateOfId('');
    }, [selectedReport?.id, selectedReport?.status]);

    const applyFilters = (nextFilters: Partial<Filters>) => {
        const merged = { ...filters, ...nextFilters };

        router.get(
            '/admin/reports',
            {
                status: merged.status || undefined,
                type: merged.type || undefined,
                city: merged.city || undefined,
                date_range: merged.date_range !== 'all' ? merged.date_range : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const submitStatusAction = () => {
        if (!selectedReport) {
            return;
        }

        router.patch(
            `/admin/reports/${selectedReport.id}/status`,
            {
                status: statusAction,
                reason: reason || undefined,
                duplicate_of_id: statusAction === 'duplicated' ? Number(duplicateOfId) : undefined,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setReason('');
                    setDuplicateOfId('');
                },
            },
        );
    };

    const updateEvidenceStatus = (evidenceId: number, status: 'approved' | 'rejected' | 'pending') => {
        router.patch(
            `/admin/evidences/${evidenceId}/status`,
            { status },
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Moderacion" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-hidden rounded-xl p-4">
                <section className="grid gap-4 md:grid-cols-4">
                    <SummaryCard label="Total reportes" value={summary.total} icon={FileSearch} />
                    <SummaryCard label="Pendientes" value={summary.pending} icon={TimerReset} accent="amber" />
                    <SummaryCard label="Publicos" value={summary.public} icon={CircleHelp} accent="blue" />
                    <SummaryCard label="Evidencias aprobadas" value={summary.approvedEvidence} icon={Paperclip} accent="green" />
                </section>

                <section className="grid min-h-0 flex-1 gap-6 xl:grid-cols-[1.05fr_1.35fr]">
                    <div className="flex min-h-0 flex-col rounded-[1.5rem] border border-sidebar-border/70 bg-white shadow-sm dark:bg-neutral-900">
                        <div className="border-b border-sidebar-border/70 p-5">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                                        Cola de moderacion
                                    </h1>
                                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                                        Filtra y selecciona reportes para revision interna.
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-[#e8f0ff] p-3 text-[#004ac6] dark:bg-neutral-800">
                                    <Filter className="h-5 w-5" />
                                </div>
                            </div>

                            <div className="mt-5 grid gap-3 md:grid-cols-2">
                                <Select
                                    value={filters.status ?? 'todos'}
                                    onValueChange={(value) => applyFilters({ status: value === 'todos' ? null : value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Estado" />
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

                                <Select
                                    value={filters.type ?? 'todos'}
                                    onValueChange={(value) => applyFilters({ type: value === 'todos' ? null : value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todos los tipos</SelectItem>
                                        {filterOptions.types.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.city ?? 'todas'}
                                    onValueChange={(value) => applyFilters({ city: value === 'todas' ? null : value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Ciudad" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todas">Todas las ciudades</SelectItem>
                                        {filterOptions.cities.map((city) => (
                                            <SelectItem key={city} value={city}>
                                                {city}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.date_range}
                                    onValueChange={(value) => applyFilters({ date_range: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Fecha" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filterOptions.dateRanges.map((range) => (
                                            <SelectItem key={range.value} value={range.value}>
                                                {range.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto">
                            {reports.length > 0 ? (
                                <table className="w-full text-left">
                                    <thead className="sticky top-0 bg-neutral-50 text-xs uppercase tracking-[0.12em] text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
                                        <tr>
                                            <th className="px-5 py-3">Reporte</th>
                                            <th className="px-5 py-3">Estado</th>
                                            <th className="px-5 py-3">Ciudad</th>
                                            <th className="px-5 py-3">Senales</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reports.map((report) => (
                                            <tr
                                                key={report.id}
                                                className={cn(
                                                    'border-t border-sidebar-border/60 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/40',
                                                    selectedReport?.id === report.id && 'bg-[#eef4ff] dark:bg-neutral-800',
                                                )}
                                            >
                                                <td className="px-5 py-4 align-top">
                                                    <Link href={`/admin/reports/${report.id}`} className="block">
                                                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                                                            {report.title ?? report.type_label}
                                                        </p>
                                                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                                                            {report.neighborhood ?? report.approximate_address ?? 'Sin zona'}
                                                        </p>
                                                        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                                                            {report.occurred_at_display ?? 'Sin fecha'} · {report.reporter_label}
                                                        </p>
                                                    </Link>
                                                </td>
                                                <td className="px-5 py-4 align-top">
                                                    <StatusBadge tone={statusTone(report.status)}>
                                                        {report.status_label}
                                                    </StatusBadge>
                                                </td>
                                                <td className="px-5 py-4 align-top text-sm text-neutral-700 dark:text-neutral-300">
                                                    {report.city ?? 'Sin ciudad'}
                                                </td>
                                                <td className="px-5 py-4 align-top">
                                                    <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
                                                        <ConfidenceBadge value={report.confidence_score} />
                                                        <p>{report.confirmations_count} confirmaciones</p>
                                                        <p>{report.pending_evidence_count} evidencia(s) pendiente(s)</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex h-full items-center justify-center p-10 text-center text-neutral-500 dark:text-neutral-400">
                                    No hay reportes para los filtros seleccionados.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="min-h-0 overflow-y-auto rounded-[1.5rem] border border-sidebar-border/70 bg-white shadow-sm dark:bg-neutral-900">
                        {selectedReport ? (
                            <div className="space-y-6 p-6">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div className="max-w-3xl">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <StatusBadge tone={statusTone(selectedReport.status)}>
                                                {selectedReport.status_label}
                                            </StatusBadge>
                                            <ConfidenceBadge value={selectedReport.confidence_score} />
                                            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                                                {selectedReport.is_public ? 'Visible al publico' : 'Oculto al publico'}
                                            </span>
                                        </div>
                                        <h2 className="mt-4 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
                                            {selectedReport.title ?? selectedReport.type_label}
                                        </h2>
                                        <p className="mt-3 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                                            {selectedReport.description}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                                        <div className="flex items-center gap-2 font-medium text-neutral-900 dark:text-neutral-100">
                                            <MapPin className="h-4 w-4 text-[#004ac6]" />
                                            {selectedReport.city ?? 'Sin ciudad'}
                                        </div>
                                        <p className="mt-2">
                                            {selectedReport.neighborhood ?? selectedReport.approximate_address ?? 'Sin ubicacion aproximada'}
                                        </p>
                                        <p className="mt-2">
                                            {selectedReport.occurred_at_display ?? 'Sin fecha aproximada'}
                                        </p>
                                    </div>
                                </div>

                                <section className="grid gap-4 md:grid-cols-4">
                                    <Metric label="Confirmaciones" value={String(selectedReport.confirmations_count)} />
                                    <Metric label="Reportes falsos" value={String(selectedReport.false_reports_count)} />
                                    <Metric label="Evidencias" value={String(selectedReport.evidence_total)} />
                                    <Metric label="Aprobadas" value={String(selectedReport.approved_evidence_count)} />
                                </section>

                                <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                                    <div className="space-y-6">
                                        <Panel title="Acciones de moderacion" icon={ShieldAlert}>
                                            <div className="space-y-3">
                                                <Select value={statusAction} onValueChange={setStatusAction}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona una accion" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {statusActionOptions.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                {statusAction === 'duplicated' ? (
                                                    <Select value={duplicateOfId || 'sin-duplicado'} onValueChange={(value) => setDuplicateOfId(value === 'sin-duplicado' ? '' : value)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona el reporte principal" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="sin-duplicado">Selecciona reporte principal</SelectItem>
                                                            {duplicateCandidates.map((report) => (
                                                                <SelectItem key={report.id} value={String(report.id)}>
                                                                    #{report.id} · {report.title ?? report.type_label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : null}

                                                <textarea
                                                    value={reason}
                                                    onChange={(event) => setReason(event.target.value)}
                                                    rows={4}
                                                    className="w-full rounded-xl border border-sidebar-border/70 bg-white px-4 py-3 text-sm outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 dark:bg-neutral-950"
                                                    placeholder="Nota interna o razon del cambio"
                                                />

                                                <Button type="button" onClick={submitStatusAction} className="w-full rounded-xl">
                                                    Aplicar accion
                                                </Button>
                                            </div>
                                        </Panel>

                                        <Panel title="Datos internos" icon={FileSearch}>
                                            <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
                                                <InfoLine label="Reportante" value={selectedReport.reporter?.email ?? 'Anonimo o sin usuario'} />
                                                <InfoLine label="Ultimo revisor" value={selectedReport.reviewer?.email ?? 'Sin revision manual'} />
                                                <InfoLine label="Tipo" value={selectedReport.type_label} />
                                                <InfoLine label="Estado actual" value={selectedReport.status_label} />
                                                {selectedReport.duplicate_of ? (
                                                    <InfoLine
                                                        label="Duplicado de"
                                                        value={`#${selectedReport.duplicate_of.id} ${selectedReport.duplicate_of.title ?? ''}`.trim()}
                                                    />
                                                ) : null}
                                            </div>
                                        </Panel>
                                    </div>

                                    <div className="space-y-6">
                                        <Panel title="Evidencias adjuntas" icon={Paperclip}>
                                            <div className="space-y-4">
                                                {selectedReport.evidences.length > 0 ? (
                                                    selectedReport.evidences.map((evidence) => (
                                                        <div
                                                            key={evidence.id}
                                                            className="rounded-2xl border border-sidebar-border/70 bg-neutral-50 p-4 dark:bg-neutral-800/50"
                                                        >
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <FileImage className="h-4 w-4 text-[#004ac6]" />
                                                                        <p className="truncate font-medium text-neutral-900 dark:text-neutral-100">
                                                                            {evidence.original_filename ?? `Archivo ${evidence.id}`}
                                                                        </p>
                                                                    </div>
                                                                    <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                                                                        {evidence.mime_type ?? 'sin mime'} · {evidence.file_type ?? 'archivo'}
                                                                    </p>
                                                                </div>
                                                                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                                                                    {evidence.status}
                                                                </span>
                                                            </div>

                                                            <div className="mt-4 flex flex-wrap gap-2">
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    className="rounded-lg"
                                                                    onClick={() => updateEvidenceStatus(evidence.id, 'approved')}
                                                                >
                                                                    Aprobar
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="rounded-lg"
                                                                    onClick={() => updateEvidenceStatus(evidence.id, 'pending')}
                                                                >
                                                                    Regresar a pendiente
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="rounded-lg border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                                                                    onClick={() => updateEvidenceStatus(evidence.id, 'rejected')}
                                                                >
                                                                    Rechazar
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="rounded-2xl border border-dashed border-sidebar-border/70 p-4 text-sm text-neutral-500 dark:text-neutral-400">
                                                        Este reporte no tiene evidencias adjuntas.
                                                    </div>
                                                )}
                                            </div>
                                        </Panel>

                                        <Panel title="Bitacora de cambios" icon={CheckCircle2}>
                                            <div className="space-y-4">
                                                {selectedReport.status_logs.length > 0 ? (
                                                    selectedReport.status_logs.map((log) => (
                                                        <div key={log.id} className="rounded-2xl border border-sidebar-border/70 p-4">
                                                            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                                                <StatusBadge tone={statusTone(log.new_status)}>
                                                                    {log.new_status_label}
                                                                </StatusBadge>
                                                                <span className="text-neutral-500 dark:text-neutral-400">
                                                                    {log.created_at ?? 'Sin fecha'}
                                                                </span>
                                                            </div>
                                                            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
                                                                {log.previous_status_label
                                                                    ? `Cambio desde ${log.previous_status_label}.`
                                                                    : 'Registro inicial del flujo.'}
                                                            </p>
                                                            {log.reason ? (
                                                                <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                                                                    {log.reason}
                                                                </p>
                                                            ) : null}
                                                            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                                                                {log.changed_by ?? 'Sistema'}
                                                            </p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="rounded-2xl border border-dashed border-sidebar-border/70 p-4 text-sm text-neutral-500 dark:text-neutral-400">
                                                        Aun no hay eventos en la bitacora de este reporte.
                                                    </div>
                                                )}
                                            </div>
                                        </Panel>
                                    </div>
                                </section>
                            </div>
                        ) : (
                            <div className="flex h-full items-center justify-center p-10 text-center">
                                <div className="max-w-md">
                                    <EyeOff className="mx-auto h-8 w-8 text-neutral-400" />
                                    <p className="mt-4 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                                        Selecciona un reporte de la tabla para abrir el panel de moderacion.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}

function SummaryCard({
    label,
    value,
    icon: Icon,
    accent = 'neutral',
}: {
    label: string;
    value: number;
    icon: typeof FileSearch;
    accent?: 'neutral' | 'amber' | 'blue' | 'green';
}) {
    const accentClassName = {
        neutral: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200',
        amber: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
        blue: 'bg-[#e8f0ff] text-[#004ac6] dark:bg-neutral-800 dark:text-[#7fa8ff]',
        green: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    }[accent];

    return (
        <div className="rounded-[1.5rem] border border-sidebar-border/70 bg-white p-5 shadow-sm dark:bg-neutral-900">
            <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl', accentClassName)}>
                <Icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">{value}</p>
        </div>
    );
}

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-sidebar-border/70 bg-neutral-50 p-4 dark:bg-neutral-800/50">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
                {label}
            </p>
            <p className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">{value}</p>
        </div>
    );
}

function Panel({
    title,
    icon: Icon,
    children,
}: {
    title: string;
    icon: typeof FileSearch;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-[1.5rem] border border-sidebar-border/70 p-5">
            <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-[#e8f0ff] p-2 text-[#004ac6] dark:bg-neutral-800 dark:text-[#7fa8ff]">
                    <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
            </div>
            {children}
        </section>
    );
}

function InfoLine({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-4 rounded-xl bg-neutral-50 px-4 py-3 dark:bg-neutral-800/50">
            <span className="text-neutral-500 dark:text-neutral-400">{label}</span>
            <span className="max-w-[60%] text-right text-neutral-900 dark:text-neutral-100">{value}</span>
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

AdminModerationReports.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Moderacion', href: '/admin/reports' },
    ],
};
