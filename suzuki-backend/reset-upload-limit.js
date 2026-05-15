const { PrismaClient } = require('@prisma/client');
const os = require('os');

const LOCAL_URL = 'postgresql://postgres:23044943@localhost:5432/suzuki_parts?schema=public';

// Detect if running on server or local machine
const isServer = os.hostname().includes('vps') || os.hostname().includes('server');
const SERVER_URL = isServer 
  ? 'postgresql://postgres:23044943@localhost:5432/suzuki_parts?schema=public'  // Use localhost when on server
  : 'postgresql://postgres:23044943@5.199.136.2:5432/suzuki_parts?schema=public'; // Use IP when remote

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
  console.log('🚀 Resetting upload limits...\n');
  
  if (isServer) {
    console.log('📍 Running on SERVER - resetting server database only\n');
    await resetDatabase('SERVER (localhost)', SERVER_URL);
  } else {
    console.log('📍 Running on LOCAL machine - resetting both databases\n');
    await resetDatabase('LOCAL (localhost)', LOCAL_URL);
    await resetDatabase('SERVER (VPS - remote access disabled)', SERVER_URL);
  }
  
  console.log('\n✅ Database reset complete!');
}

resetUploadLimit();
