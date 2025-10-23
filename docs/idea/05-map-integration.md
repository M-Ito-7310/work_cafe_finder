# Map Integration Guide

## Leaflet統合ガイド

このドキュメントでは、WorkCafeFinderにおけるLeaflet（地図ライブラリ）とOpenStreetMapの統合方法について詳しく説明します。

## なぜLeafletを選んだか

### 技術的メリット

| 項目 | Leaflet | Google Maps API | Mapbox |
|------|---------|----------------|--------|
| **コスト** | 完全無料 | 従量課金（$200/月 無料枠後） | 従量課金（50,000リクエスト/月 無料） |
| **軽量性** | 42KB (gzip) | 大 | 中 |
| **カスタマイズ性** | 高い | 制限あり | 高い |
| **プラグイン** | 豊富 | 少ない | 中程度 |
| **学習コスト** | 低い | 中 | 中 |
| **サーバーレス対応** | 完全対応 | 完全対応 | 完全対応 |

### ビジネス的メリット
- **MVPに最適**: 無料枠を気にせずデモ可能
- **スケーラビリティ**: ユーザー増加時もコスト一定
- **柔軟性**: 将来的に他の地図プロバイダーに切り替え可能

## 技術スタック

### 必要なライブラリ

```json
{
  "dependencies": {
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1"
  },
  "devDependencies": {
    "@types/leaflet": "^1.9.8"
  }
}
```

### OpenStreetMapタイルサーバー

**デフォルトタイル**:
```
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

**利用規約**:
- 無料で使用可能
- アトリビューション（© OpenStreetMap contributors）の表示が必須
- 過度な負荷をかけないこと（キャッシング推奨）

## 基本実装

### 1. Leaflet CSSの読み込み

**`src/app/layout.tsx`**:
```typescript
import 'leaflet/dist/leaflet.css';

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
```

### 2. MapViewコンポーネント

**`src/components/map/MapView.tsx`**:
```typescript
'use client';

import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { useEffect, useState } from 'react';

interface MapViewProps {
  center?: LatLngExpression;
  zoom?: number;
  onMove?: (bounds: { neLat: number; neLng: number; swLat: number; swLng: number }) => void;
}

export function MapView({ center = [35.6812, 139.7671], zoom = 15, onMove }: MapViewProps) {
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    if (!map || !onMove) return;

    const handleMoveEnd = () => {
      const bounds = map.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      onMove({
        neLat: ne.lat,
        neLng: ne.lng,
        swLat: sw.lat,
        swLng: sw.lng,
      });
    };

    map.on('moveend', handleMoveEnd);
    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map, onMove]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      ref={setMap}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
```

### 3. 現在地取得とマーカー表示

**`src/components/map/CurrentLocationMarker.tsx`**:
```typescript
'use client';

import { useEffect, useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// 現在地アイコンのカスタマイズ
const currentLocationIcon = new L.Icon({
  iconUrl: '/icons/current-location.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export function CurrentLocationMarker() {
  const map = useMap();
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        map.flyTo([latitude, longitude], 15);
      },
      (error) => {
        console.error('Geolocation error:', error);
        // フォールバック: 東京駅
        setPosition([35.6812, 139.7671]);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [map]);

  if (!position) return null;

  return (
    <Marker position={position} icon={currentLocationIcon}>
      <Popup>あなたの現在地</Popup>
    </Marker>
  );
}
```

### 4. カフェマーカーコンポーネント

**`src/components/map/CafeMarker.tsx`**:
```typescript
'use client';

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Cafe, Report } from '@/types';
import { getFreshnessLevel } from '@/lib/utils/freshness';

interface CafeMarkerProps {
  cafe: Cafe;
  latestReport?: Report | null;
  onClick: () => void;
}

