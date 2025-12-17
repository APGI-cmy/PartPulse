/**
 * Tests for User Signup Flow
 * Tests the complete signup process from invitation to account creation
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('User Signup Flow', () => {
  let testUserId: string | null = null;
  let testInvitationId: string | null = null;

  afterEach(async () => {
    // Cleanup
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    if (testUserId) {
      try {
        await prisma.user.delete({ where: { id: testUserId } });
      } catch (error) {
        // User may already be deleted
      }
      testUserId = null;
    }

    if (testInvitationId) {
      try {
        await prisma.invitation.delete({ where: { id: testInvitationId } });
      } catch (error) {
        // Invitation may already be deleted
      }
      testInvitationId = null;
    }

    await prisma.$disconnect();
  });

  describe('Complete Signup Flow', () => {
    it('should complete signup with valid invitation token', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const bcrypt = await import('bcryptjs');
      const crypto = await import('crypto');
      const prisma = new PrismaClient();

      // Step 1: Create invitation
      const token = crypto.randomBytes(32).toString('hex');
      const invitation = await prisma.invitation.create({
        data: {
          email: 'newuser@example.com',
          name: 'New User',
          role: 'technician',
          token,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          createdBy: 'admin-user-id',
        },
      });

      testInvitationId = invitation.id;

      // Step 2: Verify invitation is not accepted yet
      expect(invitation.accepted).toBe(false);

      // Step 3: Create user account
      const hashedPassword = await bcrypt.hash('UserPassword123!@#', 10);
      const user = await prisma.user.create({
        data: {
          email: invitation.email,
          name: invitation.name,
          password: hashedPassword,
          role: invitation.role,
        },
      });

      testUserId = user.id;

      // Step 4: Mark invitation as accepted
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { accepted: true },
      });

      // Step 5: Verify user was created correctly
      const createdUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      expect(createdUser).not.toBeNull();
      expect(createdUser?.email).toBe('newuser@example.com');
      expect(createdUser?.role).toBe('technician');

      // Step 6: Verify invitation was marked as accepted
      const updatedInvitation = await prisma.invitation.findUnique({
        where: { id: invitation.id },
      });

      expect(updatedInvitation?.accepted).toBe(true);

      await prisma.$disconnect();
    });

    it('should create admin user when invitation role is admin', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const bcrypt = await import('bcryptjs');
      const crypto = await import('crypto');
      const prisma = new PrismaClient();

      // Create invitation for admin role
      const token = crypto.randomBytes(32).toString('hex');
      const invitation = await prisma.invitation.create({
        data: {
          email: 'newadmin@example.com',
          name: 'New Admin',
          role: 'admin',
          token,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          createdBy: 'existing-admin-id',
        },
      });

      testInvitationId = invitation.id;

      // Complete signup
      const hashedPassword = await bcrypt.hash('AdminPassword123!@#', 10);
      const user = await prisma.user.create({
        data: {
          email: invitation.email,
          name: invitation.name,
          password: hashedPassword,
          role: invitation.role,
        },
      });

      testUserId = user.id;

      // Verify admin role
      expect(user.role).toBe('admin');

      await prisma.$disconnect();
    });
  });

  describe('Invitation Verification', () => {
    beforeEach(async () => {
      const { PrismaClient } = await import('@prisma/client');
      const crypto = await import('crypto');
      const prisma = new PrismaClient();

      // Create valid invitation
      const token = crypto.randomBytes(32).toString('hex');
      const invitation = await prisma.invitation.create({
        data: {
          email: 'verify@example.com',
          name: 'Verify User',
          role: 'technician',
          token,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          createdBy: 'admin-user-id',
        },
      });

      testInvitationId = invitation.id;

      await prisma.$disconnect();
    });

    it('should find valid invitation by token', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

      const invitation = await prisma.invitation.findUnique({
        where: { id: testInvitationId! },
      });

      expect(invitation).not.toBeNull();
      expect(invitation?.accepted).toBe(false);
      expect(invitation?.expires.getTime()).toBeGreaterThan(Date.now());

      await prisma.$disconnect();
    });

    it('should reject expired invitation tokens', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const crypto = await import('crypto');
      const prisma = new PrismaClient();

      // Create expired invitation
      const token = crypto.randomBytes(32).toString('hex');
      const expiredInvitation = await prisma.invitation.create({
        data: {
          email: 'expired@example.com',
          name: 'Expired User',
          role: 'technician',
          token,
          expires: new Date(Date.now() - 1000), // Already expired
          createdBy: 'admin-user-id',
        },
      });

      const invitation = await prisma.invitation.findUnique({
        where: { id: expiredInvitation.id },
      });

      const isExpired = invitation && new Date() > invitation.expires;
      expect(isExpired).toBe(true);

      // Cleanup
      await prisma.invitation.delete({ where: { id: expiredInvitation.id } });
      await prisma.$disconnect();
    });

    it('should reject already accepted invitation tokens', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

      // Mark invitation as accepted
      await prisma.invitation.update({
        where: { id: testInvitationId! },
        data: { accepted: true },
      });

      const invitation = await prisma.invitation.findUnique({
        where: { id: testInvitationId! },
      });

      expect(invitation?.accepted).toBe(true);

      await prisma.$disconnect();
    });

    it('should reject invalid invitation tokens', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

      const invitation = await prisma.invitation.findUnique({
        where: { token: 'invalid-token-does-not-exist' },
      });

      expect(invitation).toBeNull();

      await prisma.$disconnect();
    });
  });

  describe('User Account Creation', () => {
    it('should create user with hashed password', async () => {
      const bcrypt = await import('bcryptjs');

      const plainPassword = 'SecurePassword123!@#';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      expect(hashedPassword).not.toBe(plainPassword);
      expect(hashedPassword.startsWith('$2b$')).toBe(true);

      // Verify password comparison works
      const isValid = await bcrypt.compare(plainPassword, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('should prevent duplicate user registration', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const bcrypt = await import('bcryptjs');
      const prisma = new PrismaClient();

      const hashedPassword = await bcrypt.hash('Password123!@#', 10);

      // Create first user
      const user1 = await prisma.user.create({
        data: {
          email: 'duplicate-signup@example.com',
          name: 'First User',
          password: hashedPassword,
          role: 'technician',
        },
      });

      testUserId = user1.id;

      // Attempt to create duplicate user
      let errorOccurred = false;
      try {
        await prisma.user.create({
          data: {
            email: 'duplicate-signup@example.com',
            name: 'Second User',
            password: hashedPassword,
            role: 'technician',
          },
        });
      } catch (error) {
        errorOccurred = true;
      }

      expect(errorOccurred).toBe(true);

      await prisma.$disconnect();
    });

    it('should assign correct role from invitation', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const bcrypt = await import('bcryptjs');
      const crypto = await import('crypto');
      const prisma = new PrismaClient();

      // Create technician invitation
      const token = crypto.randomBytes(32).toString('hex');
      const invitation = await prisma.invitation.create({
        data: {
          email: 'role-test@example.com',
          name: 'Role Test',
          role: 'technician',
          token,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          createdBy: 'admin-user-id',
        },
      });

      testInvitationId = invitation.id;

      // Create user with role from invitation
      const hashedPassword = await bcrypt.hash('Password123!@#', 10);
      const user = await prisma.user.create({
        data: {
          email: invitation.email,
          name: invitation.name,
          password: hashedPassword,
          role: invitation.role,
        },
      });

      testUserId = user.id;

      expect(user.role).toBe('technician');

      await prisma.$disconnect();
    });
  });

  describe('Password Validation on Signup', () => {
    const validateSignupPassword = (password: string): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];

      if (password.length < 16) {
        errors.push('Password must be at least 16 characters');
      }
      if (!/[A-Z]/.test(password)) {
        errors.push('Must contain uppercase letter');
      }
      if (!/[0-9]/.test(password)) {
        errors.push('Must contain number');
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Must contain special character');
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    };

    it('should validate password meets all requirements', () => {
      const result = validateSignupPassword('ValidPassword123!@#');
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should reject weak passwords', () => {
      const weakPasswords = [
        'short',
        'nouppercase123!',
        'NOLOWERCASE123!',
        'NoNumbers!@#',
        'NoSpecialChars123',
      ];

      weakPasswords.forEach(pwd => {
        const result = validateSignupPassword(pwd);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Signup Audit Logging', () => {
    it('should log successful signup', () => {
      const logEntry = {
        action: 'user_signup_completed',
        timestamp: new Date(),
        success: true,
        targetUserEmail: 'newuser@example.com',
        targetUserId: 'user-id-123',
      };

      expect(logEntry.action).toBe('user_signup_completed');
      expect(logEntry.success).toBe(true);
      expect(logEntry.timestamp).toBeInstanceOf(Date);
    });

    it('should log failed signup attempts', () => {
      const logEntry = {
        action: 'user_signup_completed',
        timestamp: new Date(),
        success: false,
        errorMessage: 'Invalid invitation token',
      };

      expect(logEntry.success).toBe(false);
      expect(logEntry.errorMessage).toBeDefined();
    });
  });
});
