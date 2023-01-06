import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
async function main() {
  await prisma.proofOfLife.deleteMany({});

  for (let i = 0; i < 500; i++) {
    await prisma.proofOfLife.create({
      data: {
        id: uuidv4(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phone: faker.phone.number(),
        npi: faker.datatype.string(10),
        deviceProofId: uuidv4(),
        proofDeviceCreatedDate: faker.date.past(),
        registrationNumber: faker.datatype.string(10),
        createdAt: faker.date.past(),
        cardNumber: faker.finance.creditCardNumber(),
        dateOfBirth: faker.date.past(),
        placeOfBirth: faker.address.city(),
        profession: faker.name.jobType(),
        device: {
          create: {
            id: uuidv4(),
            reference: uuidv4(),
            compliance: faker.datatype.boolean(),
            enable: faker.datatype.boolean(),
            createdAt: faker.date.past(),
          },
        },
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
