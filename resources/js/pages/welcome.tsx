import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    AlertTriangle,
    BellRing,
    CircleAlert,
    Compass,
    EyeOff,
    Map,
    ShieldCheck,
    Siren,
    Users,
    CheckCircle2,
    CircleHelp,
    Paperclip,
} from 'lucide-react';

const featureCards = [
    {
        title: 'Mapa de reportes',
        description:
            'Visualización interactiva con reportes ciudadanos por tipo de incidente, temporalidad y nivel de validación.',
        icon: Map,
        className: 'md:col-span-8 md:row-span-2',
    },
    {
        title: 'Evidencia y validación',
        description:
            'Sube fotos o archivos de apoyo para fortalecer la credibilidad del reporte sin exponer información sensible.',
        icon: ShieldCheck,
        className: 'md:col-span-4',
    },
    {
        title: 'Reportes anónimos',
        description:
            'La publicación pública protege la identidad del reportante y limita la exposición de datos personales.',
        icon: EyeOff,
        className: 'md:col-span-4',
    },
];

const reportStatuses = [
    {
        title: 'Pendiente',
        description: 'Reporte recién enviado, en espera de revisión inicial.',
        accent: 'border-[#f3b44d]',
        icon: CircleAlert,
        iconClassName: 'text-[#f59e0b]',
    },
    {
        title: 'No verificado',
        description: 'Visible públicamente, sin validación adicional.',
        accent: 'border-slate-300',
        icon: CircleHelp,
        iconClassName: 'text-slate-400',
    },
    {
        title: 'Validado por comunidad',
        description: 'Dos o más personas coinciden en que el hecho ocurrió.',
        accent: 'border-[#4d86ea]',
        icon: Users,
        iconClassName: 'text-[#2563eb]',
    },
    {
        title: 'Validado con evidencia',
        description: 'Cuenta con evidencia aprobada para respaldo del reporte.',
        accent: 'border-[#38a169]',
        icon: Paperclip,
        iconClassName: 'text-[#16a34a]',
    },
    {
        title: 'Confirmado',
        description: 'Existe validación externa o revisión sólida por moderación.',
        accent: 'border-[#18643c]',
        icon: CheckCircle2,
        iconClassName: 'text-[#18643c]',
    },
];

