# Phase 1: プロジェクトセットアップ

**Phase**: 1/11
**見積もり時間**: 30-45分
**優先度**: Critical
**依存関係**: なし

---

## 📋 Phase概要

Next.js 14プロジェクトの初期化と開発環境の構築を行います。このPhaseでは、プロジェクトの基盤となる設定ファイル、ディレクトリ構造、必要な依存パッケージのインストールを完了します。

##

 ✅ 目標

- ✅ Next.js 14 (App Router) プロジェクトの初期化
- ✅ TypeScript設定の完了
- ✅ Tailwind CSS設定の完了
- ✅ 必要な依存パッケージのインストール
- ✅ プロジェクトディレクトリ構造の作成
- ✅ Git初期化とリモートリポジトリ設定
- ✅ ESLint/Prettier設定

---

## 📝 実装タスク

### 1. Next.js 14プロジェクト初期化

```bash
# プロジェクト作成
npx create-next-app@latest work-cafe-finder

# 設定オプション:
# ✅ Would you like to use TypeScript? Yes
# ✅ Would you like to use ESLint? Yes
# ✅ Would you like to use Tailwind CSS? Yes
# ✅ Would you like to use `src/` directory? Yes
# ✅ Would you like to use App Router? Yes
# ❌ Would you like to customize the default import alias? No

cd work-cafe-finder
```

### 2. 依存パッケージのインストール

**実行コマンド:**
```bash
# 地図関連
npm install leaflet react-leaflet
npm install -D @types/leaflet

# データベース・ORM
npm install @neondatabase/serverless drizzle-orm
npm install -D drizzle-kit

# 認証
npm install next-auth @auth/drizzle-adapter

# バリデーション
npm install zod

# ユーティリティ
npm install clsx tailwind-merge

# 日付操作
npm install date-fns
```

**package.json（最終的な dependencies）:**
```json
{
  "name": "work-cafe-finder",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "db:generate": "drizzle-kit generate:pg",
    "db:push": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "@auth/drizzle-adapter": "^1.0.0",
    "@neondatabase/serverless": "^0.9.0",
    "clsx": "^2.1.0",
    "date-fns": "^3.0.0",
    "drizzle-orm": "^0.29.0",
    "leaflet": "^1.9.4",
    "next": "14.1.0",
    "next-auth": "^4.24.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-leaflet": "^4.2.1",
    "tailwind-merge": "^2.2.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/leaflet": "^1.9.8",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "drizzle-kit": "^0.20.0",
    "eslint": "^8",
    "eslint-config-next": "14.1.0",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}
```

### 3. ディレクトリ構造の作成

```bash
# src/ディレクトリ構造を作成
mkdir -p src/{components/{map,cafe,layout,ui},lib/{db,auth,utils},types}
```

**最終的なディレクトリ構造:**
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
│   │       │       └── route.ts
│   │       ├── cafes/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       └── reports/
│   │           ├── route.ts
│   │           └── [id]/
│   │               └── route.ts
│   ├── components/
│   │   ├── map/                      # 地図関連コンポーネント
│   │   │   ├── MapView.tsx
│   │   │   ├── CafeMarker.tsx
│   │   │   ├── CurrentLocationMarker.tsx
│   │   │   └── MapFilters.tsx
│   │   ├── cafe/                     # カフェ関連コンポーネント
│   │   │   ├── CafeDetail.tsx
│   │   │   ├── ReportForm.tsx
│   │   │   └── ReportCard.tsx
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
│   │   │   ├── geolocation.ts        # 位置情報ユーティリティ
│   │   │   └── cn.ts                 # classname utility
│   │   └── constants.ts              # 定数定義
│   └── types/
│       ├── cafe.ts                   # カフェ型定義
│       ├── report.ts                 # 投稿型定義
│       ├── user.ts                   # ユーザー型定義
│       └── index.ts                  # 型のエクスポート
├── public/
│   ├── icons/                        # カフェアイコン等
│   └── images/
├── docs/
│   ├── idea/                         # 設計ドキュメント
│   ├── implementation/               # 実装ドキュメント
│   └── ticket/                       # チケット管理
├── drizzle/                          # マイグレーションファイル
├── .env.local                        # 環境変数
├── drizzle.config.ts                 # Drizzle設定
├── next.config.js                    # Next.js設定
├── tailwind.config.ts                # Tailwind設定
├── tsconfig.json                     # TypeScript設定
└── package.json                      # 依存関係
```

### 4. TypeScript設定

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 5. Tailwind CSS設定

**tailwind.config.ts:**
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

**src/app/globals.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Leaflet CSS（Phase 6で追加） */
@import 'leaflet/dist/leaflet.css';

/* カスタムスタイル */
@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer utilities {
  .map-container {
    @apply h-full w-full;
  }
}
```

### 6. Next.js設定

