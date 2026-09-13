// scripts/seed-admin-user.ts
//
// Creates (or promotes) the first ADMIN account for the dashboard.
// Run once after migrating: npm run admin:seed
//
// Reads from env vars so it can run non-interactively in CI/deploy:
//   SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_ADMIN_NAME
// Falls back to CLI args: ts-node scripts/seed-admin-user.ts <email> <password> "<name>"

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || process.argv[2];
  const password = process.env.SEED_ADMIN_PASSWORD || process.argv[3];
  const name = process.env.SEED_ADMIN_NAME || process.argv[4] || 'Admin CarPro';

  if (!email || !password) {
    console.error(
      'Usage: SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD=... npm run admin:seed\n' +
        '   or: npx ts-node scripts/seed-admin-user.ts admin@carpro.tn "MotDePasse!23456" "Nom Complet"',
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('❌ Password must be at least 8 characters long.');
    process.exit(1);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const existing = await prisma.adminUser.findUnique({ where: { email: normalizedEmail } });

  if (existing) {
    const updated = await prisma.adminUser.update({
      where: { email: normalizedEmail },
      data: { passwordHash, name, role: 'ADMIN', isActive: true },
    });
    console.log(`✅ Existing account promoted to ADMIN and password reset: ${updated.email}`);
  } else {
    const created = await prisma.adminUser.create({
      data: { email: normalizedEmail, passwordHash, name, role: 'ADMIN' },
    });
    console.log(`✅ Admin account created: ${created.email} (id=${created.id})`);
  }
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
