# Architecture

## システムアーキテクチャ概要

WorkCafeFinderは、Next.js 14のApp Routerをベースにしたフルスタック・サーバーレスアプリケーションです。モノリシックな構成を採用し、フロントエンド・バックエンドAPI・認証・データベースを統合します。

## 技術スタック詳細

### フロントエンド

#### Next.js 14 (App Router)
- **選定理由**:
  - React Server Componentsによる高速なページ読み込み
  - API Routesとの統合による開発効率向上
  - Vercelとの親和性（最適化されたデプロイ）
- **使用機能**:
  - Server Components（静的コンテンツ）
  - Client Components（インタラクティブなUI、地図表示）
  - API Routes（RESTful API）

#### TypeScript 5+
- **選定理由**:
  - 型安全性による開発時のエラー削減
  - IDE補完による開発体験向上
  - コードの可読性・保守性向上
- **使用方針**:
  - strictモード有効化
  - 型定義ファイルの一元管理（`src/types/`）

#### Tailwind CSS
- **選定理由**:
  - ユーティリティファーストによる高速な開発
  - モバイルファースト設計
  - ビルド時の未使用CSS削除（Purge）
- **カスタマイズ**:
  - カラーパレット（ブランドカラー）
  - レスポンシブブレークポイント
  - カスタムアニメーション

#### Leaflet + react-leaflet
- **選定理由**:
  - **完全無料**: Google Maps APIのような従量課金なし
  - **軽量**: バンドルサイズが小さい
  - **カスタマイズ性**: オープンソースで柔軟
  - **コミュニティ**: プラグインが豊富
- **使用機能**:
  - マーカー表示（カフェの位置）
  - 現在地表示（GPS）
  - クラスタリング（多数のカフェを効率的に表示）
  - カスタムアイコン（カフェの状態で色分け）

#### OpenStreetMap (OSM)
- **選定理由**:
  - **完全無料**: タイル配信コストなし
  - **オープンデータ**: ライセンス制約が緩い
- **タイルサーバー**:
  - デフォルト: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
  - 将来的にカスタムタイルサーバー検討可能

### バックエンド

#### Next.js API Routes (App Router)
- **エンドポイント設計**:
  - RESTful API
  - `src/app/api/` 配下に配置
- **使用パターン**:
  - `GET /api/cafes` - カフェ一覧取得
  - `GET /api/cafes/[id]` - カフェ詳細取得
  - `POST /api/reports` - 投稿作成（認証必須）
  - `GET /api/reports` - 投稿一覧取得（フィルタリング対応）

#### Neon PostgreSQL
- **選定理由**:
  - **サーバーレス**: 使用量に応じた自動スケーリング
  - **無料枠**: 0.5GB ストレージ（MVPに十分）
  - **高速接続**: HTTP接続によるコールドスタート最適化
  - **Vercel統合**: 環境変数の自動設定
- **接続方式**:
  - HTTPベース接続（`@neondatabase/serverless`）
  - コネクションプーリング不要

#### Drizzle ORM
- **選定理由**:
  - **軽量**: バンドルサイズが小さい（Prismaより軽量）
  - **高速**: コールドスタート時間が短い
  - **型安全**: TypeScriptファーストの設計
  - **Neon最適化**: サーバーレス環境に最適
- **Prismaとの比較**:
  | 項目 | Drizzle | Prisma |
  |------|---------|--------|
  | バンドルサイズ | 小 | 大 |
  | コールドスタート | 速い | やや遅い |
  | スキーマ定義 | TypeScript | Prisma Schema |
  | マイグレーション | シンプル | 高機能 |
  | MVPスピード | ⭐⭐⭐ | ⭐⭐ |

### 認証・認可

#### NextAuth.js
- **選定理由**:
  - Next.jsとの完全統合
  - 主要OAuthプロバイダーのサポート
  - セッション管理が簡単
  - セキュアなトークン管理
