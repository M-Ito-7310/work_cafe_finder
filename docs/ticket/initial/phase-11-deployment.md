# Phase 11: Vercelデプロイ

**ステータス**: 🟡 In Progress
**優先度**: High
**見積もり時間**: 30-45分
**実績時間**: _____
**作成日**: 2025-10-23
**開始日**: 2025-10-24
**完了日**: _____
**担当**: Claude

---

## 📋 Phase概要

Vercelへのデプロイを行い、本番環境で動作するアプリケーションを公開します。環境変数の設定、自動デプロイの設定、動作確認を完了します。

## ✅ 実装タスク

- [x] .env.example ファイル作成
- [x] vercel.json 設定ファイル作成
- [x] デプロイガイドドキュメント作成
- [x] デモ用シードデータスクリプト作成（渋谷エリア8店舗）
- [x] NextAuth設定の分離（auth.ts）
- [x] production build動作確認
- [ ] Vercelアカウント作成（ユーザー側で実施）
- [ ] GitHubリポジトリとの連携（ユーザー側で実施）
- [ ] Vercelプロジェクト作成（ユーザー側で実施）
- [ ] 環境変数設定（ユーザー側で実施）
  - [ ] DATABASE_URL
  - [ ] NEXTAUTH_URL
  - [ ] NEXTAUTH_SECRET
  - [ ] GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET（オプション）
  - [ ] TWITTER_CLIENT_ID / TWITTER_CLIENT_SECRET（オプション）
- [ ] Google OAuth Redirect URIの更新（本番URL追加）
- [ ] X OAuth Callback URLの更新（本番URL追加）
- [ ] 初回デプロイ実行（ユーザー側で実施）
- [ ] デモ用シードデータ投入（本番環境）
- [ ] 動作確認（本番環境）
  - [ ] トップページ表示確認
  - [ ] 地図表示確認
  - [ ] ログイン動作確認
  - [ ] カフェ情報表示確認
  - [ ] 投稿機能確認
  - [ ] フィルタリング動作確認
- [ ] パフォーマンステスト（Lighthouse）
- [ ] 自動デプロイ設定確認（mainブランチへのpush時）

## 📦 成果物

- [x] .env.example ファイル
- [x] vercel.json 設定ファイル
- [x] デプロイガイドドキュメント（docs/implementation/20251023_11-vercel-deployment.md）
- [x] デモ用シードデータスクリプト（scripts/seed-demo.ts）
- [x] NextAuth設定ファイル（src/lib/auth.ts）
- [ ] 本番環境で動作するアプリケーション（ユーザー側で実施）
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

### 実装完了内容

1. **デプロイ準備ファイル作成完了**
   - `.env.example`: 環境変数テンプレート
   - `vercel.json`: Vercel設定ファイル
   - `docs/implementation/20251023_11-vercel-deployment.md`: 詳細デプロイガイド
   - `scripts/seed-demo.ts`: デモ用シードデータ（渋谷エリア8店舗 + サンプル投稿6件）

2. **技術的な修正**
   - NextAuth設定を`src/lib/auth.ts`に分離（ルートハンドラの型エラー修正）
   - `tsconfig.json`を更新（scriptsディレクトリを除外）
   - production buildの動作確認完了（警告のみ、ビルド成功）

3. **残りのタスク（ユーザー側で実施）**
   - Vercelアカウント作成とプロジェクト連携
   - 環境変数の設定
   - OAuth設定の更新
   - 初回デプロイと動作確認
   - パフォーマンステスト

### ビルド結果
- TypeScript型チェック: ✅ 成功
- ESLint: ⚠️ 警告あり（非クリティカル）
- Production Build: ✅ 成功

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
