/**
 * System Logging Utility
 * Provides centralized logging for audit trail and system monitoring
 */

import prisma from "@/lib/prisma";

export type EventType = 
  | "submission" 
  | "pdf_generation" 
  | "admin_approval" 
  | "auth_event" 
  | "user_management";

export interface LogEventParams {
  eventType: EventType;
  action: string;
  userId?: string;
  userName?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  success?: boolean;
  errorMessage?: string;
}

/**
 * Log a system event
 */
export async function logEvent(params: LogEventParams): Promise<void> {
  try {
    await prisma.systemLog.create({
      data: {
        eventType: params.eventType,
        action: params.action,
        userId: params.userId,
        userName: params.userName,
        details: params.details ? JSON.stringify(params.details) : null,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        success: params.success ?? true,
        errorMessage: params.errorMessage,
      },
    });
  } catch (error) {
    // Log to console if database logging fails (don't throw to avoid breaking app flow)
    console.error("Failed to log event:", error);
  }
}

/**
 * Get recent system logs with optional filtering
 */
export async function getSystemLogs(params?: {
  eventType?: EventType;
  userId?: string;
  limit?: number;
  offset?: number;
}) {
  const { eventType, userId, limit = 100, offset = 0 } = params || {};

  const where: {
    eventType?: string;
    userId?: string;
  } = {};

  if (eventType) where.eventType = eventType;
  if (userId) where.userId = userId;

  return await prisma.systemLog.findMany({
    where,
    orderBy: { timestamp: "desc" },
    take: limit,
    skip: offset,
  });
}

/**
 * Helper: Log internal transfer submission
 */
export async function logInternalTransferSubmission(params: {
  transferId: string;
  userId?: string;
  userName?: string;
  success: boolean;
  errorMessage?: string;
  request?: Request;
}) {
  await logEvent({
    eventType: "submission",
    action: "internal_transfer_created",
    userId: params.userId,
    userName: params.userName,
    details: { 
      transferId: params.transferId,
      type: "internal_transfer"
    },
    success: params.success,
    errorMessage: params.errorMessage,
    ipAddress: params.request?.headers.get("x-forwarded-for") || undefined,
    userAgent: params.request?.headers.get("user-agent") || undefined,
  });
}

/**
 * Helper: Log warranty claim submission
 */
export async function logWarrantyClaimSubmission(params: {
  claimId: string;
  userId?: string;
  userName?: string;
  success: boolean;
  errorMessage?: string;
  request?: Request;
}) {
  await logEvent({
    eventType: "submission",
    action: "warranty_claim_created",
    userId: params.userId,
    userName: params.userName,
    details: { 
      claimId: params.claimId,
      type: "warranty_claim"
    },
    success: params.success,
    errorMessage: params.errorMessage,
    ipAddress: params.request?.headers.get("x-forwarded-for") || undefined,
    userAgent: params.request?.headers.get("user-agent") || undefined,
  });
}

/**
 * Helper: Log PDF generation
 */
export async function logPdfGeneration(params: {
  entityId: string;
  entityType: "internal_transfer" | "warranty_claim";
  pdfPath?: string;
  success: boolean;
  errorMessage?: string;
}) {
  await logEvent({
    eventType: "pdf_generation",
    action: `${params.entityType}_pdf_generated`,
    details: { 
      entityId: params.entityId,
      entityType: params.entityType,
      pdfPath: params.pdfPath
    },
    success: params.success,
    errorMessage: params.errorMessage,
  });
}

/**
 * Helper: Log admin approval/rejection
 */
export async function logAdminAction(params: {
  entityId: string;
  entityType: "internal_transfer" | "warranty_claim";
  action: "approved" | "rejected";
  adminUserId?: string;
  adminUserName?: string;
  request?: Request;
}) {
  await logEvent({
    eventType: "admin_approval",
    action: `${params.entityType}_${params.action}`,
    userId: params.adminUserId,
    userName: params.adminUserName,
    details: { 
      entityId: params.entityId,
      entityType: params.entityType,
      status: params.action
    },
    ipAddress: params.request?.headers.get("x-forwarded-for") || undefined,
    userAgent: params.request?.headers.get("user-agent") || undefined,
  });
}

/**
 * Helper: Log authentication events
 */
export async function logAuthEvent(params: {
  action: "login" | "logout" | "login_failed" | "password_reset";
  userId?: string;
  userName?: string;
  email?: string;
  success: boolean;
  errorMessage?: string;
  request?: Request;
}) {
  await logEvent({
    eventType: "auth_event",
    action: params.action,
    userId: params.userId,
    userName: params.userName,
    details: { 
      email: params.email 
    },
    success: params.success,
    errorMessage: params.errorMessage,
    ipAddress: params.request?.headers.get("x-forwarded-for") || undefined,
    userAgent: params.request?.headers.get("user-agent") || undefined,
  });
}

/**
 * Helper: Log user management actions
 */
export async function logUserManagement(params: {
  action: "user_invited" | "user_updated" | "user_deleted" | "password_reset" | "user_signup_completed" | "first_admin_created";
  targetUserId?: string;
  targetUserEmail?: string;
  adminUserId?: string;
  adminUserName?: string;
  success: boolean;
  errorMessage?: string;
  request?: Request;
}) {
  await logEvent({
    eventType: "user_management",
    action: params.action,
    userId: params.adminUserId,
    userName: params.adminUserName,
    details: { 
      targetUserId: params.targetUserId,
      targetUserEmail: params.targetUserEmail
    },
    success: params.success,
    errorMessage: params.errorMessage,
    ipAddress: params.request?.headers.get("x-forwarded-for") || undefined,
    userAgent: params.request?.headers.get("user-agent") || undefined,
  });
}