// 鮮度に応じたアイコン色
function getCafeIcon(freshnessLevel: 'fresh' | 'stale' | 'expired') {
  const colors = {
    fresh: '#10B981', // green-500
    stale: '#F59E0B', // yellow-500
    expired: '#9CA3AF', // gray-400
  };

  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="12" fill="${colors[freshnessLevel]}" stroke="white" stroke-width="2"/>
        <text x="16" y="20" text-anchor="middle" font-size="16" fill="white">☕</text>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

export function CafeMarker({ cafe, latestReport, onClick }: CafeMarkerProps) {
  const freshnessLevel = getFreshnessLevel(latestReport?.createdAt || null);
  const icon = getCafeIcon(freshnessLevel);

  return (
    <Marker
      position={[cafe.latitude, cafe.longitude]}
      icon={icon}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Popup>
        <div className="font-semibold">{cafe.name}</div>
        <div className="text-sm text-gray-600">{cafe.address}</div>
      </Popup>
    </Marker>
  );
}
```

### 5. メイン地図ページ統合

**`src/app/map/page.tsx`**:
```typescript
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapView } from '@/components/map/MapView';
import { CurrentLocationMarker } from '@/components/map/CurrentLocationMarker';
import { CafeMarker } from '@/components/map/CafeMarker';
import type { Cafe, Report } from '@/types';

// Leafletはクライアントサイドのみで動作するため、SSRを無効化
const DynamicMap = dynamic(
  () => import('@/components/map/MapView').then((mod) => mod.MapView),
  { ssr: false }
);

export default function MapPage() {
  const [cafes, setCafes] = useState<(Cafe & { latestReport?: Report })[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);

  const handleMapMove = async (bounds: {
    neLat: number;
    neLng: number;
    swLat: number;
    swLng: number;
  }) => {
    const response = await fetch(
      `/api/cafes?neLat=${bounds.neLat}&neLng=${bounds.neLng}&swLat=${bounds.swLat}&swLng=${bounds.swLng}`
    );
    const data = await response.json();
    setCafes(data);
  };

  return (
    <div className="h-screen w-full">
      <DynamicMap onMove={handleMapMove}>
        <CurrentLocationMarker />
        {cafes.map((cafe) => (
          <CafeMarker
            key={cafe.id}
            cafe={cafe}
            latestReport={cafe.latestReport}
            onClick={() => setSelectedCafe(cafe)}
          />
        ))}
      </DynamicMap>

      {selectedCafe && (
        <CafeDetailModal
          cafe={selectedCafe}
          onClose={() => setSelectedCafe(null)}
        />
      )}
    </div>
  );
}
```

## 高度な機能

### 1. マーカークラスタリング

多数のカフェマーカーを効率的に表示するため、クラスタリングプラグインを使用します。

**インストール**:
```bash
npm install react-leaflet-cluster
```

**実装**:
```typescript
import MarkerClusterGroup from 'react-leaflet-cluster';

<MarkerClusterGroup>
  {cafes.map((cafe) => (
    <CafeMarker key={cafe.id} cafe={cafe} />
  ))}
</MarkerClusterGroup>
```

### 2. ユーザー位置の連続追跡

```typescript
export function CurrentLocationMarker() {
  const map = useMap();
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      },
      (error) => console.error(error),
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // ...
}
```

### 3. カスタムコントロール（現在地ボタン）

**`src/components/map/RecenterButton.tsx`**:
```typescript
'use client';

import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

export function RecenterButton() {
  const map = useMap();

  useEffect(() => {
    const RecenterControl = L.Control.extend({
      onAdd: () => {
        const button = L.DomUtil.create('button', 'recenter-button');
        button.innerHTML = '📍';
        button.title = '現在地に戻る';
        button.style.cssText = `
          background: white;
          border: 2px solid rgba(0,0,0,0.2);
          border-radius: 4px;
          width: 40px;
          height: 40px;
          font-size: 20px;
          cursor: pointer;
        `;

        button.onclick = () => {
          navigator.geolocation.getCurrentPosition((pos) => {
            map.flyTo([pos.coords.latitude, pos.coords.longitude], 15);
          });
        };

        return button;
      },
    });

    const control = new RecenterControl({ position: 'bottomright' });
    control.addTo(map);

    return () => {
      control.remove();
    };
  }, [map]);

  return null;
}
```

### 4. ヒートマップ（将来的）

投稿が多いエリアを視覚化:

```bash
npm install leaflet.heat
```

```typescript
import 'leaflet.heat';

const heatData = cafes.map((cafe) => [
  cafe.latitude,
  cafe.longitude,
  cafe.reportCount, // 投稿数
]);

