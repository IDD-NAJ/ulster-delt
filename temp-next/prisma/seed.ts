import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Lord471@1761', 12);
  
  // Create admin user if it doesn't exist
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@ulsterdelt.com' },
    update: {},
    create: {
      email: 'admin@ulsterdelt.com',
      name: 'System Admin',
      hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log('Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 