**next.config.js:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google OAuth画像
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com', // X (Twitter) OAuth画像
      },
    ],
  },
  // Leaflet用のwebpack設定
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
};

module.exports = nextConfig;
```

### 7. Drizzle設定

**drizzle.config.ts:**
```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### 8. 環境変数設定

**.env.local（サンプル）:**
```env
# Database (Phase 3で設定)
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/dbname?sslmode=require"

# NextAuth (Phase 4で設定)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (Phase 4で設定)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# X (Twitter) OAuth (Phase 4で設定)
TWITTER_CLIENT_ID="your-twitter-client-id"
TWITTER_CLIENT_SECRET="your-twitter-client-secret"

# Map Settings (Phase 6で使用)
NEXT_PUBLIC_MAP_DEFAULT_CENTER_LAT=35.6812
NEXT_PUBLIC_MAP_DEFAULT_CENTER_LNG=139.7671
NEXT_PUBLIC_MAP_DEFAULT_ZOOM=15
```

**.env.example（リポジトリにコミット）:**
```env
# Database
DATABASE_URL=""

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""

# Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# X (Twitter) OAuth
TWITTER_CLIENT_ID=""
TWITTER_CLIENT_SECRET=""

# Map Settings
NEXT_PUBLIC_MAP_DEFAULT_CENTER_LAT=35.6812
NEXT_PUBLIC_MAP_DEFAULT_CENTER_LNG=139.7671
NEXT_PUBLIC_MAP_DEFAULT_ZOOM=15
```

**.gitignore（追加項目）:**
```
# Environment variables
.env.local
.env.*.local

# Drizzle
drizzle/
```

### 9. ESLint/Prettier設定

**.eslintrc.json:**
```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

**.prettierrc（オプション）:**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100
}
```

### 10. Git初期化

```bash
# Git初期化
git init

# 初回コミット
git add .
git commit -m "chore: initial project setup with Next.js 14"

# GitHubリポジトリ作成後
git remote add origin https://github.com/your-username/work-cafe-finder.git
git branch -M main
git push -u origin main
```

---

## 📦 成果物

### 完了チェックリスト

- [ ] Next.js 14プロジェクトが正常に初期化されている
- [ ] `npm run dev`で開発サーバーが起動する（http://localhost:3000）
- [ ] TypeScript型チェックが成功する（`npm run type-check`）
- [ ] ESLintが警告なしで実行される（`npm run lint`）
- [ ] Tailwind CSSが適用される（globals.cssが読み込まれる）
- [ ] 全依存パッケージがインストールされている
- [ ] ディレクトリ構造が完成している
- [ ] 環境変数ファイルが作成されている（.env.example）
- [ ] Git初期化とリモートリポジトリ設定が完了している

### 動作確認

#### 1. 開発サーバー起動確認
```bash
npm run dev
```
→ http://localhost:3000 でNext.jsのデフォルトページが表示される

#### 2. TypeScript型チェック
```bash
npm run type-check
```
→ エラーなしで完了

#### 3. ESLint実行
```bash
npm run lint
```
→ 警告なしで完了

#### 4. ビルド確認
```bash
npm run build
```
→ ビルドが成功する

---

## 🧪 テスト項目

| テスト項目 | 確認方法 | 期待結果 |
|-----------|---------|---------|
| Next.js起動 | `npm run dev` | localhost:3000で起動 |
| TypeScript | `npm run type-check` | エラーなし |
| ESLint | `npm run lint` | 警告なし |
| Tailwind CSS | ブラウザで確認 | スタイルが適用される |
| 依存パッケージ | `npm ls` | エラーなし |
| Git初期化 | `git status` | 正常に動作 |

---

## ⚠️ トラブルシューティング

### 問題1: `npm install`でエラーが発生する

**原因**: Node.jsのバージョンが古い

**解決策**:
```bash
# Node.jsバージョン確認
node -v

# Node.js 18.x以上をインストール
# https://nodejs.org/
```

### 問題2: TypeScriptエラーが発生する

**原因**: tsconfig.jsonの設定ミス

**解決策**:
```bash
# tsconfig.jsonを再生成
npx tsc --init
# 上記のtsconfig.jsonの内容をコピー
```

### 問題3: Leaflet型定義が見つからない

**原因**: @types/leafletがインストールされていない

**解決策**:
```bash
npm install -D @types/leaflet
```

---

## 📚 参考資料

- [Next.js 14 公式ドキュメント](https://nextjs.org/docs)
- [TypeScript 公式ドキュメント](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 公式ドキュメント](https://tailwindcss.com/docs)
- [Drizzle ORM 公式ドキュメント](https://orm.drizzle.team/)

---

## 🎯 次のPhase

Phase 1が完了したら、**Phase 2: 型定義とユーティリティ** (`20251023_02-type-definitions.md`) に進みます。

---

**Phase完了日**: ___________
**実績時間**: ___________
**担当者**: ___________
**レビュー**: ___________
