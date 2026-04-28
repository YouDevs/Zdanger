import { Head } from '@inertiajs/react';
import {
    BellRing,
    CircleAlert,
    EyeOff,
    Map,
    ShieldCheck,
    Siren,
    Users,
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
        iconClassName: 'text-[#d08b17]',
    },
    {
        title: 'No verificado',
        description: 'Visible públicamente, sin validación adicional.',
        accent: 'border-[#a8b0bc]',
        icon: EyeOff,
        iconClassName: 'text-[#6d7482]',
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
        icon: ShieldCheck,
        iconClassName: 'text-[#1f8a52]',
    },
    {
        title: 'Confirmado',
        description: 'Existe validación externa o revisión sólida por moderación.',
        accent: 'border-[#18643c]',
        icon: Siren,
        iconClassName: 'text-[#18643c]',
    },
];

export default function Welcome() {
    return (
        <>
            <Head title="Inicio" />

            <section className="relative overflow-hidden px-6 pb-24 pt-18 md:pb-32 md:pt-24">
                <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.18),_transparent_45%),radial-gradient(circle_at_left,_rgba(180,197,255,0.55),_transparent_35%)]" />
                <div className="mx-auto grid w-full max-w-7xl items-center gap-12 md:grid-cols-2">
                    <div className="space-y-6">
                        <span className="inline-flex rounded-full border border-[#c3c6d7] bg-white px-4 py-2 text-sm font-semibold text-[#004ac6] shadow-[0px_4px_12px_rgba(15,23,42,0.05)]">
                            Plataforma civic tech de reportes ciudadanos
                        </span>

                        <div className="space-y-4">
                            <h1 className="max-w-xl text-4xl font-bold tracking-[-0.02em] text-[#191c1e] md:text-5xl md:leading-[1.1]">
                                Reportes ciudadanos de seguridad en tu zona
                            </h1>
                            <p className="max-w-xl text-lg leading-8 text-[#4d556b]">
                                Consulta y reporta incidentes de forma responsable,
                                anónima y basada en evidencia.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <a
                                href="#mapa"
                                className="rounded-2xl bg-[#004ac6] px-8 py-4 text-base font-semibold text-white shadow-[0px_8px_24px_rgba(0,74,198,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#003ea8]"
                            >
                                Ver mapa
                            </a>
                            <a
                                href="#reportar"
                                className="rounded-2xl border border-[#c3c6d7] bg-white px-8 py-4 text-base font-semibold text-[#004ac6] transition-colors hover:bg-[#eef2f7]"
                            >
                                Reportar incidente
                            </a>
                        </div>

                        <div className="flex items-start gap-3 rounded-2xl border border-[#d7dce4] bg-white/90 p-4 text-sm text-[#5d6472] shadow-[0px_4px_12px_rgba(15,23,42,0.05)]">
                            <BellRing className="mt-0.5 h-5 w-5 shrink-0 text-[#004ac6]" />
                            <p>
                                Los reportes son ciudadanos y pueden estar pendientes
                                de validación.
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="overflow-hidden rounded-[2rem] border border-[#d7dce4] bg-white shadow-[0px_20px_48px_rgba(15,23,42,0.12)]">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOYQHt8W2aL00Q9-EpqVrujpSYJzpUxaQ3xCMDrnTI6Kw3XV2KxwIPilU56C8Bxtkg2u20ZmKOqsL8Yq7iJOmLbsJv-7uDgwIPUb2NolNtDpOTOBMVNKPJYGa66s7YFsh5kCnkyf0kZaPNDw6yMn2cclGt91QoyfTrWzPHOPgQggU8aJ_ppxm2jufvbMa1vxUSGJEnzsewfA8g7wYwFy6Qua4J95SMtl4bniphw0L2MWXuLuTafYLX7ObPDgEuIlbGnSTnVnjlZrA"
                                alt="Vista de mapa ciudadano con marcadores y zonas urbanas"
                                className="aspect-square w-full object-cover"
                            />
                        </div>

                        <div className="absolute -bottom-6 -left-4 max-w-xs rounded-3xl border border-[#d7dce4] bg-white p-5 shadow-[0px_12px_24px_rgba(15,23,42,0.10)] md:-left-8">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffdad6] text-[#ba1a1a]">
                                    <CircleAlert className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-semibold text-[#191c1e]">
                                        Reporte reciente
                                    </p>
                                    <p className="text-sm text-[#5d6472]">
                                        Hace 5 minutos en zona centro
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="mapa"
                className="bg-[#eef2f7] px-6 py-24"
            >
                <div className="mx-auto w-full max-w-7xl">
                    <div className="mb-12 max-w-2xl">
                        <h2 className="text-3xl font-semibold tracking-[-0.01em] text-[#191c1e]">
                            Herramientas de participación
                        </h2>
                        <p className="mt-3 text-lg text-[#4d556b]">
                            Tecnología cívica sobria para reportar, consultar y
                            entender información ciudadana con contexto.
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
                                        'relative overflow-hidden rounded-[2rem] border border-[#d7dce4] bg-white p-8 shadow-[0px_4px_12px_rgba(15,23,42,0.05)]',
                                    ].join(' ')}
                                >
                                    <div className="relative z-10 max-w-md">
                                        <span className="mb-5 inline-flex rounded-2xl bg-[#dbe1ff] p-3 text-[#004ac6]">
                                            <Icon className="h-8 w-8" />
                                        </span>
                                        <h3 className="text-2xl font-semibold text-[#191c1e]">
                                            {card.title}
                                        </h3>
                                        <p className="mt-3 leading-7 text-[#5d6472]">
                                            {card.description}
                                        </p>
                                    </div>
                                    <div className="absolute -bottom-8 -right-6 text-[#dbe1ff]">
                                        <Icon className="h-32 w-32" strokeWidth={1.25} />
                                    </div>
                                </article>
                            );
                        })}

                        <article className="md:col-span-12 flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-[#004ac6] p-8 text-white shadow-[0px_8px_24px_rgba(0,74,198,0.18)] md:flex-row md:items-center">
                            <div className="flex items-start gap-5">
                                <div className="rounded-2xl bg-white/18 p-4">
                                    <BellRing className="h-8 w-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold">
                                        Alertas por zona
                                    </h3>
                                    <p className="mt-2 max-w-2xl text-white/82">
                                        La arquitectura quedará lista para activar
                                        alertas en una fase posterior, sin meter esa
                                        lógica todavía al MVP.
                                    </p>
                                </div>
                            </div>

                            <span className="rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white/90">
                                Próximamente
                            </span>
                        </article>
                    </div>
                </div>
            </section>

            <section id="reportar" className="px-6 py-24">
                <div className="mx-auto w-full max-w-7xl rounded-[2rem] border border-[#d7dce4] bg-white p-8 shadow-[0px_12px_24px_rgba(15,23,42,0.06)] md:p-10">
                    <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
                        <div>
                            <h2 className="text-3xl font-semibold tracking-[-0.01em] text-[#191c1e]">
                                Cómo funciona el reporte ciudadano
                            </h2>
                            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#4d556b]">
                                AlertaZona no confirma delitos automáticamente. La
                                plataforma muestra reportes ciudadanos con diferentes
                                niveles de validación y protege la ubicación exacta de
                                quien reporta.
                            </p>
                        </div>

                        <div className="rounded-[1.5rem] bg-[#eef2f7] p-6">
                            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#004ac6]">
                                Principios del MVP
                            </p>
                            <ul className="mt-4 space-y-3 text-sm leading-7 text-[#4d556b]">
                                <li>Reporte responsable y de buena fe.</li>
                                <li>Ubicación pública aproximada, no exacta.</li>
                                <li>Evidencia opcional y moderada antes de publicar.</li>
                                <li>Confirmaciones comunitarias sin lenguaje alarmista.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section id="admin" className="px-6 pb-24">
                <div className="mx-auto w-full max-w-7xl">
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-semibold tracking-[-0.01em] text-[#191c1e]">
                            Estado de los reportes
                        </h2>
                        <p className="mt-3 text-lg text-[#5d6472]">
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
                                        'rounded-[1.5rem] border border-[#d7dce4] border-l-4 bg-white p-6 text-center shadow-[0px_4px_12px_rgba(15,23,42,0.05)]',
                                        status.accent,
                                    ].join(' ')}
                                >
                                    <Icon
                                        className={[
                                            'mx-auto mb-4 h-8 w-8',
                                            status.iconClassName,
                                        ].join(' ')}
                                    />
                                    <h3 className="font-semibold text-[#191c1e]">
                                        {status.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-[#5d6472]">
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
