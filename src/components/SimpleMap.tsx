'use client';

import { useEffect, useRef } from 'react';
import type { Property } from '@/types/property';
import { getCoordinatesFromLocation } from '@/lib/locationMapping';

type SimpleMapProps = {
  properties?: Property[];
};

export default function SimpleMap({ properties = [] }: SimpleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);

  // Component receives properties

  // Function to add property markers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addPropertyMarkers = (L: any) => {
    let markersAdded = 0;
    let mappingsFailed = 0;

    properties.forEach((property) => {
      const { Title, Price, Address } = property.fields;
      const propertyUrl = property.fields['Property URL'];

      let coords: [number, number] | null = null;

      // Try to get coordinates from address first (since it has location info)
      if (Address) {
        coords = getCoordinatesFromLocation(Address);
      }

      // If no coordinates from address, try title
      if (!coords && Title) {
        coords = getCoordinatesFromLocation(Title);
      }

      // Track which properties couldn't be mapped
      if (!coords) {
        mappingsFailed++;
      }

      if (coords) {
        const marker = L.marker(coords, {
          icon: L.icon({
            iconUrl:
              'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            iconRetinaUrl:
              'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
            shadowUrl:
              'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          }),
        }).addTo(mapInstanceRef.current!);

        // Create popup content
        const popupContent = `
          <div style="font-family: sans-serif; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${Title || 'Property'}</h3>
            ${Price ? `<p style="margin: 0 0 8px 0; font-weight: bold; color: #2563eb; font-size: 18px;">$${Price.toLocaleString()}</p>` : ''}
            ${Address ? `<p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">${Address}</p>` : ''}
            ${
              propertyUrl
                ? `
              <div style="text-align: center;">
                <a href="${propertyUrl}" target="_blank" rel="noopener noreferrer" 
                   style="display: inline-block; background: #2563eb; color: white; padding: 8px 16px; 
                          text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;
                          transition: background-color 0.2s;">
                  View Details
                </a>
              </div>
            `
                : ''
            }
          </div>
        `;

        marker.bindPopup(popupContent);
        markersRef.current.push(marker);
        markersAdded++;
      }
    });

    console.log(
      `Map: ${markersAdded} markers added, ${mappingsFailed} properties couldn't be mapped (${properties.length} total)`
    );
  };

  useEffect(() => {
    // Only initialize once and only on client side
    if (
      typeof window !== 'undefined' &&
      mapRef.current &&
      !mapInstanceRef.current
    ) {
      import('leaflet').then((L) => {
        // Skip if already initialized
        if (mapInstanceRef.current) return;

        // Fix for default marker icons
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Initialize map
        mapInstanceRef.current = L.map(mapRef.current!).setView(
          [17.1274, -61.8468],
          11
        );

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(mapInstanceRef.current);

        // Trigger property markers to be added if properties are already available
        if (properties.length > 0) {
          setTimeout(() => addPropertyMarkers(L), 100);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle property markers when properties change
  useEffect(() => {
    if (typeof window === 'undefined' || properties.length === 0) {
      return;
    }

    // If map isn't ready yet, wait and retry
    if (!mapInstanceRef.current) {
      const retryTimeoutId = setTimeout(() => {
        // Force re-trigger by updating a dummy state or just call the effect logic again
        if (mapInstanceRef.current && properties.length > 0) {
          import('leaflet').then((L) => {
            // Clear existing property markers
            markersRef.current.forEach((marker) => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.removeLayer(marker);
              }
            });
            markersRef.current = [];
            addPropertyMarkers(L);
          });
        }
      }, 500);
      return () => clearTimeout(retryTimeoutId);
    }

    // Clear existing property markers
    markersRef.current.forEach((marker) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(marker);
      }
    });
    markersRef.current = [];

    // Add new markers
    import('leaflet').then((L) => {
      addPropertyMarkers(L);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties]);

  return (
    <div
      ref={mapRef}
      style={{
        height: '400px',
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    />
  );
}
