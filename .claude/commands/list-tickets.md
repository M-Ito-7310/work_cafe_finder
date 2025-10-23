# チケット一覧表示コマンド

すべてのチケットをカテゴリごとに整理して表示します。

## 実行手順

### 1. チケットファイルの読み込み
以下のディレクトリからすべてのチケットファイルを読み込みます：
- `docs/ticket/bug/`
- `docs/ticket/feature/`
- `docs/ticket/enhancement/`
- `docs/ticket/initial/`

### 2. カテゴリ別に整理
各カテゴリごとにチケットをステータス別に分類します：
- 🔴 Unstarted
- 🟡 In Progress
- 🟢 Complete
- 🔵 Review
- ⚫ Blocked

### 3. 表示フォーマット

```markdown
# 📋 Work Cafe Finder - チケット一覧

## 🐛 Bug チケット (X件)

### 🟡 In Progress (X件)
- [bug-001-map-display-slow.md](docs/ticket/bug/bug-001-map-display-slow.md) - 地図の表示が遅い [High]
  - 作成: 2025-10-23 | 開始: 2025-10-23

### 🔴 Unstarted (X件)
- [bug-002-auth-error.md](docs/ticket/bug/bug-002-auth-error.md) - 認証エラーが発生する [Critical]
  - 作成: 2025-10-23

### 🟢 Complete (X件)
- [bug-003-marker-color.md](docs/ticket/bug/bug-003-marker-color.md) - マーカーの色が正しく表示されない [Medium]
  - 作成: 2025-10-20 | 完了: 2025-10-21 | 所要時間: 1時間

---

## ✨ Feature チケット (X件)

### 🟡 In Progress (X件)
- [feature-001-favorite-cafe.md](docs/ticket/feature/feature-001-favorite-cafe.md) - お気に入りカフェ機能 [High]
  - 作成: 2025-10-23 | 開始: 2025-10-23

### 🔴 Unstarted (X件)
- [feature-002-photo-upload.md](docs/ticket/feature/feature-002-photo-upload.md) - 写真アップロード機能 [Medium]
  - 作成: 2025-10-23

### 🟢 Complete (X件)
- [feature-003-filter-system.md](docs/ticket/feature/feature-003-filter-system.md) - フィルタリングシステム [High]
  - 作成: 2025-10-21 | 完了: 2025-10-22 | 所要時間: 3時間

---

## 🔧 Enhancement チケット (X件)

### 🟡 In Progress (X件)
- [enhancement-001-map-performance.md](docs/ticket/enhancement/enhancement-001-map-performance.md) - 地図パフォーマンスの最適化 [Performance]
  - 作成: 2025-10-23 | 開始: 2025-10-23

### 🔴 Unstarted (X件)
- [enhancement-002-ui-polish.md](docs/ticket/enhancement/enhancement-002-ui-polish.md) - UI の見た目を改善 [UX]
  - 作成: 2025-10-23

### 🟢 Complete (X件)
- [enhancement-003-code-refactor.md](docs/ticket/enhancement/enhancement-003-code-refactor.md) - コードリファクタリング [Refactoring]
  - 作成: 2025-10-20 | 完了: 2025-10-21 | 所要時間: 2時間

---

## 🚀 Initial Phase チケット (X件)

### 🟡 In Progress (X件)
- [phase-03-map-infrastructure.md](docs/ticket/initial/phase-03-map-infrastructure.md) - Phase 3: 地図インフラストラクチャ
  - 予定時間: 2-3日 | 開始: 2025-10-23

### 🔴 Unstarted (X件)
- [phase-04-reporting.md](docs/ticket/initial/phase-04-reporting.md) - Phase 4: カフェ詳細とレポート機能
  - 予定時間: 2-3日

### 🟢 Complete (X件)
- [phase-01-foundation.md](docs/ticket/initial/phase-01-foundation.md) - Phase 1: 基盤セットアップ
  - 予定時間: 1-2日 | 実績: 1日 | 完了: 2025-10-22
- [phase-02-authentication.md](docs/ticket/initial/phase-02-authentication.md) - Phase 2: 認証システム
  - 予定時間: 1-2日 | 実績: 1.5日 | 完了: 2025-10-23

---

## 📊 サマリー
- **総チケット数**: XX件
- **進行中**: XX件
- **未着手**: XX件
- **完了**: XX件
- **レビュー待ち**: XX件
- **ブロック中**: XX件
```

### 4. 統計情報の計算
- 各カテゴリの総数
- ステータス別の集計
- 完了率の計算

### 5. ソート順
各カテゴリ内では以下の順序で表示：
1. ステータス順: In Progress → Unstarted → Complete → Review → Blocked
2. 優先度順（Bug, Feature）: Critical/High → Medium → Low
3. カテゴリ順（Enhancement）: Performance → Security → UX → Refactoring → Code Quality
4. 作成日順: 新しい順

## 重要事項
- すべてのチケットファイルを読み込むこと
- PROGRESS.md の情報と整合性を確認すること
- リンクは相対パスで記載すること
- ステータス絵文字は統一すること
