import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo } from 'react';
import { Circle, CircleMarker, MapContainer, TileLayer, useMap } from 'react-leaflet';
import { LocateFixed, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PointFeature, PublicIncidentMapPayload } from '@/types';

const LeafletMapContainer = MapContainer as unknown as React.ComponentType<Record<string, unknown>>;
const LeafletTileLayer = TileLayer as unknown as React.ComponentType<Record<string, unknown>>;
const LeafletCircle = Circle as unknown as React.ComponentType<Record<string, unknown>>;
const LeafletCircleMarker = CircleMarker as unknown as React.ComponentType<Record<string, unknown>>;

type IncidentMapProps = {
    className?: string;
    mapData: PublicIncidentMapPayload;
    activeIncidentId: number | null;
    onSelectIncident: (incidentId: number) => void;
};

type IncidentPoint = {
    feature: PointFeature;
    latitude: number;
    longitude: number;
};

export default function IncidentMap({
    className,
    mapData,
    activeIncidentId,
    onSelectIncident,
}: IncidentMapProps) {
    const incidentPoints = useMemo(
        () =>
            mapData.incidentsGeoJson.features.map((feature) => ({
                feature,
                longitude: feature.geometry.coordinates[0],
                latitude: feature.geometry.coordinates[1],
            })),
        [mapData.incidentsGeoJson.features],
    );

    return (
        <div className={cn('relative h-full w-full overflow-hidden bg-[#dbeafe]', className)}>
            <LeafletMapContainer
                center={[mapData.center.latitude, mapData.center.longitude]}
                zoom={12}
                scrollWheelZoom
                className="absolute inset-0 z-0"
                zoomControl={false}
            >
                <LeafletTileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapViewport mapData={mapData} />
                <LeafletControls mapData={mapData} />

                {incidentPoints.map((point) => {
                    const incidentId = point.feature.properties.id;
                    const isActive = incidentId === activeIncidentId;
                    const markerColor = markerToneColor(point.feature.properties.status);
                    const zoneColor = zoneToneColor(point.feature.properties.confidence_score);

                    return (
                        <div key={incidentId}>
                            <LeafletCircle
                                center={[point.latitude, point.longitude]}
                                radius={170}
                                pathOptions={{
                                    color: zoneColor,
                                    fillColor: zoneColor,
                                    fillOpacity: isActive ? 0.2 : 0.12,
                                    opacity: isActive ? 0.45 : 0.25,
                                    weight: 1,
                                }}
                            />
                            <LeafletCircleMarker
                                center={[point.latitude, point.longitude]}
                                radius={isActive ? 10 : 7}
                                pathOptions={{
                                    color: '#ffffff',
                                    weight: isActive ? 3 : 2,
                                    fillColor: markerColor,
                                    fillOpacity: 0.95,
                                }}
                                eventHandlers={{
                                    click: () => {
                                        onSelectIncident(incidentId);
                                    },
                                }}
                            />
                        </div>
                    );
                })}
            </LeafletMapContainer>

            <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_50%)]" />

            <div className="absolute right-6 top-6 z-[500] rounded-full bg-white/92 px-3 py-1.5 text-xs font-semibold text-outline shadow-md backdrop-blur-sm">
                Estado mapa: loaded
            </div>
        </div>
    );
}

function MapViewport({ mapData }: { mapData: PublicIncidentMapPayload }) {
    const map = useMap();

    useEffect(() => {
        map.fitBounds(
            [
                [mapData.bounds.southWest.latitude, mapData.bounds.southWest.longitude],
                [mapData.bounds.northEast.latitude, mapData.bounds.northEast.longitude],
            ],
            {
                padding: [56, 56],
                maxZoom: 14,
            },
        );
    }, [map, mapData.bounds.northEast.latitude, mapData.bounds.northEast.longitude, mapData.bounds.southWest.latitude, mapData.bounds.southWest.longitude]);

    return null;
}

function LeafletControls({ mapData }: { mapData: PublicIncidentMapPayload }) {
    const map = useMap();

    const zoomIn = () => {
        map.zoomIn();
    };

    const zoomOut = () => {
        map.zoomOut();
    };

    const resetViewport = () => {
        map.flyTo([mapData.center.latitude, mapData.center.longitude], 12, {
            duration: 0.5,
        });
    };

    return (
        <div className="absolute bottom-8 left-8 z-[500] flex flex-col gap-2">
            <button
                type="button"
                onClick={zoomIn}
                className="rounded-xl bg-white p-3 text-on-surface shadow-lg transition-transform hover:bg-slate-50 active:scale-90"
            >
                <Plus className="h-5 w-5" />
            </button>
            <button
                type="button"
                onClick={zoomOut}
                className="rounded-xl bg-white p-3 text-on-surface shadow-lg transition-transform hover:bg-slate-50 active:scale-90"
            >
                <Minus className="h-5 w-5" />
            </button>
            <button
                type="button"
                onClick={resetViewport}
                className="mt-4 rounded-xl bg-white p-3 text-primary shadow-lg transition-transform hover:bg-slate-50 active:scale-90"
            >
                <LocateFixed className="h-5 w-5" />
            </button>
        </div>
    );
}

function markerToneColor(status: string): string {
    switch (status) {
        case 'externally_confirmed':
            return '#18643c';
        case 'evidence_validated':
            return '#16a34a';
        case 'community_validated':
            return '#2563eb';
        case 'visible_unverified':
            return '#f59e0b';
        default:
            return '#dc2626';
    }
}

function zoneToneColor(confidenceScore: number): string {
    if (confidenceScore >= 80) {
        return '#b91c1c';
    }

    if (confidenceScore >= 60) {
        return '#dc2626';
    }

    if (confidenceScore >= 40) {
        return '#ea580c';
    }

    return '#f59e0b';
}
