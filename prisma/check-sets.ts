import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sets = await prisma.set.findMany();
  console.log('Existing sets:', sets);

  const cards = await prisma.card.findMany({
    take: 5,
    include: { set: true },
  });
  console.log('Sample cards with their sets:', cards);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
