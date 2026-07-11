'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapSelectorProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number, address?: string, wilayah?: string) => void;
  address: string;
}

export default function MapSelector({ lat, lng, onChange, address }: MapSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const isFirstMountRef = useRef<boolean>(true);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const isMobile = L.Browser.mobile;
    const initialLat = lat || -7.983908;
    const initialLng = lng || 112.621391;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      dragging: !isMobile
    }).setView([initialLat, initialLng], 13);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapRef.current = map;

    // Click Listener
    map.on('click', (e) => {
      const clickLat = e.latlng.lat;
      const clickLng = e.latlng.lng;
      onChange(clickLat, clickLng);

      // Reverse geocode to get street name (address) and wilayah (region)
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${clickLat}&lon=${clickLng}`)
        .then(response => response.json())
        .then(data => {
          if (data && data.address) {
            const addr = data.address;
            const roadName = addr.road || addr.suburb || addr.neighbourhood || addr.village || data.display_name.split(',')[0];
            const wil = addr.city_district || addr.suburb || addr.town || addr.municipality || addr.village || addr.city || 'Klojen';
            onChange(clickLat, clickLng, roadName, wil);
          }
        })
        .catch(err => console.error('Reverse geocoding error:', err));
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Pin and Map View based on lat/lng changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const pinLat = lat;
    const pinLng = lng;
    if (!pinLat || !pinLng) return;

    const latlng = L.latLng(pinLat, pinLng);

    const pinColor = '#ef4444';
    const selectorIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${pinColor}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    if (markerRef.current) {
      markerRef.current.setLatLng(latlng);
    } else {
      markerRef.current = L.marker(latlng, { icon: selectorIcon })
        .addTo(map)
        .bindPopup('<div class="text-center text-xs font-bold text-gray-800"><p>Titik Kerusakan Terpilih</p></div>')
        .openPopup();
    }

    // Only pan the map automatically if this isn't the initial load to prevent resetting coordinates on mount
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
    } else {
      map.setView(latlng, 15);
    }
  }, [lat, lng]);

  // Debounced auto-geocoding from typed address
  useEffect(() => {
    if (!address || address.trim().length < 5) return;

    const debounceTimer = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=id&limit=1&q=${encodeURIComponent(address)}`)
        .then(response => response.json())
        .then(data => {
          if (data && data.length > 0) {
            const geocodeLat = parseFloat(data[0].lat);
            const geocodeLng = parseFloat(data[0].lon);
            const addr = data[0].address || {};
            const wil = addr.city_district || addr.suburb || addr.town || addr.municipality || addr.village || addr.city || 'Klojen';
            
            onChange(geocodeLat, geocodeLng, undefined, wil);
            if (mapRef.current) {
              mapRef.current.setView([geocodeLat, geocodeLng], 16);
            }
          }
        })
        .catch(err => console.error('Geocoding error:', err));
    }, 800);

    return () => clearTimeout(debounceTimer);
  }, [address]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-80 relative z-0 border border-[#D3C5B1] rounded-xl overflow-hidden" 
    />
  );
}
