/**
 * PDF Generation API Route
 * On-demand PDF generation for transfers and claims
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateInternalTransferPDF } from '@/lib/pdf/internalTransferPdf';
import { generateWarrantyClaimPDF } from '@/lib/pdf/warrantyClaimPdf';
import { getInternalTransfer, getWarrantyClaim } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, id } = body;

    if (!type || !id) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Type and ID are required' } },
        { status: 400 }
      );
    }

    let pdfBuffer: Buffer;

    if (type === 'transfer') {
      const transfer = await getInternalTransfer(id);
      if (!transfer) {
        return NextResponse.json(
          { success: false, error: { code: 'NOT_FOUND', message: 'Transfer not found' } },
          { status: 404 }
        );
      }
      pdfBuffer = await generateInternalTransferPDF(transfer);
    } else if (type === 'claim') {
      const claim = await getWarrantyClaim(id);
      if (!claim) {
        return NextResponse.json(
          { success: false, error: { code: 'NOT_FOUND', message: 'Claim not found' } },
          { status: 404 }
        );
      }
      pdfBuffer = await generateWarrantyClaimPDF(claim);
    } else {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid type. Use "transfer" or "claim"' } },
        { status: 400 }
      );
    }

    // Return the PDF buffer as base64 for client download
    const base64Pdf = pdfBuffer.toString('base64');

    return NextResponse.json({
      success: true,
      data: { 
        pdf: base64Pdf,
        contentType: 'application/pdf'
      },
      message: 'PDF generated successfully',
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to generate PDF' } },
      { status: 500 }
    );
  }
}
