# Database Schema

## データベース設計概要

WorkCafeFinderは、Neon PostgreSQL + Drizzle ORMを使用します。このドキュメントでは、データベースのテーブル構造とリレーションシップを定義します。

## ER図

```
┌─────────────────┐
│     users       │
│─────────────────│
│ id (PK)         │
│ email           │
│ name            │
│ image           │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐       ┌─────────────────┐
│    reports      │   N:1 │     cafes       │
│─────────────────│◄──────│─────────────────│
│ id (PK)         │       │ id (PK)         │
│ cafe_id (FK)    │       │ name            │
│ user_id (FK)    │       │ address         │
│ seat_status     │       │ latitude        │
│ quietness       │       │ longitude       │
│ wifi            │       │ created_at      │
│ power_outlets   │       │ updated_at      │
│ comment         │       └─────────────────┘
│ created_at      │
│ updated_at      │
└─────────────────┘
```

## テーブル定義

### 1. users テーブル

**概要**: NextAuth.jsで管理されるユーザー情報。

**Drizzle Schema** (`src/lib/db/schema.ts`):
```typescript
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  image: varchar('image', { length: 512 }),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});
```

**カラム詳細**:

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PK | ユーザーID（自動生成） |
| email | VARCHAR(255) | NOT NULL, UNIQUE | メールアドレス（OAuth経由） |
| name | VARCHAR(255) | - | 表示名（OAuth経由） |
| image | VARCHAR(512) | - | プロフィール画像URL |
| email_verified | TIMESTAMP | - | メール認証日時（NextAuth用） |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `email` (UNIQUE)

**サンプルデータ**:
```sql
INSERT INTO users (id, email, name, image) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'user@example.com', 'John Doe', 'https://example.com/avatar.jpg');
```

---

### 2. cafes テーブル

**概要**: カフェのマスターデータ（店名、住所、位置情報）。

**Drizzle Schema**:
```typescript
export const cafes = pgTable('cafes', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: varchar('address', { length: 512 }).notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 7 }).notNull(),
  longitude: decimal('longitude', { precision: 10, scale: 7 }).notNull(),
  placeId: varchar('place_id', { length: 255 }).unique(), // Google Place ID（将来的）
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});
```

**カラム詳細**:

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PK | カフェID（自動生成） |
| name | VARCHAR(255) | NOT NULL | カフェ名 |
| address | VARCHAR(512) | NOT NULL | 住所 |
| latitude | DECIMAL(10,7) | NOT NULL | 緯度（例: 35.6812345） |
| longitude | DECIMAL(10,7) | NOT NULL | 経度（例: 139.7671234） |
| place_id | VARCHAR(255) | UNIQUE | Google Place ID（将来的な連携用） |
| created_at | TIMESTAMP | NOT NULL | 登録日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `latitude, longitude` (複合インデックス、地理検索用)
- `place_id` (UNIQUE)

**サンプルデータ**（東京駅周辺のカフェ）:
```sql
INSERT INTO cafes (id, name, address, latitude, longitude) VALUES
('cafe-001', 'スターバックス 東京駅グランルーフフロント店', '東京都千代田区丸の内1-9-1', 35.6812, 139.7671),
('cafe-002', 'ドトールコーヒーショップ 丸の内北口店', '東京都千代田区丸の内1-9-1', 35.6815, 139.7665),
('cafe-003', 'タリーズコーヒー 丸の内オアゾ店', '東京都千代田区丸の内1-6-4', 35.6820, 139.7660);
```

**地理検索クエリ例**:
```typescript
// 指定範囲内のカフェを取得
const cafes = await db
  .select()
  .from(cafesTable)
  .where(
    and(
      between(cafesTable.latitude, southWestLat, northEastLat),
      between(cafesTable.longitude, southWestLng, northEastLng)
    )
  );
```

---

### 3. reports テーブル

**概要**: ユーザーが投稿したカフェの状態情報。

**Drizzle Schema**:
```typescript
import { pgEnum } from 'drizzle-orm/pg-core';

// Enum定義
export const seatStatusEnum = pgEnum('seat_status', ['available', 'crowded', 'full']);
export const quietnessEnum = pgEnum('quietness', ['quiet', 'normal', 'noisy']);
export const wifiEnum = pgEnum('wifi', ['fast', 'normal', 'slow', 'none']);

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
```

