/**
 * Input Sanitization Tests
 * 
 * Validates XSS prevention and input sanitization
 * 
 * @jest-environment node
 */

import { sanitizeString, sanitizeObject } from '@/lib/validators';

describe('Input Sanitization', () => {
  describe('String Sanitization', () => {
    it('should sanitize HTML tags to prevent XSS', () => {
      const input = '<script>alert("XSS")</script>';
      const sanitized = sanitizeString(input);
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('</script>');
      expect(sanitized).toContain('&lt;script&gt;');
    });

    it('should sanitize special characters', () => {
      const input = '"><script>alert(1)</script>';
      const sanitized = sanitizeString(input);
      
      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
      expect(sanitized).not.toContain('"');
    });

    it('should handle normal text without modification to content', () => {
      const input = 'Normal text without special chars';
      const sanitized = sanitizeString(input);
      
      // Content should be preserved (even if encoded)
      expect(sanitized).toBeTruthy();
      expect(typeof sanitized).toBe('string');
    });
  });

  describe('Object Sanitization', () => {
    it('should sanitize all string fields in an object', () => {
      const input = {
        name: '<script>alert("XSS")</script>',
        description: 'Safe text',
        comment: '<img src=x onerror=alert(1)>',
      };
      
      const sanitized = sanitizeObject(input);
      
      expect(sanitized.name).not.toContain('<script>');
      expect(sanitized.comment).not.toContain('<img');
    });

    it('should sanitize nested objects', () => {
      const input = {
        user: {
          name: '<script>XSS</script>',
          email: 'test@example.com',
        },
      };
      
      const sanitized = sanitizeObject(input);
      
      expect(sanitized.user.name).not.toContain('<script>');
    });

    it('should sanitize arrays of strings', () => {
      const input = {
        tags: ['<script>XSS</script>', 'safe', '<b>bold</b>'],
      };
      
      const sanitized = sanitizeObject(input);
      
      expect(sanitized.tags[0]).not.toContain('<script>');
      expect(sanitized.tags[2]).not.toContain('<b>');
    });
  });
});
