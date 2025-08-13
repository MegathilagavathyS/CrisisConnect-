export interface ExtractedLocation {
  original: string;
  standardized: string;
  confidence: number;
  locationId: string;
}

export interface LocationData {
  id: string;
  standardizedName: string;
  latitude: string | null;
  longitude: string | null;
  resources: ResourceData[];
  severity: 'critical' | 'warning' | 'stable';
}

export interface ResourceData {
  id: string;
  resourceType: string;
  totalCapacity: number;
  currentAvailable: number;
  criticalThreshold: number;
  availabilityPercentage: number;
}

export interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  createdAt: string;
}

export interface ChatIntent {
  type: 'location_query' | 'resource_query' | 'general_info' | 'map_action';
  entities: string[];
  confidence: number;
}

export interface DashboardStats {
  totalLocations: number;
  criticalAreas: number;
  warningAreas: number;
  stableAreas: number;
  resourceStats: {
    food: { total: number; available: number; critical: number };
    shelter: { total: number; available: number; critical: number };
    medical: { total: number; available: number; critical: number };
    water: { total: number; available: number; critical: number };
  };
}
