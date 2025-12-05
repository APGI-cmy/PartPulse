/**
 * Warranty Claims API Route
 * Handles creation and retrieval of warranty claims
 */

import { NextRequest, NextResponse } from 'next/server';
import { WarrantyClaimSchema, sanitizeObject } from '@/lib/validators';
import { saveWarrantyClaim, getAllWarrantyClaims } from '@/lib/db/schema';
import { generateWarrantyClaimPDF } from '@/lib/pdf/warrantyClaimPdf';

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

    // Save the warranty claim
    const warrantyClaim = await saveWarrantyClaim(sanitizedData);

    // Generate PDF stub (for future use)
    await generateWarrantyClaimPDF(warrantyClaim);

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
 * Retrieve all warranty claims
 */
export async function GET() {
  try {
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
