import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
async function main() {
  await prisma.user.deleteMany({});

  for (let i = 0; i < 100; i++) {
    const hashedPassword = await bcrypt.hash(faker.internet.password(), 10);

    await prisma.user.create({
      data: {
        id: uuidv4(),
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: hashedPassword,
        role: 'AGENT',
        deleted: false,
        enable: faker.datatype.boolean(),
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
