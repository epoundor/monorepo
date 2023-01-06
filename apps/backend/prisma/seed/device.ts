import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
async function main() {
  await prisma.device.deleteMany({});

  for (let i = 0; i < 50; i++) {
    await prisma.device.create({
      data: {
        id: uuidv4(),
        reference: uuidv4(),
        compliance: faker.datatype.boolean(),
        enable: faker.datatype.boolean(),
        deleted: false,
        createdAt: faker.date.past(),
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
