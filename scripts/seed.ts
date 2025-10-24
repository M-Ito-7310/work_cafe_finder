import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

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
