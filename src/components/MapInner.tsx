'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Property } from '@/types/property';

// Fix for default marker icons in Leaflet with Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

type MapInnerProps = {
  center?: [number, number];
  zoom?: number;
  height?: string;
  properties?: Property[];
};

export default function MapInner({
  center = [17.1274, -61.8468], // Antigua coordinates
  zoom = 11,
  height = '400px',
  properties = [],
}: MapInnerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) {
      return;
    }

    // Initialize map
    mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapInstanceRef.current);

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom]);

  // Add property markers when properties change
  useEffect(() => {
    if (!mapInstanceRef.current) {
      return;
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers for properties with coordinates
    properties.forEach((property) => {
      const { Latitude, Longitude, Title, Price, Location } = property.fields;

      if (Latitude && Longitude) {
        const marker = L.marker([Latitude, Longitude]).addTo(
          mapInstanceRef.current!
        );

        // Create popup content
        const popupContent = `
          <div style="font-family: sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${Title || 'Property'}</h3>
            ${Price ? `<p style="margin: 0 0 4px 0; font-weight: bold; color: #2563eb;">$${Price.toLocaleString()}</p>` : ''}
            ${Location ? `<p style="margin: 0; color: #6b7280;">${Location}</p>` : ''}
          </div>
        `;

        marker.bindPopup(popupContent);
        markersRef.current.push(marker);
      }
    });
  }, [properties]);

  return (
    <div
      ref={mapRef}
      style={{ height, width: '100%' }}
      className="map-container"
    />
  );
}
