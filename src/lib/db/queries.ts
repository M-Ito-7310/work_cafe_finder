import { db } from './index';
import { cafes, reports } from './schema';
import { eq, and, desc, sql, gte, lte } from 'drizzle-orm';
import type { CafesQueryParams, Cafe } from '@/types';

/**
 * 地図範囲内のカフェと最新投稿を取得
 */
export async function getCafesInBounds(params: CafesQueryParams): Promise<Cafe[]> {
  const { neLat, neLng, swLat, swLng, filters } = params;

  const query = db
    .select({
      id: cafes.id,
      name: cafes.name,
      address: cafes.address,
      latitude: cafes.latitude,
      longitude: cafes.longitude,
      placeId: cafes.placeId,
      createdAt: cafes.createdAt,
      updatedAt: cafes.updatedAt,
      latestReport: {
        id: reports.id,
        userId: reports.userId,
        seatStatus: reports.seatStatus,
        quietness: reports.quietness,
        wifi: reports.wifi,
        powerOutlets: reports.powerOutlets,
        comment: reports.comment,
        createdAt: reports.createdAt,
        updatedAt: reports.updatedAt,
      },
    })
    .from(cafes)
    .leftJoin(
      reports,
      and(
        eq(reports.cafeId, cafes.id),
        sql`${reports.id} = (
          SELECT id FROM ${reports}
          WHERE ${reports.cafeId} = ${cafes.id}
          ORDER BY ${reports.createdAt} DESC
          LIMIT 1
        )`
      )
    )
    .where(
      and(
        gte(cafes.latitude, swLat.toString()),
        lte(cafes.latitude, neLat.toString()),
        gte(cafes.longitude, swLng.toString()),
        lte(cafes.longitude, neLng.toString())
      )
    );

  const results = await query;

  // フィルタリング（メモリ上で実施）
  let filtered = results;

  if (filters) {
    filtered = results.filter((cafe: typeof results[0]) => {
      const report = cafe.latestReport;
      if (!report) return false;

      // 空席フィルター
      if (filters.seats && report.seatStatus !== 'available') {
        return false;
      }

      // 静かフィルター
      if (filters.quiet && report.quietness !== 'quiet') {
        return false;
      }

      // Wi-Fiフィルター
      if (filters.wifi && (report.wifi === 'none' || report.wifi === 'slow')) {
        return false;
      }

      // 電源フィルター
      if (filters.power && !report.powerOutlets) {
        return false;
      }

      return true;
    });
  }

  return filtered.map((row: typeof filtered[0]) => ({
    id: row.id,
    name: row.name,
    address: row.address,
    latitude: parseFloat(row.latitude),
    longitude: parseFloat(row.longitude),
    placeId: row.placeId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    latestReport: row.latestReport
      ? {
          id: row.latestReport.id,
          userId: row.latestReport.userId,
          cafeId: row.id,
          seatStatus: row.latestReport.seatStatus,
          quietness: row.latestReport.quietness,
          wifi: row.latestReport.wifi,
          powerOutlets: row.latestReport.powerOutlets,
          comment: row.latestReport.comment || undefined,
          createdAt: row.latestReport.createdAt,
          updatedAt: row.latestReport.updatedAt,
        }
      : null,
  }));
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
