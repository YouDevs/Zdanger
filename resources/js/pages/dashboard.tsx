import { Head, Link } from '@inertiajs/react';
import { ArrowRight, FileSearch, ShieldCheck, TimerReset } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';

const quickActions = [
    {
        title: 'Cola de moderacion',
        description: 'Revisa reportes pendientes, evidencia adjunta y cambios de estado.',
        icon: ShieldCheck,
        href: '/admin/reports',
    },
    {
        title: 'Revision de incidentes',
        description: 'Consulta detalle, votos comunitarios y bitacora de decisiones.',
        icon: FileSearch,
        href: '/admin/reports',
    },
    {
        title: 'Seguimiento operativo',
        description: 'Oculta, rechaza o marca duplicados sin tocar el flujo publico.',
        icon: TimerReset,
        href: '/admin/reports',
    },
];

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <section className="overflow-hidden rounded-[1.75rem] border border-sidebar-border/70 bg-white p-8 shadow-sm dark:bg-neutral-900">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#004ac6]">
                                Panel interno
                            </p>
                            <h1 className="mt-3 text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
                                Moderacion de reportes ciudadanos
                            </h1>
                            <p className="mt-4 text-base leading-7 text-neutral-600 dark:text-neutral-300">
                                Desde aqui puedes revisar incidentes, validar evidencia y aplicar
                                cambios de estado sobre el flujo de reportes ya publicado.
                            </p>
                        </div>

                        <Button asChild className="h-12 rounded-xl px-6">
                            <Link href="/admin/reports">
                                Abrir moderacion
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    {quickActions.map((action) => {
                        const Icon = action.icon;

                        return (
                            <Link
                                key={action.title}
                                href={action.href}
                                className="group rounded-[1.5rem] border border-sidebar-border/70 bg-white p-6 shadow-sm transition-transform hover:-translate-y-0.5 dark:bg-neutral-900"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f0ff] text-[#004ac6] dark:bg-neutral-800">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h2 className="mt-5 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                                    {action.title}
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                                    {action.description}
                                </p>
                                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#004ac6]">
                                    Ir al modulo
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </Link>
                        );
                    })}
                </section>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
