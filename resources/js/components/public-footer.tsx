const footerLinks = [
    { label: 'Aviso de privacidad', href: '#' },
    { label: 'Términos de uso', href: '#' },
    { label: 'Soporte', href: '#' },
];

export default function PublicFooter() {
    return (
        <footer className="mt-auto border-t border-slate-200 bg-slate-50">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-8 py-12 text-xs text-slate-500 md:flex-row">
                <div className="text-center md:text-left">
                    <p className="mb-1 font-bold text-blue-600">AlertaZona</p>
                    <p>© 2026 AlertaZona. Plataforma cívica de reportes ciudadanos.</p>
                </div>

                <nav className="flex flex-wrap justify-center gap-6">
                    {footerLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="transition-colors hover:text-blue-500"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>
            </div>
        </footer>
    );
}
