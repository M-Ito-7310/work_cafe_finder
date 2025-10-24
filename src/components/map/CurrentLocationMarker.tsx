'use client';

import { useEffect, useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getCurrentLocation } from '@/lib/utils/geolocation';

// 現在地アイコン
const currentLocationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" fill="#3B82F6" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="3" fill="white"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

export function CurrentLocationMarker() {
  const map = useMap();
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentLocation()
      .then((coords) => {
        const pos: [number, number] = [coords.lat, coords.lng];
        setPosition(pos);
        map.flyTo(pos, 15);
      })
      .catch((err) => {
        console.error('Geolocation error:', err);
        setError('位置情報の取得に失敗しました');
        // フォールバック: 東京駅
        const fallback: [number, number] = [35.6812, 139.7671];
        setPosition(fallback);
        map.setView(fallback, 15);
      });
  }, [map]);

  if (!position) return null;

  return (
    <Marker position={position} icon={currentLocationIcon}>
      <Popup>
        <div className="text-sm">
          <p className="font-semibold">現在地</p>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      </Popup>
    </Marker>
  );
}
