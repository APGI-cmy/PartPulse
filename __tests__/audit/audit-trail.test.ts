/**
 * Audit Trail Tests
 * 
 * Validates that system actions are logged to SystemLog
 * 
 * @jest-environment node
 */

import { PrismaClient } from '@prisma/client';

describe('Audit Trail', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should log events to SystemLog', async () => {
    const testLog = {
      eventType: 'test_audit',
      action: 'test_action',
      userId: 'test-user',
      userName: 'Test User',
      success: true,
    };

    const log = await prisma.systemLog.create({
      data: testLog,
    });

    expect(log).toHaveProperty('id');
    expect(log).toHaveProperty('timestamp');
    expect(log.eventType).toBe('test_audit');
    expect(log.success).toBe(true);

    // Cleanup
    await prisma.systemLog.delete({ where: { id: log.id } });
  });

  it('should query logs by event type', async () => {
    // Create test logs
    await prisma.systemLog.createMany({
      data: [
        { eventType: 'audit_test_1', action: 'action1', success: true },
        { eventType: 'audit_test_1', action: 'action2', success: true },
        { eventType: 'audit_test_2', action: 'action3', success: true },
      ],
    });

    const logs = await prisma.systemLog.findMany({
      where: { eventType: 'audit_test_1' },
    });

    expect(logs.length).toBeGreaterThanOrEqual(2);

    // Cleanup
    await prisma.systemLog.deleteMany({
      where: { eventType: { in: ['audit_test_1', 'audit_test_2'] } },
    });
  });

  it('should record success and failure states', async () => {
    const failureLog = {
      eventType: 'test_failure',
      action: 'test_action',
      success: false,
      errorMessage: 'Test error message',
    };

    const log = await prisma.systemLog.create({
      data: failureLog,
    });

    expect(log.success).toBe(false);
    expect(log.errorMessage).toBe('Test error message');

    // Cleanup
    await prisma.systemLog.delete({ where: { id: log.id } });
  });
});
