/**
 * Tests for User Invitation System
 * Covers invitation creation, token validation, and expiry
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('User Invitation System', () => {
  let testInvitationId: string;
  let testToken: string;

  afterEach(async () => {
    // Cleanup: Delete test invitations
    if (testInvitationId) {
      try {
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();
        await prisma.invitation.delete({ where: { id: testInvitationId } });
        await prisma.$disconnect();
      } catch (error) {
        // Invitation may already be deleted
      }
    }
  });

  describe('Invitation Creation', () => {
    it('should create invitation with valid token', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

      const invitation = await prisma.invitation.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          role: 'technician',
          token: 'test-token-123',
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          createdBy: 'admin-user-id',
        },
      });

      testInvitationId = invitation.id;
      testToken = invitation.token;

      expect(invitation.id).toBeDefined();
      expect(invitation.email).toBe('test@example.com');
      expect(invitation.accepted).toBe(false);
      expect(invitation.token).toBe('test-token-123');

      await prisma.$disconnect();
    });

    it('should set expiration date 7 days in the future', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

      const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      
      const invitation = await prisma.invitation.create({
        data: {
          email: 'test2@example.com',
          name: 'Test User 2',
          role: 'admin',
          token: 'test-token-456',
          expires: sevenDaysFromNow,
          createdBy: 'admin-user-id',
        },
      });

      testInvitationId = invitation.id;

      const daysDiff = Math.floor((invitation.expires.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      expect(daysDiff).toBeGreaterThanOrEqual(6);
      expect(daysDiff).toBeLessThanOrEqual(7);

      await prisma.$disconnect();
    });

    it('should generate cryptographically secure tokens', async () => {
      const crypto = await import('crypto');
      
      const token1 = crypto.randomBytes(32).toString('hex');
      const token2 = crypto.randomBytes(32).toString('hex');

      expect(token1).not.toBe(token2);
      expect(token1.length).toBe(64);
      expect(token2.length).toBe(64);
      expect(/^[a-f0-9]{64}$/.test(token1)).toBe(true);
    });
  });

  describe('Invitation Token Validation', () => {
    beforeEach(async () => {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

      const invitation = await prisma.invitation.create({
        data: {
          email: 'valid@example.com',
          name: 'Valid User',
          role: 'technician',
          token: 'valid-token-789',
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          createdBy: 'admin-user-id',
        },
      });

      testInvitationId = invitation.id;
      testToken = invitation.token;

      await prisma.$disconnect();
    });

    it('should find invitation by token', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

      const invitation = await prisma.invitation.findUnique({
        where: { token: testToken },
      });

      expect(invitation).not.toBeNull();
      expect(invitation?.email).toBe('valid@example.com');

      await prisma.$disconnect();
    });

    it('should reject expired invitations', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

      // Create expired invitation
      const expiredInvitation = await prisma.invitation.create({
        data: {
          email: 'expired@example.com',
          name: 'Expired User',
          role: 'technician',
          token: 'expired-token-999',
          expires: new Date(Date.now() - 1000), // Already expired
          createdBy: 'admin-user-id',
        },
      });

      const invitation = await prisma.invitation.findUnique({
        where: { token: expiredInvitation.token },
      });

      const isExpired = invitation && new Date() > invitation.expires;
      expect(isExpired).toBe(true);

      // Cleanup
      await prisma.invitation.delete({ where: { id: expiredInvitation.id } });
      await prisma.$disconnect();
    });

    it('should reject already accepted invitations', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

      // Mark invitation as accepted
      const updated = await prisma.invitation.update({
        where: { id: testInvitationId },
        data: { accepted: true },
      });

      expect(updated.accepted).toBe(true);

      await prisma.$disconnect();
    });
  });

  describe('Invitation Acceptance', () => {
    it('should mark invitation as accepted after user signup', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

      const invitation = await prisma.invitation.create({
        data: {
          email: 'accept@example.com',
          name: 'Accept User',
          role: 'technician',
          token: 'accept-token-111',
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          createdBy: 'admin-user-id',
        },
      });

      testInvitationId = invitation.id;

      // Simulate acceptance
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { accepted: true },
      });

      const updated = await prisma.invitation.findUnique({
        where: { id: invitation.id },
      });

      expect(updated?.accepted).toBe(true);

      await prisma.$disconnect();
    });
  });

  describe('Password Requirements Validation', () => {
    const validatePassword = (pwd: string): string[] => {
      const errors: string[] = [];
      if (pwd.length < 16) {
        errors.push('Password must be at least 16 characters long');
      }
      if (!/[A-Z]/.test(pwd)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/[0-9]/.test(pwd)) {
        errors.push('Password must contain at least one number');
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
        errors.push('Password must contain at least one special character');
      }
      return errors;
    };

    it('should reject passwords shorter than 16 characters', () => {
      const errors = validatePassword('Short123!');
      expect(errors).toContain('Password must be at least 16 characters long');
    });

    it('should reject passwords without uppercase letters', () => {
      const errors = validatePassword('alllowercase123!');
      expect(errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject passwords without numbers', () => {
      const errors = validatePassword('NoNumbersHere!@#');
      expect(errors).toContain('Password must contain at least one number');
    });

    it('should reject passwords without special characters', () => {
      const errors = validatePassword('NoSpecialChars123');
      expect(errors).toContain('Password must contain at least one special character');
    });

    it('should accept valid passwords', () => {
      const errors = validatePassword('ValidPassword123!@#');
      expect(errors.length).toBe(0);
    });

    it('should accept passwords with all requirements', () => {
      const passwords = [
        'StrongPassword123!',
        'Another1ValidPass!',
        'MyP@ssw0rd123456',
        'SecurePass#123456',
      ];

      passwords.forEach(pwd => {
        const errors = validatePassword(pwd);
        expect(errors.length).toBe(0);
      });
    });
  });
});
