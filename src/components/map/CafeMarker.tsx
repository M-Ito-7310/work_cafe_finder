'use client';

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Cafe } from '@/types';
import { getFreshnessLevel, getMarkerColor } from '@/lib/utils/freshness';

interface CafeMarkerProps {
  cafe: Cafe;
  onClick?: (cafe: Cafe) => void;
}

// 鮮度別アイコン作成
function createCafeIcon(freshness: 'fresh' | 'stale' | 'expired') {
  const color = getMarkerColor(freshness);

  return new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2"/>
        <path d="M16 10 L16 16 L20 16" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

export function CafeMarker({ cafe, onClick }: CafeMarkerProps) {
  const freshness = getFreshnessLevel(cafe.latestReport?.createdAt || null);
  const icon = createCafeIcon(freshness);

  const handleClick = () => {
    if (onClick) {
      onClick(cafe);
    }
  };

  return (
    <Marker
      position={[cafe.latitude, cafe.longitude]}
      icon={icon}
      eventHandlers={{
        click: handleClick,
      }}
    >
      <Popup>
        <div className="min-w-[200px]">
          <h3 className="font-semibold text-gray-900">{cafe.name}</h3>
          <p className="text-xs text-gray-500 mt-1">{cafe.address}</p>
          {cafe.latestReport && (
            <div className="mt-2 text-xs">
              <div className="flex items-center gap-2">
                <span className={`inline-block h-2 w-2 rounded-full ${
                  freshness === 'fresh' ? 'bg-green-500' :
                  freshness === 'stale' ? 'bg-yellow-500' :
                  'bg-gray-400'
                }`} />
                <span className="text-gray-600">
                  {freshness === 'fresh' ? '最新情報' :
                   freshness === 'stale' ? '情報やや古い' :
                   '情報古い'}
                </span>
              </div>
              <p className="mt-1 text-gray-700">
                空席: {cafe.latestReport.seatStatus === 'available' ? '◯' :
                       cafe.latestReport.seatStatus === 'crowded' ? '△' : '✕'}
              </p>
            </div>
          )}
          <button
            onClick={handleClick}
            className="mt-2 w-full rounded bg-primary-600 px-3 py-1 text-xs text-white hover:bg-primary-700"
          >
            詳細を見る
          </button>
        </div>
      </Popup>
    </Marker>
  );
}