- **実装方針**:
  - **認証プロバイダー**: Google, X (Twitter)
  - **セッション**: JWTベース
  - **データベース**: Neon PostgreSQL（ユーザー情報保存）
- **メールアドレス登録を避ける理由**:
  - ユーザーのハードルを下げる
  - SMTP設定不要（コスト削減）
  - ソーシャルログインで十分な信頼性

### データ更新戦略

#### ポーリング方式
- **選定理由**:
  - **シンプル**: 実装が容易
  - **サーバーレス対応**: Vercelで動作
  - **コスト効率**: WebSocket/SSEより安価
  - **十分な鮮度**: カフェ情報は秒単位の更新は不要
- **実装方針**:
  - マップ表示時に最新データ取得
  - （オプション）5分ごとのバックグラウンド更新
- **WebSocket/SSE不採用の理由**:
  - Vercelのサーバーレス環境では常時接続が困難
  - カフェ情報は「リアルタイムチャット」ほどの即時性不要
  - コスト・複雑性が増加

## アプリケーション構造

### ディレクトリ構成

```
work-cafe-finder/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # ルートレイアウト
│   │   ├── page.tsx                  # ランディングページ
│   │   ├── map/                      # メイン地図画面
│   │   │   └── page.tsx
│   │   ├── auth/                     # 認証関連ページ
│   │   │   ├── signin/
│   │   │   └── error/
│   │   └── api/                      # API Routes
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts      # NextAuth設定
│   │       ├── cafes/
│   │       │   ├── route.ts          # GET /api/cafes
│   │       │   └── [id]/
│   │       │       └── route.ts      # GET /api/cafes/:id
│   │       └── reports/
│   │           ├── route.ts          # GET, POST /api/reports
│   │           └── [id]/
│   │               └── route.ts      # GET /api/reports/:id
│   ├── components/
│   │   ├── map/                      # 地図関連コンポーネント
│   │   │   ├── MapView.tsx           # メイン地図コンポーネント
│   │   │   ├── CafeMarker.tsx        # カフェマーカー
│   │   │   ├── CurrentLocationMarker.tsx # 現在地マーカー
│   │   │   └── MapFilters.tsx        # フィルター UI
│   │   ├── cafe/                     # カフェ関連コンポーネント
│   │   │   ├── CafeDetail.tsx        # カフェ詳細表示
│   │   │   ├── ReportForm.tsx        # 投稿フォーム
│   │   │   └── ReportCard.tsx        # 投稿カード表示
│   │   ├── layout/                   # レイアウトコンポーネント
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   └── ui/                       # 共通UIコンポーネント
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── Badge.tsx
│   │       └── Spinner.tsx
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts              # Neon接続設定
│   │   │   ├── schema.ts             # Drizzleスキーマ定義
│   │   │   └── queries.ts            # データベースクエリ
│   │   ├── auth/
│   │   │   └── config.ts             # NextAuth設定
│   │   ├── utils/
│   │   │   ├── freshness.ts          # 鮮度判定ロジック
│   │   │   └── geolocation.ts        # 位置情報ユーティリティ
│   │   └── constants.ts              # 定数定義
│   └── types/
│       ├── cafe.ts                   # カフェ型定義
│       ├── report.ts                 # 投稿型定義
│       └── user.ts                   # ユーザー型定義
├── public/
│   ├── icons/                        # カフェアイコン等
│   └── images/
├── docs/
│   └── idea/                         # 設計ドキュメント
├── drizzle/                          # マイグレーションファイル
├── .env.local                        # 環境変数
├── drizzle.config.ts                 # Drizzle設定
├── next.config.js                    # Next.js設定
├── tailwind.config.ts                # Tailwind設定
├── tsconfig.json                     # TypeScript設定
└── package.json                      # 依存関係
```

## 画面構成

### 1. ランディングページ (`/`)
- **目的**: サービス紹介、CTA（「地図を見る」ボタン）
- **コンポーネント**:
  - ヒーローセクション
  - 機能説明
  - デモスクリーンショット
  - CTAボタン → `/map`

