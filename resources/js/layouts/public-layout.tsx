import { Head } from '@inertiajs/react';
import PublicFooter from '@/components/public-footer';
import PublicHeader from '@/components/public-header';

type PublicLayoutProps = {
    children: React.ReactNode;
    currentNav?: 'mapa' | 'reportar' | 'admin' | null;
};

export default function PublicLayout({
    children,
    currentNav = null,
}: PublicLayoutProps) {
    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">
                <PublicHeader currentNav={currentNav} />
                <main>{children}</main>
                <PublicFooter />
            </div>
        </>
    );
}
