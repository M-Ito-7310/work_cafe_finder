# Phase 3: データベース構築

**ステータス**: 🔴 未着手
**優先度**: Critical
**見積もり時間**: 45-60分
**実績時間**: _____
**作成日**: 2025-10-23
**完了日**: _____
**担当**: _____

---

## 📋 Phase概要

Neon PostgreSQLとDrizzle ORMの設定を行います。データベーススキーマの定義、マイグレーション、シードデータの投入を完了します。

## ✅ 実装タスク

- [ ] Neonアカウント作成とデータベース作成
- [ ] DATABASE_URLを.env.localに設定
- [ ] Drizzle ORMスキーマ定義（src/lib/db/schema.ts）
  - [ ] usersテーブル
  - [ ] cafesテーブル
  - [ ] reportsテーブル
  - [ ] NextAuth関連テーブル（accounts, sessions, verification_tokens）
  - [ ] リレーションシップ定義
- [ ] Neon接続設定（src/lib/db/index.ts）
- [ ] データベースクエリ関数（src/lib/db/queries.ts）
- [ ] マイグレーション生成・実行
- [ ] シードデータ投入（東京駅周辺のカフェ5-10件）

## 📦 成果物

- [ ] src/lib/db/index.ts
- [ ] src/lib/db/schema.ts
- [ ] src/lib/db/queries.ts
- [ ] drizzle/（マイグレーションファイル）
- [ ] Neon PostgreSQLデータベース（users, cafes, reportsテーブル）

## 🧪 テスト確認項目

- [ ] データベース接続が成功する
- [ ] すべてのテーブルが作成されている
- [ ] シードデータが投入されている
- [ ] Drizzle Studioでデータを確認できる（`npm run db:studio`）
- [ ] CRUD操作のテストが成功する

## 📝 依存関係

- **前提Phase**: Phase 1（プロジェクトセットアップ）
- **次のPhase**: Phase 4（認証）、Phase 5（API Routes）

## 📚 参考資料

- [実装ドキュメント](../../implementation/20251023_03-database-foundation.md)
- [Drizzle ORM 公式ドキュメント](https://orm.drizzle.team/)
- [Neon PostgreSQL](https://neon.tech/)

## 📝 メモ

{実装時のメモや問題点を記載}

---

**Phase完了日**: _____
**実績時間**: _____
**レビュー**: _____
