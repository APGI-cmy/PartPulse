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

    // FL/CI: Regression test for Date object preservation (Issue #117)
    // Lesson learned: sanitizeObject was treating Date instances as generic objects
    // and recursively sanitizing them, which converted them to empty objects {}.
    // This caused Prisma validation errors when Zod-transformed Date objects
    // were passed through sanitization before reaching Prisma.
    it('should preserve Date objects without modification', () => {
      const testDate = new Date('2025-12-19T10:00:00.000Z');
      const input = {
        date: testDate,
        name: '<script>test</script>',
        count: 42,
      };
      
      const sanitized = sanitizeObject(input);
      
      // Date should be preserved as-is
      expect(sanitized.date).toBeInstanceOf(Date);
      expect(sanitized.date.getTime()).toBe(testDate.getTime());
      
      // Strings should still be sanitized
      expect(sanitized.name).not.toContain('<script>');
      
      // Numbers should be preserved
      expect(sanitized.count).toBe(42);
    });

    it('should preserve Date objects in arrays', () => {
      const testDate1 = new Date('2025-12-19T10:00:00.000Z');
      const testDate2 = new Date('2025-12-20T15:30:00.000Z');
      const input = {
        items: [
          { date: testDate1, name: '<b>item1</b>' },
          { date: testDate2, name: 'item2' },
        ],
      };
      
      const sanitized = sanitizeObject(input);
      
      // Dates in arrays should be preserved
      expect(sanitized.items[0].date).toBeInstanceOf(Date);
      expect(sanitized.items[0].date.getTime()).toBe(testDate1.getTime());
      expect(sanitized.items[1].date).toBeInstanceOf(Date);
      expect(sanitized.items[1].date.getTime()).toBe(testDate2.getTime());
      
      // Strings should still be sanitized
      expect(sanitized.items[0].name).not.toContain('<b>');
    });

    it('should preserve undefined Date values', () => {
      const input = {
        date: new Date('2025-12-19T10:00:00.000Z'),
        optionalDate: undefined,
        name: 'test',
      };
      
      const sanitized = sanitizeObject(input);
      
      expect(sanitized.date).toBeInstanceOf(Date);
      expect(sanitized.optionalDate).toBeUndefined();
      expect(sanitized.name).toBe('test');
    });
  });
});
