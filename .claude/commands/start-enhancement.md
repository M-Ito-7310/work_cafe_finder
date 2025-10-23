# Enhancement 実装開始コマンド

指定された Enhancement チケットの実装作業を開始します。

## 使用方法
```
/start-enhancement [enhancement番号]
```

例: `/start-enhancement 1` → enhancement-001 の実装を開始

## 実行手順

### 1. Enhancement チケットの読み込み
`docs/ticket/enhancement/` ディレクトリから該当するチケットファイルを検索します：
- パターン: `enhancement-[番号3桁]*.md`
- 例: `enhancement-001-map-performance.md`

### 2. Enhancement 情報の表示
チケットの内容を表示します：
```markdown
## 🔧 Enhancement #1: 地図パフォーマンスの最適化

**Category**: Performance
**Priority**: Medium
**Created**: 2025-10-23

**改善内容**:
地図のレンダリングパフォーマンスを向上させ、より多くのマーカーを表示できるようにする。

**現状の課題**:
- 100個以上のマーカーを表示すると動作が遅くなる
- ズーム操作時にラグが発生する
- モバイルでのパフォーマンスが悪い

**改善後の状態**:
- 500個以上のマーカーでもスムーズに動作
- ズーム操作が即座に反応
- モバイルでも快適に動作

実装作業を開始しますか？ (y/n)
```

### 3. ユーザー確認
- `y` の場合: 続行
- `n` の場合: 処理を中断

### 4. ステータスの更新
Enhancement チケットのステータスを更新します：
```markdown
- 🟡 **Status**: In Progress
- **Started**: 2025-10-23 14:30
```

### 5. PROGRESS.md の更新
`docs/ticket/enhancement/PROGRESS.md` を更新：
- 該当 Enhancement を「進行中」セクションに移動
- 開始日時を記録
- 進捗率を再計算

### 6. Git コミット（ステータス更新）
チケットのステータス更新をコミット：
```bash
git add docs/ticket/enhancement/
git commit -m "チケット更新: enhancement-001 実装開始"
```

### 7. 実装計画の確認
チケットに記載された実装方針を表示：
```markdown
## 実装方針
- マーカークラスタリングの導入 (react-leaflet-markercluster)
- 仮想スクロールの適用
- レンダリング最適化（useMemo, useCallback の活用）
- 不要な再レンダリングの削減

## 影響範囲
- **影響を受けるコンポーネント**: MapView, CafeMarker
- **影響を受けるAPI**: /api/cafes (viewport フィルタリング)
- **データベース変更**: なし
```

### 8. Before の状態を記録
改善前の状態を測定・記録します：
```markdown
## Before (改善前)

### パフォーマンス測定
- 100マーカー表示時間: 3秒
- 500マーカー表示時間: 測定不可（フリーズ）
- ズーム操作の反応時間: 500ms
- モバイル（iPhone 12）での動作: ラグあり
```

### 9. 実装作業の実施
実装チェックリストに従って実装を進めます：
1. 必要なライブラリのインストール
2. コンポーネントの修正
3. パフォーマンス最適化の適用
4. TypeScript コンパイルエラーの確認
5. ESLint エラーの確認

### 10. After の状態を測定
改善後の状態を測定・記録します：
```markdown
## After (改善後)

### パフォーマンス測定
- 100マーカー表示時間: 0.5秒
- 500マーカー表示時間: 1.2秒
- ズーム操作の反応時間: 50ms
- モバイル（iPhone 12）での動作: スムーズ

### 改善率
- 表示時間: 83% 改善
- ズーム反応: 90% 改善
```

### 11. localhost での動作確認依頼
```
実装が完了しました。以下を確認してください:

1. npm run dev で開発サーバーを起動
2. http://localhost:3000/map にアクセス
3. 地図のパフォーマンスが改善されていることを確認
4. ズーム操作がスムーズであることを確認
5. モバイルビューでも快適に動作することを確認

動作確認が完了したら、以下のコマンドで Enhancement を完了としてください:
/complete-enhancement 1
```

## 重要事項
- **必ず localhost での動作確認を求めること**
- Before と After の状態を必ず測定・記録すること
- パフォーマンス改善は数値で示すこと
- 影響範囲を明確にすること
- 既存機能への影響がないことを確認すること
- ステータスを「Complete」にするのは `/complete-enhancement` コマンドで実施

## エラー時の対応
- Enhancement 番号が見つからない場合: エラーメッセージを表示し、利用可能な Enhancement 一覧を表示
- 既に進行中の Enhancement がある場合: 警告を表示（複数同時進行も許可）
- 既に完了している Enhancement の場合: 警告を表示し、再開するか確認
