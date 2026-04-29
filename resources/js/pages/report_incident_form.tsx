import { Head, Link, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useRef } from 'react';
import {
    CarFront,
    CloudUpload,
    Eye,
    Hammer,
    MapPin,
    MoreHorizontal,
    Plus,
    Minus,
    Search,
    Shield,
    TriangleAlert,
    UserRoundX,
    Wallet,
} from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { report_incident_form } from '@/routes';
import { store as storeReport } from '@/routes/reports';

const incidentTypeOptions = [
    { value: 'robo', label: 'Robo', icon: Wallet },
    { value: 'intento_robo', label: 'Intento de robo', icon: TriangleAlert },
    { value: 'robo_vehiculo', label: 'Robo vehiculo', icon: CarFront },
    { value: 'cristalazo', label: 'Cristalazo', icon: Hammer },
    { value: 'agresion', label: 'Agresion', icon: UserRoundX },
    { value: 'acoso', label: 'Acoso', icon: Eye },
    { value: 'vandalismo', label: 'Vandalismo', icon: Hammer },
    { value: 'zona_riesgo', label: 'Zona de riesgo', icon: MapPin },
    { value: 'otro', label: 'Otro', icon: MoreHorizontal },
] as const;

type ReportIncidentFormData = {
    type: string;
    title: string;
    description: string;
    approximate_address: string;
    occurred_on: string;
    occurred_time: string;
    latitude: string;
    longitude: string;
    neighborhood: string;
    city: string;
    state: string;
    visibility_radius: number;
    is_anonymous: boolean;
    evidence: File | null;
};

