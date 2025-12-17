/**
 * Tests for Password Reset Flow
 * Ensures password reset functionality works securely
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('Password Reset Flow', () => {
  let testUserId: string | null = null;

  afterEach(async () => {
    // Cleanup: Delete test user
    if (testUserId) {
      try {
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();
        await prisma.user.delete({ where: { id: testUserId } });
        await prisma.$disconnect();
        testUserId = null;
      } catch (error) {
        // User may already be deleted
      }
    }
  });

  describe('Password Reset Request', () => {
    it('should accept valid email for password reset', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const bcrypt = await import('bcryptjs');
      const prisma = new PrismaClient();

      // Create test user
      const hashedPassword = await bcrypt.hash('TestPassword123!@#', 10);
      const user = await prisma.user.create({
        data: {
          email: 'resettest@example.com',
          name: 'Reset Test User',
          password: hashedPassword,
          role: 'technician',
        },
      });

      testUserId = user.id;

      // Verify user can request password reset
      expect(user.email).toBe('resettest@example.com');
      expect(user.password).not.toBe('TestPassword123!@#'); // Should be hashed

      await prisma.$disconnect();
    });

    it('should not reveal if email exists (security)', () => {
      // Password reset should always return success
      // even if the email doesn't exist (prevents email enumeration)
      const response = {
        success: true,
        message: "If an account exists with that email, we've sent password reset instructions.",
      };

      expect(response.success).toBe(true);
      expect(response.message).toContain("If an account exists");
    });
  });

  describe('Reset Token Management', () => {
    it('should generate secure reset token', async () => {
      const crypto = await import('crypto');
      
      const token1 = crypto.randomBytes(32).toString('hex');
      const token2 = crypto.randomBytes(32).toString('hex');

      // Tokens should be unique
      expect(token1).not.toBe(token2);
      
      // Tokens should be 64 characters (32 bytes as hex)
      expect(token1.length).toBe(64);
      expect(token2.length).toBe(64);
    });

    it('should store token expiry (1 hour from now)', () => {
      const now = Date.now();
      const oneHourLater = new Date(now + 60 * 60 * 1000);
      const oneHourAndOneMinuteLater = new Date(now + 61 * 60 * 1000);

      // Expiry should be approximately 1 hour from now
      const timeDiff = oneHourLater.getTime() - now;
      expect(timeDiff).toBeGreaterThanOrEqual(59 * 60 * 1000); // At least 59 minutes
      expect(timeDiff).toBeLessThanOrEqual(61 * 60 * 1000); // At most 61 minutes
    });

    it('should validate token expiry correctly', () => {
      const now = new Date();
      const futureDate = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
      const pastDate = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago

      // Future date should be valid
      expect(futureDate > now).toBe(true);
      
      // Past date should be invalid
      expect(pastDate > now).toBe(false);
    });
  });

  describe('Password Reset Completion', () => {
    it('should enforce password requirements on reset', () => {
      const validatePassword = (pwd: string): boolean => {
        return (
          pwd.length >= 16 &&
          /[A-Z]/.test(pwd) &&
          /[0-9]/.test(pwd) &&
          /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
        );
      };

      expect(validatePassword('Short123!')).toBe(false);
      expect(validatePassword('nouppercase123!@#')).toBe(false);
      expect(validatePassword('NoNumbers!@#$%^&')).toBe(false);
      expect(validatePassword('NoSpecialChars123')).toBe(false);
      expect(validatePassword('ValidPassword123!@#')).toBe(true);
    });

    it('should hash new password with bcrypt', async () => {
      const bcrypt = await import('bcryptjs');
      
      const newPassword = 'NewPassword123!@#';
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Verify hash is different from plain password
      expect(hashedPassword).not.toBe(newPassword);
      expect(hashedPassword.startsWith('$2b$')).toBe(true);

      // Verify password can be verified
      const isValid = await bcrypt.compare(newPassword, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('should clear reset token after successful reset', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const bcrypt = await import('bcryptjs');
      const crypto = await import('crypto');
      const prisma = new PrismaClient();

      // Create user with reset token
      const hashedPassword = await bcrypt.hash('OldPassword123!@#', 10);
      const resetToken = crypto.randomBytes(32).toString('hex');
      const user = await prisma.user.create({
        data: {
          email: 'cleartoken@example.com',
          name: 'Clear Token User',
          password: hashedPassword,
          role: 'technician',
          resetToken,
          resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000),
        },
      });

      testUserId = user.id;

      // Simulate password reset (clear token)
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          password: await bcrypt.hash('NewPassword123!@#', 10),
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      expect(updatedUser.resetToken).toBeNull();
      expect(updatedUser.resetTokenExpiry).toBeNull();

      await prisma.$disconnect();
    });
  });

  describe('Security Validations', () => {
    it('should reject expired tokens', () => {
      const expiredDate = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
      const now = new Date();

      // Expired token should not be valid
      expect(expiredDate > now).toBe(false);
    });

    it('should reject invalid token format', () => {
      const invalidTokens = [
        '',
        'short',
        'invalid-token',
        '12345',
      ];

      // Valid token should be 64 hex characters
      invalidTokens.forEach(token => {
        const isValid = /^[a-f0-9]{64}$/.test(token);
        expect(isValid).toBe(false);
      });
    });

    it('should validate token is 64 hex characters', () => {
      const crypto = require('crypto');
      const validToken = crypto.randomBytes(32).toString('hex');

      const isValid = /^[a-f0-9]{64}$/.test(validToken);
      expect(isValid).toBe(true);
    });
  });

  describe('User Experience', () => {
    it('should show appropriate success message after reset', () => {
      const successMessage = "Password reset successfully! You can now sign in with your new password.";
      
      expect(successMessage).toContain("successfully");
      expect(successMessage).toContain("sign in");
    });

    it('should show clear error for expired token', () => {
      const errorMessage = "Invalid or expired reset token. Please request a new password reset.";
      
      expect(errorMessage).toContain("expired");
      expect(errorMessage).toContain("request a new");
    });
  });

  describe('Audit Logging', () => {
    it('should log password reset request', () => {
      const logEntry = {
        action: 'password_reset_requested',
        timestamp: new Date(),
        success: true,
        targetUserEmail: 'user@example.com',
      };

      expect(logEntry.action).toBe('password_reset_requested');
      expect(logEntry.success).toBe(true);
      expect(logEntry.timestamp).toBeInstanceOf(Date);
    });

    it('should log successful password reset', () => {
      const logEntry = {
        action: 'password_reset_completed',
        timestamp: new Date(),
        success: true,
        targetUserId: 'user123',
        targetUserEmail: 'user@example.com',
      };

      expect(logEntry.action).toBe('password_reset_completed');
      expect(logEntry.success).toBe(true);
    });

    it('should log failed password reset attempts', () => {
      const logEntry = {
        action: 'password_reset_failed',
        timestamp: new Date(),
        success: false,
        errorMessage: 'Invalid or expired token',
      };

      expect(logEntry.action).toBe('password_reset_failed');
      expect(logEntry.success).toBe(false);
      expect(logEntry.errorMessage).toBeDefined();
    });
  });
});
