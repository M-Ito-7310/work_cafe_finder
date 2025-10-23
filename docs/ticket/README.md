# Work Cafe Finder チケット管理システム

WorkCafeFinderプロジェクトの開発進捗を体系的に管理するためのチケット管理システムです。Claude Codeのスラッシュコマンドと連携し、効率的な開発ワークフローを実現します。

## 目次

- [システム概要](#システム概要)
- [ディレクトリ構造](#ディレクトリ構造)
- [チケットカテゴリ](#チケットカテゴリ)
- [スラッシュコマンド](#スラッシュコマンド)
- [ワークフロー](#ワークフロー)
- [使い方](#使い方)
- [ベストプラクティス](#ベストプラクティス)

---

## システム概要

このチケット管理システムは、プロジェクトの開発タスクを4つのカテゴリに分類して管理します：

1. **Initial Phases** - プロジェクト初期構築フェーズ（Phase 1-11）
2. **Bug** - バグ修正チケット
3. **Feature** - 新機能追加チケット
4. **Enhancement** - 既存機能の改善・最適化チケット

各カテゴリは独立した進捗管理を持ち、Claude Codeのスラッシュコマンドで簡単に操作できます。

### 主な特徴

- **体系的な管理**: カテゴリ別に整理されたチケットファイル
- **自動化されたワークフロー**: スラッシュコマンドによる効率的な操作
- **進捗の可視化**: PROGRESS.mdによるリアルタイム進捗確認
- **Git連携**: 実装とチケット更新の2段階コミット
- **テンプレート**: 各カテゴリ専用のチケットテンプレート

---

## ディレクトリ構造

```
docs/ticket/
├── README.md                    # このファイル（マスターREADME）
│
├── initial/                     # 初期構築Phaseチケット（Phase 1-11）
│   ├── README.md               # Initial Phaseガイド
│   ├── PROGRESS.md             # Phase進捗管理
│   ├── phase-01-project-setup.md
│   ├── phase-02-type-definitions.md
│   ├── phase-03-database.md
│   ├── phase-04-authentication.md
│   ├── phase-05-api-routes.md
│   ├── phase-06-map-integration.md
│   ├── phase-07-cafe-display.md
│   ├── phase-08-report-system.md
│   ├── phase-09-filtering.md
│   ├── phase-10-ui-polish.md
│   └── phase-11-deployment.md
│
├── bug/                        # バグ修正チケット
│   ├── README.md              # Bugカテゴリガイド
│   ├── PROGRESS.md            # Bug進捗管理
│   └── bug-{番号}-{説明}.md  # 個別Bugチケット
│
├── feature/                    # 機能追加チケット
│   ├── README.md              # Featureカテゴリガイド
│   ├── PROGRESS.md            # Feature進捗管理
│   └── feature-{番号}-{説明}.md  # 個別Featureチケット
│
└── enhancement/                # 改善チケット
    ├── README.md              # Enhancementカテゴリガイド
    ├── PROGRESS.md            # Enhancement進捗管理
    └── enhancement-{番号}-{説明}.md  # 個別Enhancementチケット
```

---

## チケットカテゴリ

### 1. Initial Phases（初期構築フェーズ）

**ディレクトリ**: `docs/ticket/initial/`

プロジェクトの初期構築時に使用するPhase 1-11のチケットです。各Phaseは順序立てて実装され、依存関係を持ちます。

#### Phase一覧

| Phase | タイトル | 予定時間 | 説明 |
|-------|---------|---------|------|
| 1 | プロジェクトセットアップ | 30-45分 | Next.js初期化、依存パッケージインストール |
| 2 | 型定義 | 1-2時間 | TypeScript型定義、Zodスキーマ |
| 3 | データベース | 2-3時間 | Drizzle ORM、Neon DB設定、スキーマ定義 |
| 4 | 認証システム | 2-3時間 | NextAuth.js、Google OAuth |
| 5 | APIルート | 2-3時間 | カフェAPI、レポートAPI |
| 6 | 地図統合 | 3-4時間 | Leaflet地図、マーカー表示 |
| 7 | カフェ表示 | 2-3時間 | カフェ詳細、リスト表示 |
| 8 | レポートシステム | 2-3時間 | レポート投稿、鮮度計算 |
| 9 | フィルタリング | 2-3時間 | 検索、フィルター機能 |
| 10 | UI仕上げ | 2-3時間 | レスポンシブ、UX改善 |
| 11 | デプロイ | 1-2時間 | Vercelデプロイ、環境設定 |

#### 特徴

- **順序性**: Phase 1から順番に実装する必要がある
- **依存関係**: 各Phaseは前のPhaseの完了が前提
- **マイルストーン**: 4つのマイルストーンに分類
- **詳細ガイド**: 各Phaseに実装タスク、テスト項目、受入基準を記載

#### 関連コマンド

- `/start-phase [番号]` - 指定Phaseを開始
- `/next-phase` - 次のPhaseを自動開始
- `/check-progress` - Phase進捗確認

---

### 2. Bug（バグ修正）

**ディレクトリ**: `docs/ticket/bug/`

本番環境や開発中に発見されたバグの修正を管理します。

#### 優先度レベル

- **Critical（緊急）**: システムダウン、データ損失、セキュリティ脆弱性
- **High（高）**: 主要機能の動作不良、認証エラー
- **Medium（中）**: 一部機能の不具合（回避策あり）
- **Low（低）**: マイナーな問題、UI表示崩れ

#### 命名規則

```
bug-[3桁番号]-[説明].md
```

例：
- `bug-001-map-rendering-error.md`
- `bug-002-login-validation-issue.md`
- `bug-003-search-filter-crash.md`

#### チケット構造

```markdown
# Bug #XXX: [タイトル]

## ステータス
- 🔴 **Status**: Unstarted
- **Priority**: [Critical/High/Medium/Low]
- **Created**: YYYY-MM-DD
- **Started**: -
- **Completed**: -

## 問題の説明
[バグの詳細]

## 再現手順
1. [手順1]
2. [手順2]

## 期待される動作
[正しい動作]

## 実際の動作
[現在の不具合]

## 環境
- ブラウザ:
- OS:
- バージョン:

## 修正内容
[修正後に記載]

## テストケース
- [ ] 再現手順で問題が解消
- [ ] 関連機能に影響なし
- [ ] ブラウザ動作確認

## コミット
- 修正: `[コミットハッシュ]`
- チケット更新: `[コミットハッシュ]`
```

#### 関連コマンド

- `/ticket` - 新しいBugチケット作成
- `/start-bug [番号]` - Bug修正開始
- `/complete-bug [番号]` - Bug修正完了

---

### 3. Feature（機能追加）

**ディレクトリ**: `docs/ticket/feature/`

新しい機能の追加や要望を管理します。

#### 優先度レベル

- **High（高）**: MVP（最小実用製品）に必須の機能
- **Medium（中）**: ユーザビリティ向上に寄与する機能
- **Low（低）**: あると便利な機能

#### 命名規則

```
feature-[3桁番号]-[説明].md
```

例：
- `feature-001-favorite-cafes.md`
- `feature-002-cafe-registration.md`
- `feature-003-photo-upload.md`

#### チケット構造

```markdown
# Feature #XXX: [タイトル]

## ステータス
- 🔴 **Status**: Unstarted
- **Priority**: [High/Medium/Low]
- **Created**: YYYY-MM-DD
- **Started**: -
- **Completed**: -

## 機能概要
[機能の説明]

## 要件
- [要件1]
- [要件2]

## UI/UX 仕様
[画面設計、インタラクション]

## 技術仕様
- **使用技術**:
- **API エンドポイント**:
- **データモデル**:

## 実装チェックリスト
- [ ] コンポーネント作成
- [ ] API ルート作成
- [ ] データベーススキーマ更新
- [ ] UI 実装
- [ ] バリデーション実装
- [ ] エラーハンドリング
- [ ] レスポンシブ対応
- [ ] ブラウザ動作確認
- [ ] テストケース作成

## テストケース
- [ ] 基本機能が動作
- [ ] エラーケース処理
- [ ] モバイル表示確認

## コミット
- 実装: `[コミットハッシュ]`
- チケット更新: `[コミットハッシュ]`
```

#### 関連コマンド

- `/ticket` - 新しいFeatureチケット作成
- `/start-feature [番号]` - Feature実装開始
- `/complete-feature [番号]` - Feature実装完了

---

### 4. Enhancement（改善）

**ディレクトリ**: `docs/ticket/enhancement/`

既存機能の改善、最適化、リファクタリングを管理します。

#### カテゴリ

- **Performance**: パフォーマンス改善（速度、メモリ最適化）
- **Refactoring**: コード品質向上（構造改善、重複排除）
- **UX**: ユーザー体験改善（操作性、視認性向上）
- **Security**: セキュリティ強化（脆弱性対策）
- **Code Quality**: コード品質改善（型安全性、エラーハンドリング）

#### 命名規則

```
enhancement-[3桁番号]-[説明].md
```

例：
- `enhancement-001-map-performance.md`
- `enhancement-002-api-refactoring.md`
- `enhancement-003-ui-accessibility.md`

#### チケット構造

```markdown
# Enhancement #XXX: [タイトル]

## ステータス
- 🔴 **Status**: Unstarted
- **Category**: [Performance/Refactoring/UX/Security/Code Quality]
- **Priority**: Medium
- **Created**: YYYY-MM-DD
- **Started**: -
- **Completed**: -

## 改善内容
[改善の説明]

## 現状の課題
[Before: 現在の状態]

## 改善後の状態
[After: 改善後の期待値]

## 実装方針
- [アプローチ1]
- [アプローチ2]

## 影響範囲
- **影響を受けるコンポーネント**:
- **影響を受けるAPI**:
- **データベース変更**: [あり/なし]

## 実装チェックリスト
- [ ] 実装完了
- [ ] 既存機能への影響確認
- [ ] パフォーマンス測定
- [ ] ブラウザ動作確認
- [ ] コードレビュー

## テストケース
- [ ] 改善が反映
- [ ] 既存機能が正常動作
- [ ] パフォーマンス向上確認

## コミット
- 実装: `[コミットハッシュ]`
- チケット更新: `[コミットハッシュ]`
```

#### 関連コマンド

- `/ticket` - 新しいEnhancementチケット作成
- `/start-enhancement [番号]` - Enhancement実装開始
- `/complete-enhancement [番号]` - Enhancement実装完了

---

## スラッシュコマンド

チケット管理システムは、`.claude/commands/` ディレクトリに配置されたスラッシュコマンドで操作します。

### チケット管理コマンド

#### `/ticket`
新しいチケットを作成します。ユーザーからの報告内容を自動的に分類し、適切なカテゴリ（Bug/Feature/Enhancement）のチケットを生成します。

**使用例**:
```
ユーザー: 地図の表示が遅いので改善してほしい
Claude: /ticket を実行
→ bug-001-map-display-slow.md を作成
```

**実行フロー**:
1. 内容の分類（Bug/Feature/Enhancement）
2. 優先度の判断
3. ファイル名の自動生成
4. ユーザー確認
5. チケットファイル作成
6. PROGRESS.md更新
7. Gitコミット

#### `/list-tickets`
すべてのチケットをカテゴリ別、ステータス別に表示します。

**表示内容**:
- カテゴリ別チケット一覧（Bug/Feature/Enhancement/Initial）
- ステータス別分類（未着手/進行中/完了/レビュー/ブロック）
- 優先度情報
- 作成日、開始日、完了日
- 所要時間

#### `/ticket-status`
プロジェクト全体の進捗状況を表示します。

**表示内容**:
- 全体サマリー（総チケット数、完了率）
- カテゴリ別進捗率
- 優先度別の件数
- 現在対応中のタスク
- ブロック中のチケット

---

### Initial Phase コマンド

#### `/start-phase [番号]`
指定されたPhaseの実装を開始します。

**使用例**:
```
/start-phase 3
→ Phase 3（データベース）を開始
```

**実行フロー**:
1. Phaseチケット読み込み
2. 実装ドキュメント確認
3. ステータス更新（未着手 → 進行中）
4. PROGRESS.md更新
5. タスクチェックリスト表示
6. 実装実行
7. 受入テスト確認
8. Gitコミット（実装）
9. チケット・PROGRESS更新
10. Gitコミット（チケット更新）

**重要事項**:
- 必ずlocalhost動作確認を実施
- すべてのタスクを完了すること
- TypeScript/ESLintエラーなし
- 2回のコミット（実装、チケット更新）

#### `/next-phase`
次に実行すべきPhaseを自動判断して開始します。

**実行フロー**:
1. PROGRESS.md読み込み
2. 現在の状況確認
3. 次のPhase判断
4. ユーザー確認
5. `/start-phase`自動実行

**判断ロジック**:
- 進行中のPhaseがある → 警告表示
- すべてのPhase完了 → 完了メッセージ
- 次のPhaseあり → 自動開始提案

#### `/check-progress`
Initial Phaseの進捗状況を詳細表示します。

**表示内容**:
- Phase一覧（ステータス、予定時間、実績時間）
- マイルストーン進捗
- 全体進捗率
- 現在進行中のPhase
- 次に実行すべきPhase

---

### Bug管理コマンド

#### `/start-bug [番号]`
指定されたBugの修正作業を開始します。

**使用例**:
```
/start-bug 1
→ bug-001 の修正開始
```

**実行フロー**:
1. Bugチケット読み込み
2. Bug情報表示
3. ユーザー確認
4. ステータス更新（未着手 → 進行中）
5. PROGRESS.md更新
6. Gitコミット（ステータス更新）
7. 修正作業実施
8. テストケース実行
9. localhost動作確認依頼

#### `/complete-bug [番号]`
Bugの修正を完了し、チケットをクローズします。

**実行フロー**:
1. Bugチケット読み込み
2. 完了確認（すべてのテストケースチェック済み）
3. ステータス更新（進行中 → 完了）
4. 実績時間記録
5. PROGRESS.md更新
6. Gitコミット（実装）
7. Gitコミット（チケット更新）

---

### Feature管理コマンド

#### `/start-feature [番号]`
指定されたFeatureの実装を開始します。

**実行フロー**:
1. Featureチケット読み込み
2. 機能仕様表示
3. ユーザー確認
4. ステータス更新（未着手 → 進行中）
5. PROGRESS.md更新
6. Gitコミット（ステータス更新）
7. 実装作業実施
8. テストケース実行
9. localhost動作確認依頼

#### `/complete-feature [番号]`
Featureの実装を完了し、チケットをクローズします。

**実行フロー**:
1. Featureチケット読み込み
2. 完了確認（実装チェックリスト、テストケース）
3. ステータス更新（進行中 → 完了）
4. 実績時間記録
5. PROGRESS.md更新
6. Gitコミット（実装）
7. Gitコミット（チケット更新）

---

### Enhancement管理コマンド

#### `/start-enhancement [番号]`
指定されたEnhancementの実装を開始します。

**実行フロー**:
1. Enhancementチケット読み込み
2. 改善内容表示
3. 影響範囲確認
4. ユーザー確認
5. ステータス更新（未着手 → 進行中）
6. PROGRESS.md更新
7. Gitコミット（ステータス更新）
8. 実装作業実施
9. 既存機能への影響確認
10. localhost動作確認依頼

#### `/complete-enhancement [番号]`
Enhancementの実装を完了し、チケットをクローズします。

**実行フロー**:
1. Enhancementチケット読み込み
2. 完了確認（実装チェックリスト、テストケース）
3. 改善効果の測定・記録
4. ステータス更新（進行中 → 完了）
5. 実績時間記録
6. PROGRESS.md更新
7. Gitコミット（実装）
8. Gitコミット（チケット更新）

---

## ワークフロー

### Initial Phase ワークフロー

```
1. Phase開始
   /start-phase [番号]
   ↓
2. ステータス更新（未着手 → 進行中）
   ↓
3. PROGRESS.md更新
   ↓
4. Gitコミット（ステータス更新）
   ↓
5. 実装タスク実行
   - コード作成・編集
   - TypeScript/ESLintチェック
   - タスクチェックリスト更新
   ↓
6. 受入テスト
   - localhost動作確認
   - 受入基準チェック
   ↓
7. Gitコミット（実装）
   ↓
8. チケット更新
   - ステータス更新（進行中 → 完了）
   - 実績時間記録
   - コミットハッシュ記録
   ↓
9. PROGRESS.md更新
   ↓
10. Gitコミット（チケット更新）
   ↓
11. 次のPhaseへ
    /next-phase
```

### Bug修正ワークフロー

```
1. Bug発見・報告
   /ticket
   ↓
2. チケット作成
   - カテゴリ分類: Bug
   - 優先度判断
   - ファイル作成: bug-XXX-description.md
   ↓
3. PROGRESS.md更新
   ↓
4. Gitコミット（チケット作成）
   ↓
5. Bug修正開始
   /start-bug [番号]
   ↓
6. ステータス更新（未着手 → 進行中）
   ↓
7. PROGRESS.md更新
   ↓
8. Gitコミット（ステータス更新）
   ↓
9. 修正実装
   - 問題箇所特定
   - コード修正
   - テストケース実行
   ↓
10. localhost動作確認
   ↓
11. Bug修正完了
    /complete-bug [番号]
    ↓
12. ステータス更新（進行中 → 完了）
    ↓
13. 実績時間記録
    ↓
14. PROGRESS.md更新
    ↓
15. Gitコミット（実装）
    ↓
16. Gitコミット（チケット更新）
```

### Feature追加ワークフロー

```
1. 機能要望・提案
   /ticket
   ↓
2. チケット作成
   - カテゴリ分類: Feature
   - 優先度判断
   - ファイル作成: feature-XXX-description.md
   ↓
3. PROGRESS.md更新
   ↓
4. Gitコミット（チケット作成）
   ↓
5. Feature実装開始
   /start-feature [番号]
   ↓
6. ステータス更新（未着手 → 進行中）
   ↓
7. PROGRESS.md更新
   ↓
8. Gitコミット（ステータス更新）
   ↓
9. 仕様検討・設計
   - UI/UX設計
   - 技術仕様決定
   - データモデル設計
   ↓
10. 実装
    - コンポーネント作成
    - API作成
    - DBスキーマ更新
    - UI実装
    - バリデーション
    - エラーハンドリング
    ↓
11. テストケース実行
    ↓
12. localhost動作確認
    ↓
13. Feature実装完了
    /complete-feature [番号]
    ↓
14. ステータス更新（進行中 → 完了）
    ↓
15. 実績時間記録
    ↓
16. PROGRESS.md更新
    ↓
17. Gitコミット（実装）
    ↓
18. Gitコミット（チケット更新）
```

### Enhancement実装ワークフロー

```
1. 改善点発見・提案
   /ticket
   ↓
2. チケット作成
   - カテゴリ分類: Enhancement
   - カテゴリ判断（Performance/Refactoring/UX/Security/Code Quality）
   - ファイル作成: enhancement-XXX-description.md
   ↓
3. PROGRESS.md更新
   ↓
4. Gitコミット（チケット作成）
   ↓
5. Enhancement実装開始
   /start-enhancement [番号]
   ↓
6. ステータス更新（未着手 → 進行中）
   ↓
7. PROGRESS.md更新
   ↓
8. Gitコミット（ステータス更新）
   ↓
9. 影響範囲調査
   - 影響を受けるコンポーネント確認
   - 影響を受けるAPI確認
   - DB変更の有無確認
   ↓
10. 実装方針決定
    ↓
11. 実装
    - コード改善
    - パフォーマンス最適化
    - リファクタリング
    ↓
12. 既存機能への影響確認
    ↓
13. 改善効果の測定
    - パフォーマンス測定（該当する場合）
    - コード品質指標確認
    ↓
14. localhost動作確認
    ↓
15. Enhancement実装完了
    /complete-enhancement [番号]
    ↓
16. ステータス更新（進行中 → 完了）
    ↓
17. 実績時間記録
    ↓
18. PROGRESS.md更新
    ↓
19. Gitコミット（実装）
    ↓
20. Gitコミット（チケット更新）
```

---

## 使い方

### 1. プロジェクト開始時（Initial Phases）

#### ステップ1: 最初のPhaseを開始

```
/start-phase 1
```

Claude Codeが以下を実行します：
1. `phase-01-project-setup.md` を読み込み
2. ステータスを「進行中」に更新
3. PROGRESS.md更新
4. タスクチェックリストを表示
5. 実装を実行
6. localhost動作確認を依頼

#### ステップ2: 動作確認

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開き、動作を確認します。

#### ステップ3: 次のPhaseへ

```
/next-phase
```

Claude Codeが次のPhaseを自動判断して開始します。

#### ステップ4: 進捗確認

```
/check-progress
```

現在の進捗状況を確認できます。

---

### 2. Bugを発見した場合

#### ステップ1: Bugチケット作成

```
ユーザー: 地図が表示されない問題があります
Claude: /ticket を実行
```

Claude Codeが以下を実行します：
1. 内容を分析してBugカテゴリに分類
2. 優先度を判断（Critical/High/Medium/Low）
3. ファイル名を生成（例: bug-001-map-not-loading.md）
4. ユーザーに確認
5. チケットファイル作成
6. PROGRESS.md更新
7. Gitコミット

#### ステップ2: Bug修正開始

```
/start-bug 1
```

Claude Codeが以下を実行します：
1. bug-001チケット読み込み
2. Bug情報表示
3. ステータス更新（未着手 → 進行中）
4. 修正実装
5. テストケース実行
6. localhost動作確認依頼

#### ステップ3: 動作確認

```bash
npm run dev
```

Bugが修正されていることを確認します。

#### ステップ4: Bug修正完了

```
/complete-bug 1
```

Claude Codeが以下を実行します：
1. 完了確認
2. ステータス更新（進行中 → 完了）
3. 実績時間記録
4. Gitコミット（実装、チケット更新）

---

### 3. 新機能を追加する場合

#### ステップ1: Featureチケット作成

```
ユーザー: お気に入りカフェ機能を追加したいです
Claude: /ticket を実行
```

Claude Codeが以下を実行します：
1. 内容を分析してFeatureカテゴリに分類
2. 優先度を判断（High/Medium/Low）
3. ファイル名を生成（例: feature-001-favorite-cafes.md）
4. ユーザーに確認
5. チケットファイル作成
6. PROGRESS.md更新
7. Gitコミット

#### ステップ2: Feature実装開始

```
/start-feature 1
```

Claude Codeが以下を実行します：
1. feature-001チケット読み込み
2. 機能仕様表示
3. ステータス更新（未着手 → 進行中）
4. 仕様検討・設計
5. 実装（コンポーネント、API、UI）
6. テストケース実行
7. localhost動作確認依頼

#### ステップ3: 動作確認

```bash
npm run dev
```

新機能が正しく動作することを確認します。

#### ステップ4: Feature実装完了

```
/complete-feature 1
```

Claude Codeが以下を実行します：
1. 完了確認（実装チェックリスト、テストケース）
2. ステータス更新（進行中 → 完了）
3. 実績時間記録
4. Gitコミット（実装、チケット更新）

---

### 4. 既存機能を改善する場合

#### ステップ1: Enhancementチケット作成

```
ユーザー: 地図の読み込みを高速化したいです
Claude: /ticket を実行
```

Claude Codeが以下を実行します：
1. 内容を分析してEnhancementカテゴリに分類
2. カテゴリを判断（Performance）
3. ファイル名を生成（例: enhancement-001-map-performance.md）
4. ユーザーに確認
5. チケットファイル作成
6. PROGRESS.md更新
7. Gitコミット

#### ステップ2: Enhancement実装開始

```
/start-enhancement 1
```

Claude Codeが以下を実行します：
1. enhancement-001チケット読み込み
2. 改善内容・影響範囲表示
3. ステータス更新（未着手 → 進行中）
4. 影響範囲調査
5. 実装方針決定
6. 実装（最適化、リファクタリング）
7. 既存機能への影響確認
8. パフォーマンス測定
9. localhost動作確認依頼

#### ステップ3: 動作確認

```bash
npm run dev
```

改善効果を確認します。

#### ステップ4: Enhancement実装完了

```
/complete-enhancement 1
```

Claude Codeが以下を実行します：
1. 完了確認（実装チェックリスト、テストケース）
2. 改善効果の記録
3. ステータス更新（進行中 → 完了）
4. 実績時間記録
5. Gitコミット（実装、チケット更新）

---

### 5. 進捗状況の確認

#### 全チケット一覧表示

```
/list-tickets
```

カテゴリ別、ステータス別にすべてのチケットを表示します。

#### プロジェクト全体の進捗確認

```
/ticket-status
```

プロジェクト全体のサマリーと進捗率を表示します。

#### Initial Phase進捗確認

```
/check-progress
```

Phase一覧とマイルストーン進捗を表示します。

---

## ベストプラクティス

### 1. チケット管理

#### こまめな更新
- タスク完了時は即座にチェック
- 進捗メモを詳細に記録
- 実績時間を正確に記録

#### 優先度の見直し
- 状況に応じて優先度を調整
- Criticalなバグは最優先で対応
- Phaseは順序通りに実行

#### 詳細な記録
- 問題点や解決策をメモセクションに記録
- スクリーンショットやエラーログを添付
- 関連チケットをリンク

---

### 2. Git管理

#### 2段階コミット
すべての作業は2回のコミットで完了します：

**1回目: 実装コミット**
```bash
git add src/ app/ components/
git commit -m "実装: [機能名]

- 実装内容1
- 実装内容2
- 実装内容3"
```

**2回目: チケット更新コミット**
```bash
git add docs/ticket/
git commit -m "チケット更新: [カテゴリ]-XXX [タイトル]

- ステータス更新: 進行中 → 完了
- 実績時間記録: X時間
- テストケース完了"
```

#### コミットメッセージ規則
- **実装**: 「実装: Phase X - [タイトル]」
- **修正**: 「修正: Bug #X - [タイトル]」
- **追加**: 「追加: Feature #X - [タイトル]」
- **改善**: 「改善: Enhancement #X - [タイトル]」
- **チケット**: 「チケット更新: [カテゴリ]-XXX [タイトル]」

---

### 3. テスト・品質管理

#### 必須チェック項目
すべての実装で以下を確認：

```bash
# TypeScript型チェック
npm run type-check

# ESLintチェック
npm run lint

# ビルド確認
npm run build

# 開発サーバー起動
npm run dev
```

#### localhost動作確認
- 実装後は必ずlocalhost:3000で動作確認
- モバイル表示確認（レスポンシブデザイン）
- ブラウザコンソールエラー確認
- ネットワークエラー確認

---

### 4. エスカレーション

#### ブロック時の対応
問題が発生した場合：

1. チケットのステータスを ⚫ **ブロック** に変更
2. メモセクションに問題の詳細を記載
3. 関連する依存関係を記録
4. `/ticket-status` で全体への影響を確認
5. 別のチケットに着手するか検討

#### 依存関係の管理
- Phaseは順序通りに実行（依存関係を尊重）
- Bug修正はいつでも実施可能
- Feature/Enhancementは優先度に従う

---

### 5. 定期レビュー

#### 週次レビュー
毎週以下を確認：

```
/ticket-status
```

- 全体進捗率
- 完了済みタスク数
- 進行中タスク数
- ブロック中タスク数
- 次週の計画

#### PROGRESS.md確認
各カテゴリのPROGRESS.mdで詳細を確認：

- `docs/ticket/initial/PROGRESS.md` - Phase進捗
- `docs/ticket/bug/PROGRESS.md` - Bug対応状況
- `docs/ticket/feature/PROGRESS.md` - Feature実装状況
- `docs/ticket/enhancement/PROGRESS.md` - Enhancement実装状況

---

## チケットステータス一覧

| ステータス | 絵文字 | 説明 |
|-----------|--------|------|
| Unstarted | 🔴 | まだ開始していない |
| In Progress | 🟡 | 現在作業中 |
| Complete | 🟢 | 実装・テスト完了 |
| Review | 🔵 | レビュー依頼中 |
| Blocked | ⚫ | 他の作業待ち、問題発生 |

---

## 統計情報

各カテゴリの `PROGRESS.md` で以下の情報を確認できます：

- **全体進捗率**: 完了チケット数 / 総チケット数
- **カテゴリ別件数**: 各カテゴリの総数
- **優先度別件数**: Critical/High/Medium/Low別の件数
- **平均対応時間**: チケットあたりの平均所要時間
- **現在対応中**: 進行中のチケット一覧
- **完了済み**: 完了したチケット一覧
- **ブロック中**: ブロックされているチケット一覧

---

## トラブルシューティング

### Q: Phaseが進行中のまま次に進めない

**A**: `/check-progress` で現在の状況を確認し、進行中のPhaseを完了させてください。完了していない場合は作業を続行し、完了している場合はステータスを更新してください。

### Q: チケット番号がわからない

**A**: `/list-tickets` ですべてのチケットを一覧表示できます。

### Q: 複数のBugを同時に修正したい

**A**: Bug修正は複数同時進行が可能です。それぞれ `/start-bug [番号]` で開始してください。

### Q: 優先度を変更したい

**A**: チケットファイルを直接編集し、優先度を変更してください。変更後はPROGRESS.mdも更新してください。

### Q: チケットを削除したい

**A**: チケットファイルとPROGRESS.mdから該当エントリを削除し、Gitコミットしてください。

---

## 関連ドキュメント

- [Initial Phaseガイド](initial/README.md) - Phase 1-11の詳細
- [Bugカテゴリガイド](bug/README.md) - バグ管理ガイド
- [Featureカテゴリガイド](feature/README.md) - 機能追加ガイド
- [Enhancementカテゴリガイド](enhancement/README.md) - 改善管理ガイド

---

## まとめ

このチケット管理システムは、Work Cafe Finderプロジェクトの開発を効率的に進めるために設計されています。

### 主な利点

1. **体系的な管理**: 4つのカテゴリで明確に分類
2. **自動化**: スラッシュコマンドで効率的に操作
3. **可視化**: PROGRESS.mdでリアルタイム進捗確認
4. **品質保証**: テストケース、受入基準の明確化
5. **Git連携**: 2段階コミットで変更履歴を明確化

### 開発フロー

```
Initial Phases → Bug修正 → Feature追加 → Enhancement → 継続的改善
    ↓              ↓          ↓             ↓              ↓
  Phase 1-11    随時対応    優先度順      最適化       メンテナンス
```

### 次のステップ

1. `/start-phase 1` でプロジェクトを開始
2. `/next-phase` で順次Phase実装
3. `/ticket` でBug/Feature/Enhancement管理
4. `/ticket-status` で定期的に進捗確認

---

**Good Luck with Work Cafe Finder Development!**
