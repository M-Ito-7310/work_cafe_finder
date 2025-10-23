# Enhancement 完了コマンド

指定された Enhancement チケットを完了としてマークします。

## 使用方法
```
/complete-enhancement [enhancement番号]
```

例: `/complete-enhancement 1` → enhancement-001 を完了

## 実行手順

### 1. Enhancement チケットの読み込み
該当する Enhancement チケットファイルを読み込みます。

### 2. 完了条件の確認
以下の条件をすべて満たしているか確認します：

```markdown
## ✅ 完了条件チェック

- [ ] 実装が完了している
- [ ] Before と After の状態を測定・記録済み
- [ ] パフォーマンス改善が数値で示されている（該当する場合）
- [ ] TypeScript コンパイルエラーなし
- [ ] ESLint エラーなし
- [ ] localhost で動作確認済み
- [ ] すべてのテストケースをクリア
- [ ] 既存機能への影響がないことを確認済み
```

すべての条件を満たしていますか？ (y/n)

### 3. ユーザー確認
- `y` の場合: 続行
- `n` の場合: 不足している項目を確認し、処理を中断

### 4. 実装内容の記録
チケットに実装内容と Before/After を詳細に記録します：
```markdown
## 実装内容

### 実施した変更
- `package.json`: react-leaflet-markercluster を追加
- `src/components/map/MapView.tsx`: マーカークラスタリングの導入
- `src/components/map/CafeMarker.tsx`: useMemo による最適化
- `src/app/api/cafes/route.ts`: viewport フィルタリングの実装

### Before (改善前)
- 100マーカー表示時間: 3秒
- 500マーカー表示時間: 測定不可（フリーズ）
- ズーム操作の反応時間: 500ms
- モバイル（iPhone 12）での動作: ラグあり

### After (改善後)
- 100マーカー表示時間: 0.5秒
- 500マーカー表示時間: 1.2秒
- ズーム操作の反応時間: 50ms
- モバイル（iPhone 12）での動作: スムーズ

### 改善率
- 表示時間: 83% 改善
- ズーム反応: 90% 改善
- モバイルパフォーマンス: 大幅改善

### テスト結果
- ✅ パフォーマンスが向上している
- ✅ 既存機能が正常に動作する
- ✅ モバイルでも快適に動作する
- ✅ エラーが発生しない
```

### 5. ステータスの更新
Enhancement チケットのステータスを更新します：
```markdown
- 🟢 **Status**: Complete
- **Started**: 2025-10-23 14:30
- **Completed**: 2025-10-23 16:30
- **実績時間**: 2時間
```

### 6. Git コミット（実装内容）
実装内容をコミットします：
```bash
git add src/ package.json
git commit -m "改善: enhancement-001 地図パフォーマンスの最適化

- マーカークラスタリングの導入
- レンダリング最適化（useMemo, useCallback）
- viewport フィルタリングの実装

パフォーマンス改善:
- 表示時間: 3秒 → 0.5秒 (83%改善)
- ズーム反応: 500ms → 50ms (90%改善)"
```

### 7. PROGRESS.md の更新
`docs/ticket/enhancement/PROGRESS.md` を更新：
- 該当 Enhancement を「完了」セクションに移動
- 完了日時と所要時間を記録
- 進捗率を再計算
- 平均完了時間を更新

### 8. Git コミット（チケット更新）
チケット更新をコミットします：
```bash
git add docs/ticket/enhancement/
git commit -m "チケット完了: enhancement-001 地図パフォーマンスの最適化 (2h)"
```

### 9. 完了メッセージの表示
```markdown
## 🎉 Enhancement #1 が完了しました！

**タイトル**: 地図パフォーマンスの最適化
**Category**: Performance
**所要時間**: 2時間

### 実施した改善
- マーカークラスタリングの導入
- レンダリング最適化
- viewport フィルタリング

### パフォーマンス改善
- 表示時間: 83% 改善 (3秒 → 0.5秒)
- ズーム反応: 90% 改善 (500ms → 50ms)
- モバイル体験: 大幅改善

### 更新されたファイル
- チケット: docs/ticket/enhancement/enhancement-001-map-performance.md
- 進捗: docs/ticket/enhancement/PROGRESS.md

### 次のアクション
残りの Enhancement チケット: 5件
- Performance: 0件
- UX: 2件
- Refactoring: 1件
- Security: 1件
- Code Quality: 1件

次の Enhancement に取り組むには:
/start-enhancement [番号]

または、Enhancement 一覧を確認:
/list-tickets
```

## 重要事項
- **必ず localhost での動作確認が完了していること**
- Before と After の状態を必ず記録すること
- パフォーマンス改善は数値で示すこと
- すべてのテストケースをクリアしていること
- TypeScript と ESLint のエラーがないこと
- 既存機能への影響がないことを確認すること
- 2回のコミット（実装、チケット更新）を必ず実行すること

## エラー時の対応
- Enhancement が「In Progress」ステータスでない場合: 警告を表示
- 完了条件を満たしていない場合: 不足している項目を指摘
- Before/After の記録がない場合: 測定を促す
- テストが失敗している場合: 修正を促す
- 既存機能に影響がある場合: 修正を促す
