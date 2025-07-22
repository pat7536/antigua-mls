'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Property } from '@/types/property';

// Dynamically import Leaflet to avoid SSR issues
const DynamicMap = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => <div style={{ height: '400px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading map...</div>
});

type MapProps = {
  center?: [number, number];
  zoom?: number;
  height?: string;
  properties?: Property[];
};

export default function Map(props: MapProps) {
  return <DynamicMap {...props} />;
}