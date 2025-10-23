# Phase 6: 地図統合

**ステータス**: 🔴 未着手
**優先度**: High
**見積もり時間**: 90-120分
**実績時間**: _____
**作成日**: 2025-10-23
**完了日**: _____
**担当**: _____

---

## 📋 Phase概要

Leaflet + OpenStreetMapの統合を行います。地図表示、現在地取得、地図移動イベントハンドリング、デバウンス処理、SSR無効化を実装します。

## ✅ 実装タスク

- [ ] Leaflet CSS読み込み（globals.css）
- [ ] MapViewコンポーネント実装
- [ ] CurrentLocationMarkerコンポーネント実装
- [ ] 現在地取得（GPS）実装
- [ ] 地図移動イベントハンドリング
- [ ] デバウンス処理実装
- [ ] dynamic import設定（SSR無効化）
- [ ] RecenterButton実装（現在地に戻る）
- [ ] エラーハンドリング（位置情報許可なし等）

## 📦 成果物

- [ ] src/components/map/MapView.tsx
- [ ] src/components/map/CurrentLocationMarker.tsx
- [ ] src/components/map/RecenterButton.tsx
- [ ] src/app/map/page.tsx
- [ ] 動作する地図表示

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

{実装時のメモや問題点を記載}

---

**Phase完了日**: _____
**実績時間**: _____
**レビュー**: _____
