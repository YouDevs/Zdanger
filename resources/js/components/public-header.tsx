import { Link, usePage } from '@inertiajs/react';
import { Bell, CircleUserRound } from 'lucide-react';
import { dashboard, login, register } from '@/routes';

type PublicHeaderProps = {
    currentNav?: 'mapa' | 'reportar' | 'admin' | null;
};

const navItems = [
    { label: 'Mapa', href: '/view_map', key: 'mapa' as const },
    { label: 'Reportar', href: '/report_incident_form', key: 'reportar' as const },
    { label: 'Admin', href: '/dashboard', key: 'admin' as const },
];

export default function PublicHeader({
    currentNav = null,
}: PublicHeaderProps) {
    const page = usePage();
    const { auth } = page.props;
    const pathname = page.url.split('?')[0];

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-slate-50/80 shadow-sm backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3">
                <a
                    href="/"
                    className="text-xl font-bold tracking-tight text-[#004ac6]"
                >
                    AlertaZona
                </a>

                <nav className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.key}
                            href={item.href}
                            className={[
                                'text-sm font-medium transition-colors',
                                currentNav === item.key || pathname === item.href
                                    ? 'text-[#004ac6]'
                                    : 'text-[#5d6472] hover:text-[#004ac6]',
                            ].join(' ')}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-150 hover:bg-primary/90 active:scale-95"
                        >
                            Ir al panel
                        </Link>
                    ) : (
                        <>
                            <div className="hidden items-center gap-2 text-slate-600 sm:flex">
                                <span className="cursor-pointer rounded-md p-2 transition-all hover:bg-slate-100">
                                    <Bell className="h-5 w-5" />
                                </span>
                                <Link
                                    href={login()}
                                    className="cursor-pointer rounded-md p-2 transition-all hover:bg-slate-100"
                                >
                                    <CircleUserRound className="h-5 w-5" />
                                </Link>
                            </div>
                            <Link
                                href={login()}
                                className="hidden rounded-md px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-blue-500 md:inline-flex"
                            >
                                Iniciar sesión
                            </Link>
                            <Link
                                href={register()}
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-150 hover:bg-primary/90 active:scale-95"
                            >
                                Reportar incidente
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
