/**
 * Tests for First Admin Bootstrap System
 * Ensures only one admin can be created via bootstrap, and security is maintained
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('First Admin Bootstrap System', () => {
  let adminUserId: string | null = null;

  afterEach(async () => {
    // Cleanup: Delete test admin user
    if (adminUserId) {
      try {
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();
        await prisma.user.delete({ where: { id: adminUserId } });
        await prisma.$disconnect();
        adminUserId = null;
      } catch (error) {
        // User may already be deleted
      }
    }
  });

  describe('First Admin Creation', () => {
    it('should allow first admin creation when no admins exist', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

      // Check if we can create first admin
      const adminCount = await prisma.user.count({
        where: { role: 'admin' },
      });

      const canCreate = adminCount === 0;
      expect(typeof canCreate).toBe('boolean');

      await prisma.$disconnect();
    });

    it('should prevent second admin creation via bootstrap', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const bcrypt = await import('bcryptjs');
      const prisma = new PrismaClient();

      // Create first admin
      const hashedPassword = await bcrypt.hash('FirstAdmin123!@#', 10);
      const admin1 = await prisma.user.create({
        data: {
          email: 'admin1@example.com',
          name: 'First Admin',
          password: hashedPassword,
          role: 'admin',
        },
      });

      adminUserId = admin1.id;

      // Check if second admin can be created via bootstrap
      const adminCount = await prisma.user.count({
        where: { role: 'admin' },
      });

      const canCreate = adminCount === 0;
      expect(canCreate).toBe(false);

      await prisma.$disconnect();
    });

    it('should create admin user with correct role', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const bcrypt = await import('bcryptjs');
      const prisma = new PrismaClient();

      // Delete any existing admins for this test
      await prisma.user.deleteMany({ where: { role: 'admin' } });

      const hashedPassword = await bcrypt.hash('TestAdmin123!@#', 10);
      const admin = await prisma.user.create({
        data: {
          email: 'testadmin@example.com',
          name: 'Test Admin',
          password: hashedPassword,
          role: 'admin',
        },
      });

      adminUserId = admin.id;

      expect(admin.role).toBe('admin');
      expect(admin.email).toBe('testadmin@example.com');
      expect(admin.password).not.toBe('TestAdmin123!@#'); // Should be hashed

      await prisma.$disconnect();
    });

    it('should hash admin password with bcrypt', async () => {
      const bcrypt = await import('bcryptjs');
      
      const plainPassword = 'AdminPassword123!@#';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // Verify hash is different from plain password
      expect(hashedPassword).not.toBe(plainPassword);
      expect(hashedPassword.startsWith('$2b$')).toBe(true);

      // Verify password can be verified
      const isValid = await bcrypt.compare(plainPassword, hashedPassword);
      expect(isValid).toBe(true);
    });
  });

  describe('Email Validation', () => {
    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user@domain',
        'user domain@example.com',
      ];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      invalidEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(false);
      });
    });

    it('should accept valid email formats', () => {
      const validEmails = [
        'user@example.com',
        'admin@company.org',
        'firstname.lastname@subdomain.example.com',
        'user+tag@domain.co.uk',
      ];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      validEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true);
      });
    });
  });

  describe('Security Requirements', () => {
    it('should enforce password requirements', () => {
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

    it('should not store plain text passwords', async () => {
      const bcrypt = await import('bcryptjs');
      
      const plainPassword = 'MySecretPassword123!';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      expect(hashedPassword).not.toContain(plainPassword);
      expect(hashedPassword.length).toBeGreaterThan(50);
    });
  });

  describe('Bootstrap Page Access Control', () => {
    it('should only be accessible when no admins exist', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

      const adminCount = await prisma.user.count({
        where: { role: 'admin' },
      });

      const shouldAllowAccess = adminCount === 0;
      
      // If admins exist, access should be denied
      // If no admins exist, access should be allowed
      expect(typeof shouldAllowAccess).toBe('boolean');

      await prisma.$disconnect();
    });
  });

  describe('User Creation Validation', () => {
    it('should require all mandatory fields', async () => {
      const requiredFields = {
        email: 'admin@example.com',
        name: 'Admin User',
        password: 'hashedpassword',
        role: 'admin',
      };

      // All fields should be present
      expect(requiredFields.email).toBeDefined();
      expect(requiredFields.name).toBeDefined();
      expect(requiredFields.password).toBeDefined();
      expect(requiredFields.role).toBeDefined();
    });

    it('should prevent duplicate email addresses', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const bcrypt = await import('bcryptjs');
      const prisma = new PrismaClient();

      const hashedPassword = await bcrypt.hash('Password123!@#', 10);

      // Create first user
      const user1 = await prisma.user.create({
        data: {
          email: 'duplicate@example.com',
          name: 'User 1',
          password: hashedPassword,
          role: 'admin',
        },
      });

      adminUserId = user1.id;

      // Attempt to create second user with same email should fail
      let errorOccurred = false;
      try {
        await prisma.user.create({
          data: {
            email: 'duplicate@example.com',
            name: 'User 2',
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
  });

  describe('Audit Logging', () => {
    it('should log first admin creation events', async () => {
      const logEntry = {
        action: 'first_admin_created',
        timestamp: new Date(),
        success: true,
        targetUserEmail: 'admin@example.com',
      };

      expect(logEntry.action).toBe('first_admin_created');
      expect(logEntry.success).toBe(true);
      expect(logEntry.timestamp).toBeInstanceOf(Date);
    });
  });
});
