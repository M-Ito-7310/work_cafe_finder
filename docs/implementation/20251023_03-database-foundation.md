# Phase 3: データベース構築

**Phase**: 3/11
**見積もり時間**: 45-60分
**優先度**: Critical
**依存関係**: Phase 1

---

## 📋 Phase概要

Neon PostgreSQLとDrizzle ORMの設定を行います。データベーススキーマの定義、マイグレーション実行、シードデータの投入を完了します。

## ✅ 目標

- ✅ Neon PostgreSQLデータベースの作成
- ✅ Drizzle ORMスキーマ定義の完成
- ✅ マイグレーション実行
- ✅ シードデータ投入（東京駅周辺のカフェ）
- ✅ データベースクエリ関数の実装

---

## 📝 実装タスク

### 1. Neon PostgreSQLセットアップ

**手順:**
1. https://neon.tech にアクセスしてアカウント作成
2. 新しいプロジェクト作成: `work-cafe-finder`
3. データベース名: `workcafe`
4. リージョン: 最寄りのリージョン（例: Tokyo）
5. 接続文字列（Connection String）をコピー

**.env.local に追加:**
```env
DATABASE_URL="postgresql://username:password@ep-xxx.neon.tech/workcafe?sslmode=require"
```

### 2. Drizzle ORMスキーマ定義

**src/lib/db/schema.ts:**
```typescript
import { pgTable, uuid, varchar, timestamp, decimal, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ========================================
// Enums
// ========================================

export const seatStatusEnum = pgEnum('seat_status', ['available', 'crowded', 'full']);
export const quietnessEnum = pgEnum('quietness', ['quiet', 'normal', 'noisy']);
export const wifiEnum = pgEnum('wifi', ['fast', 'normal', 'slow', 'none']);

// ========================================
// Tables
// ========================================

// Users テーブル（NextAuth用）
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  image: varchar('image', { length: 512 }),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Cafes テーブル
export const cafes = pgTable('cafes', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: varchar('address', { length: 512 }).notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 7 }).notNull(),
  longitude: decimal('longitude', { precision: 10, scale: 7 }).notNull(),
  placeId: varchar('place_id', { length: 255 }).unique(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Reports テーブル
export const reports = pgTable('reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  cafeId: uuid('cafe_id').notNull().references(() => cafes.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  seatStatus: seatStatusEnum('seat_status').notNull(),
  quietness: quietnessEnum('quietness').notNull(),
  wifi: wifiEnum('wifi').notNull(),
  powerOutlets: boolean('power_outlets').notNull(),
  comment: varchar('comment', { length: 50 }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// NextAuth関連テーブル
export const accounts = pgTable('accounts', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  refresh_token: varchar('refresh_token', { length: 512 }),
  access_token: varchar('access_token', { length: 512 }),
  expires_at: timestamp('expires_at', { mode: 'date' }),
  token_type: varchar('token_type', { length: 255 }),
  scope: varchar('scope', { length: 255 }),
  id_token: varchar('id_token', { length: 2048 }),
  session_state: varchar('session_state', { length: 255 }),
});

export const sessions = pgTable('sessions', {
  sessionToken: varchar('session_token', { length: 255 }).primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable('verification_tokens', {
  identifier: varchar('identifier', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

// ========================================
// Relations
// ========================================

export const usersRelations = relations(users, ({ many }) => ({
  reports: many(reports),
}));

export const cafesRelations = relations(cafes, ({ many }) => ({
  reports: many(reports),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  cafe: one(cafes, {
    fields: [reports.cafeId],
    references: [cafes.id],
  }),
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
}));
```

### 3. Neon接続設定

**src/lib/db/index.ts:**
```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

### 4. データベースクエリ関数

**src/lib/db/queries.ts:**
```typescript
import { db } from './index';
import { cafes, reports } from './schema';
import { eq, and, between, desc, sql } from 'drizzle-orm';
import type { CafesQueryParams } from '@/types';

/**
 * 地図範囲内のカフェと最新投稿を取得
 */
export async function getCafesInBounds(params: CafesQueryParams) {
  const { neLat, neLng, swLat, swLng, filters } = params;

  const conditions: any[] = [
    between(cafes.latitude, swLat.toString(), neLat.toString()),
    between(cafes.longitude, swLng.toString(), neLng.toString()),
  ];

  // フィルター条件の追加
  if (filters) {
    if (filters.seats) conditions.push(eq(reports.seatStatus, 'available'));
    if (filters.quiet) conditions.push(eq(reports.quietness, 'quiet'));
    if (filters.wifi) conditions.push(eq(reports.wifi, 'fast'));
    if (filters.power) conditions.push(eq(reports.powerOutlets, true));
  }

  const result = await db
    .select({
      cafe: cafes,
      latestReport: reports,
    })
    .from(cafes)
    .leftJoin(
      reports,
      and(
        eq(cafes.id, reports.cafeId),
        sql`${reports.createdAt} > NOW() - INTERVAL '24 hours'`
      )
    )
    .where(and(...conditions))
    .orderBy(desc(reports.createdAt));

  return result;
}

/**
 * カフェ詳細と投稿履歴を取得
 */
