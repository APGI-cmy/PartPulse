/**
 * Internal Transfer API Route
 * Handles creation of internal transfer records
 */

import { NextRequest, NextResponse } from 'next/server';
import { InternalTransferSchema, sanitizeObject } from '@/lib/validators';
import { saveInternalTransfer, getAllInternalTransfers } from '@/lib/db/schema';
import { generateInternalTransferPDF, savePDF } from '@/lib/pdf/internalTransferPdf';
import { sendInternalTransferReceipt } from '@/lib/email/sendInternalTransferReceipt';

/**
 * POST /api/internal-transfer
 * Create a new internal transfer record
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate input against schema
    const validationResult = InternalTransferSchema.safeParse(body);
    
    if (!validationResult.success) {
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
    
    // Security: In production, validate organization_id header
    // const orgId = request.headers.get('organization_id');
    // if (!orgId) {
    //   return NextResponse.json(
    //     { success: false, error: { code: 'UNAUTHORIZED', message: 'Missing organization ID' } },
    //     { status: 401 }
    //   );
    // }
    
    // Save to database (currently in-memory, will be Prisma in production)
    const transfer = await saveInternalTransfer(sanitizedData);
    
    // Generate and save PDF
    let pdfPath: string | undefined;
    let pdfContent: string | undefined;
    try {
      pdfContent = await generateInternalTransferPDF(transfer);
      const pdfResult = await savePDF(pdfContent, `transfer-${transfer.id}.pdf`);
      if (pdfResult.success) {
        pdfPath = pdfResult.path;
        // Update transfer with PDF path (in production, this would update the DB)
        transfer.pdfPath = pdfPath;
      }
    } catch (pdfError) {
      // Log PDF generation error but don't fail the request
      console.error('PDF generation failed:', pdfError);
    }
    
    // Send email notification
    try {
      await sendInternalTransferReceipt(transfer, pdfContent);
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('Email notification failed:', emailError);
    }
    
    // Return success response
    return NextResponse.json(
      {
        success: true,
        data: transfer,
        message: 'Internal transfer created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating internal transfer:', error);
    
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

/**
 * GET /api/internal-transfer
 * List all internal transfers
 */
export async function GET(request: NextRequest) {
  try {
    // In production, filter by user role and organization
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json(
    //     { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
    //     { status: 401 }
    //   );
    // }
    
    const transfers = await getAllInternalTransfers();
    
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
