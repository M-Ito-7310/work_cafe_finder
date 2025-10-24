'use client';

import { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import { apiClient } from '@/lib/api/client';
import type { Cafe } from '@/types';
import type { FilterState } from '@/components/map/MapFilters';
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

const CafeMarker = dynamic(
  () => import('@/components/map/CafeMarker').then((mod) => mod.CafeMarker),
  { ssr: false }
);

const CafeDetailModal = dynamic(
  () => import('@/components/cafe/CafeDetailModal').then((mod) => mod.CafeDetailModal),
  { ssr: false }
);

const MapFilters = dynamic(
  () => import('@/components/map/MapFilters').then((mod) => mod.MapFilters),
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
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    seats: false,
    quiet: false,
    wifi: false,
    power: false,
  });

  const currentBoundsRef = useRef<{
    neLat: number;
    neLng: number;
    swLat: number;
    swLng: number;
  } | null>(null);

  // カフェ取得関数
  const fetchCafes = async (bounds: {
    neLat: number;
    neLng: number;
    swLat: number;
    swLng: number;
  }) => {
    setLoading(true);
    try {
      const response = await apiClient.getCafes({
        ...bounds,
        filters: {
          seats: filters.seats,
          quiet: filters.quiet,
          wifi: filters.wifi,
          power: filters.power,
        },
      });
      setCafes((response.data as Cafe[] | undefined) || []);
    } catch (error) {
      console.error('Failed to fetch cafes:', error);
    } finally {
      setLoading(false);
    }
  };

  // デバウンス処理
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleMapMove = useCallback(
    debounce(async (bounds: {
      neLat: number;
      neLng: number;
      swLat: number;
      swLng: number;
    }) => {
      currentBoundsRef.current = bounds;
      fetchCafes(bounds);
    }, 500),
    [filters]
  );

  // フィルター変更時
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // 現在の地図範囲でカフェを再取得
    if (currentBoundsRef.current) {
      fetchCafes(currentBoundsRef.current);
    }
  };

  const handleReportSuccess = () => {
    // 投稿成功後、地図を再読み込み
    if (currentBoundsRef.current) {
      fetchCafes(currentBoundsRef.current);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="relative flex-1">
        <MapView onMoveEnd={handleMapMove}>
          <CurrentLocationMarker />
          {cafes.map((cafe) => (
            <CafeMarker
              key={cafe.id}
              cafe={cafe}
              onClick={setSelectedCafe}
            />
          ))}
        </MapView>

        {/* Filters */}
        <MapFilters filters={filters} onChange={handleFilterChange} />

        {/* Recenter Button */}
        <RecenterButton />

        {/* Loading Indicator */}
        {loading && (
          <div className="absolute right-4 top-4 z-[1000] rounded-lg bg-white px-4 py-2 shadow-lg">
            <p className="text-sm text-gray-600">読み込み中...</p>
          </div>
        )}
      </div>

      {/* Cafe Detail Modal */}
      {selectedCafe && (
        <CafeDetailModal
          cafe={selectedCafe}
          onClose={() => setSelectedCafe(null)}
          onReportSuccess={handleReportSuccess}
        />
      )}
    </div>
  );
}
