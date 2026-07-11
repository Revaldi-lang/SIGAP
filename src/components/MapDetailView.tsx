'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapDetailViewProps {
  lat: number;
  lng: number;
  kategori: string;
}

export default function MapDetailView({ lat, lng, kategori }: MapDetailViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const initialLat = lat || -7.983908;
    const initialLng = lng || 112.621391;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      touchZoom: false
    }).setView([initialLat, initialLng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    const pinColor = '#ef4444';
    const selectorIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${pinColor}; width: 16px; height: 16px; border-radius: 50%; border: 3.5px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    L.marker([initialLat, initialLng], { icon: selectorIcon }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-60 relative z-0 border border-[#D3C5B1] rounded-xl overflow-hidden shadow-sm" 
    />
  );
}