export default function ReportIncidentForm() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { auth } = usePage().props;
    const isAuthenticated = Boolean(auth.user);

    const { data, setData, post, processing, errors, reset } = useForm<ReportIncidentFormData>({
        type: 'robo',
        title: '',
        description: '',
        approximate_address: '',
        occurred_on: '',
        occurred_time: '',
        latitude: '',
        longitude: '',
        neighborhood: '',
        city: '',
        state: '',
        visibility_radius: 250,
        is_anonymous: true,
        evidence: null,
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post(storeReport.url(), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setData('type', 'robo');
                setData('visibility_radius', 250);
                setData('is_anonymous', true);

                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

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
                                                'mx-2 mb-4 h-[2px] flex-1',
                                                index === 0 ? 'bg-primary' : 'bg-outline-variant',
                                            )}
                                        />
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10 p-6 md:p-8">
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
                                    const isSelected = data.type === option.value;

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setData('type', option.value)}
                                            className={cn(
                                                'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
                                                isSelected
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
                            <InputError message={errors.type} />
                        </section>

                        <section className="space-y-4 border-t border-outline-variant/30 pt-8">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium text-on-surface">
                                    Titulo opcional
                                </Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(event) => setData('title', event.target.value)}
                                    className="h-12 rounded-lg border-outline-variant bg-surface-container-low"
                                    placeholder="Ej. Reporte cerca de corredor comercial"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium text-on-surface">
                                    Descripcion
                                </Label>
                                <textarea
                                    id="description"
                                    rows={5}
                                    value={data.description}
                                    onChange={(event) => setData('description', event.target.value)}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-sm outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    placeholder="Describe lo ocurrido sin incluir nombres de personas ni datos sensibles."
                                />
                                <InputError message={errors.description} />
                            </div>
                        </section>

                        <section className="space-y-4 border-t border-outline-variant/30 pt-8">
                            <Label htmlFor="approximate_address" className="text-sm font-medium text-on-surface">
                                Direccion aproximada
                            </Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3.5 h-4 w-4 text-secondary-foreground" />
                                <Input
                                    id="approximate_address"
                                    value={data.approximate_address}
                                    onChange={(event) => setData('approximate_address', event.target.value)}
                                    className="h-12 rounded-lg border-outline-variant bg-surface-container-low pl-10"
                                    placeholder="Busca una calle, avenida o referencia..."
                                />
                            </div>
                            <InputError message={errors.approximate_address} />

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
                                    <button type="button" className="rounded p-1 transition-colors hover:bg-slate-100">
                                        <Plus className="h-4 w-4 text-secondary-foreground" />
                                    </button>
                                    <button type="button" className="rounded p-1 transition-colors hover:bg-slate-100">
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
                                <Label htmlFor="occurred_on" className="text-sm font-medium text-on-surface">
                                    Fecha del suceso
                                </Label>
                                <Input
                                    id="occurred_on"
                                    type="date"
                                    value={data.occurred_on}
                                    onChange={(event) => setData('occurred_on', event.target.value)}
                                    className="h-12 rounded-lg border-outline-variant bg-surface-container-low"
                                />
                                <InputError message={errors.occurred_on} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="occurred_time" className="text-sm font-medium text-on-surface">
                                    Hora aproximada
                                </Label>
                                <Input
                                    id="occurred_time"
                                    type="time"
                                    value={data.occurred_time}
                                    onChange={(event) => setData('occurred_time', event.target.value)}
                                    className="h-12 rounded-lg border-outline-variant bg-surface-container-low"
                                />
                                <InputError message={errors.occurred_time} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="latitude" className="text-sm font-medium text-on-surface">
                                    Latitud
                                </Label>
                                <Input
                                    id="latitude"
                                    value={data.latitude}
                                    onChange={(event) => setData('latitude', event.target.value)}
                                    placeholder="21.8853"
                                    className="h-12 rounded-lg border-outline-variant bg-surface-container-low"
                                />
                                <InputError message={errors.latitude} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="longitude" className="text-sm font-medium text-on-surface">
                                    Longitud
                                </Label>
                                <Input
                                    id="longitude"
                                    value={data.longitude}
                                    onChange={(event) => setData('longitude', event.target.value)}
                                    placeholder="-102.2916"
                                    className="h-12 rounded-lg border-outline-variant bg-surface-container-low"
                                />
                                <InputError message={errors.longitude} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="neighborhood" className="text-sm font-medium text-on-surface">
                                    Colonia
                                </Label>
                                <Input
                                    id="neighborhood"
                                    value={data.neighborhood}
                                    onChange={(event) => setData('neighborhood', event.target.value)}
                                    placeholder="Zona Centro"
                                    className="h-12 rounded-lg border-outline-variant bg-surface-container-low"
                                />
                                <InputError message={errors.neighborhood} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city" className="text-sm font-medium text-on-surface">
                                    Ciudad
                                </Label>
                                <Input
                                    id="city"
                                    value={data.city}
                                    onChange={(event) => setData('city', event.target.value)}
                                    placeholder="Aguascalientes"
                                    className="h-12 rounded-lg border-outline-variant bg-surface-container-low"
                                />
                                <InputError message={errors.city} />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="state" className="text-sm font-medium text-on-surface">
                                    Estado
                                </Label>
                                <Input
                                    id="state"
                                    value={data.state}
                                    onChange={(event) => setData('state', event.target.value)}
                                    placeholder="Aguascalientes"
                                    className="h-12 rounded-lg border-outline-variant bg-surface-container-low"
                                />
                                <InputError message={errors.state} />
                            </div>
                        </section>

                        <section className="space-y-4 border-t border-outline-variant/30 pt-8">
                            <Label className="text-sm font-medium text-on-surface">
                                Evidencia opcional
                            </Label>
                            <label className="flex cursor-pointer flex-col items-center justify-center space-y-2 rounded-xl border-2 border-dashed border-outline-variant p-10 text-center transition-colors hover:bg-surface-container">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp,.mp4"
                                    className="hidden"
                                    onChange={(event) =>
                                        setData('evidence', event.target.files?.[0] ?? null)
                                    }
                                />
                                <CloudUpload className="h-9 w-9 text-primary-container" />
                                <div className="text-sm text-on-surface">
                                    <span className="font-semibold text-primary">Haz clic para subir</span> o arrastra y suelta
                                </div>
                                <p className="text-xs text-secondary-foreground">
                                    JPG, PNG, WEBP o MP4 (max. 25MB)
                                </p>
                                {data.evidence ? (
                                    <p className="text-xs font-medium text-primary">
                                        Archivo seleccionado: {data.evidence.name}
                                    </p>
                                ) : null}
                            </label>
                            <InputError message={errors.evidence} />
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
                                <Checkbox
                                    checked={data.is_anonymous}
                                    onCheckedChange={(checked) => setData('is_anonymous', checked === true)}
                                    className="h-5 w-5 rounded-full"
                                />
                            </div>
                            {!isAuthenticated ? (
                                <p className="text-xs text-outline">
                                    Al no haber sesion iniciada, este reporte se enviara como anonimo.
                                </p>
                            ) : null}
                            <InputError message={errors.is_anonymous} />
                            <p className="text-sm leading-7 text-secondary-foreground">
                                Al enviar este reporte confirmas que la informacion proporcionada es de
                                buena fe. Este reporte no sustituye una denuncia oficial.
                            </p>
                        </section>

                        <div className="flex gap-4 pt-2">
                            <Link
                                href={report_incident_form()}
                                className="flex flex-1 items-center justify-center rounded-xl border border-outline px-4 py-4 text-sm font-medium text-secondary transition-colors hover:bg-surface-container"
                            >
                                Reiniciar
                            </Link>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-auto flex-[2] rounded-xl px-4 py-4 text-sm font-medium shadow-lg hover:shadow-xl active:scale-95"
                            >
                                {processing ? <Spinner /> : null}
                                Enviar reporte
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}
