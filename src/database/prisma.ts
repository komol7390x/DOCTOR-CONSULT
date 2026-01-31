import 'dotenv/config';
import pg from 'pg';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from 'config/config';

const pool = new pg.Pool({ connectionString: config.DATABASE_URL });
const adapter = new PrismaPg(pool);
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (config.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

(async () => {
  try {
    await prisma.$connect();
    console.log('\x1b[32m%s\x1b[0m', '📂 Prisma: Database connected successfully');
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Prisma: Database connection failed!');
    console.error(error);
    process.exit(1);
  }
})();
