import { Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';

type PublicHeaderProps = {
    currentNav?: 'mapa' | 'reportar' | 'admin' | null;
};

const navItems = [
    { label: 'Mapa', href: '#mapa', key: 'mapa' as const },
    { label: 'Reportar', href: '#reportar', key: 'reportar' as const },
    { label: 'Admin', href: '#admin', key: 'admin' as const },
];

export default function PublicHeader({
    currentNav = null,
}: PublicHeaderProps) {
    const { auth } = usePage().props;

    return (
        <header className="sticky top-0 z-50 border-b border-[#d7dce4] bg-[rgba(247,249,251,0.92)] backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
                <a
                    href="/"
                    className="text-xl font-bold tracking-tight text-[#004ac6]"
                >
                    AlertaZona
                </a>

                <nav className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <a
                            key={item.key}
                            href={item.href}
                            className={[
                                'text-sm font-medium transition-colors',
                                currentNav === item.key
                                    ? 'text-[#004ac6]'
                                    : 'text-[#5d6472] hover:text-[#004ac6]',
                            ].join(' ')}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            className="rounded-xl bg-[#004ac6] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#003ea8]"
                        >
                            Ir al panel
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="hidden rounded-xl px-4 py-2 text-sm font-medium text-[#5d6472] transition-colors hover:bg-[#eef2f7] hover:text-[#004ac6] sm:inline-flex"
                            >
                                Iniciar sesión
                            </Link>
                            <Link
                                href={register()}
                                className="rounded-xl bg-[#004ac6] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#003ea8]"
                            >
                                Crear cuenta
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
