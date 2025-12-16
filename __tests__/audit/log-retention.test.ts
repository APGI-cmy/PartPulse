/**
 * Log Retention Tests
 * 
 * Validates log querying and retention capabilities
 * 
 * @jest-environment node
 */

import { PrismaClient } from '@prisma/client';

describe('Log Retention', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should query logs by date range', async () => {
    const now = new Date();
    const pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago

    // Create logs with different timestamps
    await prisma.systemLog.create({
      data: {
        eventType: 'retention_test',
        action: 'recent_action',
        timestamp: now,
        success: true,
      },
    });

    const recentLogs = await prisma.systemLog.findMany({
      where: {
        eventType: 'retention_test',
        timestamp: { gte: pastDate },
      },
    });

    expect(recentLogs.length).toBeGreaterThan(0);

    // Cleanup
    await prisma.systemLog.deleteMany({
      where: { eventType: 'retention_test' },
    });
  });

  it('should query logs by user', async () => {
    await prisma.systemLog.createMany({
      data: [
        { eventType: 'user_query_test', action: 'action1', userId: 'user-A', success: true },
        { eventType: 'user_query_test', action: 'action2', userId: 'user-A', success: true },
        { eventType: 'user_query_test', action: 'action3', userId: 'user-B', success: true },
      ],
    });

    const userALogs = await prisma.systemLog.findMany({
      where: {
        userId: 'user-A',
        eventType: 'user_query_test',
      },
    });

    expect(userALogs.length).toBe(2);

    // Cleanup
    await prisma.systemLog.deleteMany({
      where: { eventType: 'user_query_test' },
    });
  });

  it('should query logs by action type', async () => {
    await prisma.systemLog.createMany({
      data: [
        { eventType: 'action_query_test', action: 'create', success: true },
        { eventType: 'action_query_test', action: 'update', success: true },
        { eventType: 'action_query_test', action: 'create', success: true },
      ],
    });

    const createLogs = await prisma.systemLog.findMany({
      where: {
        eventType: 'action_query_test',
        action: 'create',
      },
    });

    expect(createLogs.length).toBe(2);

    // Cleanup
    await prisma.systemLog.deleteMany({
      where: { eventType: 'action_query_test' },
    });
  });
});
