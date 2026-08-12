import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "prisma/generated/client";

const connectionString = process.env.DATABASE_URL;

// This check used to run after the client was already created, and compared a
// template string, which is never falsy.
if (!connectionString) {
  throw new Error(
    "DATABASE_URL environment variable is required but not set. " +
      "Please set it in your .env file"
  );
}

function createPrismaClient() {
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

// Hot reload re-evaluates this module in dev; without the singleton every
// reload opened a new connection pool until Postgres refused more.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { prisma };
