# Phase 5: API Routes実装

**ステータス**: 🟡 進行中
**優先度**: High
**見積もり時間**: 60-90分
**実績時間**: _____
**作成日**: 2025-10-23
**開始日**: 2025-10-24
**完了日**: _____
**担当**: _____

---

## 📋 Phase概要

カフェ情報と投稿のCRUD APIを実装します。地図範囲内のカフェ取得、カフェ詳細取得、投稿作成・取得のAPIエンドポイントを作成します。

## ✅ 実装タスク

- [x] GET /api/cafes - カフェ一覧取得（地図範囲指定、フィルタリング対応）
- [x] GET /api/cafes/[id] - カフェ詳細取得（投稿履歴含む）
- [x] POST /api/reports - 投稿作成（認証必須）
- [x] GET /api/reports - 投稿一覧取得
- [x] GET /api/reports/[id] - 投稿詳細取得（GET /api/reportsに統合）
- [x] エラーハンドリング実装
- [x] Zodバリデーション実装
- [x] レスポンス型定義

## 📦 成果物

- [x] src/app/api/cafes/route.ts
- [x] src/app/api/cafes/[id]/route.ts
- [x] src/app/api/reports/route.ts
- [x] src/lib/validations/report.ts
- [x] src/lib/api/errorHandler.ts
- [x] src/lib/api/client.ts
- [ ] すべてのAPIが正しく動作する（受入テストで確認）

## 🧪 テスト確認項目

- [ ] GET /api/cafes でカフェ一覧が取得できる
- [ ] フィルタリングパラメータが正しく動作する
- [ ] GET /api/cafes/[id] でカフェ詳細が取得できる
- [ ] POST /api/reports で投稿が作成できる（認証済み）
- [ ] 未認証時に401エラーが返る
- [ ] バリデーションエラーが正しく返る

## 📝 依存関係

- **前提Phase**: Phase 2（型定義）、Phase 3（データベース）、Phase 4（認証）
- **次のPhase**: Phase 6（地図統合）、Phase 7（カフェ表示）

## 📚 参考資料

- [実装ドキュメント](../../implementation/20251023_05-api-routes.md)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Zod](https://zod.dev/)

## 📝 メモ

実装完了：
- Zodバリデーションスキーマの作成
- GET /api/cafes - カフェ一覧取得API実装
- GET /api/cafes/[id] - カフェ詳細取得API実装
- POST /api/reports - 投稿作成API実装（認証必須）
- GET /api/reports - 投稿一覧取得API実装
- エラーハンドリングミドルウェアの作成
- APIクライアントの作成
- TypeScript/ESLintエラー修正

コミットハッシュ: 09efed9

次のステップ：
- localhost での API 動作確認が必要
- Phase 6（地図統合）で API を利用予定

---

**Phase完了日**: 2025-10-24（実装完了、受入テスト待ち）
**実績時間**: 約30分
**レビュー**: _____
