# WorkCafeFinder (ワークカフェファインダー)

**「今、作業できるカフェ」がすぐに見つかる。**

WorkCafeFinderは、フリーランス・ノマドワーカー・学生のための作業カフェ発見アプリです。ユーザー参加型（CGM）により、リアルタイムな情報（空席状況・静かさ・Wi-Fi速度・電源席）を共有し、最適な作業環境を素早く見つけられます。

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 🌟 主な機能

### ユーザー機能
- **地図表示**: Leaflet + OpenStreetMapによるインタラクティブな地図
- **現在地取得**: GPS連携で周辺のカフェを自動表示
- **リアルタイム情報**: 3時間以内の新鮮な作業環境情報
- **カフェ情報投稿**: 空席・静かさ・Wi-Fi・電源席を簡単に投稿
- **フィルタリング**: 「空席あり」「静か」「Wi-Fi速い」「電源あり」で絞り込み
- **情報の鮮度管理**: 古い情報は自動でグレーアウト表示

### 認証機能
- **ソーシャルログイン**: Google / X (Twitter) OAuthでワンタップログイン
- **スパム防止**: 投稿には認証が必須

---

## 🚀 技術スタック

### フロントエンド
- **Next.js 14** (App Router) - React Server Components対応
- **TypeScript 5** - 型安全性
- **Tailwind CSS 3** - モダンなスタイリング
- **Leaflet** - オープンソース地図ライブラリ（完全無料）
- **react-leaflet** - React統合

### バックエンド
- **Next.js API Routes** - サーバーレスAPI
- **Neon PostgreSQL** - サーバーレスPostgreSQL（無料枠あり）
- **Drizzle ORM** - 軽量で高速なORM

### 認証・インフラ
- **NextAuth.js** - 認証フレームワーク
- **Vercel** - ホスティング（推奨）
- **OpenStreetMap** - 無料の地図データ

---

## 📦 クイックスタート

### 前提条件

- **Node.js**: 18.x以上
- **npm**: 9.x以上
- **PostgreSQL**: Neonアカウント（無料）
- **OAuth認証情報**: Google / X (Twitter) Developer Console

### インストール手順

#### 1. リポジトリをクローン

```bash
git clone https://github.com/yourusername/work-cafe-finder.git
cd work-cafe-finder
```

#### 2. 依存関係をインストール

```bash
npm install
```

#### 3. 環境変数を設定

`.env.local.example` を `.env.local` にコピーして、必要な値を設定します。

```bash
cp .env.local.example .env.local
```

**必須環境変数**:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/dbname?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"  # openssl rand -base64 32 で生成

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# X (Twitter) OAuth
TWITTER_CLIENT_ID="your-twitter-client-id"
TWITTER_CLIENT_SECRET="your-twitter-client-secret"
```

#### 4. データベースをセットアップ

##### Neon PostgreSQLアカウントを作成

1. [Neon](https://neon.tech/) にアクセス
2. 無料アカウントを作成
3. 新しいプロジェクトを作成
4. 接続文字列をコピーして `DATABASE_URL` に設定

##### マイグレーションを実行

```bash
# Drizzleでスキーマをデータベースに反映
npm run db:push

# （オプション）Drizzle Studioでデータベースを確認
npm run db:studio
```

#### 5. 初期データを投入（オプション）

デモ用のサンプルカフェデータを投入:

```bash
npx tsx scripts/seed.ts
```

#### 6. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

---

## 🧪 スクリプト

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm run start

# ESLintチェック
npm run lint

# TypeScript型チェック
npm run type-check

# Prettierでフォーマット
npm run format

# Drizzleマイグレーション生成
npm run db:generate

# データベースにスキーマ反映
npm run db:push

# Drizzle Studio起動
npm run db:studio
```

---

## 📁 プロジェクト構造

