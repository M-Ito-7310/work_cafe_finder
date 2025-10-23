# Phase 6: 地図統合

**Phase**: 6/11
**見積もり時間**: 90-120分
**優先度**: High
**依存関係**: Phase 2, Phase 5

---

## 📋 Phase概要

Leaflet + OpenStreetMapの統合を行います。地図表示、現在地取得、地図移動イベントハンドリング、デバウンス処理、SSR無効化を実装します。

## ✅ 目標

- ✅ Leaflet地図表示の実装
- ✅ 現在地取得（GPS）の実装
- ✅ 地図移動イベントの処理
- ✅ デバウンス処理の実装
- ✅ SSR無効化（dynamic import）

---

## 📝 実装タスク

### 1. Leaflet CSS読み込み

**src/app/globals.css に追加:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Leaflet CSS */
@import 'leaflet/dist/leaflet.css';

/* カスタムスタイル */
@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

/* Leafletマーカーのカスタマイズ */
.leaflet-container {
  font-family: inherit;
}

.leaflet-popup-content-wrapper {
  @apply rounded-lg shadow-lg;
}

.leaflet-popup-content {
  @apply p-4;
}
```

### 2. MapViewコンポーネント

**src/components/map/MapView.tsx:**
```typescript
'use client';

import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { useState, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  center?: LatLngExpression;
  zoom?: number;
  onMoveEnd?: (bounds: {
    neLat: number;
    neLng: number;
    swLat: number;
    swLng: number;
  }) => void;
  children?: React.ReactNode;
}

function MapEventHandler({ onMoveEnd }: { onMoveEnd?: MapViewProps['onMoveEnd'] }) {
  const map = useMapEvents({
    moveend: () => {
      if (onMoveEnd) {
        const bounds = map.getBounds();
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        onMoveEnd({
          neLat: ne.lat,
          neLng: ne.lng,
          swLat: sw.lat,
          swLng: sw.lng,
        });
      }
    },
  });

  return null;
}

export function MapView({ center, zoom = 15, onMoveEnd, children }: MapViewProps) {
  const defaultCenter: LatLngExpression = center || [35.6812, 139.7671]; // 東京駅

  return (
    <MapContainer
      center={defaultCenter}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEventHandler onMoveEnd={onMoveEnd} />
      {children}
    </MapContainer>
  );
}
```

### 3. CurrentLocationMarkerコンポーネント

**src/components/map/CurrentLocationMarker.tsx:**
```typescript
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
```

### 4. RecenterButtonコンポーネント

**src/components/map/RecenterButton.tsx:**
```typescript
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
```

### 5. メイン地図ページ

**src/app/map/page.tsx:**
```typescript
'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import { apiClient } from '@/lib/api/client';
import type { Cafe } from '@/types';

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

export default function MapPage() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
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

### 6. Leafletアイコン修正

**src/lib/utils/leafletConfig.ts:**
```typescript
import L from 'leaflet';

// Leafletのデフォルトアイコン問題を修正
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});
```

**src/app/map/page.tsx に追加:**
```typescript
import '@/lib/utils/leafletConfig';
```

---

## 📦 成果物

### 完了チェックリスト

- [ ] src/components/map/MapView.tsx が作成されている
- [ ] src/components/map/CurrentLocationMarker.tsx が作成されている
- [ ] src/components/map/RecenterButton.tsx が作成されている
- [ ] src/app/map/page.tsx が作成されている
- [ ] src/lib/utils/leafletConfig.ts が作成されている
- [ ] Leaflet CSSが読み込まれている
- [ ] 地図が正しく表示される
- [ ] 現在地取得が動作する

### 動作確認

#### 1. 地図表示
```
1. http://localhost:3000/map にアクセス
2. 地図が表示される
3. OpenStreetMapのタイルが読み込まれる
```

#### 2. 現在地取得
```
1. ブラウザが位置情報許可を求める
2. 許可すると現在地に移動
3. 青いマーカーが表示される
```

#### 3. 現在地ボタン
```
1. 右下の現在地ボタンをクリック
2. 現在地に戻る
```

#### 4. 地図移動
```
1. 地図をドラッグして移動
2. 移動が止まると自動的にカフェデータを取得
3. コンソールにカフェデータが表示される
```

---

## 🧪 テスト項目

| テスト項目 | 確認方法 | 期待結果 |
|-----------|---------|---------|
| 地図表示 | /map アクセス | 地図が表示される |
| 現在地取得 | 位置情報許可 | 現在地マーカー表示 |
| 地図移動 | ドラッグ操作 | スムーズに移動 |
| ズーム | +/-ボタン | ズームイン/アウト |
| 現在地ボタン | ボタンクリック | 現在地に戻る |
| デバウンス | 連続移動 | 移動停止後にAPI呼び出し |

---

## ⚠️ トラブルシューティング

### 問題1: 地図が表示されない

**原因**: Leaflet CSSが読み込まれていない

**解決策**:
```css
/* globals.cssに以下を追加 */
@import 'leaflet/dist/leaflet.css';
```

### 問題2: マーカーアイコンが表示されない

**原因**: Leafletのデフォルトアイコンパス問題

**解決策**:
```typescript
// leafletConfig.tsを確認
// CDNからアイコンを読み込む設定
```

### 問題3: 位置情報が取得できない

**原因**: HTTPSでない、または位置情報が拒否されている

**解決策**:
- localhostはHTTPでも動作する
- 本番環境ではHTTPS必須
- ブラウザの位置情報設定を確認

### 問題4: SSRエラー

**原因**: Leafletがサーバーサイドで実行されている

**解決策**:
```typescript
// dynamic importでSSRを無効化
const MapView = dynamic(() => import('./MapView'), { ssr: false });
```

---

## 📚 参考資料

- [Leaflet 公式ドキュメント](https://leafletjs.com/)
- [react-leaflet](https://react-leaflet.js.org/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)

---

## 🎯 次のPhase

Phase 6が完了したら、**Phase 7: カフェ表示機能** (`20251023_07-cafe-display.md`) に進みます。

---

**Phase完了日**: ___________
**実績時間**: ___________
**担当者**: ___________
**レビュー**: ___________
