'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import { apiClient } from '@/lib/api/client';
import type { Cafe } from '@/types';
import '@/lib/utils/leafletConfig';

// SSR無効化
const MapView = dynamic(
  () => import('@/components/map/MapView').then((mod) => mod.MapView),
  { ssr: false, loading: () => <div className="h-full w-full bg-gray-100" /> }
);

const CurrentLocationMarker = dynamic(
  () => import('@/components/map/CurrentLocationMarker').then((mod) => mod.CurrentLocationMarker),
  { ssr: false }
);

const RecenterButton = dynamic(
  () => import('@/components/map/RecenterButton').then((mod) => mod.RecenterButton),
  { ssr: false }
);

// デバウンス関数
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function MapPage() {
  const [, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(false);

  // デバウンス処理
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleMapMove = useCallback(
    debounce(async (bounds: {
      neLat: number;
      neLng: number;
      swLat: number;
      swLng: number;
    }) => {
      setLoading(true);
      try {
        const response = await apiClient.getCafes(bounds);
        setCafes((response.data as Cafe[] | undefined) || []);
      } catch (error) {
        console.error('Failed to fetch cafes:', error);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="relative flex-1">
        <MapView onMoveEnd={handleMapMove}>
          <CurrentLocationMarker />
          {/* CafeMarkerはPhase 7で実装 */}
        </MapView>
        <RecenterButton />

        {loading && (
          <div className="absolute left-4 top-4 z-[1000] rounded-lg bg-white px-4 py-2 shadow-lg">
            <p className="text-sm text-gray-600">読み込み中...</p>
          </div>
        )}
      </div>
    </div>
  );
}
