import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Skip database initialization during build if DATABASE_URL is not set
const DATABASE_URL = process.env.DATABASE_URL || '';

const sql = DATABASE_URL ? neon(DATABASE_URL) : null;
export const db = sql ? drizzle(sql, { schema }) : ({} as any);
