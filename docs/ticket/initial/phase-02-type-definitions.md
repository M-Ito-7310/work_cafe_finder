# Phase 2: 型定義とユーティリティ

**ステータス**: 🟡 進行中
**優先度**: Critical
**見積もり時間**: 30-45分
**実績時間**: _____
**作成日**: 2025-10-23
**開始日**: 2025-10-23
**完了日**: _____
**担当**: Claude

---

## 📋 Phase概要

TypeScript型システムの構築と共通ユーティリティ関数の実装を行います。このPhaseでは、アプリケーション全体で使用する型定義と、鮮度判定・位置情報計算などのユーティリティ関数を作成します。

## ✅ 実装タスク

- [x] Cafe型定義（src/types/cafe.ts）
- [x] Report型定義（src/types/report.ts）
- [x] User型定義（src/types/user.ts）
- [x] API Response型定義（src/types/api.ts）
- [x] 型のエクスポート（src/types/index.ts）
- [x] 鮮度判定ユーティリティ（src/lib/utils/freshness.ts）
- [x] 位置情報ユーティリティ（src/lib/utils/geolocation.ts）
- [x] classname utility（src/lib/utils/cn.ts）
- [x] 定数定義（src/lib/constants.ts）

## 📦 成果物

- [x] src/types/cafe.ts
- [x] src/types/report.ts
- [x] src/types/user.ts
- [x] src/types/api.ts
- [x] src/types/index.ts
- [x] src/lib/utils/freshness.ts
- [x] src/lib/utils/geolocation.ts
- [x] src/lib/utils/cn.ts
- [x] src/lib/constants.ts

## 🧪 テスト確認項目

- [x] TypeScript型チェックが成功する
- [x] すべての型定義がエクスポートされている
- [x] ユーティリティ関数が正しく動作する
- [x] 鮮度判定ロジックが正しい（fresh/stale/expired）

## 📝 依存関係

- **前提Phase**: Phase 1（プロジェクトセットアップ）
- **次のPhase**: Phase 4（認証）、Phase 5（API Routes）、Phase 6（地図統合）

## 📚 参考資料

- [実装ドキュメント](../../implementation/20251023_02-type-definitions.md)
- [TypeScript 公式ドキュメント](https://www.typescriptlang.org/docs/)

## 📝 メモ

- すべての型定義とユーティリティを実装完了
- TypeScript型チェック成功
- ビルド成功（ESLint警告1件: any型使用は仕様通り）
- コミット: bed48c4

---

**Phase完了日**: 2025-10-23
**実績時間**: 約30分
**レビュー**: すべてのタスクを完了、受入テスト待ち
