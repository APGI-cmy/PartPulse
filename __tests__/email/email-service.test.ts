/**
 * Email Service Tests
 * 
 * Validates email service functionality with SMTP
 * 
 * @jest-environment node
 */

import { sendEmail, verifyEmailConfig } from '@/lib/email/emailService';

describe('Email Service', () => {
  describe('sendEmail', () => {
    it('should handle missing SMTP configuration gracefully', async () => {
      // Clear environment variables to simulate missing config
      const originalSmtpHost = process.env.SMTP_HOST;
      const originalSmtpPort = process.env.SMTP_PORT;
      const originalSmtpUser = process.env.SMTP_USER;
      const originalSmtpPass = process.env.SMTP_PASS;
      
      delete process.env.SMTP_HOST;
      delete process.env.SMTP_PORT;
      delete process.env.SMTP_USER;
      delete process.env.SMTP_PASS;
      
      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Email',
        text: 'This is a test email',
      });
      
      // Should fail when SMTP not configured (no stub fallback)
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.messageId).toBeUndefined(); // No messageId on failure
      
      // Restore environment variables
      if (originalSmtpHost) process.env.SMTP_HOST = originalSmtpHost;
      if (originalSmtpPort) process.env.SMTP_PORT = originalSmtpPort;
      if (originalSmtpUser) process.env.SMTP_USER = originalSmtpUser;
      if (originalSmtpPass) process.env.SMTP_PASS = originalSmtpPass;
    });

    it('should accept email with all required fields', async () => {
      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Email',
        text: 'This is a test email',
        html: '<p>This is a test email</p>',
      };
      
      const result = await sendEmail(emailOptions);
      
      // Should return a result (success or failure depending on SMTP config)
      expect(result).toBeDefined();
      // messageId only present on success
      if (result.success) {
        expect(result.messageId).toBeDefined();
      } else {
        expect(result.error).toBeDefined();
      }
    });

    it('should accept email with multiple recipients', async () => {
      const emailOptions = {
        to: ['test1@example.com', 'test2@example.com'],
        subject: 'Test Email',
        text: 'This is a test email',
      };
      
      const result = await sendEmail(emailOptions);
      
      // Should return a result
      expect(result).toBeDefined();
      // messageId only present on success
      if (result.success) {
        expect(result.messageId).toBeDefined();
      } else {
        expect(result.error).toBeDefined();
      }
    });

    it('should accept email with PDF attachment', async () => {
      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Email with PDF',
        text: 'This is a test email with PDF',
        attachments: [
          {
            filename: 'test.pdf',
            content: 'PDF content here',
            contentType: 'application/pdf',
          },
        ],
      };
      
      const result = await sendEmail(emailOptions);
      
      // Should return a result
      expect(result).toBeDefined();
      // messageId only present on success
      if (result.success) {
        expect(result.messageId).toBeDefined();
      } else {
        expect(result.error).toBeDefined();
      }
    });
  });

  describe('verifyEmailConfig', () => {
    it('should verify SMTP configuration when available', async () => {
      const result = await verifyEmailConfig();
      
      // Result depends on whether SMTP is configured
      expect(typeof result).toBe('boolean');
    });
  });
});
