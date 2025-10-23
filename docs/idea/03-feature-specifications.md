# Feature Specifications

## 機能仕様概要

このドキュメントでは、WorkCafeFinderのMVP（Minimum Viable Product）として実装する各機能の詳細仕様を定義します。

## 1. 地図表示機能

### 1.1 基本地図表示

**概要**: OpenStreetMapベースの地図を表示し、ユーザーがカフェの位置を視覚的に把握できるようにする。

**技術**: Leaflet + react-leaflet

**実装詳細**:
- 初期表示位置: ユーザーの現在地（GPS取得後）
- フォールバック: 東京駅周辺（GPS取得失敗時）
- ズームレベル: 初期値15（徒歩圏内が見渡せるレベル）
- 最小ズーム: 10（広域）
- 最大ズーム: 18（詳細）

**UIコンポーネント**:
```typescript
<MapView
  center={[lat, lng]}
  zoom={15}
  onMove={(bounds) => fetchCafesInBounds(bounds)}
/>
```

**表示要素**:
- 背景地図（OpenStreetMap）
- カフェマーカー
- 現在地マーカー
- ズームコントロール
- 位置情報再取得ボタン

### 1.2 現在地取得（GPS）

**概要**: ブラウザのGeolocation APIを使用して、ユーザーの現在位置を取得。

**実装詳細**:
```typescript
function getCurrentLocation(): Promise<{ lat: number; lng: number }> {
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
```

**エラーハンドリング**:
- 位置情報許可なし → 東京駅をデフォルト表示、許可を促すメッセージ
- タイムアウト → 「位置情報の取得に失敗しました」メッセージ、手動で地図移動を促す

**UI/UX**:
- 初回アクセス時に位置情報許可を促すモーダル
- 現在地マーカーを青い円で表示
- 「現在地に戻る」ボタン（右下に配置）

### 1.3 カフェマーカー表示

**概要**: 地図上にカフェの位置をマーカーで表示し、投稿の鮮度に応じて色分け。

**マーカー仕様**:

| 鮮度レベル | 色 | アイコン | 説明 |
|-----------|-----|---------|------|
| Fresh (3時間以内) | 🟢 緑 | ☕ | 新鮮な情報あり |
| Stale (3〜24時間) | 🟡 黄 | ☕ | やや古い情報 |
| No Data / Expired | ⚪ グレー | ☕ | 投稿なし or 24時間以上経過 |

**実装詳細**:
```typescript
<CafeMarker
  position={[cafe.latitude, cafe.longitude]}
  cafe={cafe}
  freshnessLevel={getFreshnessLevel(cafe.latestReport?.createdAt)}
  onClick={() => openCafeDetail(cafe.id)}
/>
```

**インタラクション**:
- マーカークリック → カフェ詳細モーダル表示
- マーカーホバー → カフェ名のツールチップ表示

### 1.4 地図範囲の動的読み込み

**概要**: 地図の表示範囲（ビューポート）に応じてカフェデータを動的に取得。

**実装詳細**:
- 地図の移動（drag）またはズーム変更時にイベント発火
- デバウンス処理（500ms）で過剰なAPI呼び出しを防止
- 現在の表示範囲の境界座標をAPIに送信

```typescript
const handleMapMove = debounce((bounds: LatLngBounds) => {
  fetchCafes({
    northEast: bounds.getNorthEast(),
    southWest: bounds.getSouthWest(),
  });
}, 500);
```

**APIエンドポイント**:
```
GET /api/cafes?neLat=35.7&neLng=139.8&swLat=35.6&swLng=139.7
```

---

## 2. カフェ情報閲覧機能

### 2.1 カフェ詳細モーダル

**概要**: マーカーをクリックすると、カフェの詳細情報と投稿履歴を表示するモーダルを開く。

**表示情報**:
- **基本情報**:
  - カフェ名
  - 住所
  - 地図上の位置（小さなサムネイル地図）
- **最新の投稿** (3時間以内):
  - 投稿時刻（「15分前」形式）
  - 空席状況・静かさ・Wi-Fi・電源席
  - コメント（あれば）
  - 投稿者名（匿名 or ユーザー名の頭文字）
