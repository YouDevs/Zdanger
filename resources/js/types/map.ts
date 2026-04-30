export type IncidentMapFilters = {
    types: string[];
    date_range: string;
    neighborhood: string | null;
    status: string | null;
    min_confidence: number;
};

export type FilterOption = {
    value: string;
    label: string;
};

export type MapIncident = {
    id: number;
    type: string;
    type_label: string;
    title: string | null;
    description: string;
    approximate_address: string | null;
    neighborhood: string | null;
    city: string | null;
    state: string | null;
    occurred_at: string | null;
    occurred_at_human: string | null;
    occurred_at_display: string | null;
    status: string;
    status_label: string;
    confidence_score: number;
    confirmations_count: number;
    approved_evidence_count: number;
    has_approved_evidence: boolean;
};

export type PublicMapCenter = {
    latitude: number;
    longitude: number;
};

export type PublicMapBounds = {
    southWest: PublicMapCenter;
    northEast: PublicMapCenter;
};

export type IncidentMapFeatureProperties = {
    id: number;
    type: string;
    type_label: string;
    title: string | null;
    description: string;
    approximate_address: string | null;
    neighborhood: string | null;
    city: string | null;
    state: string | null;
    occurred_at: string | null;
    occurred_at_human: string | null;
    occurred_at_display: string | null;
    status: string;
    status_label: string;
    confidence_score: number;
    confirmations_count: number;
    approved_evidence_count: number;
    has_approved_evidence: boolean;
    heat_weight: number;
};

export type PointFeature = {
    type: 'Feature';
    geometry: {
        type: 'Point';
        coordinates: [number, number];
    };
    properties: IncidentMapFeatureProperties;
};

export type PointFeatureCollection = {
    type: 'FeatureCollection';
    features: PointFeature[];
};

export type PublicIncidentMapPayload = {
    center: PublicMapCenter;
    bounds: PublicMapBounds;
    incidentsGeoJson: PointFeatureCollection;
    heatmapGeoJson: PointFeatureCollection;
};
