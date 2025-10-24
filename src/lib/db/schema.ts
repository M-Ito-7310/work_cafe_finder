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
