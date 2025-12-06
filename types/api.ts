/**
 * API Response Types
 * Type definitions for API responses
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

// API Request Types
export interface CreateTransferRequest {
  technician: string;
  department: string;
  transferType: string;
  serial: string;
  model: string;
  part: string;
  description: string;
  reason: string;
  newUnit?: string;
  comments?: string;
  images?: string[];
  signature?: string;
}

export interface CreateClaimRequest {
  date: Date;
  chillerModel: string;
  chillerSerial: string;
  ssidJobNumber: string;
  buildingName?: string;
  siteName: string;
  technicianName: string;
  items: WarrantyItemRequest[];
  comments?: string;
  coveredByWarranty: boolean;
  technicianSignature?: string;
}

export interface WarrantyItemRequest {
  partNo: string;
  quantity: number;
  failedPartSerial: string;
  replacedPartSerial: string;
  dateOfFailure: Date;
  dateOfRepair: Date;
}

export interface InviteUserRequest {
  email: string;
  role: 'admin' | 'technician';
  message?: string;
}

// API Error Codes
export const API_ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  CSRF_TOKEN_INVALID: 'CSRF_TOKEN_INVALID',
} as const;

export type ApiErrorCode = typeof API_ERROR_CODES[keyof typeof API_ERROR_CODES];
