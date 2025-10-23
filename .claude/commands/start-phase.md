# Phase 開始コマンド

指定された Phase の実装を開始します。

## 使用方法
```
/start-phase [phase番号]
```

例: `/start-phase 3` → Phase 3 を開始

## 実行手順

### 1. Phase チケットの読み込み
`docs/ticket/initial/phase-[番号]-[名前].md` ファイルを読み込みます。

例: `docs/ticket/initial/phase-03-map-infrastructure.md`

### 2. 実装ドキュメントの確認
該当 Phase の実装ガイドがある場合は読み込みます：
- `docs/implementation/phase-[番号]-*.md`

### 3. ステータスの更新
Phase チケットのステータスを更新します：
```markdown
- 🟡 **Status**: In Progress
- **Started**: 2025-10-23
```

### 4. PROGRESS.md の更新
`docs/ticket/initial/PROGRESS.md` を更新：
- 該当 Phase を「進行中」セクションに移動
- 開始日時を記録
- 進捗率を再計算

### 5. タスクチェックリストの表示
Phase チケットに記載されているタスク一覧を表示：
```markdown
## 実装タスク

Phase 3 のタスクリスト:
- [ ] 地図コンポーネントの作成 (MapView.tsx)
- [ ] カフェマーカーの実装 (CafeMarker.tsx)
- [ ] カフェデータAPIの作成 (/api/cafes)
- [ ] 鮮度判定ロジックの実装
- [ ] 地図ページの作成 (/map)
- [ ] レスポンシブデザインの適用

これらのタスクを順次実装していきます。
```

### 6. 実装の実行
チケットに記載されたタスクを順次実行します：
1. 必要なディレクトリを作成
2. ファイルを作成・編集
3. 各タスク完了後にチェックボックスを更新
4. TypeScript コンパイルエラーがないことを確認
5. ESLint エラーがないことを確認

### 7. 受入テストの確認
実装完了後、受入基準を満たしているか確認：
```markdown
## 受入基準
- [ ] localhost:3000 で地図が表示される
- [ ] カフェマーカーが正しく表示される
- [ ] マーカーをクリックするとカフェ詳細が表示される
- [ ] 現在地が取得できる
- [ ] モバイルでも正常に表示される
- [ ] TypeScript エラーなし
- [ ] ESLint エラーなし
```

ユーザーに localhost での動作確認を依頼します。

### 8. Git コミット（実装）
実装内容をコミットします：
```bash
git add src/
git commit -m "実装: Phase 3 - 地図インフラストラクチャ

- MapView コンポーネントの作成
- カフェマーカーの実装
- カフェデータ API の作成
- 鮮度判定ロジックの実装
- 地図ページの作成
- レスポンシブデザインの適用"
```

### 9. チケットとPROGRESSの更新
Phase チケットと PROGRESS.md を更新します：
- 完了タスクにチェック
- ステータスは「In Progress」のまま（完了確認は `/complete-phase` で実施）
- コミットハッシュを記録

### 10. Git コミット（チケット更新）
チケット更新をコミットします：
```bash
git add docs/ticket/initial/
git commit -m "チケット更新: Phase 3 実装完了、受入テスト待ち"
```

## 重要事項
- **必ず localhost での動作確認を求めること**
- Phase チケットに記載されたすべてのタスクを実行すること
- 実装ドキュメントがある場合は参照すること
- TypeScript と ESLint のエラーがないことを確認すること
- 2回のコミット（実装、チケット更新）を必ず実行すること
- ステータスを「Complete」にするのは `/complete-phase` コマンドで実施

## エラー時の対応
- Phase 番号が見つからない場合: エラーメッセージを表示し、利用可能な Phase 一覧を表示
- 既に進行中の Phase がある場合: 警告を表示し、先に完了させることを推奨
- 依存する Phase が未完了の場合: エラーメッセージを表示し、依存関係を説明
