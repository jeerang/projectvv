import { prisma } from '../../src/lib/prisma';

/**
 * Truncate all tables between integration tests to ensure test isolation.
 */
export async function truncateAll(): Promise<void> {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "Vote", "Candidate", "User", "Party", "Constituency" RESTART IDENTITY CASCADE;
  `);
}
