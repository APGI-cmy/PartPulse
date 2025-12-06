/**
 * Reports API Route
 * Aggregates reports from subdirectories
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');

  if (type === 'transfers') {
    // Redirect to transfers report
    const url = new URL('/api/reports/transfers', request.url);
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url);
  }

  if (type === 'claims') {
    // Redirect to claims report
    const url = new URL('/api/reports/claims', request.url);
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url);
  }

  return NextResponse.json({
    success: true,
    data: {
      availableReports: ['transfers', 'claims'],
      message: 'Use ?type=transfers or ?type=claims to get specific reports',
    },
  });
}