- **過去の投稿** (3〜24時間):
  - グレーアウト表示
  - 「6時間前の古い情報です」ラベル
  - 折りたたみ可能（デフォルトは折りたたみ）

**UIコンポーネント**:
```typescript
<CafeDetailModal
  cafe={selectedCafe}
  reports={cafeReports}
  onClose={() => setSelectedCafe(null)}
  onReportClick={() => openReportForm(selectedCafe)}
/>
```

**アクション**:
- 「このカフェに投稿する」ボタン → 投稿フォーム表示
- 「閉じる」ボタン → モーダルを閉じる

### 2.2 投稿カード表示

**概要**: 各投稿を視覚的に分かりやすく表示。

**カードレイアウト**:
```
┌────────────────────────────────┐
│  👤 ユーザー名   📅 15分前      │
├────────────────────────────────┤
│  ✅ 空席: あり                  │
│  🔇 静かさ: 静か                │
│  📶 Wi-Fi: 速い                 │
│  🔌 電源席: あり                │
├────────────────────────────────┤
│  💬 「窓側の席が空いてます」     │
└────────────────────────────────┘
```

**アイコン定義**:
- 空席: ✅ あり / 🟡 混雑 / ❌ なし
- 静かさ: 🔇 静か / 🔉 普通 / 🔊 にぎやか
- Wi-Fi: 📶 速い / 📶 普通 / 📶 遅い / ❌ なし
- 電源: 🔌 あり / ❌ なし

**鮮度による表示変化**:
- **Fresh (3時間以内)**: 通常色、緑のバッジ「新鮮」
- **Stale (3〜24時間)**: グレーアウト、黄色のバッジ「古い情報」
- **Expired (24時間以上)**: マップには表示しない（詳細モーダルの履歴には表示）

---

## 3. カフェ情報投稿機能

### 3.1 認証要件

**概要**: 投稿にはユーザー認証が必須。スパムや不正な投稿を防ぐため。

**実装方針**:
- 未認証ユーザーが「投稿する」ボタンをクリック → ログイン画面へリダイレクト
- 認証済みユーザー → 投稿フォームを直接表示

**認証プロバイダー**:
- Google OAuth
- X (Twitter) OAuth

**セッション管理**:
- NextAuth.jsのJWTベースセッション
- セッション有効期限: 30日

### 3.2 投稿フォーム

**概要**: ユーザーがカフェの現状を簡単に投稿できるフォーム。

**入力項目**:

#### 空席状況（必須）
- タイプ: ラジオボタン（3択）
- 選択肢:
  - ✅ あり
  - 🟡 混雑
  - ❌ なし

#### 静かさ（必須）
- タイプ: ラジオボタン（3択）
- 選択肢:
  - 🔇 静か
  - 🔉 普通
  - 🔊 にぎやか

#### Wi-Fi速度（必須）
- タイプ: ラジオボタン（4択）
- 選択肢:
  - 📶 速い（動画視聴・ビデオ会議OK）
  - 📶 普通（メール・ブラウジングOK）
  - 📶 遅い（メールのみ）
  - ❌ なし or 未確認

#### 電源席（必須）
- タイプ: ラジオボタン（2択）
- 選択肢:
  - 🔌 あり
  - ❌ なし

#### コメント（任意）
- タイプ: テキストエリア
- 最大文字数: 50文字
- プレースホルダー: 「例: 窓側の席が空いてます」

**バリデーション**:
```typescript
const reportSchema = z.object({
  cafeId: z.string().uuid(),
  seatStatus: z.enum(['available', 'crowded', 'full']),
  quietness: z.enum(['quiet', 'normal', 'noisy']),
  wifi: z.enum(['fast', 'normal', 'slow', 'none']),
  powerOutlets: z.boolean(),
  comment: z.string().max(50).optional(),
});
```

**UIコンポーネント**:
```typescript
<ReportForm
  cafeId={cafe.id}
  onSubmit={handleSubmit}
  onCancel={() => setShowForm(false)}
/>
```

### 3.3 投稿処理

**フロー**:
1. フォーム入力完了
2. クライアント側バリデーション
3. `POST /api/reports` にデータ送信
4. サーバー側バリデーション
5. データベースに保存
6. 成功レスポンス → モーダルを閉じ、地図を更新