**カラム詳細**:

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PK | 投稿ID（自動生成） |
| cafe_id | UUID | FK, NOT NULL | カフェID（外部キー） |
| user_id | UUID | FK, NOT NULL | ユーザーID（外部キー） |
| seat_status | ENUM | NOT NULL | 空席状況: 'available', 'crowded', 'full' |
| quietness | ENUM | NOT NULL | 静かさ: 'quiet', 'normal', 'noisy' |
| wifi | ENUM | NOT NULL | Wi-Fi速度: 'fast', 'normal', 'slow', 'none' |
| power_outlets | BOOLEAN | NOT NULL | 電源席の有無 |
| comment | VARCHAR(50) | - | コメント（任意） |
| created_at | TIMESTAMP | NOT NULL | 投稿日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `cafe_id` (FK、頻繁に結合)
- `user_id` (FK)
- `created_at` (降順、鮮度判定用)
- `cafe_id, created_at` (複合インデックス、カフェの最新投稿取得用)

**外部キー制約**:
- `cafe_id` → `cafes.id` (ON DELETE CASCADE)
- `user_id` → `users.id` (ON DELETE CASCADE)

**サンプルデータ**:
```sql
INSERT INTO reports (id, cafe_id, user_id, seat_status, quietness, wifi, power_outlets, comment, created_at) VALUES
('report-001', 'cafe-001', '550e8400-e29b-41d4-a716-446655440000', 'available', 'quiet', 'fast', true, '窓側の席が空いてます', NOW() - INTERVAL '15 minutes'),
('report-002', 'cafe-001', '550e8400-e29b-41d4-a716-446655440000', 'crowded', 'normal', 'fast', true, NULL, NOW() - INTERVAL '2 hours'),
('report-003', 'cafe-002', '550e8400-e29b-41d4-a716-446655440000', 'full', 'noisy', 'normal', false, NULL, NOW() - INTERVAL '5 hours');
```

---

### 4. NextAuth関連テーブル

NextAuth.jsのDrizzle Adapterが自動生成するテーブル:

#### accounts テーブル
**概要**: OAuth認証プロバイダー情報。

```typescript
export const accounts = pgTable('accounts', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: varchar('token_type', { length: 255 }),
  scope: varchar('scope', { length: 255 }),
  id_token: text('id_token'),
  session_state: varchar('session_state', { length: 255 }),
}, (table) => ({
  pk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
}));
```

#### sessions テーブル
**概要**: セッション情報（JWTベースの場合、使用しない可能性あり）。

```typescript
export const sessions = pgTable('sessions', {
  sessionToken: varchar('session_token', { length: 255 }).primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});
```

#### verification_tokens テーブル
**概要**: メール認証トークン（MVP段階では未使用）。

```typescript
export const verificationTokens = pgTable('verification_tokens', {
  identifier: varchar('identifier', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.identifier, table.token] }),
}));
```

---

## リレーションシップ定義

**Drizzle Relations** (`src/lib/db/schema.ts`):
```typescript
import { relations } from 'drizzle-orm';

// usersとreportsのリレーション
export const usersRelations = relations(users, ({ many }) => ({
  reports: many(reports),
}));

// cafesとreportsのリレーション
export const cafesRelations = relations(cafes, ({ many }) => ({
  reports: many(reports),
}));

// reportsのリレーション
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

**使用例**:
```typescript
// カフェとその最新投稿を取得
const cafeWithReports = await db.query.cafes.findFirst({
  where: eq(cafes.id, cafeId),
  with: {
    reports: {
      orderBy: [desc(reports.createdAt)],
      limit: 10,
      with: {
        user: true,
      },
    },
  },
});
```

---

## クエリ例

### 1. 地図範囲内のカフェと最新投稿を取得

```typescript
import { db } from '@/lib/db';
import { cafes, reports } from '@/lib/db/schema';
import { and, between, desc, eq, sql } from 'drizzle-orm';

