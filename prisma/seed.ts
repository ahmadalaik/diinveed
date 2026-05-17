import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT
    ? Number(process.env.DATABASE_PORT)
    : undefined,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

const PASSWORD = "password123";

const SEED_USERS = [
  {
    name: "Root Admin",
    username: "root",
    email: "root@diinveed.test",
    role: "super_admin" as const,
  },
  {
    name: "Ops Admin",
    username: "ops",
    email: "ops@diinveed.test",
    role: "admin" as const,
  },
  {
    name: "Support Admin",
    username: "support",
    email: "support@diinveed.test",
    role: "admin" as const,
  },
  {
    name: "Alice",
    email: "alice@example.test",
    username: "alice17",
    role: "user" as const,
  },
  {
    name: "Bob",
    email: "bob@example.test",
    username: "bob99",
    role: "user" as const,
  },
  {
    name: "Carol",
    email: "carol@example.test",
    username: "carol21",
    role: "user" as const,
  },
];

async function main() {
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash(PASSWORD, 10);

  for (const u of SEED_USERS) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { role: u.role, status: "active", deletedAt: null },
      create: {
        name: u.name,
        username: u.username,
        email: u.email,
        password: hash,
        role: u.role,
        status: "active",
      },
    });
    console.log(`✔ upserted ${u.role.padEnd(11)} ${u.email}`);
  }

  console.log(`\nAll seeded accounts use password: ${PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
