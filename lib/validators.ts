/**
 * Zod validation schemas for PartPulse
 */
import { z } from 'zod';

/**
 * Internal Transfer validation schema
 */
export const InternalTransferSchema = z.object({
  technician: z.string().min(1, 'Technician name is required'),
  department: z.string().min(1, 'Department is required'),
  transferType: z.string().min(1, 'Transfer type is required'),
  serial: z.string().min(1, 'Serial number is required'),
  model: z.string().min(1, 'Model number is required'),
  part: z.string().min(1, 'Part number is required'),
  description: z.string().min(1, 'Description is required'),
  reason: z.string().min(1, 'Reason for removal is required'),
  newUnit: z.string().optional(),
  comments: z.string().optional(),
  images: z.array(z.string()).optional(),
  signature: z.string().optional(),
  createdAt: z.date().optional(),
});

export type InternalTransferInput = z.infer<typeof InternalTransferSchema>;

/**
 * Sanitize string input to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize an object with string values
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeString(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized as T;
}
