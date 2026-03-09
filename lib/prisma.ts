import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import "dotenv/config";

// ─── Adapter (passes pool config, not pool instance) ────────

// Log only once when the file is loaded
if (process.env.NODE_ENV === "development" || process.env.NEXT_PHASE === "phase-production-build") {
  console.log('Database Host:', process.env.DATABASE_HOST || "localhost");
  console.log('Database User:', process.env.DATABASE_USER);
  console.log('Database Name:', process.env.DATABASE_NAME);
}

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || "localhost",
  port: Number(process.env.DATABASE_PORT) || 3306,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 50,
  connectTimeout: 30000,
  acquireTimeout: 30000,
});

// ─── Client Singleton ───────────────────────────────────────

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
