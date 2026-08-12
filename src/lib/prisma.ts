import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "prisma/generated/client";

const connectionString = process.env.DATABASE_URL;

// A checagem antes acontecia depois do client já ter sido criado — e usava
// template string, o que nunca resultava em valor falsy.
if (!connectionString) {
  throw new Error(
    "DATABASE_URL environment variable is required but not set. " +
      "Please set it in your .env file"
  );
}

function createPrismaClient() {
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

// Em dev o hot reload reavalia o módulo; sem o singleton cada reload abria um
// novo pool de conexões até o Postgres recusar novas.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { prisma };
