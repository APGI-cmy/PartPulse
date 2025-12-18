/**
 * Internal Transfer API Route
 * Handles creation of internal transfer records
 */

import { NextRequest, NextResponse } from 'next/server';
import { InternalTransferSchema, sanitizeObject } from '@/lib/validators';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateInternalTransferPDF, savePDF } from '@/lib/pdf/internalTransferPdf';
import { sendInternalTransferReceipt } from '@/lib/email/sendInternalTransferReceipt';
import { logInternalTransferSubmission, logPdfGeneration, logEvent } from '@/lib/logging/systemLog';
import type { InternalTransfer } from '@/lib/db/schema';

/**
 * Adapter: Convert Prisma InternalTransfer to legacy format for PDF/Email
 */
const DEFAULT_DEPARTMENT = 'Unknown';
const DEFAULT_TRANSFER_TYPE = 'Internal';

function adaptTransferForPdfEmail(prismaTransfer: any): InternalTransfer {
  // Safety check: ensure items array exists
  const items = prismaTransfer.items || [];
  
  // Extract technician info with null-safety
  const technician = prismaTransfer.technician;
  const technicianDisplay = technician?.name || technician?.email || 'Unknown';
  
  return {
    id: prismaTransfer.id,
    technician: technicianDisplay,
    department: prismaTransfer.siteName || DEFAULT_DEPARTMENT,
    transferType: DEFAULT_TRANSFER_TYPE,
    serial: prismaTransfer.ssid || '',
    model: '',
    part: items[0]?.partNo || '',
    description: items[0]?.description || '',
    reason: '',
    newUnit: '',
    comments: '',
    images: [],
    signature: prismaTransfer.clientSignature || undefined,
    items: items.map((item: any) => ({
      quantity: item.qty,
      partNo: item.partNo,
      description: item.description,
    })),
    status: 'submitted',
    pdfPath: prismaTransfer.pdfPath || undefined,
    createdAt: prismaTransfer.createdAt,
  };
}

/**
 * POST /api/internal-transfer
 * Create a new internal transfer record
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    // Admin and Technician roles can submit transfers
    if (session.user.role !== 'admin' && session.user.role !== 'technician') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Only admins and technicians can submit transfers',
          },
        },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate input against schema
    const validationResult = InternalTransferSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.error('[INTERNAL_TRANSFER] Validation failed:', validationResult.error.flatten());
      
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: validationResult.error.flatten(),
          },
        },
        { status: 400 }
      );
    }
    
    // Sanitize input to prevent XSS attacks
    const sanitizedData = sanitizeObject(validationResult.data);
    
    // Handle psid → ssid mapping (validator accepts both, Prisma only has ssid)
    // Prefer ssid if provided, fall back to psid, then null
    const ssidValue = sanitizedData.ssid !== undefined && sanitizedData.ssid !== null && sanitizedData.ssid !== ''
      ? sanitizedData.ssid
      : (sanitizedData.psid !== undefined && sanitizedData.psid !== null && sanitizedData.psid !== ''
        ? sanitizedData.psid
        : null);
    
    // Save to database using Prisma
    const transfer = await prisma.internalTransfer.create({
      data: {
        date: sanitizedData.date,
        ssid: ssidValue,
        siteName: sanitizedData.siteName || null,
        poNumber: sanitizedData.poNumber || null,
        technicianId: session.user.id,
        clientName: sanitizedData.clientName || null,
        clientDate: sanitizedData.clientDate || null,
        clientSignature: sanitizedData.clientSignature || null,
        items: {
          create: sanitizedData.items.map((item: any) => ({
            qty: item.qty,
            partNo: item.partNo,
            description: item.description,
          })),
        },
      },
      include: {
        items: true,
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
    
    // Log submission
    await logInternalTransferSubmission({
      transferId: transfer.id,
      userId: session.user.id,
      userName: session.user.name || session.user.email,
      success: true,
      request,
    });
    
    // Generate and save PDF
    let pdfContent: Buffer | undefined;
    let pdfPath: string | undefined;
    try {
      // Adapt transfer for PDF generation
      const adaptedTransfer = adaptTransferForPdfEmail(transfer);
      pdfContent = await generateInternalTransferPDF(adaptedTransfer);
      const pdfResult = await savePDF(pdfContent, `transfer-${transfer.id}.pdf`);
      if (pdfResult.success && pdfResult.path) {
        pdfPath = pdfResult.path;
        
        // Update transfer with PDF path (no need to reassign, just update DB)
        await prisma.internalTransfer.update({
          where: { id: transfer.id },
          data: { pdfPath: pdfResult.path },
        });
        
        // Log successful PDF generation
        await logPdfGeneration({
          entityId: transfer.id,
          entityType: 'internal_transfer',
          pdfPath: pdfResult.path,
          success: true,
        });
        
        // Log email event (queued)
        await logEvent({
          eventType: 'submission',
          action: 'email_queued',
          userId: session.user.id,
          userName: session.user.name || session.user.email,
          details: {
            entityType: 'internal_transfer',
            entityId: transfer.id,
            emailType: 'transfer_receipt',
          },
        });
      }
    } catch (pdfError) {
      // Log PDF generation error but don't fail the request
      console.error('PDF generation failed:', pdfError);
      await logPdfGeneration({
        entityId: transfer.id,
        entityType: 'internal_transfer',
        success: false,
        errorMessage: pdfError instanceof Error ? pdfError.message : 'Unknown error',
      });
    }
    
    // Send email notification
    try {
      // Adapt transfer for email
      const adaptedTransfer = adaptTransferForPdfEmail(transfer);
      const emailResult = await sendInternalTransferReceipt(adaptedTransfer, pdfContent);
      
      // Log email sent/failed
      await logEvent({
        eventType: 'submission',
        action: emailResult.success ? 'email_sent' : 'email_failed',
        userId: session.user.id,
        userName: session.user.name || session.user.email,
        details: {
          entityType: 'internal_transfer',
          entityId: transfer.id,
          emailType: 'transfer_receipt',
          messageId: emailResult.messageId,
        },
        success: emailResult.success,
        errorMessage: emailResult.error,
      });
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('Email notification failed:', emailError);
      
      await logEvent({
        eventType: 'submission',
        action: 'email_failed',
        userId: session.user.id,
        userName: session.user.name || session.user.email,
        details: {
          entityType: 'internal_transfer',
          entityId: transfer.id,
          emailType: 'transfer_receipt',
        },
        success: false,
        errorMessage: emailError instanceof Error ? emailError.message : 'Unknown error',
      });
    }
    
    // Return success response
    return NextResponse.json(
      {
        success: true,
        data: {
          ...transfer,
          pdfPath,
        },
        message: 'Internal transfer created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating internal transfer:', error);
    
    // Log failed submission
    try {
      const session = await auth();
      await logInternalTransferSubmission({
        transferId: 'unknown',
        userId: session?.user?.id,
        userName: session?.user?.name || session?.user?.email,
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        request,
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/internal-transfer
 * List all internal transfers
 */
export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      );
    }
    
    // Fetch transfers from Prisma
    const transfers = await prisma.internalTransfer.findMany({
      include: {
        items: true,
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(
      {
        success: true,
        data: transfers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching internal transfers:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}
