import { PrismaClient, Product, User } from "@prisma/client";
import bcrypt from "bcrypt";

export const usersToSeed: User[] = [
  {
    id: 1,
    email: "james.admin@email.com",
    firstName: "James",
    lastName: "Hetfield",
    passwordHash: bcrypt.hashSync("James123456*", 10),
    role: "Administrator",
  },
  {
    id: 2,
    email: "rodrigo.user@email.com",
    firstName: "Rodrigo",
    lastName: "Borgia",
    passwordHash: bcrypt.hashSync("Rodri123456*", 10),
    role: "User",
  },
  {
    id: 3,
    email: "naoe.user@email.com",
    firstName: "Naoe",
    lastName: "Bustamante",
    passwordHash: bcrypt.hashSync("Test123456*", 10),
    role: "User",
  },
];

export const productsToSeed: Product[] = [
  {
    id: 1,
    name: "Orange Juice",
    description: "Freshly squeezed from oranges",
    price: 2.0,
    quantity: 120,
  },
  {
    id: 2,
    name: "Salmon Fillet",
    description: "Rich in omega-3, from the sea",
    price: 8.5,
    quantity: 75,
  },
  {
    id: 3,
    name: "Granola Bar",
    description: "Oats and honey flavor",
    price: 1.2,
    quantity: 180,
  },
  {
    id: 4,
    name: "Chicken Breast",
    description: "Lean white meat",
    price: 6.0,
    quantity: 220,
  },
  {
    id: 5,
    name: "Blueberry",
    description: "Small and sweet, full of antioxidants",
    price: 4.0,
    quantity: 260,
  }
];

const prisma = new PrismaClient();

interface MaxIdResult {
  maxid: number | null;
}
async function resetSequence(tableName: string, sequenceName: string) {
  const maxIdResult: MaxIdResult[] = await prisma.$queryRawUnsafe(
    `SELECT MAX(id) as maxid FROM "${tableName}"`
  );
  const nextId = (maxIdResult[0].maxid ?? 0) + 1;
  await prisma.$queryRawUnsafe(
    `ALTER SEQUENCE "${sequenceName}" RESTART WITH ${nextId}`
  );
}

async function main() {
  for (const user of usersToSeed) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    });
  }
  await resetSequence("User", "User_id_seq");

  for (const product of productsToSeed) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: product,
    });
  }
  await resetSequence("Product", "Product_id_seq");
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