**APIエンドポイント**:
```typescript
// POST /api/reports
{
  cafeId: 'uuid',
  seatStatus: 'available',
  quietness: 'quiet',
  wifi: 'fast',
  powerOutlets: true,
  comment: '窓側の席が空いてます'
}

// Response
{
  success: true,
  reportId: 'uuid',
  message: '投稿が完了しました'
}
```

**エラーハンドリング**:
- 認証エラー → ログイン画面へリダイレクト
- バリデーションエラー → フォームにエラーメッセージ表示
- サーバーエラー → 「投稿に失敗しました。もう一度お試しください」

### 3.4 投稿頻度制限（将来的）

**現在のMVPスコープ外**、将来的には以下の制限を検討:
- 同じカフェへの連続投稿: 30分以内は再投稿不可
- 1日の投稿上限: 10件

---

## 4. フィルタリング機能

### 4.1 フィルター項目

**概要**: ユーザーが特定の条件でカフェを絞り込める機能。

**フィルター項目**:
- **空席あり**: 最新の投稿で「空席あり」のカフェのみ表示
- **静か**: 最新の投稿で「静か」のカフェのみ表示
- **Wi-Fi速い**: 最新の投稿で「Wi-Fi速い」のカフェのみ表示
- **電源席あり**: 最新の投稿で「電源席あり」のカフェのみ表示

**UI配置**:
- 地図の上部に横並びで配置
- トグルボタン形式（ON/OFF切り替え）
- 複数選択可能（AND条件）

**UIコンポーネント**:
```typescript
<MapFilters
  filters={filters}
  onChange={(newFilters) => setFilters(newFilters)}
/>
```

### 4.2 フィルタリングロジック

**クライアント側**:
- フィルター変更時にAPIリクエストを再送信
- クエリパラメータでフィルター条件を指定

**APIエンドポイント**:
```
GET /api/cafes?neLat=...&swLat=...&filters=seats,quiet,wifi,power
```

**サーバー側**:
```typescript
// Drizzle Query
const cafes = await db
  .select()
  .from(cafesTable)
  .leftJoin(reportsTable, eq(cafesTable.id, reportsTable.cafeId))
  .where(
    and(
      // 地図範囲
      between(cafesTable.latitude, swLat, neLat),
      between(cafesTable.longitude, swLng, neLng),
      // フィルター条件
      filters.includes('seats') ? eq(reportsTable.seatStatus, 'available') : undefined,
      filters.includes('quiet') ? eq(reportsTable.quietness, 'quiet') : undefined,
      filters.includes('wifi') ? eq(reportsTable.wifi, 'fast') : undefined,
      filters.includes('power') ? eq(reportsTable.powerOutlets, true) : undefined,
      // 鮮度（3時間以内）
      gt(reportsTable.createdAt, new Date(Date.now() - 3 * 60 * 60 * 1000))
    )
  );
```

### 4.3 フィルターUI

**デザイン**:
```
[🪑 空席あり] [🔇 静か] [📶 Wi-Fi速い] [🔌 電源あり]
```

**状態**:
- 未選択: グレー背景、グレー文字
- 選択中: ブランドカラー背景、白文字
- ホバー: 薄いブランドカラー背景

---

## 5. 情報の鮮度管理機能

### 5.1 鮮度レベルの定義

**概要**: 投稿の経過時間に応じて、情報の信頼性を視覚的に表現。

**鮮度レベル**:

| レベル | 経過時間 | 表示方法 | マーカー色 |
|--------|---------|---------|-----------|
| **Fresh** | 3時間以内 | 通常表示、緑バッジ「新鮮」 | 🟢 緑 |
| **Stale** | 3〜24時間 | グレーアウト、黄バッジ「古い情報」 | 🟡 黄 |
| **Expired** | 24時間以上 | マップ非表示、履歴のみ | - |

### 5.2 鮮度判定ロジック