useEffect(() => {
  if (!map) return;
  L.heatLayer(heatData, { radius: 25 }).addTo(map);
}, [map, heatData]);
```

## パフォーマンス最適化

### 1. 動的import（SSR無効化）

Leafletはブラウザ専用のため、Next.jsのSSRを無効化:

```typescript
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => <div>Loading map...</div>,
});
```

### 2. マーカーの仮想化

大量のマーカーを表示する際は、表示範囲内のみレンダリング:

```typescript
const visibleCafes = cafes.filter((cafe) => {
  const bounds = map.getBounds();
  return bounds.contains([cafe.latitude, cafe.longitude]);
});
```

### 3. デバウンス処理

地図移動時のAPI呼び出しを抑制:

```typescript
import { debounce } from 'lodash';

const debouncedFetch = debounce((bounds) => {
  fetchCafes(bounds);
}, 500);

map.on('moveend', () => {
  debouncedFetch(map.getBounds());
});
```

## レスポンシブ対応

### モバイルUI

```typescript
<MapContainer
  center={center}
  zoom={zoom}
  zoomControl={false} // モバイルではズームコントロールを非表示
  className="h-full w-full"
>
  {/* スマホでは小さいアイコン */}
  <CafeMarker iconSize={isMobile ? [24, 24] : [32, 32]} />
</MapContainer>
```

### タッチジェスチャー

```typescript
<MapContainer
  touchZoom={true}
  scrollWheelZoom={false} // スクロール時の誤操作防止
  doubleClickZoom={true}
>
```

## エラーハンドリング

### 1. 位置情報許可なし

```typescript
navigator.geolocation.getCurrentPosition(
  (pos) => { /* 成功 */ },
  (error) => {
    if (error.code === error.PERMISSION_DENIED) {
      toast.error('位置情報の使用を許可してください');
      // デフォルト位置（東京駅）を表示
      map.setView([35.6812, 139.7671], 15);
    }
  }
);
```

### 2. タイル読み込みエラー

```typescript
<TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  errorTileUrl="/images/error-tile.png" // エラー時の代替画像
/>
```

### 3. オフライン対応（将来的）

Service Workerでタイルをキャッシュ:

```typescript
// service-worker.js
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
```

## アクセシビリティ

### キーボード操作

```typescript
<MapContainer keyboard={true} keyboardPanDelta={80}>
```

### スクリーンリーダー対応

```typescript
<Marker position={position} alt="カフェ: スターバックス">
  <Popup>
    <h3 role="heading" aria-level="3">スターバックス</h3>
    <p>東京都千代田区...</p>
  </Popup>
</Marker>
```

## セキュリティ考慮事項

### 1. HTTPS必須

位置情報APIはHTTPSでのみ動作:

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },
};
```

### 2. 位置情報の保護

ユーザーの正確な位置を他のユーザーに公開しない:

```typescript
// 投稿時に位置情報を丸める
function roundCoordinates(lat: number, lng: number) {
  return {
    lat: Math.round(lat * 1000) / 1000, // 小数点3桁まで（約111m精度）
    lng: Math.round(lng * 1000) / 1000,
  };
}
```

## テスト

### 単体テスト

```typescript
import { render, screen } from '@testing-library/react';
import { MapView } from './MapView';

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => <div>TileLayer</div>,
}));

test('renders MapView', () => {
  render(<MapView />);
  expect(screen.getByText('TileLayer')).toBeInTheDocument();
});
```

### E2Eテスト（Playwright）

```typescript
test('displays cafe markers on map', async ({ page }) => {
  await page.goto('/map');
  await page.waitForSelector('.leaflet-marker-icon');

  const markers = await page.$$('.leaflet-marker-icon');
  expect(markers.length).toBeGreaterThan(0);
});
```

## デプロイ時の注意点

### 1. 環境変数

```env
# .env.local
NEXT_PUBLIC_MAP_DEFAULT_CENTER_LAT=35.6812
NEXT_PUBLIC_MAP_DEFAULT_CENTER_LNG=139.7671
NEXT_PUBLIC_MAP_DEFAULT_ZOOM=15
```

### 2. ビルド最適化

```javascript
// next.config.js
module.exports = {
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }];
    return config;
  },
};
```

## まとめ

Leaflet + OpenStreetMapの組み合わせは、WorkCafeFinderのMVPに最適な選択です:

✅ **完全無料** - デモやスケール時もコスト心配なし
✅ **軽量** - 高速な読み込み
✅ **柔軟** - カスタマイズ性が高い
✅ **実績** - 多くのサービスで採用実績あり

将来的にGoogle Maps APIやMapboxへの移行も可能な設計にしておくことで、ビジネスの成長に合わせた最適化が可能です。
