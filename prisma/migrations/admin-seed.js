const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = 'Admin@123';
  const hashedPassword = await hash(adminPassword, 12);

  // Create basic user first
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ulsterdelt.com' },
    update: {},
    create: {
      email: 'admin@ulsterdelt.com',
      hashedPassword: hashedPassword,
      firstName: 'Roger',
      lastName: 'Beaudry',
      dateOfBirth: '1990-01-01'
    },
  });

  // Set admin role directly in database
  await prisma.$executeRaw`UPDATE "User" SET role = 'ADMIN' WHERE id = ${admin.id}`;

  console.log('Admin user created successfully:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 