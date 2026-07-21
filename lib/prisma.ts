import "dotenv/config";
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
  connectionLimit: 2,
  minimumIdle: 1,
  connectTimeout: 10_000,
  acquireTimeout: 20_000,
  idleTimeout: 60,
  ssl: {
    rejectUnauthorized: true,
  },
});

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
