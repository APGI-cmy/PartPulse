/**
 * Zod validation schemas for PartPulse
 */
import { z } from 'zod';

/**
 * Internal Transfer Item validation schema
 */
export const InternalTransferItemSchema = z.object({
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  partNo: z.string().min(1, 'Part number is required'),
  description: z.string().min(1, 'Description is required'),
});

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
  items: z.array(InternalTransferItemSchema).optional(),
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
 * Recursively handles nested objects and arrays
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => {
        if (typeof item === 'string') {
          return sanitizeString(item);
        } else if (typeof item === 'object' && item !== null) {
          return sanitizeObject(item as Record<string, unknown>);
        }
        return item;
      });
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized as T;
}

/**
 * Warranty Item validation schema
 */
export const WarrantyItemSchema = z.object({
  partNo: z.string().min(1, 'Part number is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  failedPartSerial: z.string().min(1, 'Failed part serial is required'),
  replacedPartSerial: z.string().min(1, 'Replaced part serial is required'),
  dateOfFailure: z.coerce.date(),
  dateOfRepair: z.coerce.date(),
});

/**
 * Warranty Claim validation schema
 */
export const WarrantyClaimSchema = z.object({
  date: z.coerce.date(),
  chillerModel: z.string().min(1, 'Chiller model is required'),
  chillerSerial: z.string().min(1, 'Chiller serial is required'),
  ssidJobNumber: z.string().min(1, 'SSID/Job number is required'),
  buildingName: z.string().optional(),
  siteName: z.string().min(1, 'Site name is required'),
  technicianName: z.string().min(1, 'Technician name is required'),
  items: z.array(WarrantyItemSchema).min(1, 'At least one item is required'),
  comments: z.string().optional(),
  coveredByWarranty: z.boolean(),
  technicianSignature: z.string().optional(),
  adminSignature: z.string().optional(),
  adminProcessedStamp: z.boolean().optional(),
});

export type WarrantyClaimInput = z.infer<typeof WarrantyClaimSchema>;