export async function getCafesInBounds(
  bounds: { neLat: number; neLng: number; swLat: number; swLng: number }
) {
  const { neLat, neLng, swLat, swLng } = bounds;

  // 地図範囲内のカフェを取得し、最新の投稿を結合
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
        // 3時間以内の投稿のみ
        sql`${reports.createdAt} > NOW() - INTERVAL '3 hours'`
      )
    )
    .where(
      and(
        between(cafes.latitude, swLat, neLat),
        between(cafes.longitude, swLng, neLng)
      )
    )
    .orderBy(desc(reports.createdAt));

  return result;
}
```

### 2. カフェの詳細と投稿履歴を取得

```typescript
export async function getCafeWithReports(cafeId: string) {
  const cafe = await db.query.cafes.findFirst({
    where: eq(cafes.id, cafeId),
    with: {
      reports: {
        orderBy: [desc(reports.createdAt)],
        limit: 20, // 直近20件
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
```

### 3. フィルタリング付きカフェ取得

```typescript
export async function getCafesWithFilters(
  bounds: Bounds,
  filters: {
    seats?: boolean;
    quiet?: boolean;
    wifi?: boolean;
    power?: boolean;
  }
) {
  const conditions = [
    between(cafes.latitude, bounds.swLat, bounds.neLat),
    between(cafes.longitude, bounds.swLng, bounds.neLng),
    sql`${reports.createdAt} > NOW() - INTERVAL '3 hours'`, // 3時間以内
  ];

  if (filters.seats) {
    conditions.push(eq(reports.seatStatus, 'available'));
  }
  if (filters.quiet) {
    conditions.push(eq(reports.quietness, 'quiet'));
  }
  if (filters.wifi) {
    conditions.push(eq(reports.wifi, 'fast'));
  }
  if (filters.power) {
    conditions.push(eq(reports.powerOutlets, true));
  }

  const result = await db
    .select({
      cafe: cafes,
      latestReport: reports,
    })
    .from(cafes)
    .innerJoin(reports, eq(cafes.id, reports.cafeId))
    .where(and(...conditions))
    .orderBy(desc(reports.createdAt));

  return result;
}
```

### 4. 投稿の作成

```typescript
export async function createReport(data: {
  cafeId: string;
  userId: string;
  seatStatus: 'available' | 'crowded' | 'full';
  quietness: 'quiet' | 'normal' | 'noisy';
  wifi: 'fast' | 'normal' | 'slow' | 'none';
  powerOutlets: boolean;
  comment?: string;
}) {
  const [newReport] = await db
    .insert(reports)
    .values(data)
    .returning();

  return newReport;
}
```

---

## マイグレーション

### Drizzle Kit設定 (`drizzle.config.ts`)

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### マイグレーション実行

```bash
# スキーマからマイグレーションファイル生成
npx drizzle-kit generate:pg

# マイグレーションをデータベースに適用
npx drizzle-kit push:pg

# Drizzle Studioでデータベース確認
npx drizzle-kit studio
```

---

## 初期データ投入（シード）

**`scripts/seed.ts`**:
```typescript
import { db } from '../src/lib/db';
import { cafes } from '../src/lib/db/schema';

async function seed() {
  console.log('Seeding database...');

  // 東京駅周辺のカフェを登録
  await db.insert(cafes).values([
    {
      name: 'スターバックス 東京駅グランルーフフロント店',
      address: '東京都千代田区丸の内1-9-1',
      latitude: '35.6812',
      longitude: '139.7671',
    },
    {
      name: 'ドトールコーヒーショップ 丸の内北口店',
      address: '東京都千代田区丸の内1-9-1',
      latitude: '35.6815',
      longitude: '139.7665',
    },
    {
      name: 'タリーズコーヒー 丸の内オアゾ店',
      address: '東京都千代田区丸の内1-6-4',
      latitude: '35.6820',
      longitude: '139.7660',
    },
    // 交流会会場周辺のカフェを追加する
  ]);

  console.log('Seeding completed!');
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
```

**実行**:
```bash
npx tsx scripts/seed.ts
```

---

## パフォーマンス最適化

### 1. インデックス戦略
- `cafes` テーブル: `(latitude, longitude)` 複合インデックス
- `reports` テーブル: `(cafe_id, created_at DESC)` 複合インデックス

### 2. クエリ最適化
- `LIMIT` 句を使用して取得件数を制限
- 不要なカラムは `select` で明示的に除外
- `LEFT JOIN` vs `INNER JOIN` の使い分け

### 3. 将来的な最適化（スコープ外）
- PostGIS拡張（地理検索の高速化）
- パーティショニング（古いレポートの分離）
- マテリアライズドビュー（カフェ統計の事前計算）

---

## データ保持ポリシー

### MVP段階
- すべてのデータを無期限保持

### 将来的なポリシー（検討事項）
- 24時間以上経過した投稿は「履歴」として扱う
- 6ヶ月以上経過した投稿は削除（GDPR対応）
- 削除されたユーザーの投稿はカスケード削除

---

## バックアップ戦略

### Neon PostgreSQL
- 自動バックアップ機能を有効化
- ポイントインタイムリカバリ（PITR）を設定

### 将来的な対策
- 定期的なエクスポート（CSV/SQL）
- 別リージョンへのレプリケーション