export default function Welcome() {
    return (
        <>
            <Head title="Inicio" />

            <section className="relative overflow-hidden px-6 pb-24 pt-16 md:pb-32 md:pt-24">
                <div className="mx-auto grid w-full max-w-7xl items-center gap-12 md:grid-cols-2">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h1 className="max-w-xl text-5xl font-bold leading-[1.15] text-on-background md:text-6xl">
                                Reportes ciudadanos de seguridad en tu zona
                            </h1>
                            <p className="max-w-xl text-lg leading-7 text-tertiary-container">
                                Consulta y reporta incidentes de forma responsable,
                                anónima y basada en evidencia. Juntos construimos
                                una ciudad más informada.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link
                                href="/view_map"
                                className="rounded-xl bg-primary px-8 py-4 text-base font-semibold text-on-primary transition-all duration-150 hover:shadow-lg active:scale-95"
                            >
                                Ver mapa
                            </Link>
                            <Link
                                href="/report_incident_form"
                                className="rounded-xl border-2 border-outline-variant px-8 py-4 text-base font-semibold text-primary transition-all duration-150 hover:bg-surface-container-low active:scale-95"
                            >
                                Reportar incidente
                            </Link>
                        </div>

                        <p className="flex items-center gap-2 text-sm font-semibold text-outline">
                            <BellRing className="h-4 w-4 text-primary" />
                            <span>
                                Los reportes son ciudadanos y pueden estar pendientes
                                de validación.
                            </span>
                        </p>
                    </div>

                    <div className="relative w-full md:w-auto">
                        <div className="rotate-2 overflow-hidden rounded-[1.75rem] shadow-2xl transition-transform duration-500 hover:rotate-0">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOYQHt8W2aL00Q9-EpqVrujpSYJzpUxaQ3xCMDrnTI6Kw3XV2KxwIPilU56C8Bxtkg2u20ZmKOqsL8Yq7iJOmLbsJv-7uDgwIPUb2NolNtDpOTOBMVNKPJYGa66s7YFsh5kCnkyf0kZaPNDw6yMn2cclGt91QoyfTrWzPHOPgQggU8aJ_ppxm2jufvbMa1vxUSGJEnzsewfA8g7wYwFy6Qua4J95SMtl4bniphw0L2MWXuLuTafYLX7ObPDgEuIlbGnSTnVnjlZrA"
                                alt="Vista de mapa ciudadano con marcadores y zonas urbanas"
                                className="aspect-square w-full object-cover"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                        </div>

                        <div className="landing-overlay-shadow absolute -bottom-6 -left-4 flex max-w-xs animate-pulse items-center gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest/82 p-6 backdrop-blur-sm md:-left-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-container text-error">
                                    <AlertTriangle className="h-5 w-5 fill-current text-[#9f1239]" strokeWidth={2.4} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-on-background">
                                        Reporte reciente
                                    </p>
                                    <p className="text-xs font-semibold text-outline">
                                        Hace 5 minutos en Zona Centro
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="mapa"
                className="bg-surface-container-low px-6 py-24"
            >
                <div className="mx-auto w-full max-w-7xl">
                    <div className="mb-12 max-w-2xl">
                        <h2 className="text-4xl font-semibold text-on-background">
                            Herramientas de participación
                        </h2>
                        <p className="mt-3 text-base text-tertiary-container">
                            Tecnología civic-tech diseñada para la prevención y
                            respuesta comunitaria.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:auto-rows-[240px]">
                        {featureCards.map((card) => {
                            const Icon = card.icon;

                            return (
                                <article
                                    key={card.title}
                                    className={[
                                        card.className,
                                        'group landing-soft-shadow relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-outline-variant/30 bg-surface-container-lowest p-8',
                                    ].join(' ')}
                                >
                                    <div className="relative z-10 max-w-md">
                                        <span className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                                            <Icon className="h-8 w-8" />
                                        </span>
                                        <h3 className="mb-2 text-2xl font-semibold text-on-background">
                                            {card.title}
                                        </h3>
                                        <p className="text-base leading-7 text-outline">
                                            {card.description}
                                        </p>
                                    </div>
                                    {card.title === 'Mapa de reportes' ? (
                                        <>
                                            <Link
                                                href="/view_map"
                                                className="mt-8 flex items-center font-semibold text-primary transition-transform group-hover:translate-x-2"
                                            >
                                                Explorar mapa completo
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </Link>
                                            <div className="absolute bottom-0 right-0 opacity-10 transition-opacity group-hover:opacity-20">
                                                <Map className="h-52 w-52" strokeWidth={1.2} />
                                            </div>
                                        </>
                                    ) : null}
                                </article>
                            );
                        })}

                        <article className="md:col-span-12 flex flex-col items-center justify-between gap-8 rounded-[1.75rem] bg-primary p-8 text-on-primary md:flex-row">
                            <div className="flex items-start gap-5">
                                <div className="rounded-2xl bg-white/20 p-4">
                                    <BellRing className="h-8 w-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold">
                                        Alertas por zona
                                    </h3>
                                    <p className="mt-2 max-w-2xl text-base text-white/80">
                                        Recibe notificaciones inmediatas si se reporta
                                        actividad inusual en tus rutas frecuentes.
                                    </p>
                                </div>
                            </div>

                            <button className="rounded-xl bg-surface-container-lowest px-8 py-3 font-bold whitespace-nowrap text-primary transition-all hover:scale-105">
                                Activar alertas
                            </button>
                        </article>
                    </div>
                </div>
            </section>

            <section id="reportar" className="px-6 py-24">
                <div className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-[1.75rem] border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-[0px_4px_12px_rgba(15,23,42,0.05)] md:p-10">
                    <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
                        <div>
                            <h2 className="text-4xl font-semibold text-on-background">
                                Cómo funciona el reporte ciudadano
                            </h2>
                            <p className="mt-4 max-w-2xl text-lg leading-8 text-tertiary-container">
                                AlertaZona no confirma delitos automáticamente. La
                                plataforma muestra reportes ciudadanos con diferentes
                                niveles de validación y protege la ubicación exacta de
                                quien reporta.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-surface-container-low p-6">
                            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-primary">
                                Principios del MVP
                            </p>
                            <ul className="mt-4 space-y-3 text-sm leading-7 text-tertiary-container">
                                <li>Reporte responsable y de buena fe.</li>
                                <li>Ubicación pública aproximada, no exacta.</li>
                                <li>Evidencia opcional y moderada antes de publicar.</li>
                                <li>Confirmaciones comunitarias sin lenguaje alarmista.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="pointer-events-none absolute bottom-4 right-6 hidden opacity-[0.14] md:block">
                        <Compass className="h-44 w-44 animate-[spin_24s_linear_infinite] text-slate-400" strokeWidth={1.2} />
                    </div>
                </div>
            </section>

            <section id="admin" className="px-6 pb-24">
                <div className="mx-auto w-full max-w-7xl">
                    <div className="mb-16 text-center">
                        <h2 className="text-4xl font-semibold text-on-background">
                            Estado de los reportes
                        </h2>
                        <p className="mt-3 text-base text-outline">
                            Transparencia sobre la etapa en la que se encuentra cada
                            reporte ciudadano.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {reportStatuses.map((status) => {
                            const Icon = status.icon;

                            return (
                                <article
                                    key={status.title}
                                    className={[
                                        'rounded-2xl border border-slate-200 border-l-4 bg-surface-container-lowest p-6 text-center shadow-sm',
                                        status.accent,
                                    ].join(' ')}
                                >
                                    <Icon
                                        className={[
                                            'mx-auto mb-4 h-8 w-8',
                                            status.iconClassName,
                                        ].join(' ')}
                                    />
                                    <h3 className="mb-1 font-bold text-on-background">
                                        {status.title}
                                    </h3>
                                    <p className="text-xs leading-5 text-outline">
                                        {status.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
