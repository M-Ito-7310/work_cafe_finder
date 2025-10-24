# Phase 4: 認証機能実装

**ステータス**: 🟡 受入テスト待ち
**優先度**: High
**見積もり時間**: 60-90分
**実績時間**: 約30分
**作成日**: 2025-10-23
**開始日**: 2025-10-24
**実装完了日**: 2025-10-24
**完了日**: _____
**担当**: Claude
**コミットハッシュ**: ebf8db9

---

## 📋 Phase概要

NextAuth.jsによるソーシャルログイン機能を実装します。Google OAuthとX (Twitter) OAuthを設定し、ユーザー認証とセッション管理を完了します。

## ✅ 実装タスク

- [ ] Google Cloud ConsoleでOAuthクライアント作成（ユーザー側で設定）
- [ ] X Developer PortalでOAuthアプリケーション作成（ユーザー側で設定）
- [x] 環境変数設定（NEXTAUTH_URL, NEXTAUTH_SECRET, GOOGLE_*, TWITTER_*）
- [x] NextAuth設定（src/app/api/auth/[...nextauth]/route.ts）
- [x] DrizzleAdapterの設定
- [x] サインインページ作成（src/app/auth/signin/page.tsx）
- [x] エラーページ作成（src/app/auth/error/page.tsx）
- [x] SessionProviderラップ（src/app/layout.tsx）
- [x] Headerコンポーネント作成（ログイン/ログアウトボタン）
- [x] useSessionフック利用例作成

## 📦 成果物

- [x] src/app/api/auth/[...nextauth]/route.ts
- [x] src/app/auth/signin/page.tsx
- [x] src/app/auth/error/page.tsx
- [x] src/components/layout/Header.tsx
- [x] src/components/providers/SessionProvider.tsx
- [x] src/lib/auth/getServerSession.ts
- [ ] GoogleとX OAuthの動作する認証フロー（環境変数設定後にテスト）

## 🧪 テスト確認項目

- [ ] Googleログインが成功する
- [ ] X (Twitter)ログインが成功する
- [ ] ユーザー情報がデータベースに保存される
- [ ] セッションが正しく管理される
- [ ] ログアウトが正しく動作する
- [ ] 保護されたルートで認証チェックが動作する

## 📝 依存関係

- **前提Phase**: Phase 2（型定義）、Phase 3（データベース）
- **次のPhase**: Phase 5（API Routes）、Phase 8（投稿システム）

## 📚 参考資料

- [実装ドキュメント](../../implementation/20251023_04-authentication-setup.md)
- [NextAuth.js 公式ドキュメント](https://next-auth.js.org/)
- [Google OAuth 設定ガイド](https://console.cloud.google.com/)
- [X Developer Portal](https://developer.twitter.com/)

## 📝 メモ

### 実装完了内容
- NextAuth.js v5 (beta) を使用
- Google OAuth と X (Twitter) OAuth プロバイダーを設定
- SessionProvider をアプリケーション全体にラップ
- サインインページとエラーページを作成
- Header コンポーネントにログイン/ログアウト機能を実装
- サーバーサイドでセッションを取得するヘルパー関数を作成

### 次のステップ
1. `.env.local` に以下の環境変数を設定:
   - `NEXTAUTH_URL=http://localhost:3000`
   - `NEXTAUTH_SECRET` (openssl rand -base64 32 で生成)
   - `GOOGLE_CLIENT_ID` と `GOOGLE_CLIENT_SECRET`
   - `TWITTER_CLIENT_ID` と `TWITTER_CLIENT_SECRET`

2. Google Cloud Console で OAuth クライアントを作成:
   - リダイレクトURI: `http://localhost:3000/api/auth/callback/google`

3. X Developer Portal で OAuth アプリケーションを作成:
   - Callback URL: `http://localhost:3000/api/auth/callback/twitter`

4. localhost:3000/auth/signin にアクセスして動作確認

---

**Phase完了日**: _____
**実績時間**: _____
**レビュー**: _____