**実装** (`lib/utils/freshness.ts`):
```typescript
export type FreshnessLevel = 'fresh' | 'stale' | 'expired';

export function getFreshnessLevel(createdAt: Date | null): FreshnessLevel {
  if (!createdAt) return 'expired';

  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours <= 3) return 'fresh';
  if (diffHours <= 24) return 'stale';
  return 'expired';
}

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

export function getFreshnessColor(level: FreshnessLevel): string {
  switch (level) {
    case 'fresh': return 'text-green-600';
    case 'stale': return 'text-yellow-600';
    case 'expired': return 'text-gray-400';
  }
}

export function getMarkerColor(level: FreshnessLevel): string {
  switch (level) {
    case 'fresh': return '#10B981'; // green-500
    case 'stale': return '#F59E0B'; // yellow-500
    case 'expired': return '#9CA3AF'; // gray-400
  }
}
```

### 5.3 UI表示ルール

**地図上のマーカー**:
- Fresh: 緑色マーカー、通常サイズ
- Stale: 黄色マーカー、通常サイズ
- Expired: 非表示（ただし、投稿が一つもないカフェはグレーマーカー表示）

**カフェ詳細モーダル**:
- Fresh投稿: 上部に表示、緑のバッジ
- Stale投稿: 折りたたみセクション、黄色のバッジ
- Expired投稿: 「過去の履歴」セクション（デフォルト非表示）

---

## 6. 認証機能（NextAuth.js）

### 6.1 認証プロバイダー

**サポートするプロバイダー**:
1. **Google OAuth**
   - 理由: 最も普及している、信頼性が高い
   - 取得情報: email, name, profile image
2. **X (Twitter) OAuth**
   - 理由: 技術系ユーザーに人気
   - 取得情報: username, name, profile image

**将来的な拡張（スコープ外）**:
- GitHub OAuth
- Apple Sign-In

### 6.2 認証フロー

**初回ログイン**:
1. ユーザーが「ログイン」ボタンをクリック
2. サインイン画面（`/auth/signin`）に遷移
3. プロバイダー選択（Google or X）
4. OAuthプロバイダーへリダイレクト
5. ユーザーが許可
6. コールバックURL（`/api/auth/callback/google`）に戻る
7. NextAuth.jsがユーザー情報を取得
8. データベースにユーザー情報を保存（初回のみ）
9. セッション確立、`/map`にリダイレクト

**2回目以降のログイン**:
- セッションが有効な場合、自動ログイン
- セッション切れの場合、再度OAuth認証

### 6.3 NextAuth設定

**`src/app/api/auth/[...nextauth]/route.ts`**:
```typescript
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';

export const authOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: '2.0',
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### 6.4 保護されたAPI

**投稿APIの認証チェック**:
```typescript
// POST /api/reports
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // 投稿処理
  const body = await request.json();
  // ...
}
```

### 6.5 クライアント側セッション管理

**SessionProviderでラップ**:
```typescript
// src/app/layout.tsx
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

**セッション取得**:
```typescript
// src/components/Header.tsx
'use client';
import { useSession, signIn, signOut } from 'next-auth/react';

export function Header() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;

  if (!session) {
    return <button onClick={() => signIn()}>ログイン</button>;
  }

  return (
    <div>
      <span>ようこそ、{session.user?.name}さん</span>
      <button onClick={() => signOut()}>ログアウト</button>
    </div>
  );
}
```

---

## 7. その他の機能

### 7.1 カフェの新規登録（将来的）

**MVPスコープ外**、将来的には以下の機能を追加:
- ユーザーが地図上をロングタップ → 「新しいカフェを登録」
- カフェ名、住所を入力
- 管理者承認後に公開

### 7.2 お気に入り機能（将来的）

**MVPスコープ外**:
- カフェをお気に入りに追加
- お気に入りリストの表示
- お気に入りカフェの新しい投稿通知

### 7.3 統計・ランキング（将来的）

**MVPスコープ外**:
- 最も投稿が多いカフェ
- 最も「静か」と評価されたカフェ
- ユーザーの投稿数ランキング

---

## 機能優先順位まとめ

### MVP必須機能（Phase 1）
1. ✅ 地図表示・現在地取得
2. ✅ カフェマーカー表示
3. ✅ カフェ詳細閲覧
4. ✅ 認証機能（Google/X OAuth）
5. ✅ 投稿機能
6. ✅ フィルタリング
7. ✅ 鮮度管理

### 将来的な拡張（Phase 2以降）
- カフェの新規登録
- お気に入り機能
- 投稿頻度制限
- 統計・ランキング
- PWA化
- プッシュ通知
