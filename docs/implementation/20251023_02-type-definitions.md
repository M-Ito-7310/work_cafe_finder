# Phase 2: 型定義とユーティリティ

**Phase**: 2/11
**見積もり時間**: 30-45分
**優先度**: Critical
**依存関係**: Phase 1

---

## 📋 Phase概要

TypeScript型システムの構築と共通ユーティリティ関数の実装を行います。アプリケーション全体で使用する型定義と、鮮度判定・位置情報計算などのユーティリティ関数を作成します。

## ✅ 目標

- ✅ Cafe型定義の完成
- ✅ Report型定義の完成
- ✅ User型定義の完成
- ✅ API Response型定義の完成
- ✅ 鮮度判定ユーティリティの実装
- ✅ 位置情報ユーティリティの実装
- ✅ その他共通ユーティリティの実装

---

## 📝 実装タスク

### 1. Cafe型定義

**src/types/cafe.ts:**
```typescript
export interface Cafe {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  latestReport?: Report | null;
}

export type CafeWithReports = Cafe & {
  reports: Report[];
};

export interface CafeCreateInput {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId?: string;
}
```

### 2. Report型定義

**src/types/report.ts:**
```typescript
export type SeatStatus = 'available' | 'crowded' | 'full';
export type Quietness = 'quiet' | 'normal' | 'noisy';
export type WifiSpeed = 'fast' | 'normal' | 'slow' | 'none';

export interface Report {
  id: string;
  cafeId: string;
  userId: string;
  seatStatus: SeatStatus;
  quietness: Quietness;
  wifi: WifiSpeed;
  powerOutlets: boolean;
  comment?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface ReportCreateInput {
  cafeId: string;
  seatStatus: SeatStatus;
  quietness: Quietness;
  wifi: WifiSpeed;
  powerOutlets: boolean;
  comment?: string;
}

export type FreshnessLevel = 'fresh' | 'stale' | 'expired';
```

### 3. User型定義

**src/types/user.ts:**
```typescript
export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}
```

### 4. API Response型定義

**src/types/api.ts:**
```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface MapBounds {
  neLat: number;
  neLng: number;
  swLat: number;
  swLng: number;
}

export interface CafesQueryParams extends MapBounds {
  filters?: {
    seats?: boolean;
    quiet?: boolean;
    wifi?: boolean;
    power?: boolean;
  };
}
```

### 5. 型のエクスポート

**src/types/index.ts:**
```typescript
export * from './cafe';
export * from './report';
export * from './user';
export * from './api';
```

### 6. 鮮度判定ユーティリティ

**src/lib/utils/freshness.ts:**
```typescript
import type { FreshnessLevel } from '@/types';

/**
 * 投稿の鮮度レベルを判定
 * @param createdAt 投稿日時
 * @returns 'fresh' (3時間以内) | 'stale' (3-24時間) | 'expired' (24時間以上)
 */
export function getFreshnessLevel(createdAt: Date | null): FreshnessLevel {
  if (!createdAt) return 'expired';

  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours <= 3) return 'fresh';
  if (diffHours <= 24) return 'stale';
  return 'expired';
}

/**
 * 鮮度レベルに応じた日本語ラベルを取得
 * @param createdAt 投稿日時
 * @returns 「15分前の情報」「6時間前の古い情報です」など
 */
export function getFreshnessLabel(createdAt: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return 'たった今';
  if (diffMinutes < 60) return `${diffMinutes}分前の情報`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}時間前の情報`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}日前の古い情報です`;
}

/**
 * 鮮度レベルに応じたTailwindテキストカラークラスを取得
 * @param level 鮮度レベル
 * @returns Tailwindクラス名
 */
export function getFreshnessColor(level: FreshnessLevel): string {
  switch (level) {
    case 'fresh':
      return 'text-green-600';
    case 'stale':
      return 'text-yellow-600';
    case 'expired':
      return 'text-gray-400';
  }
}

/**
 * 鮮度レベルに応じたマーカー色（16進数）を取得
 * @param level 鮮度レベル
 * @returns 16進数カラーコード
 */
export function getMarkerColor(level: FreshnessLevel): string {
  switch (level) {
    case 'fresh':
      return '#10B981'; // green-500
    case 'stale':
      return '#F59E0B'; // yellow-500
    case 'expired':
      return '#9CA3AF'; // gray-400
  }
}
```

### 7. 位置情報ユーティリティ

