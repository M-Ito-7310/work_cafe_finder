# Phase 3: データベース構築

**ステータス**: 🟡 進行中
**優先度**: Critical
**見積もり時間**: 45-60分
**実績時間**: _____
**作成日**: 2025-10-23
**開始日**: 2025-10-24
**完了日**: _____
**担当**: Claude

---

## 📋 Phase概要

Neon PostgreSQLとDrizzle ORMの設定を行います。データベーススキーマの定義、マイグレーション、シードデータの投入を完了します。

## ✅ 実装タスク

- [x] Neonアカウント作成とデータベース作成
- [x] DATABASE_URLを.env.localに設定
- [x] Drizzle ORMスキーマ定義（src/lib/db/schema.ts）
  - [x] usersテーブル
  - [x] cafesテーブル
  - [x] reportsテーブル
  - [x] NextAuth関連テーブル（accounts, sessions, verification_tokens）
  - [x] リレーションシップ定義
- [x] Neon接続設定（src/lib/db/index.ts）
- [x] データベースクエリ関数（src/lib/db/queries.ts）
- [x] マイグレーション生成・実行
- [x] シードデータ投入（東京駅周辺のカフェ5件）

## 📦 成果物

- [x] src/lib/db/index.ts
- [x] src/lib/db/schema.ts
- [x] src/lib/db/queries.ts
- [x] drizzle/（マイグレーションファイル）
- [x] Neon PostgreSQLデータベース（users, cafes, reportsテーブル）
- [x] scripts/seed.ts

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

- Neon PostgreSQL データベース作成完了
- DATABASE_URL を .env.local に設定
- Drizzle ORM スキーマ定義完了（users, cafes, reports, NextAuth テーブル）
- マイグレーション生成・実行完了
- シードデータ投入完了（東京駅周辺のカフェ5件）
- dotenv パッケージ追加

コミットハッシュ: c25e83f

---

**Phase完了日**: 2025-10-24
**実績時間**: 約45分
**レビュー**: 受入テスト待ち
