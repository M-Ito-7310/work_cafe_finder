# Feature 完了コマンド

指定された Feature チケットを完了としてマークします。

## 使用方法
```
/complete-feature [feature番号]
```

例: `/complete-feature 1` → feature-001 を完了

## 実行手順

### 1. Feature チケットの読み込み
該当する Feature チケットファイルを読み込みます。

### 2. 完了条件の確認
以下の条件をすべて満たしているか確認します：

```markdown
## ✅ 完了条件チェック

- [ ] すべての実装チェックリストが完了している
- [ ] TypeScript コンパイルエラーなし
- [ ] ESLint エラーなし
- [ ] localhost で動作確認済み
- [ ] すべてのテストケースをクリア
- [ ] UI/UX 仕様を満たしている
- [ ] レスポンシブデザインが適用されている
- [ ] エラーハンドリングが実装されている
- [ ] 認証チェックが実装されている（該当する場合）
```

すべての条件を満たしていますか？ (y/n)

### 3. ユーザー確認
- `y` の場合: 続行
- `n` の場合: 不足している項目を確認し、処理を中断

### 4. 実装内容の記録
チケットに実装内容を記録します：
```markdown
## 実装内容

### 作成したファイル
- `src/lib/db/schema.ts`: favorites テーブルを追加
- `src/app/api/favorites/route.ts`: お気に入り API
- `src/components/cafe/FavoriteButton.tsx`: お気に入りボタン
- `src/app/mypage/page.tsx`: マイページ
- `src/components/mypage/FavoriteList.tsx`: お気に入り一覧

### 実装した機能
- ✅ お気に入りの追加/削除
- ✅ マイページでの一覧表示
- ✅ 認証チェック
- ✅ レスポンシブデザイン
- ✅ エラーハンドリング

### テスト結果
- ✅ お気に入りボタンが表示される
- ✅ お気に入りに追加できる
- ✅ お気に入りから削除できる
- ✅ マイページでお気に入り一覧が表示される
- ✅ 未ログイン時は認証を促す
- ✅ モバイルで正常に表示される
```

### 5. ステータスの更新
Feature チケットのステータスを更新します：
```markdown
- 🟢 **Status**: Complete
- **Started**: 2025-10-23 14:30
- **Completed**: 2025-10-23 17:30
- **実績時間**: 3時間
```

### 6. Git コミット（実装内容）
実装内容をコミットします：
```bash
git add src/ drizzle/
git commit -m "機能追加: feature-001 お気に入りカフェ機能

- favorites テーブルの追加
- お気に入り API の実装
- お気に入りボタンコンポーネント
- マイページの作成
- お気に入り一覧の表示
- 認証チェックとエラーハンドリング"
```

### 7. PROGRESS.md の更新
`docs/ticket/feature/PROGRESS.md` を更新：
- 該当 Feature を「完了」セクションに移動
- 完了日時と所要時間を記録
- 進捗率を再計算
- 平均完了時間を更新

### 8. Git コミット（チケット更新）
チケット更新をコミットします：
```bash
git add docs/ticket/feature/
git commit -m "チケット完了: feature-001 お気に入りカフェ機能 (3h)"
```

### 9. 完了メッセージの表示
```markdown
## 🎉 Feature #1 が完了しました！

**タイトル**: お気に入りカフェ機能
**所要時間**: 3時間
**Priority**: High

### 実装した機能
- お気に入りの追加/削除
- マイページでの一覧表示
- 認証チェック
- レスポンシブデザイン
- エラーハンドリング

### 作成したファイル
- データベース: favorites テーブル
- API: /api/favorites
- コンポーネント: FavoriteButton, FavoriteList
- ページ: /mypage

### 更新されたファイル
- チケット: docs/ticket/feature/feature-001-favorite-cafe.md
- 進捗: docs/ticket/feature/PROGRESS.md

### 次のアクション
残りの Feature チケット: 3件
- High: 0件
- Medium: 2件
- Low: 1件

次の Feature に取り組むには:
/start-feature [番号]

または、Feature 一覧を確認:
/list-tickets
```

## 重要事項
- **必ず localhost での動作確認が完了していること**
- すべての実装チェックリストが完了していること
- すべてのテストケースをクリアしていること
- TypeScript と ESLint のエラーがないこと
- UI/UX 仕様を満たしていること
- レスポンシブデザインが適用されていること
- 認証が必要な機能は認証チェックが実装されていること
- 2回のコミット（実装、チケット更新）を必ず実行すること

## エラー時の対応
- Feature が「In Progress」ステータスでない場合: 警告を表示
- 完了条件を満たしていない場合: 不足している項目を指摘
- テストが失敗している場合: 修正を促す
- UI/UX 仕様を満たしていない場合: 修正を促す