export async function getCafeWithReports(cafeId: string) {
  const cafe = await db.query.cafes.findFirst({
    where: eq(cafes.id, cafeId),
    with: {
      reports: {
        orderBy: [desc(reports.createdAt)],
        limit: 20,
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  return cafe;
}

/**
 * 投稿を作成
 */
export async function createReport(data: {
  cafeId: string;
  userId: string;
  seatStatus: 'available' | 'crowded' | 'full';
  quietness: 'quiet' | 'normal' | 'noisy';
  wifi: 'fast' | 'normal' | 'slow' | 'none';
  powerOutlets: boolean;
  comment?: string;
}) {
  const [newReport] = await db.insert(reports).values(data).returning();
  return newReport;
}

/**
 * すべてのカフェを取得
 */
export async function getAllCafes() {
  return await db.select().from(cafes);
}
```

### 5. マイグレーション実行

```bash
# マイグレーションファイル生成
npx drizzle-kit generate:pg

# データベースに適用
npx drizzle-kit push:pg

# Drizzle Studioで確認（オプション）
npx drizzle-kit studio
```

### 6. シードデータ投入

**scripts/seed.ts:**
```typescript
import { db } from '../src/lib/db';
import { cafes } from '../src/lib/db/schema';

async function seed() {
  console.log('🌱 Seeding database...');

  // 東京駅周辺のカフェを登録
  await db.insert(cafes).values([
    {
      name: 'スターバックス 東京駅グランルーフフロント店',
      address: '東京都千代田区丸の内1-9-1',
      latitude: '35.681200',
      longitude: '139.767100',
    },
    {
      name: 'ドトールコーヒーショップ 丸の内北口店',
      address: '東京都千代田区丸の内1-9-1',
      latitude: '35.681500',
      longitude: '139.766500',
    },
    {
      name: 'タリーズコーヒー 丸の内オアゾ店',
      address: '東京都千代田区丸の内1-6-4',
      latitude: '35.682000',
      longitude: '139.766000',
    },
    {
      name: 'サンマルクカフェ 東京駅八重洲北口店',
      address: '東京都千代田区丸の内1-9-1',
      latitude: '35.681800',
      longitude: '139.767500',
    },
    {
      name: 'コメダ珈琲店 丸の内店',
      address: '東京都千代田区丸の内3-1-1',
      latitude: '35.679500',
      longitude: '139.764000',
    },
  ]);

  console.log('✅ Seeding completed! 5 cafes added.');
}

seed()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
```

**package.jsonにスクリプト追加:**
```json
{
  "scripts": {
    "db:seed": "tsx scripts/seed.ts"
  }
}
```

**実行:**
```bash
npm run db:seed
```

---

## 📦 成果物

### 完了チェックリスト

- [ ] Neon PostgreSQLデータベースが作成されている
- [ ] DATABASE_URLが.env.localに設定されている
- [ ] src/lib/db/schema.ts が作成されている
- [ ] src/lib/db/index.ts が作成されている
- [ ] src/lib/db/queries.ts が作成されている
- [ ] マイグレーションが実行されている
- [ ] シードデータが投入されている
- [ ] Drizzle Studioでデータを確認できる

### 動作確認

#### 1. データベース接続確認
```bash
npx drizzle-kit studio
```
→ http://localhost:4983 でDrizzle Studioが開く

#### 2. テーブル確認
- users テーブルが存在する
- cafes テーブルが存在する
- reports テーブルが存在する
- accounts, sessions, verification_tokens テーブルが存在する

#### 3. シードデータ確認
- cafes テーブルに5件のカフェデータが存在する

---

## 🧪 テスト項目

| テスト項目 | 確認方法 | 期待結果 |
|-----------|---------|---------|
| DB接続 | Drizzle Studio起動 | 正常に接続 |
| テーブル作成 | Studio確認 | 全テーブル存在 |
| シードデータ | Studio確認 | 5件のカフェデータ |
| クエリ実行 | `getAllCafes()`テスト | データ取得成功 |

---

## ⚠️ トラブルシューティング

### 問題1: DATABASE_URLが見つからない

**原因**: .env.localが作成されていない

**解決策**:
```bash
# .env.localを作成
cp .env.example .env.local
# DATABASE_URLを編集
```

### 問題2: マイグレーションエラー

**原因**: Neon接続情報が正しくない

**解決策**:
1. Neon Consoleで接続文字列を再確認
2. `?sslmode=require` が含まれているか確認
3. ユーザー名・パスワードが正しいか確認

### 問題3: シードデータ投入エラー

**原因**: テーブルが存在しない

**解決策**:
```bash
# マイグレーションを再実行
npx drizzle-kit push:pg
```

### 問題4: TypeScriptエラー

**原因**: 型定義が不完全

**解決策**:
```bash
# Phase 2の型定義を確認
# src/types/cafe.ts, report.ts, api.ts が存在するか確認
```

---

## 📚 参考資料

- [Drizzle ORM 公式ドキュメント](https://orm.drizzle.team/)
- [Neon PostgreSQL](https://neon.tech/docs)
- [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)
- [PostgreSQL データ型](https://www.postgresql.org/docs/current/datatype.html)

---

## 🎯 次のPhase

Phase 3が完了したら、**Phase 4: 認証機能実装** (`20251023_04-authentication-setup.md`) に進みます。

---

**Phase完了日**: ___________
**実績時間**: ___________
**担当者**: ___________
**レビュー**: ___________
