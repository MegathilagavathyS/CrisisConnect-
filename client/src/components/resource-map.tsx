import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers, Filter } from "lucide-react";

interface ResourceMapProps {
  searchQuery: string;
}

interface LocationWithResources {
  location: {
    id: string;
    standardizedName: string;
    latitude: string | null;
    longitude: string | null;
  };
  resources: Array<{
    resourceType: string;
    currentAvailable: number;
    totalCapacity: number;
  }>;
  severity: 'critical' | 'warning' | 'stable';
}

// Declare Leaflet on window to avoid TypeScript issues
declare global {
  interface Window {
    L: any;
  }
}

export default function ResourceMap({ searchQuery }: ResourceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const { data: locationResources, isLoading } = useQuery<LocationWithResources[]>({
    queryKey: ["/api/resources"],
  });

  const severityColors = {
    critical: '#F44336',
    warning: '#FF9800',
    stable: '#4CAF50'
  };

  const severityLabels = {
    critical: 'Critical (Food + Shelter)',
    warning: 'Food Shortage',
    stable: 'Stable'
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      if (!window.L) {
        // Create script element for Leaflet
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initializeMap;
        document.head.appendChild(script);

        // Create link element for Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (mapInstanceRef.current) return;

      const map = window.L.map(mapRef.current).setView([20.5937, 78.9629], 5); // India center
      
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !locationResources || !window.L) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Filter locations based on search query
    const filteredLocations = searchQuery 
      ? locationResources.filter(item => 
          item.location.standardizedName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : locationResources;

    // Add new markers
    filteredLocations.forEach(item => {
      const { location, resources, severity } = item;
      
      if (!location.latitude || !location.longitude) return;

      const lat = parseFloat(location.latitude);
      const lng = parseFloat(location.longitude);

      const marker = window.L.circleMarker([lat, lng], {
        color: severityColors[severity],
        fillColor: severityColors[severity],
        fillOpacity: 0.7,
        radius: 8
      }).addTo(mapInstanceRef.current);

      const resourceInfo = resources.map(resource => {
        const percentage = Math.round((resource.currentAvailable / resource.totalCapacity) * 100);
        return `${resource.resourceType}: ${percentage}% available`;
      }).join('<br>');

      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold text-base mb-2">${location.standardizedName}</h3>
          <div class="text-sm space-y-1">
            ${resourceInfo}
          </div>
          <div class="mt-2">
            <span class="px-2 py-1 rounded text-xs text-white font-medium" style="background-color: ${severityColors[severity]}">
              ${severity.toUpperCase()}
            </span>
          </div>
        </div>
      `);

      markersRef.current.push(marker);
    });
  }, [locationResources, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex-1 relative bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative">
      {/* Legend */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Legend</h3>
        <div className="space-y-2 text-sm">
          {Object.entries(severityLabels).map(([severity, label]) => (
            <div key={severity} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: severityColors[severity as keyof typeof severityColors] }}
              ></div>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full"></div>
      
      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 z-10 space-y-2">
        <Button variant="secondary" size="sm" className="bg-white shadow-lg hover:bg-gray-50">
          <Layers className="w-4 h-4" />
        </Button>
        <Button variant="secondary" size="sm" className="bg-white shadow-lg hover:bg-gray-50">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Search Results Count */}
      {searchQuery && locationResources && (
        <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-3">
          <Badge variant="outline">
            {locationResources.filter(item => 
              item.location.standardizedName.toLowerCase().includes(searchQuery.toLowerCase())
            ).length} locations found
          </Badge>
        </div>
      )}
    </div>
  );
}
