import { Head, Link } from '@inertiajs/react';
import {
    CloudUpload,
    MapPin,
    Minus,
    MoreHorizontal,
    Plus,
    Search,
    Shield,
    Siren,
    TriangleAlert,
    UserRoundX,
    Wallet,
    CarFront,
    Hammer,
    Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const incidentTypeOptions = [
    { value: 'robo', label: 'Robo', icon: Wallet, selected: true },
    { value: 'intento_robo', label: 'Intento de robo', icon: TriangleAlert },
    { value: 'robo_vehiculo', label: 'Robo vehiculo', icon: CarFront },
    { value: 'cristalazo', label: 'Cristalazo', icon: Hammer },
    { value: 'acoso', label: 'Acoso', icon: Eye },
    { value: 'otro', label: 'Otro', icon: MoreHorizontal },
];

export default function ReportIncidentForm() {
    return (
        <>
            <Head title="Reportar incidente" />

            <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-start bg-surface px-5 py-12">
                <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0px_4px_12px_rgba(15,23,42,0.05)]">
                    <div className="border-b border-outline-variant/30 bg-surface-container-low px-6 py-5">
                        <div className="mx-auto flex max-w-md items-center justify-between">
                            {['Tipo', 'Mapa', 'Fecha', 'Evidencia', 'Privacidad'].map((step, index) => (
                                <div key={step} className="flex flex-1 items-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <div
                                            className={cn(
                                                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold',
                                                index === 0
                                                    ? 'bg-primary text-on-primary'
                                                    : 'bg-outline-variant text-on-surface opacity-40',
                                            )}
                                        >
                                            {index + 1}
                                        </div>
                                        <span
                                            className={cn(
                                                'text-xs font-medium',
                                                index === 0 ? 'text-primary' : 'opacity-40',
                                            )}
                                        >
                                            {step}
                                        </span>
                                    </div>
                                    {index < 4 ? (
                                        <div
                                            className={cn(
                                                'mb-4 h-[2px] flex-1 mx-2',
                                                index === 0 ? 'bg-primary' : 'bg-outline-variant',
                                            )}
                                        />
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-10 p-6 md:p-8">
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-semibold text-on-surface">
                                Reportar incidente
                            </h1>
                            <p className="text-base text-secondary-foreground">
                                Proporciona los detalles para ayudar a la comunidad.
                            </p>
                        </div>

                        <section className="space-y-4">
                            <Label className="text-sm font-medium text-on-surface">
                                Tipo de incidente
                            </Label>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {incidentTypeOptions.map((option) => {
                                    const Icon = option.icon;

                                    return (
                                        <button
                                            key={option.value}
                                            className={cn(
                                                'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
                                                option.selected
                                                    ? 'border-primary bg-[#dbe1ff] text-[#00174b]'
                                                    : 'border-outline-variant text-secondary hover:border-primary hover:text-primary',
                                            )}
                                        >
                                            <Icon className="h-6 w-6" />
                                            <span className="text-sm font-medium">{option.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="space-y-4 border-t border-outline-variant/30 pt-8">
                            <Label className="text-sm font-medium text-on-surface">
                                Descripcion
                            </Label>
                            <textarea
                                rows={5}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-sm outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20"
                                placeholder="Describe lo ocurrido sin incluir nombres de personas ni datos sensibles."
                            />
                        </section>

                        <section className="space-y-4 border-t border-outline-variant/30 pt-8">
                            <Label className="text-sm font-medium text-on-surface">
                                Direccion aproximada
                            </Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3.5 h-4 w-4 text-secondary-foreground" />
                                <Input
                                    className="h-12 rounded-lg border-outline-variant bg-surface-container-low pl-10"
                                    placeholder="Busca una calle, avenida o referencia..."
                                />
                            </div>

                            <div className="relative h-64 overflow-hidden rounded-xl border border-outline-variant">
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDui-jQ_5GmyIIv9BPmOEr1dUKq7A8Amnk4gJPUSEaMIPQNPDqSdy4bXNS7gJAeT715wUlk4cocaUdqEVX6FTJhmQj2sv8d1uQpXCww1qwRFIvUdwYD3RvJypg4v1bF2EwoMQCu55LMjzs826XukRepndn70BsFLVTnu2kYHsXR0E15jyJ6XVJj2bhltscqRcff0BymrSOEyEAGRUimaGV11xs5as1DDQjqdzz3QzoDCjRdVRUjnzlWCZM1Xit_n6-A3sfS50WY4SI"
                                    alt="Mapa placeholder para seleccionar zona aproximada"
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/5" />
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                    <MapPin className="h-10 w-10 text-error" fill="currentColor" />
                                </div>
                                <div className="absolute bottom-4 right-4 flex flex-col gap-2 rounded-lg bg-white p-2 shadow-md">
                                    <button className="rounded p-1 transition-colors hover:bg-slate-100">
                                        <Plus className="h-4 w-4 text-secondary-foreground" />
                                    </button>
                                    <button className="rounded p-1 transition-colors hover:bg-slate-100">
                                        <Minus className="h-4 w-4 text-secondary-foreground" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-sm text-outline">
                                No mostraremos tu ubicacion exacta publicamente.
                            </p>
                        </section>

                        <section className="grid gap-4 border-t border-outline-variant/30 pt-8 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="occurred-date" className="text-sm font-medium text-on-surface">
                                    Fecha del suceso
                                </Label>
                                <Input
                                    id="occurred-date"
                                    type="date"
                                    className="h-12 rounded-lg border-outline-variant bg-surface-container-low"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="occurred-time" className="text-sm font-medium text-on-surface">
                                    Hora aproximada
                                </Label>
                                <Input
                                    id="occurred-time"
                                    type="time"
                                    className="h-12 rounded-lg border-outline-variant bg-surface-container-low"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="latitude" className="text-sm font-medium text-on-surface">
                                    Latitud
                                </Label>
                                <Input
                                    id="latitude"
                                    placeholder="21.8853"
                                    className="h-12 rounded-lg border-outline-variant bg-surface-container-low"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="longitude" className="text-sm font-medium text-on-surface">
                                    Longitud
                                </Label>
                                <Input
                                    id="longitude"
                                    placeholder="-102.2916"
                                    className="h-12 rounded-lg border-outline-variant bg-surface-container-low"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="neighborhood" className="text-sm font-medium text-on-surface">
                                    Colonia
                                </Label>
                                <Input
                                    id="neighborhood"
                                    placeholder="Zona Centro"
                                    className="h-12 rounded-lg border-outline-variant bg-surface-container-low"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city" className="text-sm font-medium text-on-surface">
                                    Ciudad
                                </Label>
                                <Input
                                    id="city"
                                    placeholder="Aguascalientes"
                                    className="h-12 rounded-lg border-outline-variant bg-surface-container-low"
                                />
                            </div>
                        </section>

                        <section className="space-y-4 border-t border-outline-variant/30 pt-8">
                            <Label className="text-sm font-medium text-on-surface">
                                Evidencia opcional
                            </Label>
                            <label className="flex cursor-pointer flex-col items-center justify-center space-y-2 rounded-xl border-2 border-dashed border-outline-variant p-10 text-center transition-colors hover:bg-surface-container">
                                <CloudUpload className="h-9 w-9 text-primary-container" />
                                <div className="text-sm text-on-surface">
                                    <span className="font-semibold text-primary">Haz clic para subir</span> o arrastra y suelta
                                </div>
                                <p className="text-xs text-secondary-foreground">
                                    JPG, PNG o MP4 (max. 25MB)
                                </p>
                            </label>
                        </section>

                        <section className="space-y-4 border-t border-outline-variant/30 pt-8">
                            <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-4">
                                <div className="flex items-center gap-4">
                                    <Shield className="h-5 w-5 text-secondary-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-on-surface">
                                            Reportar de forma anonima
                                        </p>
                                        <p className="text-xs text-secondary-foreground">
                                            Tu identidad no sera publica en el mapa.
                                        </p>
                                    </div>
                                </div>
                                <Checkbox checked className="h-5 w-5 rounded-full" />
                            </div>
                            <p className="text-sm leading-7 text-secondary-foreground">
                                Al enviar este reporte confirmas que la informacion proporcionada es de
                                buena fe. Este reporte no sustituye una denuncia oficial.
                            </p>
                        </section>

                        <div className="flex gap-4 pt-2">
                            <Link
                                href="/"
                                className="flex flex-1 items-center justify-center rounded-xl border border-outline px-4 py-4 text-sm font-medium text-secondary transition-colors hover:bg-surface-container"
                            >
                                Cancelar
                            </Link>
                            <Button className="h-auto flex-[2] rounded-xl px-4 py-4 text-sm font-medium shadow-lg hover:shadow-xl active:scale-95">
                                Enviar reporte
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
