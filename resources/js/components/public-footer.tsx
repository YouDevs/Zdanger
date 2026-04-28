const footerLinks = [
    { label: 'Aviso de privacidad', href: '#' },
    { label: 'Términos de uso', href: '#' },
    { label: 'Soporte', href: '#' },
];

export default function PublicFooter() {
    return (
        <footer className="border-t border-[#d7dce4] bg-[#f3f6fa]">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-10 text-sm text-[#5d6472] md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="font-semibold text-[#004ac6]">AlertaZona</p>
                    <p>© 2026 AlertaZona. Plataforma cívica de reportes ciudadanos.</p>
                </div>

                <nav className="flex flex-wrap gap-5">
                    {footerLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="transition-colors hover:text-[#004ac6]"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>
            </div>
        </footer>
    );
}
