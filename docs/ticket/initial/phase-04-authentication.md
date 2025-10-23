# Phase 4: 認証機能実装

**ステータス**: 🔴 未着手
**優先度**: High
**見積もり時間**: 60-90分
**実績時間**: _____
**作成日**: 2025-10-23
**完了日**: _____
**担当**: _____

---

## 📋 Phase概要

NextAuth.jsによるソーシャルログイン機能を実装します。Google OAuthとX (Twitter) OAuthを設定し、ユーザー認証とセッション管理を完了します。

## ✅ 実装タスク

- [ ] Google Cloud ConsoleでOAuthクライアント作成
- [ ] X Developer PortalでOAuthアプリケーション作成
- [ ] 環境変数設定（NEXTAUTH_URL, NEXTAUTH_SECRET, GOOGLE_*, TWITTER_*）
- [ ] NextAuth設定（src/app/api/auth/[...nextauth]/route.ts）
- [ ] DrizzleAdapterの設定
- [ ] サインインページ作成（src/app/auth/signin/page.tsx）
- [ ] エラーページ作成（src/app/auth/error/page.tsx）
- [ ] SessionProviderラップ（src/app/layout.tsx）
- [ ] Headerコンポーネント作成（ログイン/ログアウトボタン）
- [ ] useSessionフック利用例作成

## 📦 成果物

- [ ] src/app/api/auth/[...nextauth]/route.ts
- [ ] src/app/auth/signin/page.tsx
- [ ] src/app/auth/error/page.tsx
- [ ] src/components/layout/Header.tsx
- [ ] GoogleとX OAuthの動作する認証フロー

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

{実装時のメモや問題点を記載}

---

**Phase完了日**: _____
**実績時間**: _____
**レビュー**: _____
