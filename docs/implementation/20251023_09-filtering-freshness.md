# Phase 9: フィルタリング・鮮度管理

**Phase**: 9/11
**見積もり時間**: 60-90分
**優先度**: Medium
**依存関係**: Phase 2, Phase 5, Phase 6, Phase 7

---

## 📋 Phase概要

地図上のカフェフィルタリング機能と鮮度管理ロジックを実装します。空席状況、静かさ、Wi-Fi、電源の有無でカフェを絞り込み、鮮度に応じたマーカー色変更を完成させます。

## ✅ 目標

- ✅ MapFiltersコンポーネントの実装
- ✅ フィルター条件の管理
- ✅ APIクエリパラメータ連携
- ✅ 鮮度ロジックの完成
- ✅ マーカー色変更の実装

---

## 📝 実装タスク

### 1. MapFiltersコンポーネント

**src/components/map/MapFilters.tsx:**
```typescript
'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';

export interface FilterState {
  seats: boolean;    // 空席あり
  quiet: boolean;    // 静か
  wifi: boolean;     // Wi-Fiあり
  power: boolean;    // 電源あり
}

interface MapFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function MapFilters({ filters, onChange }: MapFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const filterOptions = [
    { key: 'seats' as const, label: '空席あり', emoji: '🪑' },
    { key: 'quiet' as const, label: '静か', emoji: '🔇' },
    { key: 'wifi' as const, label: 'Wi-Fiあり', emoji: '📶' },
    { key: 'power' as const, label: '電源あり', emoji: '🔌' },
  ];

  const toggleFilter = (key: keyof FilterState) => {
    onChange({
      ...filters,
      [key]: !filters[key],
    });
  };

  const clearFilters = () => {
    onChange({
      seats: false,
      quiet: false,
      wifi: false,
      power: false,
    });
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="absolute left-4 top-4 z-[1000]">
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg bg-white px-4 py-3 shadow-lg transition hover:bg-gray-50"
      >
        <Filter size={20} className="text-gray-700" />
        <span className="font-medium text-gray-900">フィルター</span>
        {activeFilterCount > 0 && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="mt-2 w-64 rounded-lg bg-white p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">絞り込み条件</h3>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-primary-600 hover:text-primary-700"
              >
                クリア
              </button>
            )}
          </div>

          <div className="space-y-2">
            {filterOptions.map((option) => (
              <label
                key={option.key}
                className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={filters[option.key]}
                  onChange={() => toggleFilter(option.key)}
                  className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-xl">{option.emoji}</span>
                <span className="flex-1 text-sm font-medium text-gray-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>

          <div className="mt-4 rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-600">
              {activeFilterCount === 0
                ? 'すべてのカフェを表示'
                : `${activeFilterCount}個の条件で絞り込み中`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 2. 地図ページにフィルター統合

**src/app/map/page.tsx を更新:**
```typescript
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
      setCafes(response.data || []);
    } catch (error) {
      console.error('Failed to fetch cafes:', error);
    } finally {
      setLoading(false);
    }
  };

  // デバウンス処理
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
          onReportSuccess={() => {
            if (currentBoundsRef.current) {
              fetchCafes(currentBoundsRef.current);
            }
          }}
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

### 3. API Route更新（フィルター対応）

