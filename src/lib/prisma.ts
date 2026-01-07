import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// IMPORTANT: Do not initialize Prisma at module load time.
// This prevents Vercel/Next build-time evaluation from crashing.
export function getPrisma(): PrismaClient {
  if (global.prisma) return global.prisma;

  const client = new PrismaClient();
  global.prisma = client;

  return client;
}
