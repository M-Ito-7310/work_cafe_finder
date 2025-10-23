# Phase 7: カフェ表示機能

**Phase**: 7/11
**見積もり時間**: 90-120分
**優先度**: High
**依存関係**: Phase 2, Phase 5, Phase 6

---

## 📋 Phase概要

地図上のカフェマーカー表示、カフェ詳細モーダル、投稿カード表示を実装します。鮮度に応じた色分けマーカー、カフェ詳細情報、過去の投稿履歴を表示します。

## ✅ 目標

- ✅ カフェマーカーコンポーネントの実装
- ✅ 鮮度に応じた色分け（fresh/stale/expired）
- ✅ カフェ詳細モーダルの実装
- ✅ 投稿カード表示の実装
- ✅ カフェ情報の表示

---

## 📝 実装タスク

### 1. CafeMarkerコンポーネント

**src/components/map/CafeMarker.tsx:**
```typescript
'use client';

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Cafe } from '@/types';
import { getFreshnessLevel, getFreshnessColor } from '@/lib/utils/freshness';

interface CafeMarkerProps {
  cafe: Cafe;
  onClick?: (cafe: Cafe) => void;
}

// 鮮度別アイコン作成
function createCafeIcon(freshness: 'fresh' | 'stale' | 'expired') {
  const color = getFreshnessColor(freshness);

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
```

### 2. CafeDetailModalコンポーネント

**src/components/cafe/CafeDetailModal.tsx:**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Cafe, Report } from '@/types';
import { apiClient } from '@/lib/api/client';
import { ReportCard } from './ReportCard';
import { getFreshnessLevel } from '@/lib/utils/freshness';

interface CafeDetailModalProps {
  cafe: Cafe;
  onClose: () => void;
}

export function CafeDetailModal({ cafe, onClose }: CafeDetailModalProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await apiClient.getCafe(cafe.id);
        setReports(response.data?.reports || []);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [cafe.id]);

  const freshness = getFreshnessLevel(cafe.latestReport?.createdAt || null);

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center md:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-t-2xl md:rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-white px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{cafe.name}</h2>
              <p className="mt-1 text-sm text-gray-500">{cafe.address}</p>
              {cafe.latestReport && (
                <div className="mt-2 flex items-center gap-2">
                  <span className={`inline-block h-2 w-2 rounded-full ${
                    freshness === 'fresh' ? 'bg-green-500' :
                    freshness === 'stale' ? 'bg-yellow-500' :
                    'bg-gray-400'
                  }`} />
                  <span className="text-xs text-gray-600">
                    {freshness === 'fresh' ? '最新情報（3時間以内）' :
                     freshness === 'stale' ? '情報やや古い（24時間以内）' :
                     '情報古い（24時間以上前）'}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 100px)' }}>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
            </div>
          ) : reports.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">
                最新の投稿 ({reports.length}件)
              </h3>
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">まだ投稿がありません</p>
              <p className="mt-2 text-sm text-gray-400">
                最初の投稿者になりましょう！
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t bg-white px-6 py-4">
          <button
            onClick={() => {
              // Phase 8で実装
              console.log('投稿フォームを開く');
            }}
            className="w-full rounded-lg bg-primary-600 px-4 py-3 font-semibold text-white hover:bg-primary-700"
          >
            このカフェの情報を投稿
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 3. ReportCardコンポーネント

**src/components/cafe/ReportCard.tsx:**
```typescript
'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { Report } from '@/types';
import { getFreshnessLevel } from '@/lib/utils/freshness';

interface ReportCardProps {
  report: Report;
}

const seatStatusLabels = {
  available: { label: '空いている', color: 'text-green-600', bg: 'bg-green-50' },
  crowded: { label: 'やや混雑', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  full: { label: '満席', color: 'text-red-600', bg: 'bg-red-50' },
};

const quietnessLabels = {
  quiet: { label: '静か', icon: '🔇' },
  normal: { label: '普通', icon: '🔉' },
  noisy: { label: 'うるさい', icon: '🔊' },
};

const wifiLabels = {
  fast: { label: '高速', icon: '📶' },
  normal: { label: '普通', icon: '📶' },
  slow: { label: '低速', icon: '📶' },
  none: { label: 'なし', icon: '❌' },
};

export function ReportCard({ report }: ReportCardProps) {
  const freshness = getFreshnessLevel(report.createdAt);
  const seatStatus = seatStatusLabels[report.seatStatus];
  const quietness = quietnessLabels[report.quietness];
  const wifi = wifiLabels[report.wifi];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {report.user?.image && (
            <img
              src={report.user.image}
              alt={report.user.name || 'User'}
              className="h-8 w-8 rounded-full"
            />
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">
              {report.user?.name || '匿名ユーザー'}
            </p>
            <p className="text-xs text-gray-500">
              {format(new Date(report.createdAt), 'M月d日 HH:mm', { locale: ja })}
            </p>
          </div>
        </div>
        <span className={`inline-block h-2 w-2 rounded-full ${
          freshness === 'fresh' ? 'bg-green-500' :
          freshness === 'stale' ? 'bg-yellow-500' :
          'bg-gray-400'
        }`} />
      </div>

      {/* Status Grid */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {/* 空席状況 */}
        <div className={`rounded-lg ${seatStatus.bg} px-3 py-2`}>
          <p className="text-xs text-gray-600">空席状況</p>
          <p className={`mt-1 font-semibold ${seatStatus.color}`}>
            {seatStatus.label}
          </p>
        </div>

        {/* 静かさ */}
        <div className="rounded-lg bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-600">静かさ</p>
          <p className="mt-1 font-semibold text-gray-900">
            {quietness.icon} {quietness.label}
          </p>
        </div>

        {/* Wi-Fi */}
        <div className="rounded-lg bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-600">Wi-Fi</p>
          <p className="mt-1 font-semibold text-gray-900">
            {wifi.icon} {wifi.label}
          </p>
        </div>

        {/* 電源 */}
        <div className="rounded-lg bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-600">電源席</p>
          <p className="mt-1 font-semibold text-gray-900">
            {report.powerOutlets ? '🔌 あり' : '❌ なし'}
          </p>
        </div>
      </div>

      {/* Comment */}
      {report.comment && (
        <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2">
          <p className="text-sm text-gray-700">{report.comment}</p>
        </div>
      )}
    </div>
  );
}
```

