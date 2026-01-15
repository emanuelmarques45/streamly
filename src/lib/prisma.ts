import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "prisma/generated/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

if (!connectionString) {
  throw new Error(
    "DATABASE_URL environment variable is required but not set. " +
      "Please set it in your .env file"
  );
}

export { prisma };
