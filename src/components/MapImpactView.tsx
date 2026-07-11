'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Laporan } from '@/context/AppContext';

interface MapImpactViewProps {
  laporan: Laporan[];
  statusFilters: string[];
  detailUrlPrefix: string;
}

export default function MapImpactView({ laporan, statusFilters, detailUrlPrefix }: MapImpactViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const initialLat = -7.983908;
    const initialLng = 112.621391;

    const map = L.map(containerRef.current, {
      zoomControl: false
    }).setView([initialLat, initialLng], 13);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Markers when reports or filters change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach(marker => {
      marker.remove();
    });
    markersRef.current = [];

    // Filter reports
    const filteredLaporan = laporan.filter(l => statusFilters.includes(l.status));

    // Add new markers
    filteredLaporan.forEach(aduan => {
      const getMarkerColor = (status: string) => {
        switch (status) {
          case 'baru': return '#ef4444';
          case 'proses': return '#f59e0b';
          case 'selesai': return '#22c55e';
          default: return '#3b82f6';
        }
      };

      const pinColor = getMarkerColor(aduan.status);
      const icon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="background-color: ${pinColor}; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const popupHtml = `
        <div style="font-family: sans-serif; padding: 4px; min-width: 140px;">
          <p style="margin: 0; font-size: 9px; font-weight: bold; color: #807667;">#${aduan.id}</p>
          <h4 style="margin: 2px 0; font-size: 11px; font-weight: bold; color: #1c1b18;">${aduan.kategoriLabel}</h4>
          <p style="margin: 4px 0; font-size: 9px; color: #4e4639; line-height: 1.3;">${aduan.lokasi}</p>
          <div style="margin-top: 8px;">
            <a href="${detailUrlPrefix}?id=${aduan.id}" style="display: block; text-align: center; background-color: #001360; color: white; padding: 5px 10px; border-radius: 6px; font-size: 9px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px;">Tinjau Detail</a>
          </div>
        </div>
      `;

      const marker = L.marker([aduan.lat, aduan.lng], { icon })
        .addTo(map)
        .bindPopup(popupHtml);

      markersRef.current.push(marker);
    });
  }, [laporan, statusFilters, detailUrlPrefix]);

  return (
    <div 
      ref={containerRef} 
      className="w-full flex-grow h-full relative z-0" 
    />
  );
}