### 2. メイン地図画面 (`/map`)

```
┌─────────────────────────────────────────────────────────┐
│  Header [Logo] [User Avatar/Login]                      │
├─────────────────────────────────────────────────────────┤
│  Filters: [空席あり] [静か] [Wi-Fi速い] [電源あり]        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│                     Map (Leaflet)                        │
│                                                          │
│  📍 Cafe Marker (色分け: 新鮮/古い)                       │
│  📍 Cafe Marker                                          │
│  📌 Current Location                                     │
│                                                          │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  [投稿する] ボタン                                         │
└─────────────────────────────────────────────────────────┘
```

**主要機能**:
- 地図表示（Leaflet）
- カフェマーカー表示（色分け: 新鮮/古い）
- 現在地マーカー
- フィルター切り替え
- カフェタップ → 詳細モーダル表示

### 3. カフェ詳細モーダル

```
┌────────────────────────────────┐
│  カフェ名                       │
│  住所                           │
├────────────────────────────────┤
│  最新の投稿 (15分前)            │
│  ✅ 空席あり                    │
│  🔇 静か                        │
│  📶 Wi-Fi: 速い                 │
│  🔌 電源席あり                  │
│  💬 「窓側の席が空いてます」      │
├────────────────────────────────┤
│  過去の投稿 (2時間前) [グレー]   │
│  ...                            │
├────────────────────────────────┤
│  [このカフェに投稿する]          │
└────────────────────────────────┘
```

### 4. 投稿フォーム（モーダル）

```
┌────────────────────────────────┐
│  投稿する - カフェ名             │
├────────────────────────────────┤
│  空席状況: [あり] [混雑] [なし]  │
│  静かさ: [静か] [普通] [にぎやか]│
│  Wi-Fi: [速い] [普通] [遅い] [なし]│
│  電源席: [あり] [なし]           │
│  コメント (任意):                │
│  ┌──────────────────────────┐  │
│  │                          │  │
│  └──────────────────────────┘  │
├────────────────────────────────┤
│  [キャンセル]  [投稿する]        │
└────────────────────────────────┘
```

## データフロー

### 地図表示フロー

```
┌──────────────┐
│   User       │
└──────┬───────┘
       │ /map アクセス
       ▼
┌──────────────────────┐
│  MapView (Client)    │
│  - 現在地取得 (GPS)   │
│  - Leaflet初期化      │
└──────┬───────────────┘
       │ GET /api/cafes?lat=...&lng=...
       ▼
┌──────────────────────┐
│  API Route           │
│  GET /api/cafes      │
└──────┬───────────────┘
       │ DB Query (Drizzle)
       ▼
┌──────────────────────┐
│  Neon PostgreSQL     │
│  cafes table         │
│  reports table       │
└──────┬───────────────┘
       │ カフェ + 最新投稿
       ▼
┌──────────────────────┐
│  MapView (Client)    │
│  - マーカー表示       │
│  - 鮮度判定・色分け   │
└──────────────────────┘
```

### 投稿フロー

```
┌──────────────┐
│   User       │
│  (認証済み)   │
└──────┬───────┘
       │ 「投稿する」クリック
       ▼
┌──────────────────────┐
│  ReportForm (Client) │
│  - フォーム入力       │
└──────┬───────────────┘
       │ POST /api/reports
       │ { cafeId, seatStatus, quietness, wifi, power, comment }
       ▼
┌──────────────────────┐
│  API Route           │
│  POST /api/reports   │
│  - 認証チェック       │
│  - バリデーション     │
└──────┬───────────────┘
       │ DB Insert (Drizzle)
       ▼
┌──────────────────────┐
│  Neon PostgreSQL     │
│  reports table       │
└──────┬───────────────┘
       │ 投稿完了
       ▼
┌──────────────────────┐
│  MapView (Client)    │
│  - 地図を再読み込み   │
│  - 新しい投稿を表示   │
└──────────────────────┘
```

