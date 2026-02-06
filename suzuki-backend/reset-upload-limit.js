const { PrismaClient } = require('@prisma/client');

const LOCAL_URL = 'postgresql://postgres:23044943@localhost:5432/suzuki_parts?schema=public';
const PROD_URL = 'postgresql://postgres.xncjrdjqixpvpgysaicw:Suzuki2025!222@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

async function resetDatabase(name, url) {
  const prisma = new PrismaClient({
    datasources: { db: { url } }
  });

  try {
    console.log(`\n🔄 Resetting ${name}...`);
    await prisma.$connect();
    console.log(`✅ Connected to ${name}`);
    
    const deleted = await prisma.uploadTracking.deleteMany({});
    console.log(`✅ Deleted ${deleted.count} upload records from ${name}`);
  } catch (error) {
    console.error(`❌ Error with ${name}:`, error.message);
  } finally {
    await prisma.$disconnect();
  }
}

async function resetUploadLimit() {
  console.log('🚀 Resetting upload limits for LOCAL and PRODUCTION...\n');
  
  await resetDatabase('LOCAL (localhost)', LOCAL_URL);
  await resetDatabase('PRODUCTION (Supabase)', PROD_URL);
  
  console.log('\n✅ All databases reset! You can now test OCR again.');
}

resetUploadLimit();