**src/lib/utils/geolocation.ts:**
```typescript
export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * ブラウザのGeolocation APIで現在地を取得
 * @returns 座標 {lat, lng}
 */
export function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // 1分以内のキャッシュを許可
      }
    );
  });
}

/**
 * 2点間の距離を計算（Haversine formula）
 * @param point1 座標1
 * @param point2 座標2
 * @returns 距離（km）
 */
export function calculateDistance(point1: Coordinates, point2: Coordinates): number {
  const R = 6371; // 地球の半径（km）
  const dLat = toRad(point2.lat - point1.lat);
  const dLng = toRad(point2.lng - point1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) *
      Math.cos(toRad(point2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * 位置情報を丸めて精度を下げる（プライバシー保護）
 * @param lat 緯度
 * @param lng 経度
 * @returns 丸めた座標
 */
export function roundCoordinates(lat: number, lng: number): Coordinates {
  return {
    lat: Math.round(lat * 1000) / 1000, // 小数点3桁まで（約111m精度）
    lng: Math.round(lng * 1000) / 1000,
  };
}
```

### 8. classname utility

**src/lib/utils/cn.ts:**
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwindクラスをマージするユーティリティ
 * @param inputs クラス名
 * @returns マージされたクラス名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 9. 定数定義

**src/lib/constants.ts:**
```typescript
// 地図デフォルト設定
export const MAP_DEFAULT_CENTER = {
  lat: Number(process.env.NEXT_PUBLIC_MAP_DEFAULT_CENTER_LAT) || 35.6812,
  lng: Number(process.env.NEXT_PUBLIC_MAP_DEFAULT_CENTER_LNG) || 139.7671,
} as const;

export const MAP_DEFAULT_ZOOM = Number(process.env.NEXT_PUBLIC_MAP_DEFAULT_ZOOM) || 15;

// 鮮度判定の閾値（時間）
export const FRESHNESS_THRESHOLDS = {
  FRESH: 3, // 3時間以内
  STALE: 24, // 24時間以内
} as const;

// 投稿フォームの制限
export const REPORT_CONSTRAINTS = {
  COMMENT_MAX_LENGTH: 50,
} as const;

// APIエンドポイント
export const API_ENDPOINTS = {
  CAFES: '/api/cafes',
  REPORTS: '/api/reports',
  AUTH: '/api/auth',
} as const;

// 空席状況のラベル
export const SEAT_STATUS_LABELS = {
  available: '空席あり',
  crowded: '混雑',
  full: '満席',
} as const;

// 静かさのラベル
export const QUIETNESS_LABELS = {
  quiet: '静か',
  normal: '普通',
  noisy: 'にぎやか',
} as const;

// Wi-Fi速度のラベル
export const WIFI_LABELS = {
  fast: '速い',
  normal: '普通',
  slow: '遅い',
  none: 'なし',
} as const;
```

---

## 📦 成果物

### 完了チェックリスト

- [ ] src/types/cafe.ts が作成されている
- [ ] src/types/report.ts が作成されている
- [ ] src/types/user.ts が作成されている
- [ ] src/types/api.ts が作成されている
- [ ] src/types/index.ts が作成されている
- [ ] src/lib/utils/freshness.ts が作成されている
- [ ] src/lib/utils/geolocation.ts が作成されている
- [ ] src/lib/utils/cn.ts が作成されている
- [ ] src/lib/constants.ts が作成されている

### 動作確認

#### 1. TypeScript型チェック
```bash
npm run type-check
```
→ エラーなしで完了

#### 2. 型定義のインポート確認
```typescript
// テストファイルで確認
import type { Cafe, Report, User } from '@/types';
import { getFreshnessLevel, getCurrentLocation } from '@/lib/utils';

const cafe: Cafe = {
  id: '1',
  name: 'Test Cafe',
  address: 'Tokyo',
  latitude: 35.6812,
  longitude: 139.7671,
  createdAt: new Date(),
  updatedAt: new Date(),
};

console.log(cafe); // 型エラーなし
```

---

## 🧪 テスト項目

| テスト項目 | 確認方法 | 期待結果 |
|-----------|---------|---------|
| 型定義インポート | `import type { Cafe } from '@/types'` | エラーなし |
| 鮮度判定（fresh） | `getFreshnessLevel(new Date())` | 'fresh' |
| 鮮度判定（expired） | `getFreshnessLevel(null)` | 'expired' |
| 現在地取得 | `getCurrentLocation()` | Promise<Coordinates> |
| classname utility | `cn('text-red-500', 'bg-blue-500')` | 正しくマージされる |

---

## ⚠️ トラブルシューティング

### 問題1: 型定義がインポートできない

**原因**: tsconfig.jsonのpathsが正しく設定されていない

**解決策**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 問題2: clsx/tailwind-mergeがインストールされていない

**原因**: Phase 1で依存関係がインストールされていない

**解決策**:
```bash
npm install clsx tailwind-merge
```

---

## 📚 参考資料

- [TypeScript 公式ドキュメント](https://www.typescriptlang.org/docs/)
- [clsx](https://github.com/lukeed/clsx)
- [tailwind-merge](https://github.com/dcastil/tailwind-merge)

---

## 🎯 次のPhase

Phase 2が完了したら、**Phase 3: データベース構築** (`20251023_03-database-foundation.md`) に進みます。

---

**Phase完了日**: ___________
**実績時間**: ___________
**担当者**: ___________
**レビュー**: ___________
