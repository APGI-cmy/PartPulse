import { NextRequest, NextResponse } from 'next/server';
import { getAllWarrantyClaims, WarrantyClaim } from '@/lib/db/schema';
import { sortItems } from '../utils';

/**
 * GET /api/reports/claims
 * Retrieve warranty claims with pagination, filtering, and sorting
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse pagination parameters
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('perPage') || '10', 10);
    
    // Parse filter parameters
    const technician = searchParams.get('technician');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Parse sort parameters
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Get all claims
    let claims = await getAllWarrantyClaims();
    
    // Apply filters
    if (technician) {
      claims = claims.filter(c => 
        c.technicianName.toLowerCase().includes(technician.toLowerCase())
      );
    }
    
    if (status) {
      claims = claims.filter(c => c.status === status);
    }
    
    if (startDate) {
      const start = new Date(startDate);
      claims = claims.filter(c => new Date(c.createdAt) >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the entire end date
      claims = claims.filter(c => new Date(c.createdAt) <= end);
    }
    
    // Apply sorting
    const sortedClaims = sortItems(
      claims,
      sortBy,
      sortOrder as 'asc' | 'desc',
      (claim: WarrantyClaim, field: string) => {
        switch (field) {
          case 'createdAt':
            return new Date(claim.createdAt).getTime();
          case 'technician':
            return claim.technicianName.toLowerCase();
          case 'status':
            return claim.status || 'pending';
          default:
            return new Date(claim.createdAt).getTime();
        }
      }
    );
    
    // Calculate pagination
    const total = sortedClaims.length;
    const totalPages = Math.ceil(total / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    
    // Get paginated results
    const paginatedClaims = sortedClaims.slice(startIndex, endIndex);
    
    return NextResponse.json(
      {
        success: true,
        data: paginatedClaims,
        pagination: {
          page,
          perPage,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching claims reports:', error);
    
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
