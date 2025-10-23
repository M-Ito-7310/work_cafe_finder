# Phase 11: Vercelデプロイ

**ステータス**: 🔴 未着手
**優先度**: High
**見積もり時間**: 30-45分
**実績時間**: _____
**作成日**: 2025-10-23
**完了日**: _____
**担当**: _____

---

## 📋 Phase概要

Vercelへのデプロイを行い、本番環境で動作するアプリケーションを公開します。環境変数の設定、自動デプロイの設定、動作確認を完了します。

## ✅ 実装タスク

- [ ] Vercelアカウント作成（未作成の場合）
- [ ] GitHubリポジトリとの連携
- [ ] Vercelプロジェクト作成
- [ ] 環境変数設定
  - [ ] DATABASE_URL
  - [ ] NEXTAUTH_URL
  - [ ] NEXTAUTH_SECRET
  - [ ] GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
  - [ ] TWITTER_CLIENT_ID / TWITTER_CLIENT_SECRET
  - [ ] その他環境変数
- [ ] Google OAuth Redirect URIの更新（本番URL追加）
- [ ] X OAuth Callback URLの更新（本番URL追加）
- [ ] 初回デプロイ実行
- [ ] デモ用シードデータ投入（交流会会場周辺のカフェ）
- [ ] 動作確認
  - [ ] トップページ表示確認
  - [ ] 地図表示確認
  - [ ] ログイン動作確認
  - [ ] カフェ情報表示確認
  - [ ] 投稿機能確認
  - [ ] フィルタリング動作確認
- [ ] パフォーマンステスト（Lighthouse）
- [ ] 自動デプロイ設定確認（mainブランチへのpush時）

## 📦 成果物

- [ ] 本番環境で動作するアプリケーション
- [ ] 公開URL（https://work-cafe-finder.vercel.app）
- [ ] 自動デプロイ設定
- [ ] デモ用データ

## 🧪 テスト確認項目

- [ ] 本番URLでアプリケーションが表示される
- [ ] すべての機能が本番環境で動作する
- [ ] Google OAuth認証が動作する
- [ ] X OAuth認証が動作する
- [ ] データベース接続が動作する
- [ ] 地図が正しく表示される
- [ ] カフェマーカーが表示される
- [ ] 投稿が正しく保存される
- [ ] フィルタリングが動作する
- [ ] モバイルで正しく表示される
- [ ] Lighthouse Performance 85点以上
- [ ] Lighthouse Accessibility 90点以上

## 📝 依存関係

- **前提Phase**: Phase 10（UI/UXポリッシュ）
- **次のPhase**: なし（最終Phase）

## 📚 参考資料

- [実装ドキュメント](../../implementation/20251023_11-vercel-deployment.md)
- [Vercel 公式ドキュメント](https://vercel.com/docs)
- [Next.js デプロイガイド](https://nextjs.org/docs/deployment)

## 📝 メモ

{実装時のメモや問題点を記載}

### 本番URL
- Production: https://work-cafe-finder.vercel.app
- Preview: https://work-cafe-finder-*.vercel.app

### デプロイ完了チェックリスト
- [ ] トップページ動作確認
- [ ] 地図表示確認
- [ ] 認証動作確認
- [ ] 投稿機能確認
- [ ] パフォーマンス確認

---

**Phase完了日**: _____
**実績時間**: _____
**レビュー**: _____
