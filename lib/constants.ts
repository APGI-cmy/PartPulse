/**
 * Application Constants
 * Centralized constants used throughout the application
 */

// Application Info
export const APP_NAME = 'PartPulse';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Part Distribution Management System';

// Branding
export const PRIMARY_COLOR = '#FF2B00'; // Trane Red

// Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  TECHNICIAN: 'technician',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Transfer Types
export const TRANSFER_TYPES = [
  'Scrap',
  'Return to Stock',
  'Transfer to Another Job',
  'Warranty Claim',
  'Other',
] as const;

export type TransferType = typeof TRANSFER_TYPES[number];

// Departments
export const DEPARTMENTS = [
  'Service',
  'Installation',
  'Maintenance',
  'Warranty',
  'Parts',
  'Other',
] as const;

export type Department = typeof DEPARTMENTS[number];

// Status Values
export const TRANSFER_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type TransferStatus = typeof TRANSFER_STATUS[keyof typeof TRANSFER_STATUS];

export const CLAIM_STATUS = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under-review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
} as const;

export type ClaimStatus = typeof CLAIM_STATUS[keyof typeof CLAIM_STATUS];

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

// Date Formats
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

// API Response Messages
export const API_MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  ERROR: 'An error occurred',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  SERVER_ERROR: 'Internal server error',
} as const;

// Session
export const SESSION_TIMEOUT = 8 * 60 * 60; // 8 hours in seconds

// Rate Limiting
export const RATE_LIMITS = {
  AUTH: {
    WINDOW: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 5,
  },
  API: {
    WINDOW: 60 * 1000, // 1 minute
    MAX_REQUESTS: 100,
  },
  UPLOAD: {
    WINDOW: 60 * 1000, // 1 minute
    MAX_REQUESTS: 10,
  },
} as const;

// Cache TTL (milliseconds)
export const CACHE_TTL = {
  SHORT: 1 * 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 15 * 60 * 1000, // 15 minutes
  EXTENDED: 60 * 60 * 1000, // 1 hour
} as const;

// Email
export const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@partpulse.com';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@partpulse.com';

// Storage
export const STORAGE_PATHS = {
  PDFS: 'pdfs',
  INTERNAL_TRANSFERS: 'pdfs/internal-transfers',
  WARRANTY_CLAIMS: 'pdfs/warranty-claims',
  UPLOADS: 'uploads',
} as const;
