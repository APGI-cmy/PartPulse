import { NextRequest, NextResponse } from 'next/server';
import { getAllInternalTransfers, InternalTransfer } from '@/lib/db/schema';
import { sortItems } from '../utils';

/**
 * GET /api/reports/transfers
 * Retrieve internal transfers with pagination, filtering, and sorting
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
    
    // Get all transfers
    let transfers = await getAllInternalTransfers();
    
    // Apply filters
    if (technician) {
      transfers = transfers.filter(t => 
        t.technician.toLowerCase().includes(technician.toLowerCase())
      );
    }
    
    if (status) {
      transfers = transfers.filter(t => t.status === status);
    }
    
    if (startDate) {
      const start = new Date(startDate);
      transfers = transfers.filter(t => new Date(t.createdAt) >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the entire end date
      transfers = transfers.filter(t => new Date(t.createdAt) <= end);
    }
    
    // Apply sorting
    const sortedTransfers = sortItems(
      transfers,
      sortBy,
      sortOrder as 'asc' | 'desc',
      (transfer: InternalTransfer, field: string) => {
        switch (field) {
          case 'createdAt':
            return new Date(transfer.createdAt).getTime();
          case 'technician':
            return transfer.technician.toLowerCase();
          case 'status':
            return transfer.status;
          default:
            return new Date(transfer.createdAt).getTime();
        }
      }
    );
    
    // Calculate pagination
    const total = sortedTransfers.length;
    const totalPages = Math.ceil(total / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    
    // Get paginated results
    const paginatedTransfers = sortedTransfers.slice(startIndex, endIndex);
    
    return NextResponse.json(
      {
        success: true,
        data: paginatedTransfers,
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
    console.error('Error fetching transfer reports:', error);
    
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
