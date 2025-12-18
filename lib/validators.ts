/**
 * Zod validation schemas for PartPulse
 */
import { z } from 'zod';

/**
 * Internal Transfer Item validation schema
 * Matches Prisma schema: InternalTransferItem model
 */
export const InternalTransferItemSchema = z.object({
  qty: z.number().int().min(1, 'Quantity must be at least 1'),
  partNo: z.string().min(1, 'Part number is required'),
  description: z.string().min(1, 'Description is required'),
});

/**
 * Internal Transfer validation schema
 * Matches Prisma schema: InternalTransfer model
 * Frontend submits: date, technicianName, ssid/psid, items
 */
export const InternalTransferSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }).transform((val) => new Date(val)),
  technicianName: z.string().min(1, 'Technician name is required'),
  ssid: z.string().optional(),
  psid: z.string().optional(),
  siteName: z.string().optional(),
  poNumber: z.string().optional(),
  clientName: z.string().optional(),
  clientDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  clientSignature: z.string().optional(),
  items: z.array(InternalTransferItemSchema).min(1, 'At least one item is required'),
}).refine((data) => data.ssid || data.psid, {
  message: 'Either SSID or PSID must be provided',
  path: ['ssid'],
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
 * Preserves Date objects, null, undefined, and primitive types
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (value instanceof Date) {
      // Preserve Date objects - do not recursively sanitize
      sanitized[key] = value;
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => {
        if (typeof item === 'string') {
          return sanitizeString(item);
        } else if (item instanceof Date) {
          // Preserve Date objects in arrays
          return item;
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
