/**
 * Warranty Claims API Route
 * Handles creation and retrieval of warranty claims
 */

import { NextRequest, NextResponse } from 'next/server';
import { WarrantyClaimSchema, sanitizeObject } from '@/lib/validators';
import { saveWarrantyClaim, updateWarrantyClaim, getAllWarrantyClaims, getWarrantyClaim } from '@/lib/db/schema';
import { generateWarrantyClaimPDF, savePDF } from '@/lib/pdf/warrantyClaimPdf';
import { sendWarrantyClaimReceipt } from '@/lib/email/sendWarrantyClaimReceipt';

/**
 * POST /api/warranty-claims
 * Create a new warranty claim
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = WarrantyClaimSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid warranty claim data',
            details: validationResult.error.issues,
          },
        },
        { status: 400 }
      );
    }

    // Sanitize input to prevent XSS
    const sanitizedData = sanitizeObject(validationResult.data);

    // Save the warranty claim with pending status
    let warrantyClaim = await saveWarrantyClaim({
      ...sanitizedData,
      status: 'pending',
    });

    // Generate and save PDF
    let pdfContent: string | undefined;
    try {
      pdfContent = await generateWarrantyClaimPDF(warrantyClaim);
      const pdfResult = await savePDF(pdfContent, `warranty-claim-${warrantyClaim.id}.pdf`);
      if (pdfResult.success && pdfResult.path) {
        // Update warranty claim with PDF path
        const updated = await updateWarrantyClaim(warrantyClaim.id, { pdfPath: pdfResult.path });
        if (updated) {
          warrantyClaim = updated;
        }
      }
    } catch (pdfError) {
      // Log PDF generation error but don't fail the request
      console.error('PDF generation failed:', pdfError);
    }

    // Send email notification
    try {
      await sendWarrantyClaimReceipt(warrantyClaim, pdfContent);
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('Email notification failed:', emailError);
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        data: warrantyClaim,
        message: 'Warranty claim submitted successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating warranty claim:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/warranty-claims
 * Retrieve all warranty claims or a specific claim by ID
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // If ID is provided, get specific claim
    if (id) {
      const claim = await getWarrantyClaim(id);
      
      if (!claim) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Warranty claim not found',
            },
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          data: claim,
        },
        { status: 200 }
      );
    }

    // Otherwise, get all claims
    const claims = await getAllWarrantyClaims();

    return NextResponse.json(
      {
        success: true,
        data: claims,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching warranty claims:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch warranty claims',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/warranty-claims
 * Update a warranty claim (admin processing)
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, adminSignature, status } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Claim ID is required',
          },
        },
        { status: 400 }
      );
    }

    // Get the existing claim
    const existingClaim = await getWarrantyClaim(id);
    if (!existingClaim) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Warranty claim not found',
          },
        },
        { status: 404 }
      );
    }

    // Update claim with admin info
    const updates: Partial<typeof existingClaim> = {
      adminSignature: adminSignature || existingClaim.adminSignature,
      adminDate: new Date(),
      status: status || existingClaim.status,
    };

    // If approved, set the processed stamp
    if (status === 'approved') {
      updates.adminProcessedStamp = true;
    }

    let updatedClaim = await updateWarrantyClaim(id, updates);
    
    if (!updatedClaim) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UPDATE_FAILED',
            message: 'Failed to update warranty claim',
          },
        },
        { status: 500 }
      );
    }

    // Regenerate PDF with admin information
    if (status === 'approved' || status === 'rejected') {
      try {
        const pdfContent = await generateWarrantyClaimPDF(updatedClaim);
        const pdfResult = await savePDF(pdfContent, `warranty-claim-${updatedClaim.id}.pdf`);
        if (pdfResult.success && pdfResult.path) {
          const updated = await updateWarrantyClaim(updatedClaim.id, { pdfPath: pdfResult.path });
          if (updated) {
            updatedClaim = updated;
          }
        }
      } catch (pdfError) {
        console.error('PDF regeneration failed:', pdfError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedClaim,
        message: `Warranty claim ${status || 'updated'} successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating warranty claim:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}
