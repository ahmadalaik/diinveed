import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, UserRole } from "../generated/prisma/client";
import { auth } from "../lib/auth";

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
    email: "root@diinveed.test",
    role: UserRole.super_admin,
  },
  {
    name: "Ops Admin",
    email: "ops@diinveed.test",
    role: UserRole.admin,
  },
  {
    name: "Support Admin",
    email: "support@diinveed.test",
    role: UserRole.admin,
  },
  {
    name: "Alice",
    email: "alice@example.test",
    role: UserRole.user,
  },
  {
    name: "Bob",
    email: "bob@example.test",
    role: UserRole.user,
  },
  {
    name: "Carol",
    email: "carol@example.test",
    role: UserRole.user,
  },
];

async function main() {
  await prisma.guestRsvp.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  for (const u of SEED_USERS) {
    await auth.api.createUser({
      body: {
        email: u.email,
        password: PASSWORD,
        name: u.name,
        role: u.role as "user" | "admin",
        data: {
          emailVerified: true,
          status: "active",
        },
      },
    });
    console.log(`✔ created ${u.role.padEnd(11)} ${u.email}`);
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
