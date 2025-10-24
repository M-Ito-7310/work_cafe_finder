'use client';

import { useMap } from 'react-leaflet';
import { getCurrentLocation } from '@/lib/utils/geolocation';

export function RecenterButton() {
  const map = useMap();

  const handleRecenter = async () => {
    try {
      const coords = await getCurrentLocation();
      map.flyTo([coords.lat, coords.lng], 15);
    } catch (error) {
      console.error('Failed to get current location:', error);
      alert('位置情報の取得に失敗しました');
    }
  };

  return (
    <button
      onClick={handleRecenter}
      className="absolute bottom-24 right-4 z-[1000] rounded-lg bg-white p-3 shadow-lg transition hover:bg-gray-50"
      title="現在地に戻る"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </button>
  );
}