```
work-cafe-finder/
├── docs/                       # ドキュメント
│   └── idea/                   # 初期アイデア・設計資料
│       ├── 01-project-overview.md
│       ├── 02-architecture.md
│       ├── 03-feature-specifications.md
│       ├── 04-database-schema.md
│       └── 05-map-integration.md
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # ルートレイアウト
│   │   ├── page.tsx            # ランディングページ
│   │   ├── map/                # メイン地図画面
│   │   ├── auth/               # 認証ページ
│   │   └── api/                # API Routes
│   │       ├── auth/           # NextAuth設定
│   │       ├── cafes/          # カフェAPI
│   │       └── reports/        # 投稿API
│   ├── components/             # Reactコンポーネント
│   │   ├── map/                # 地図関連
│   │   ├── cafe/               # カフェ関連
│   │   ├── layout/             # レイアウト
│   │   └── ui/                 # 共通UI
│   ├── lib/                    # ユーティリティ・ビジネスロジック
│   │   ├── db/                 # データベース設定・クエリ
│   │   ├── auth/               # 認証設定
│   │   └── utils/              # ユーティリティ関数
│   └── types/                  # TypeScript型定義
├── public/                     # 静的ファイル
├── drizzle/                    # マイグレーションファイル
├── scripts/                    # スクリプト（シード等）
├── .env.local.example          # 環境変数テンプレート
├── drizzle.config.ts           # Drizzle設定
├── next.config.js              # Next.js設定
├── tailwind.config.ts          # Tailwind CSS設定
└── tsconfig.json               # TypeScript設定
```

---

## 🎨 デザインコンセプト

WorkCafeFinderは**モバイルファースト**設計を採用しています。

- **シンプル**: 直感的で迷わないUI
- **高速**: Leafletによる軽量な地図表示
- **レスポンシブ**: スマホ・タブレット・PCに対応

---

## 📚 ドキュメント

### 開発者向け
- [プロジェクト概要](docs/idea/01-project-overview.md) - コンセプト・ターゲットユーザー・MVPスコープ
- [アーキテクチャ設計](docs/idea/02-architecture.md) - 技術スタック・システム構成
- [機能仕様書](docs/idea/03-feature-specifications.md) - 各機能の詳細仕様
- [データベーススキーマ](docs/idea/04-database-schema.md) - テーブル設計・ER図
- [地図統合ガイド](docs/idea/05-map-integration.md) - Leaflet実装の詳細

---

## 🔐 セキュリティ

WorkCafeFinderは以下のセキュリティ対策を実装しています:

- **認証**: NextAuth.js + OAuth 2.0
- **投稿制限**: 認証ユーザーのみ投稿可能（スパム防止）
- **入力バリデーション**: Zodスキーマによる厳格な検証
- **SQL Injection防止**: Drizzle ORMのパラメータ化クエリ
- **XSS対策**: Reactの自動エスケープ

セキュリティ上の問題を発見した場合は、公開せずに管理者に直接ご連絡ください。

---

## 🤝 コントリビューション

コントリビューションを歓迎します！

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

---

## 📊 開発状況

**現在のフェーズ**: MVP Phase 1 - プロジェクト設計完了

| 項目 | 進捗 |
|------|------|
| ドキュメント作成 | 100% ✅ |
| プロジェクトセットアップ | 0% 🚧 |
| 認証機能 | 0% 🚧 |
| 地図表示 | 0% 🚧 |
| 投稿機能 | 0% 🚧 |
| フィルタリング | 0% 🚧 |

---

## 🚢 デプロイ

### Vercel（推奨）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/work-cafe-finder)

1. Vercelアカウントを作成
2. リポジトリをインポート
3. 環境変数を設定（DATABASE_URL, NEXTAUTH_*, GOOGLE_*, TWITTER_*）
4. デプロイ

### 環境変数の設定（Vercel）

Vercel ダッシュボードの「Settings > Environment Variables」で以下を設定:

- `DATABASE_URL`
- `NEXTAUTH_URL` (本番URLに変更)
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `TWITTER_CLIENT_ID`
- `TWITTER_CLIENT_SECRET`

---

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) の下でライセンスされています。

---

## 👥 メンテナー

- **開発者**: [あなたの名前](https://github.com/yourusername)
- **プロジェクト開始**: 2025年10月

---

## 🙏 謝辞

このプロジェクトは以下のオープンソースプロジェクトを活用しています:

- [Next.js](https://nextjs.org/) - Reactフレームワーク
- [Leaflet](https://leafletjs.com/) - オープンソース地図ライブラリ
- [OpenStreetMap](https://www.openstreetmap.org/) - 無料の地図データ
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [NextAuth.js](https://next-auth.js.org/) - 認証ライブラリ
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストCSS

---

## 📞 お問い合わせ

- **バグ報告**: [GitHub Issues](https://github.com/yourusername/work-cafe-finder/issues)
- **機能リクエスト**: [GitHub Discussions](https://github.com/yourusername/work-cafe-finder/discussions)

---

**WorkCafeFinder** - あなたの「今日の作業場所」を見つけよう。
