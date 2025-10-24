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