**src/app/api/cafes/route.ts を更新:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getCafesInBounds } from '@/lib/db/queries';
import type { CafesQueryParams } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // クエリパラメータの取得
    const neLat = parseFloat(searchParams.get('neLat') || '0');
    const neLng = parseFloat(searchParams.get('neLng') || '0');
    const swLat = parseFloat(searchParams.get('swLat') || '0');
    const swLng = parseFloat(searchParams.get('swLng') || '0');

    // バリデーション
    if (!neLat || !neLng || !swLat || !swLng) {
      return NextResponse.json(
        { error: '地図範囲のパラメータが不正です' },
        { status: 400 }
      );
    }

    // フィルターの取得
    const filtersParam = searchParams.get('filters');
    let filters: { seats?: boolean; quiet?: boolean; wifi?: boolean; power?: boolean } | undefined;

    if (filtersParam) {
      try {
        const filterObj = JSON.parse(filtersParam);
        filters = {
          seats: filterObj.seats === true,
          quiet: filterObj.quiet === true,
          wifi: filterObj.wifi === true,
          power: filterObj.power === true,
        };
      } catch {
        // パース失敗時はフィルターなし
        filters = undefined;
      }
    }

    const params: CafesQueryParams = {
      neLat,
      neLng,
      swLat,
      swLng,
      filters,
    };

    // カフェ取得
    const cafes = await getCafesInBounds(params);

    return NextResponse.json({
      success: true,
      data: cafes,
    });
  } catch (error) {
    console.error('GET /api/cafes error:', error);
    return NextResponse.json(
      { error: 'カフェの取得に失敗しました' },
      { status: 500 }
    );
  }
}
```

### 4. API Client更新

**src/lib/api/client.ts を更新:**
```typescript
import type { ApiResponse, CafesQueryParams } from '@/types';

export class ApiClient {
  private baseUrl = '/api';

  async getCafes(params: CafesQueryParams) {
    const query = new URLSearchParams({
      neLat: params.neLat.toString(),
      neLng: params.neLng.toString(),
      swLat: params.swLat.toString(),
      swLng: params.swLng.toString(),
    });

    if (params.filters) {
      query.append('filters', JSON.stringify(params.filters));
    }

    const response = await fetch(`${this.baseUrl}/cafes?${query}`);
    return this.handleResponse(response);
  }

  async getCafe(id: string) {
    const response = await fetch(`${this.baseUrl}/cafes/${id}`);
    return this.handleResponse(response);
  }

