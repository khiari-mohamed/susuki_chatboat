const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.xncjrdjqixpvpgysaicw:Suzuki2025!222@aws-1-eu-west-1.pooler.supabase.com:5432/postgres'
    }
  }
});

async function resetUploadLimit() {
  try {
    console.log('🔄 Resetting upload tracking...');
    console.log('📡 Connecting to Supabase...');
    
    // Test connection first
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    const deleted = await prisma.uploadTracking.deleteMany({});
    
    console.log(`✅ Deleted ${deleted.count} upload records`);
    console.log('✅ Upload limit reset! You can now test OCR again.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetUploadLimit();
