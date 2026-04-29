import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    ChevronRight,
    CircleOff,
    Filter,
    LocateFixed,
    MapPin,
    Minus,
    Plus,
    Search,
    ShieldAlert,
    TriangleAlert,
    X,
} from 'lucide-react';
import ConfidenceBadge from '@/components/public/confidence-badge';
import StatusBadge from '@/components/public/status-badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const incidentTypes = [
    { id: 'robo', label: 'Robo', icon: ShieldAlert, danger: true, checked: true },
    { id: 'robo_vehiculo', label: 'Robo de vehiculo', icon: MapPin, checked: false },
    { id: 'agresion', label: 'Agresion', icon: TriangleAlert, danger: true, checked: true },
    { id: 'zona_riesgo', label: 'Zona de riesgo', icon: CircleOff, checked: false },
];

const dateRanges = [
    { label: 'Ultimas 24h', active: true },
    { label: '7 dias' },
    { label: '30 dias' },
];

const markers = [
    { top: '35%', left: '45%', tone: 'text-error', large: true },
    { top: '55%', left: '30%', tone: 'text-amber-500' },
    { top: '65%', left: '60%', tone: 'text-emerald-500' },
    { top: '20%', left: '75%', tone: 'text-outline opacity-40' },
];

export default function ViewMap() {
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
                                {incidentTypes.map((type) => {
                                    const Icon = type.icon;

                                    return (
                                        <label
                                            key={type.id}
                                            className="group flex cursor-pointer items-center rounded-xl border border-outline-variant p-3 transition-colors hover:bg-surface-container-low"
                                        >
                                            <Checkbox checked={type.checked} />
                                            <span className="ml-3 text-sm text-on-surface">
                                                {type.label}
                                            </span>
                                            <Icon
                                                className={cn(
                                                    'ml-auto h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100',
                                                    type.danger
                                                        ? 'text-error'
                                                        : 'text-on-surface-variant',
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
                                {dateRanges.map((range) => (
                                    <button
                                        key={range.label}
                                        className={cn(
                                            'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                                            range.active
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
                            <Select defaultValue="todas">
                                <SelectTrigger className="h-12 w-full rounded-xl border-outline-variant bg-surface-container-lowest">
                                    <SelectValue placeholder="Selecciona una colonia" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todas">Todas las colonias</SelectItem>
                                    <SelectItem value="centro">Zona Centro</SelectItem>
                                    <SelectItem value="reforma">Reforma</SelectItem>
                                    <SelectItem value="roma">Roma Norte</SelectItem>
                                    <SelectItem value="condesa">Condesa</SelectItem>
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
                                    <span>70%</span>
                                </div>
                                <input
                                    type="range"
                                    defaultValue={70}
                                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-surface-container-high accent-primary"
                                />
                                <div className="flex justify-between gap-2 text-xs">
                                    <StatusBadge tone="pending" className="rounded-md">
                                        Pendiente
                                    </StatusBadge>
                                    <StatusBadge tone="community" className="rounded-md">
                                        Validado
                                    </StatusBadge>
                                    <ConfidenceBadge value={85} className="rounded-md" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto border-t border-outline-variant bg-surface-container-low p-6">
                        <button className="flex w-full items-center justify-center gap-2 font-medium text-primary hover:underline">
                            <Filter className="h-4 w-4" />
                            Reiniciar filtros
                        </button>
                    </div>
                </aside>

                <section className="relative flex-1 overflow-hidden bg-[#e2e8f0]">
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAc1w3ZYwtaihAB46MqD1TNjz50LH_DNwedRZwk6njdrlVnK_EjVuzJXN56KEDGPopiFjNzcFZG9U9MB0QJlbVTSU_q8P-amrJe6NjGq88cT1PrQkgWBjPsFsNJ3eereda7sypGUKpKSkb-FPra5rNtbvFuMQylyck_34Kl8AMrLcxl9EziNE6f3TT48oEqEZA7BXJeRuKxund4XvvRoxCbQQsVKBbuvOc01GFMlPQ-BGedqdEnNzjDU42BrQhj2RaEEaxmecXvBxY"
                        alt="Mapa de referencia de la ciudad"
                        className="absolute inset-0 h-full w-full object-cover grayscale-[0.18] contrast-[0.95] brightness-[1.03]"
                    />

                    <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]" />

                    <div className="absolute inset-0">
                        {markers.map((marker, index) => (
                            <div
                                key={`${marker.top}-${marker.left}-${index}`}
                                className="pointer-events-auto absolute cursor-pointer"
                                style={{ top: marker.top, left: marker.left }}
                            >
                                <div className="group relative">
                                    {marker.large ? (
                                        <div className="absolute -left-2 -top-2 h-8 w-8 animate-ping rounded-full bg-error/20" />
                                    ) : null}
                                    <MapPin
                                        className={cn(
                                            marker.large ? 'h-10 w-10 drop-shadow-lg' : 'h-8 w-8 drop-shadow-md',
                                            marker.tone,
                                        )}
                                        fill="currentColor"
                                    />
                                    {marker.large ? (
                                        <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-outline-variant bg-white px-3 py-1.5 opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                                            <p className="text-xs font-bold text-error">
                                                Robo con violencia
                                            </p>
                                            <p className="text-[11px] text-outline">
                                                Hace 15 minutos
                                            </p>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="absolute bottom-8 left-8 flex flex-col gap-2">
                        <button className="rounded-xl bg-white p-3 text-on-surface shadow-lg transition-transform hover:bg-slate-50 active:scale-90">
                            <Plus className="h-5 w-5" />
                        </button>
                        <button className="rounded-xl bg-white p-3 text-on-surface shadow-lg transition-transform hover:bg-slate-50 active:scale-90">
                            <Minus className="h-5 w-5" />
                        </button>
                        <button className="mt-4 rounded-xl bg-white p-3 text-primary shadow-lg transition-transform hover:bg-slate-50 active:scale-90">
                            <LocateFixed className="h-5 w-5" />
                        </button>
                    </div>
                </section>

                <aside className="hidden w-[400px] shrink-0 flex-col border-l border-outline-variant bg-surface-container-lowest shadow-[-10px_0_20px_rgba(0,0,0,0.05)] xl:flex">
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <StatusBadge tone="pending" className="rounded-md uppercase tracking-wider">
                                    No verificado
                                </StatusBadge>
                                <h2 className="mt-3 text-2xl font-semibold text-on-surface">
                                    Zona Centro, corredor comercial
                                </h2>
                                <p className="text-sm text-outline">
                                    Ubicacion aproximada cerca de transporte publico
                                </p>
                            </div>
                            <button className="rounded-full p-2 transition-colors hover:bg-surface-container-high">
                                <X className="h-5 w-5 text-outline" />
                            </button>
                        </div>

                        <div className="relative mb-6 aspect-video overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-high">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDanU-WwwD05A2vIUUgBNfyeprSnRZzY9ZU9Hfmbjcc3vdnEqJKucy59Qxt-R5fOm6ZZEGJDrXMrQTyUKUdj_hWlG25Qf6-WtXKmRqNCKyxfrBjlM3Z2kP2bbfYhsiCkxG-wIkH7BMXt8gDeanjZxpCnRe33Z7AMRBDww-r-2H7Lt-Zqv2WfGrAY3Gc6KzU4ln_yPoiwNN_dNkJIf5otfUDHbzY35FId6PgCaswuts9axnWcEhgPjKrEDPT_bnv3bP3BJaAa5ck13s"
                                alt="Evidencia referencial de un reporte ciudadano"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold shadow-sm backdrop-blur-sm">
                                Evidencia aprobada
                            </div>
                        </div>

                        <div className="mb-8 grid grid-cols-2 gap-4">
                            <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-4">
                                <p className="mb-1 text-xs font-bold uppercase text-outline">
                                    Confianza
                                </p>
                                <p className="text-2xl font-semibold text-primary">85%</p>
                            </div>
                            <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-4">
                                <p className="mb-1 text-xs font-bold uppercase text-outline">
                                    Fecha aproximada
                                </p>
                                <p className="text-2xl font-semibold text-on-surface">11:42 pm</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="flex items-center text-sm font-bold text-on-surface-variant">
                                <AlertTriangle className="mr-2 h-5 w-5" />
                                Detalle del reporte
                            </h3>
                            <p className="border-l-4 border-error-container pl-4 text-sm leading-7 text-on-surface italic">
                                "Se reporto un robo de telefono cerca de una parada de transporte.
                                Varias personas se resguardaron en locales cercanos y el incidente
                                ocurrio al anochecer."
                            </p>
                        </div>

                        <div className="mt-10 space-y-3">
                            <Button className="h-14 w-full rounded-2xl text-sm font-medium shadow-md">
                                Yo tambien lo vi
                            </Button>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="flex items-center justify-center gap-2 rounded-2xl bg-surface-container-high py-3 text-sm font-medium text-on-surface-variant transition-all hover:bg-surface-container-highest active:scale-95">
                                    Marcar falso
                                </button>
                                <button className="flex items-center justify-center gap-2 rounded-2xl bg-surface-container-high py-3 text-sm font-medium text-on-surface-variant transition-all hover:bg-surface-container-highest active:scale-95">
                                    Ver detalles
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-low p-6">
                        <div className="flex -space-x-2">
                            {['JD', 'MA', 'TP'].map((initials, index) => (
                                <div
                                    key={initials}
                                    className={cn(
                                        'flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold',
                                        index === 0
                                            ? 'bg-slate-300'
                                            : index === 1
                                              ? 'bg-blue-300'
                                              : 'bg-slate-400',
                                    )}
                                >
                                    {initials}
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-outline">12 personas confirmaron este reporte</p>
                    </div>
                </aside>
            </main>
        </>
    );
}

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ');
}
