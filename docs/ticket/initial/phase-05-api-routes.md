# Phase 5: API Routes実装

**ステータス**: 🔴 未着手
**優先度**: High
**見積もり時間**: 60-90分
**実績時間**: _____
**作成日**: 2025-10-23
**完了日**: _____
**担当**: _____

---

## 📋 Phase概要

カフェ情報と投稿のCRUD APIを実装します。地図範囲内のカフェ取得、カフェ詳細取得、投稿作成・取得のAPIエンドポイントを作成します。

## ✅ 実装タスク

- [ ] GET /api/cafes - カフェ一覧取得（地図範囲指定、フィルタリング対応）
- [ ] GET /api/cafes/[id] - カフェ詳細取得（投稿履歴含む）
- [ ] POST /api/reports - 投稿作成（認証必須）
- [ ] GET /api/reports - 投稿一覧取得
- [ ] GET /api/reports/[id] - 投稿詳細取得
- [ ] エラーハンドリング実装
- [ ] Zodバリデーション実装
- [ ] レスポンス型定義

## 📦 成果物

- [ ] src/app/api/cafes/route.ts
- [ ] src/app/api/cafes/[id]/route.ts
- [ ] src/app/api/reports/route.ts
- [ ] src/app/api/reports/[id]/route.ts
- [ ] すべてのAPIが正しく動作する

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

{実装時のメモや問題点を記載}

---

**Phase完了日**: _____
**実績時間**: _____
**レビュー**: _____