### 4. 地図ページに統合

**src/app/map/page.tsx を更新:**
```typescript
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

const CafeMarker = dynamic(
  () => import('@/components/map/CafeMarker').then((mod) => mod.CafeMarker),
  { ssr: false }
);

const CafeDetailModal = dynamic(
  () => import('@/components/cafe/CafeDetailModal').then((mod) => mod.CafeDetailModal),
  { ssr: false }
);

export default function MapPage() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [loading, setLoading] = useState(false);

  // デバウンス処理
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
        setCafes(response.data || []);
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
          {cafes.map((cafe) => (
            <CafeMarker
              key={cafe.id}
              cafe={cafe}
              onClick={setSelectedCafe}
            />
          ))}
        </MapView>
        <RecenterButton />

        {loading && (
          <div className="absolute left-4 top-4 z-[1000] rounded-lg bg-white px-4 py-2 shadow-lg">
            <p className="text-sm text-gray-600">読み込み中...</p>
          </div>
        )}
      </div>

      {/* Cafe Detail Modal */}
      {selectedCafe && (
        <CafeDetailModal
          cafe={selectedCafe}
          onClose={() => setSelectedCafe(null)}
        />
      )}
    </div>
  );
}

// デバウンス関数
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
```

### 5. 鮮度カラーユーティリティ追加

**src/lib/utils/freshness.ts に追加:**
```typescript
export function getFreshnessColor(freshness: FreshnessLevel): string {
  switch (freshness) {
    case 'fresh':
      return '#10B981'; // green-500
    case 'stale':
      return '#F59E0B'; // yellow-500
    case 'expired':
      return '#9CA3AF'; // gray-400
  }
}
```

---

## 📦 成果物

### 完了チェックリスト

- [ ] src/components/map/CafeMarker.tsx が作成されている
- [ ] src/components/cafe/CafeDetailModal.tsx が作成されている
- [ ] src/components/cafe/ReportCard.tsx が作成されている
- [ ] src/app/map/page.tsx が更新されている
- [ ] 鮮度に応じた色分けが実装されている
- [ ] カフェマーカーが地図上に表示される
- [ ] カフェ詳細モーダルが正しく動作する

### 動作確認

#### 1. カフェマーカー表示
```
1. http://localhost:3000/map にアクセス
2. 地図上にカフェマーカーが表示される
3. マーカーの色が鮮度に応じて変わる（緑/黄/グレー）
```

#### 2. ポップアップ表示
```
1. カフェマーカーをクリック
2. カフェ名、住所、最新情報が表示される
3. 「詳細を見る」ボタンが表示される
```

#### 3. カフェ詳細モーダル
```
1. マーカーまたはポップアップの「詳細を見る」をクリック
2. モーダルが開く
3. カフェ情報と過去の投稿が表示される
4. ✕ボタンまたは背景クリックでモーダルが閉じる
```

#### 4. 投稿カード
```
1. 投稿カードに空席状況、静かさ、Wi-Fi、電源が表示される
2. 投稿時刻が日本語フォーマットで表示される
3. 鮮度インジケーターが表示される
```

---

## 🧪 テスト項目

| テスト項目 | 確認方法 | 期待結果 |
|-----------|---------|---------|
| マーカー表示 | 地図移動 | カフェマーカー表示 |
| 色分け | 鮮度データ確認 | fresh=緑、stale=黄、expired=グレー |
| ポップアップ | マーカークリック | カフェ情報表示 |
| モーダル表示 | 詳細ボタンクリック | モーダル開く |
| モーダル閉じる | ✕ボタン/背景クリック | モーダル閉じる |
| 投稿一覧 | モーダル内 | 投稿カード表示 |
| レスポンシブ | モバイル表示 | 下部からスライド |

---

## ⚠️ トラブルシューティング

### 問題1: マーカーが表示されない

**原因**: カフェデータが取得できていない

**解決策**:
```typescript
// コンソールでカフェデータを確認
console.log('Cafes:', cafes);

// API Routeが正しく動作しているか確認
// Phase 5のAPI実装を確認
```

### 問題2: モーダルが正しく表示されない

**原因**: z-indexの競合

**解決策**:
```typescript
// モーダルのz-indexを確認
className="z-[2000]"

// Leaflet地図のz-indexより高くする
```

### 問題3: 日付フォーマットエラー

**原因**: date-fnsがインストールされていない

**解決策**:
```bash
npm install date-fns
```

---

## 📚 参考資料

- [Leaflet Markers](https://leafletjs.com/reference.html#marker)
- [React Portal](https://react.dev/reference/react-dom/createPortal)
- [date-fns](https://date-fns.org/)
- [Tailwind CSS Z-Index](https://tailwindcss.com/docs/z-index)

---

## 🎯 次のPhase

Phase 7が完了したら、**Phase 8: 投稿システム** (`20251023_08-report-system.md`) に進みます。

---

**Phase完了日**: ___________
**実績時間**: ___________
**担当者**: ___________
**レビュー**: ___________
