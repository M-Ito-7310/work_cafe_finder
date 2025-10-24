# Phase 6: 地図統合

**ステータス**: 🟡 進行中（受入テスト待ち）
**優先度**: High
**見積もり時間**: 90-120分
**実績時間**: 約40分
**作成日**: 2025-10-23
**開始日**: 2025-10-24
**実装完了日**: 2025-10-24
**完了日**: _____
**担当**: Claude
**コミットハッシュ**: 33ac32a

---

## 📋 Phase概要

Leaflet + OpenStreetMapの統合を行います。地図表示、現在地取得、地図移動イベントハンドリング、デバウンス処理、SSR無効化を実装します。

## ✅ 実装タスク

- [x] Leaflet CSS読み込み（globals.css）
- [x] MapViewコンポーネント実装
- [x] CurrentLocationMarkerコンポーネント実装
- [x] 現在地取得（GPS）実装
- [x] 地図移動イベントハンドリング
- [x] デバウンス処理実装
- [x] dynamic import設定（SSR無効化）
- [x] RecenterButton実装（現在地に戻る）
- [x] エラーハンドリング（位置情報許可なし等）

## 📦 成果物

- [x] src/components/map/MapView.tsx
- [x] src/components/map/CurrentLocationMarker.tsx
- [x] src/components/map/RecenterButton.tsx
- [x] src/lib/utils/leafletConfig.ts
- [x] src/app/map/page.tsx
- [x] 動作する地図表示

## 🧪 テスト確認項目

- [ ] 地図が正しく表示される
- [ ] 現在地が取得できる
- [ ] 現在地マーカーが表示される
- [ ] 地図を移動できる
- [ ] ズーム操作ができる
- [ ] 現在地ボタンが動作する
- [ ] 位置情報許可なしでもデフォルト位置（東京駅）が表示される

## 📝 依存関係

- **前提Phase**: Phase 2（型定義）、Phase 5（API Routes）
- **次のPhase**: Phase 7（カフェ表示）

## 📚 参考資料

- [実装ドキュメント](../../implementation/20251023_06-map-integration.md)
- [Leaflet 公式ドキュメント](https://leafletjs.com/)
- [react-leaflet](https://react-leaflet.js.org/)

## 📝 メモ

### 実装完了事項
- Leaflet + OpenStreetMapの統合完了
- 地図表示、現在地取得、地図移動イベント処理を実装
- デバウンス処理により、地図移動後500msでAPI呼び出し
- SSR無効化（dynamic import）により、クライアントサイドでのみ地図を読み込み
- TypeScriptエラーなし、ESLintエラーなし

### 次のPhase
Phase 7でカフェマーカー表示機能を実装予定

---

**Phase実装完了日**: 2025-10-24
**実績時間**: 約40分
**受入テスト**: 保留中（ユーザーによるlocalhost動作確認待ち）