## データベース接続

### Neon PostgreSQL設定

**.env.local**
```env
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/dbname?sslmode=require"
```

**lib/db/index.ts**
```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

## 認証フロー

### NextAuth.js フロー

```
┌──────────────┐
│   User       │
└──────┬───────┘
       │ 「ログイン」クリック
       ▼
┌──────────────────────┐
│  SignIn Page         │
│  - Google            │
│  - X (Twitter)       │
└──────┬───────────────┘
       │ OAuth認証
       ▼
┌──────────────────────┐
│  OAuth Provider      │
│  (Google/X)          │
└──────┬───────────────┘
       │ 認証成功
       ▼
┌──────────────────────┐
│  NextAuth Callback   │
│  - ユーザー情報取得   │
│  - DBに保存/更新      │
└──────┬───────────────┘
       │ JWT生成
       ▼
┌──────────────────────┐
│  Session確立         │
│  - Cookie保存        │
└──────┬───────────────┘
       │ リダイレクト
       ▼
┌──────────────────────┐
│  /map                │
│  (認証済み状態)       │
└──────────────────────┘
```

## 鮮度管理ロジック

### freshness.ts

```typescript
export function getFreshnessLevel(createdAt: Date): 'fresh' | 'stale' | 'expired' {
  const now = new Date();
  const diffHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

  if (diffHours <= 3) return 'fresh';    // 3時間以内
  if (diffHours <= 24) return 'stale';   // 24時間以内
  return 'expired';                       // 24時間以上
}

export function getFreshnessColor(level: 'fresh' | 'stale' | 'expired'): string {
  switch (level) {
    case 'fresh': return 'text-green-600';
    case 'stale': return 'text-gray-400';
    case 'expired': return 'text-gray-200';
  }
}

export function getFreshnessLabel(createdAt: Date): string {
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));

  if (diffMinutes < 60) return `${diffMinutes}分前の情報`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}時間前の情報`;
  return `${Math.floor(diffHours / 24)}日前の古い情報です`;
}
```

## セキュリティ考慮事項

### MVP段階
- **認証**: NextAuth.jsによるOAuth認証
- **投稿制限**: 認証ユーザーのみ投稿可能
- **入力検証**: Zodスキーマによるバリデーション
- **SQL Injection防止**: Drizzle ORMのパラメータ化クエリ

### 将来的な対策（スコープ外）
- レート制限（Upstash Redis）
- CSRF対策（NextAuth.js標準で一部対応）
- XSS対策（React標準エスケープ + DOMPurify）
- セキュリティヘッダー（next.config.js）

## パフォーマンス最適化

### MVP段階
- React Server Components（静的コンテンツ）
- 動的importによるコード分割（Leafletなど）
- Tailwind CSS Purge設定
- 画像最適化（next/image）

### 将来的な最適化（スコープ外）
- マーカークラスタリング（多数のカフェ表示時）
- Service Worker（PWA化）
- ISR（Incremental Static Regeneration）
- CDN最適化（Vercel Edge）

## デプロイ戦略

### Vercel設定
1. GitHubリポジトリ連携
2. 環境変数設定:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
   - `TWITTER_CLIENT_ID` / `TWITTER_CLIENT_SECRET`
3. 自動デプロイ（mainブランチへのpush時）

### ビルド設定
- **Node.js**: 18.x以上
- **ビルドコマンド**: `npm run build`
- **出力ディレクトリ**: `.next/`

## 拡張性の考慮

### プラグインアーキテクチャ（将来的）
- 地図プロバイダーの切り替え可能性（Leaflet → Mapbox）
- 投稿項目の動的追加
- 多言語対応（i18n）

### API拡張（将来的）
- GraphQL（柔軟なクエリ）
- WebSocket（リアルタイム更新）
- Webhooks（外部連携）
