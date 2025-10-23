# 🚀 Initial Phase チケット

初期プレリリースまでの実装を9つのPhaseに分けて管理します。

## Phase 一覧

| Phase | タイトル | 予定時間 | ステータス |
|-------|---------|---------|-----------|
| 1 | 基盤セットアップ | 1-2日 | 🔴 未着手 |
| 2 | 認証システム | 1-2日 | 🔴 未着手 |
| 3 | 地図インフラストラクチャ | 2-3日 | 🔴 未着手 |
| 4 | カフェ詳細とレポート機能 | 2-3日 | 🔴 未着手 |
| 5 | フィルタリングとUI改善 | 1-2日 | 🔴 未着手 |
| 6 | ランディングページとナビゲーション | 1日 | 🔴 未着手 |
| 7 | テストと品質保証 | 1-2日 | 🔴 未着手 |
| 8 | デプロイ設定 | 1日 | 🔴 未着手 |
| 9 | デモ準備とローンチ | 1-2日 | 🔴 未着手 |

**総予定時間**: 11-18日

## マイルストーン

### Milestone 1: Foundation (Phases 1-2)
プロジェクトの基盤とセキュリティを確立
- Phase 1: データベース、プロジェクト構造
- Phase 2: NextAuth.js、OAuth 認証

### Milestone 2: Core Features (Phases 3-5)
主要機能の実装
- Phase 3: Leaflet 地図、マーカー表示
- Phase 4: カフェ情報、レポートシステム
- Phase 5: フィルタリング、UI/UX

### Milestone 3: Polish & Testing (Phases 6-7)
品質向上とテスト
- Phase 6: ランディングページ、ナビゲーション
- Phase 7: テスト、バグ修正

### Milestone 4: Deployment (Phases 8-9)
本番環境へのデプロイ
- Phase 8: Vercel デプロイ、環境設定
- Phase 9: デモデータ、ローンチ

## Phase 実行ルール

### 開始前
1. 依存する Phase がすべて完了していること
2. 進行中の Phase がないこと
3. Phase チケットを読んで内容を理解すること

### 実行中
1. チケットに記載されたタスクをすべて実行すること
2. TypeScript と ESLint のエラーがないこと
3. 実装完了後、必ず localhost で動作確認すること

### 完了時
1. すべてのタスクがチェック済みであること
2. 受入基準をすべて満たしていること
3. localhost での動作確認が完了していること
4. 2回の Git コミット（実装、チケット更新）を実行すること

## コマンド

### Phase を開始
```bash
/start-phase [番号]
```

### 次の Phase を自動開始
```bash
/next-phase
```

### 進捗を確認
```bash
/check-progress
```

## ファイル命名規則
```
phase-[番号2桁]-[英語タイトル].md
```

例: `phase-01-foundation-setup.md`

## ステータス
- 🔴 Unstarted: 未着手
- 🟡 In Progress: 進行中
- 🟢 Complete: 完了

## 進捗確認
詳細な進捗は [PROGRESS.md](./PROGRESS.md) を参照してください。