  async createReport(data: {
    cafeId: string;
    seatStatus: 'available' | 'crowded' | 'full';
    quietness: 'quiet' | 'normal' | 'noisy';
    wifi: 'fast' | 'normal' | 'slow' | 'none';
    powerOutlets: boolean;
    comment?: string;
  }) {
    const response = await fetch(`${this.baseUrl}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'APIエラー');
    }

    return data;
  }
}

export const apiClient = new ApiClient();
```

### 5. Query更新（フィルタリングロジック）

**src/lib/db/queries.ts を更新:**
```typescript
import { db } from '@/lib/db';
import { cafes, reports } from '@/lib/db/schema';
import { eq, and, gte, lte, sql, desc } from 'drizzle-orm';
import type { CafesQueryParams, Cafe } from '@/types';

export async function getCafesInBounds(params: CafesQueryParams): Promise<Cafe[]> {
  const { neLat, neLng, swLat, swLng, filters } = params;

  let query = db
    .select({
      id: cafes.id,
      name: cafes.name,
      address: cafes.address,
      latitude: cafes.latitude,
      longitude: cafes.longitude,
      latestReport: {
        id: reports.id,
        seatStatus: reports.seatStatus,
        quietness: reports.quietness,
        wifi: reports.wifi,
        powerOutlets: reports.powerOutlets,
        comment: reports.comment,
        createdAt: reports.createdAt,
      },
    })
    .from(cafes)
    .leftJoin(
      reports,
      and(
        eq(reports.cafeId, cafes.id),
        sql`${reports.id} = (
          SELECT id FROM ${reports}
          WHERE ${reports.cafeId} = ${cafes.id}
          ORDER BY ${reports.createdAt} DESC
          LIMIT 1
        )`
      )
    )
    .where(
      and(
        gte(cafes.latitude, swLat),
        lte(cafes.latitude, neLat),
        gte(cafes.longitude, swLng),
        lte(cafes.longitude, neLng)
      )
    );

  const results = await query;

  // フィルタリング（メモリ上で実施）
  let filtered = results;

  if (filters) {
    filtered = results.filter((cafe) => {
      const report = cafe.latestReport;
      if (!report) return false;

      // 空席フィルター
      if (filters.seats && report.seatStatus !== 'available') {
        return false;
      }

      // 静かフィルター
      if (filters.quiet && report.quietness !== 'quiet') {
        return false;
      }

      // Wi-Fiフィルター
      if (filters.wifi && (report.wifi === 'none' || report.wifi === 'slow')) {
        return false;
      }

      // 電源フィルター
      if (filters.power && !report.powerOutlets) {
        return false;
      }

      return true;
    });
  }

  return filtered.map((row) => ({
    id: row.id,
    name: row.name,
    address: row.address,
    latitude: parseFloat(row.latitude),
    longitude: parseFloat(row.longitude),
    latestReport: row.latestReport
      ? {
          id: row.latestReport.id,
          cafeId: row.id,
          seatStatus: row.latestReport.seatStatus,
          quietness: row.latestReport.quietness,
          wifi: row.latestReport.wifi,
          powerOutlets: row.latestReport.powerOutlets,
          comment: row.latestReport.comment || undefined,
          createdAt: row.latestReport.createdAt,
        }
      : null,
  }));
}
```

---

## 📦 成果物

### 完了チェックリスト

- [ ] src/components/map/MapFilters.tsx が作成されている
- [ ] src/app/map/page.tsx が更新されている
- [ ] src/app/api/cafes/route.ts が更新されている
- [ ] src/lib/api/client.ts が更新されている
- [ ] src/lib/db/queries.ts が更新されている
- [ ] フィルター機能が正しく動作する
- [ ] マーカー色が鮮度に応じて変わる

### 動作確認

#### 1. フィルターパネル表示
```
1. http://localhost:3000/map にアクセス
2. 左上の「フィルター」ボタンをクリック
3. フィルターパネルが表示される
```

#### 2. フィルタリング
```
1. 「空席あり」にチェックを入れる
2. 空席のカフェのみが表示される
3. 他のフィルターも試す
```

#### 3. フィルタークリア
```
1. 複数のフィルターを選択
2. 「クリア」ボタンをクリック
3. すべてのフィルターが解除される
```

#### 4. 鮮度色分け
```
1. カフェマーカーを確認
2. 新しい投稿（3時間以内）は緑色
3. やや古い投稿（24時間以内）は黄色
4. 古い投稿（24時間以上）はグレー
```

---

## 🧪 テスト項目

| テスト項目 | 確認方法 | 期待結果 |
|-----------|---------|---------|
| フィルター表示 | フィルターボタンクリック | パネル表示 |
| 空席フィルター | 空席ありチェック | 空席カフェのみ表示 |
| 静かフィルター | 静かチェック | 静かなカフェのみ表示 |
| Wi-Fiフィルター | Wi-Fiありチェック | Wi-Fiありカフェのみ表示 |
| 電源フィルター | 電源ありチェック | 電源ありカフェのみ表示 |
| 複数フィルター | 複数チェック | AND条件で絞り込み |
| フィルタークリア | クリアボタンクリック | すべて解除 |
| 鮮度色分け | マーカー確認 | 緑/黄/グレー |

---

## ⚠️ トラブルシューティング

### 問題1: フィルターが効かない

**原因**: APIクエリパラメータが正しく渡されていない

**解決策**:
```typescript
// ブラウザのNetwork タブでAPIリクエストを確認
// filters パラメータが正しくエンコードされているか確認
```

### 問題2: フィルター変更後もカフェが変わらない

**原因**: fetchCafes が呼ばれていない

**解決策**:
```typescript
// handleFilterChange 内で fetchCafes を呼ぶ
// currentBoundsRef.current が null でないか確認
```

### 問題3: マーカー色が変わらない

**原因**: getFreshnessLevel ロジックの問題

**解決策**:
```typescript
// src/lib/utils/freshness.ts を確認
// createdAt が正しく Date 型になっているか確認
```

---

## 📚 参考資料

- [React State Management](https://react.dev/learn/managing-state)
- [Drizzle ORM Filters](https://orm.drizzle.team/docs/select#filtering)
- [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

---

## 🎯 次のPhase

Phase 9が完了したら、**Phase 10: UI/UXポリッシュ** (`20251023_10-ui-ux-polish.md`) に進みます。

---

**Phase完了日**: ___________
**実績時間**: ___________
**担当者**: ___________
**レビュー**: ___________
