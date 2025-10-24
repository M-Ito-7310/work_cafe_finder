import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from '../src/lib/db';
import { cafes, reports } from '../src/lib/db/schema';

async function seedDemo() {
  console.log('🌱 Seeding demo database...');

  // 渋谷エリアのワークに適したカフェを登録（交流会やイベント向け）
  const insertedCafes = await db
    .insert(cafes)
    .values([
      {
        name: 'WIRED SHIBUYA',
        address: '東京都渋谷区宇田川町20-15',
        latitude: '35.661600',
        longitude: '139.698000',
      },
      {
        name: 'TRUNK(HOTEL) LOUNGE',
        address: '東京都渋谷区神宮前5-31',
        latitude: '35.665500',
        longitude: '139.707800',
      },
      {
        name: 'THE LOCAL',
        address: '東京都渋谷区神南1-20-2',
        latitude: '35.663700',
        longitude: '139.700200',
      },
      {
        name: 'CAFFE VELOCE 渋谷センター街店',
        address: '東京都渋谷区宇田川町26-5',
        latitude: '35.661200',
        longitude: '139.698500',
      },
      {
        name: 'スターバックス 渋谷TSUTAYA店',
        address: '東京都渋谷区宇田川町21-6',
        latitude: '35.661800',
        longitude: '139.698200',
      },
      {
        name: 'Blue Bottle Coffee 渋谷カフェ',
        address: '東京都渋谷区神宮前6-19-17',
        latitude: '35.665100',
        longitude: '139.705500',
      },
      {
        name: 'ABOUT LIFE COFFEE BREWERS',
        address: '東京都渋谷区神宮前3-4-9',
        latitude: '35.668000',
        longitude: '139.710500',
      },
      {
        name: 'STREAMER COFFEE COMPANY 渋谷',
        address: '東京都渋谷区渋谷1-20-28',
        latitude: '35.659400',
        longitude: '139.703600',
      },
    ])
    .returning();

  console.log(`✅ ${insertedCafes.length} cafes added.`);

  // デモ用の投稿データ（最近の投稿として）
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);

  await db.insert(reports).values([
    {
      cafeId: insertedCafes[0].id,
      userId: 'demo-user-1',
      seatStatus: 'many' as const,
      quietness: 'quiet' as const,
      wifi: 'fast' as const,
      powerOutlets: true,
      comment: '電源とWi-Fi完備で作業しやすい！',
      createdAt: oneHourAgo,
    },
    {
      cafeId: insertedCafes[0].id,
      userId: 'demo-user-2',
      seatStatus: 'some' as const,
      quietness: 'normal' as const,
      wifi: 'fast' as const,
      powerOutlets: true,
      comment: '平日の昼間は少し混雑気味',
      createdAt: threeHoursAgo,
    },
    {
      cafeId: insertedCafes[1].id,
      userId: 'demo-user-3',
      seatStatus: 'few' as const,
      quietness: 'quiet' as const,
      wifi: 'normal' as const,
      powerOutlets: false,
      comment: 'おしゃれな空間。落ち着いて作業できます',
      createdAt: twoHoursAgo,
    },
    {
      cafeId: insertedCafes[2].id,
      userId: 'demo-user-4',
      seatStatus: 'many' as const,
      quietness: 'normal' as const,
      wifi: 'fast' as const,
      powerOutlets: true,
      comment: '広々していて快適。電源も豊富',
      createdAt: oneHourAgo,
    },
    {
      cafeId: insertedCafes[4].id,
      userId: 'demo-user-5',
      seatStatus: 'some' as const,
      quietness: 'noisy' as const,
      wifi: 'fast' as const,
      powerOutlets: true,
      comment: '人気店なので少し賑やか',
      createdAt: twoHoursAgo,
    },
    {
      cafeId: insertedCafes[5].id,
      userId: 'demo-user-6',
      seatStatus: 'few' as const,
      quietness: 'quiet' as const,
      wifi: 'normal' as const,
      powerOutlets: false,
      comment: 'コーヒーが美味しい！落ち着いた雰囲気',
      createdAt: threeHoursAgo,
    },
  ]);

  console.log('✅ Demo reports added.');
  console.log('🎉 Demo seeding completed!');
}

seedDemo()
  .catch((error) => {
    console.error('❌ Demo seeding failed:', error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
