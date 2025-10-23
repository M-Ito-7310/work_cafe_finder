# Phase 2: 型定義とユーティリティ

**ステータス**: 🔴 未着手
**優先度**: Critical
**見積もり時間**: 30-45分
**実績時間**: _____
**作成日**: 2025-10-23
**完了日**: _____
**担当**: _____

---

## 📋 Phase概要

TypeScript型システムの構築と共通ユーティリティ関数の実装を行います。このPhaseでは、アプリケーション全体で使用する型定義と、鮮度判定・位置情報計算などのユーティリティ関数を作成します。

## ✅ 実装タスク

- [ ] Cafe型定義（src/types/cafe.ts）
- [ ] Report型定義（src/types/report.ts）
- [ ] User型定義（src/types/user.ts）
- [ ] API Response型定義（src/types/api.ts）
- [ ] 型のエクスポート（src/types/index.ts）
- [ ] 鮮度判定ユーティリティ（src/lib/utils/freshness.ts）
- [ ] 位置情報ユーティリティ（src/lib/utils/geolocation.ts）
- [ ] classname utility（src/lib/utils/cn.ts）
- [ ] 定数定義（src/lib/constants.ts）

## 📦 成果物

- [ ] src/types/cafe.ts
- [ ] src/types/report.ts
- [ ] src/types/user.ts
- [ ] src/types/api.ts
- [ ] src/types/index.ts
- [ ] src/lib/utils/freshness.ts
- [ ] src/lib/utils/geolocation.ts
- [ ] src/lib/utils/cn.ts
- [ ] src/lib/constants.ts

## 🧪 テスト確認項目

- [ ] TypeScript型チェックが成功する
- [ ] すべての型定義がエクスポートされている
- [ ] ユーティリティ関数が正しく動作する
- [ ] 鮮度判定ロジックが正しい（fresh/stale/expired）

## 📝 依存関係

- **前提Phase**: Phase 1（プロジェクトセットアップ）
- **次のPhase**: Phase 4（認証）、Phase 5（API Routes）、Phase 6（地図統合）

## 📚 参考資料

- [実装ドキュメント](../../implementation/20251023_02-type-definitions.md)
- [TypeScript 公式ドキュメント](https://www.typescriptlang.org/docs/)

## 📝 メモ

{実装時のメモや問題点を記載}

---

**Phase完了日**: _____
**実績時間**: _____
**レビュー**: _____
