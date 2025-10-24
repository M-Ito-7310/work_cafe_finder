import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from '../src/lib/db';
import { cafes, users, reports } from '../src/lib/db/schema';

async function verifyDatabase() {
  console.log('🔍 Verifying database...\n');

  try {
    // Check cafes table
    console.log('📍 Cafes table:');
    const allCafes = await db.select().from(cafes);
    console.log(`   Found ${allCafes.length} cafes`);
    allCafes.forEach((cafe, index) => {
      console.log(`   ${index + 1}. ${cafe.name}`);
      console.log(`      Address: ${cafe.address}`);
      console.log(`      Coordinates: (${cafe.latitude}, ${cafe.longitude})`);
    });

    console.log('\n👥 Users table:');
    const allUsers = await db.select().from(users);
    console.log(`   Found ${allUsers.length} users`);

    console.log('\n📝 Reports table:');
    const allReports = await db.select().from(reports);
    console.log(`   Found ${allReports.length} reports`);

    console.log('\n✅ Database verification completed!');
    console.log('\nSummary:');
    console.log(`   - Cafes: ${allCafes.length}`);
    console.log(`   - Users: ${allUsers.length}`);
    console.log(`   - Reports: ${allReports.length}`);

  } catch (error) {
    console.error('❌ Database verification failed:', error);
    process.exit(1);
  }
}

verifyDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
