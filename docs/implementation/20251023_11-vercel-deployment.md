# Phase 11: Vercel デプロイガイド

作成日: 2025-10-23
更新日: 2025-10-24

---

## 📋 概要

このドキュメントでは、work-cafe-finder アプリケーションを Vercel にデプロイする手順を説明します。

---

## 🚀 デプロイ手順

### 1. Vercel アカウントの準備

1. [Vercel](https://vercel.com) にアクセス
2. GitHub アカウントでサインアップ/ログイン
3. Hobby プラン（無料）で開始可能

### 2. GitHub リポジトリの準備

デプロイ前に、すべての変更を GitHub にプッシュしておきます：

```bash
git add .
git commit -m "実装: Phase 11 - Vercelデプロイ準備"
git push origin main
```

### 3. Vercel プロジェクトの作成

#### Web UI から作成する場合：

1. Vercel ダッシュボードで「Add New」→「Project」をクリック
2. GitHub リポジトリをインポート
3. プロジェクト名: `work-cafe-finder`
4. Framework Preset: `Next.js` (自動検出されるはず)
5. Root Directory: `.` (デフォルト)
6. Build Command: `npm run build` (デフォルト)
7. Output Directory: `.next` (デフォルト)

#### CLI から作成する場合：

```bash
# Vercel CLI をインストール
npm i -g vercel

# ログイン
vercel login

# デプロイ
vercel
```

### 4. 環境変数の設定

Vercel ダッシュボードの「Settings」→「Environment Variables」で以下を設定：

#### 必須の環境変数：

```bash
# Database
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# NextAuth
NEXTAUTH_URL=https://work-cafe-finder.vercel.app
NEXTAUTH_SECRET=your-secret-here
```

#### オプションの環境変数（OAuth を使用する場合）：

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# X (Twitter) OAuth
TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret
```

**重要:**
- すべての環境変数を「Production」、「Preview」、「Development」すべてに適用
- `NEXTAUTH_URL` は本番 URL に変更すること
- `NEXTAUTH_SECRET` は以下で生成：
  ```bash
  openssl rand -base64 32
  ```

### 5. OAuth 設定の更新

#### Google OAuth の場合：

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) にアクセス
2. 作成済みの OAuth 2.0 クライアント ID を選択
3. 「承認済みのリダイレクト URI」に追加：
   ```
   https://work-cafe-finder.vercel.app/api/auth/callback/google
   ```

#### X (Twitter) OAuth の場合：

1. [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard) にアクセス
2. アプリの設定で「Authentication settings」を編集
3. 「Callback URI / Redirect URL」に追加：
   ```
   https://work-cafe-finder.vercel.app/api/auth/callback/twitter
   ```

### 6. 初回デプロイ

1. Vercel ダッシュボードで「Deploy」をクリック
2. ビルドログを確認
3. デプロイが成功したら、本番 URL にアクセス

### 7. デモデータの投入

本番データベースにデモデータを投入します（オプション）：

```bash
# ローカルで実行する場合
# .env.local の DATABASE_URL を本番 URL に変更してから実行
npm run db:seed

# または、Vercel CLI 経由で実行
vercel env pull .env.production.local
npm run db:seed
```

**注意:** 本番データベースへの直接操作は慎重に行ってください。

---

## ✅ 動作確認チェックリスト

デプロイ後、以下を確認してください：

### 基本機能

- [ ] トップページ（`/`）が表示される
- [ ] 地図ページ（`/map`）が表示される
- [ ] 地図上にカフェマーカーが表示される
- [ ] 現在地ボタンが動作する
- [ ] カフェマーカーをクリックすると詳細モーダルが表示される

### 認証機能

- [ ] ログインページ（`/auth/signin`）が表示される
- [ ] Google OAuth ログインが動作する（設定済みの場合）
- [ ] X OAuth ログインが動作する（設定済みの場合）
- [ ] ログアウトが正常に動作する
- [ ] セッション情報が Header に表示される

### 投稿機能

- [ ] ログイン後、投稿フォームが表示される
- [ ] 投稿が正常に送信できる
- [ ] 投稿後、カフェ詳細に反映される
- [ ] 投稿が時系列順に表示される

### フィルタリング機能

- [ ] 空席フィルターが動作する
- [ ] 静かさフィルターが動作する
- [ ] Wi-Fi フィルターが動作する
- [ ] 電源フィルターが動作する

### レスポンシブデザイン

- [ ] モバイル（375px）で正しく表示される
- [ ] タブレット（768px）で正しく表示される
- [ ] デスクトップ（1280px）で正しく表示される

---

## 🔧 パフォーマンステスト

### Lighthouse スコア目標

Chrome DevTools の Lighthouse で測定：

- **Performance**: 85点以上
- **Accessibility**: 90点以上
- **Best Practices**: 90点以上
- **SEO**: 90点以上

### 測定手順

1. Chrome DevTools を開く（F12）
2. 「Lighthouse」タブを選択
3. 「Performance」「Accessibility」「Best Practices」「SEO」を選択
4. 「Analyze page load」をクリック

---

## 🔄 自動デプロイ設定

Vercel は GitHub との連携により、以下の自動デプロイが設定されます：

- **Production デプロイ**: `main` ブランチへの push 時
- **Preview デプロイ**: Pull Request 作成時

### カスタム設定

`vercel.json` でカスタマイズ可能：

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

---

## 🐛 トラブルシューティング

### ビルドエラーが発生する場合

```bash
# ローカルで本番ビルドをテスト
npm run build

# TypeScript エラーをチェック
npm run type-check

# ESLint エラーをチェック
npm run lint
```

### 環境変数が反映されない場合

1. Vercel ダッシュボードで環境変数を再確認
2. 「Redeploy」で再デプロイ
3. キャッシュをクリアして再ビルド

### データベース接続エラー

1. `DATABASE_URL` が正しく設定されているか確認
2. Neon のダッシュボードでデータベースが起動しているか確認
3. SSL モード（`?sslmode=require`）が含まれているか確認

### OAuth 認証エラー

1. リダイレクト URI が正しく設定されているか確認
2. `NEXTAUTH_URL` が本番 URL と一致しているか確認
3. OAuth プロバイダーの設定を再確認

---

## 📊 監視とログ

### Vercel Analytics

Vercel ダッシュボードで以下を確認可能：

- ページビュー数
- デプロイ履歴
- ビルドログ
- エラーログ

### Runtime Logs

```bash
# Vercel CLI でリアルタイムログを確認
vercel logs
```

---

## 🔐 セキュリティチェックリスト

- [ ] すべての環境変数が Vercel Secrets として管理されている
- [ ] `.env.local` がコミットされていない（`.gitignore` に含まれている）
- [ ] `NEXTAUTH_SECRET` が強力なランダム文字列である
- [ ] OAuth リダイレクト URI が正しく設定されている
- [ ] データベース接続が SSL で暗号化されている

---

## 📚 参考リンク

- [Vercel 公式ドキュメント](https://vercel.com/docs)
- [Next.js デプロイガイド](https://nextjs.org/docs/deployment)
- [NextAuth.js デプロイガイド](https://authjs.dev/getting-started/deployment)
- [Neon Serverless Postgres](https://neon.tech/docs/introduction)

---

## 📝 メモ

### 本番 URL

- Production: https://work-cafe-finder.vercel.app
- Preview: https://work-cafe-finder-{git-branch}.vercel.app

### カスタムドメイン設定（オプション）

Vercel ダッシュボードの「Settings」→「Domains」から独自ドメインを追加可能。

---

**作成者**: Claude
**最終更新**: 2025-10-24
