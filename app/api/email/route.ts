/**
 * Email API Route
 * On-demand email sending for notifications
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

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
    const { type, to, data } = body;

    if (!type || !to) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Type and recipient are required' } },
        { status: 400 }
      );
    }

    // Email sending logic would go here
    // This is a placeholder for architecture compliance
    console.log(`Sending ${type} email to ${to} with data:`, data);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully (stub)',
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to send email' } },
      { status: 500 }
    );
  }
}
