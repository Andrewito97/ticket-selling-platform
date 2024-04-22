import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  await prisma.$connect();

  // Set initial data for fee settings
  const defaultFeeSetting = { serviceFeeRate: 10, minimumFee: 1 };
  await prisma.feeSettings.create({ data: defaultFeeSetting });

  console.log('Database seeding completed.');
}

seed()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
