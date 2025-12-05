/**
 * Claims Reports API Route
 * Handles retrieval of warranty claims reports with pagination, filtering, and sorting
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllWarrantyClaims } from '@/lib/db/schema';

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
    claims.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;
      
      switch (sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'technician':
          aValue = a.technicianName.toLowerCase();
          bValue = b.technicianName.toLowerCase();
          break;
        case 'status':
          aValue = a.status || 'pending';
          bValue = b.status || 'pending';
          break;
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    // Calculate pagination
    const total = claims.length;
    const totalPages = Math.ceil(total / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    
    // Get paginated results
    const paginatedClaims = claims.slice(startIndex, endIndex);
    
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
