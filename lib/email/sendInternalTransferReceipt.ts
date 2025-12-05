/**
 * Email notification for Internal Transfer Receipt
 * This is a stub implementation for MVP
 * In production, this would integrate with an email service like SendGrid, AWS SES, or Resend
 */

import type { InternalTransfer } from '../db/schema';

export interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: string;
    contentType?: string;
  }>;
}

/**
 * Generate email address for technician
 * In production, this should look up the actual email from user database
 */
function getTechnicianEmail(technician: string): string {
  // For MVP, use environment variable for email domain or default to example.com
  const emailDomain = process.env.EMAIL_DOMAIN || 'example.com';
  
  // Simple sanitization: lowercase, replace spaces with dots, remove special chars
  const sanitizedName = technician
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9.]/g, '');
  
  return `${sanitizedName}@${emailDomain}`;
}

/**
 * Send confirmation email to technician with PDF attached
 * @param transfer - The internal transfer data
 * @param pdfContent - Optional PDF content to attach
 * @returns Promise that resolves when email is sent
 */
export async function sendInternalTransferReceipt(
  transfer: InternalTransfer,
  pdfContent?: string
): Promise<{ success: boolean; messageId?: string }> {
  // Stub implementation - in production, integrate with email service
  
  console.log('[EMAIL STUB] Sending Internal Transfer Receipt');
  console.log('[EMAIL STUB] Transfer ID:', transfer.id);
  console.log('[EMAIL STUB] Technician:', transfer.technician);
  console.log('[EMAIL STUB] Department:', transfer.department);
  
  // Build email content
  const emailOptions: EmailOptions = {
    to: getTechnicianEmail(transfer.technician),
    subject: `Internal Transfer Confirmation - ${transfer.id}`,
    html: generateEmailHTML(transfer),
    text: generateEmailText(transfer),
  };
  
  // Add PDF attachment if provided
  if (pdfContent) {
    emailOptions.attachments = [
      {
        filename: `transfer-${transfer.id}.pdf`,
        content: pdfContent,
        contentType: 'application/pdf',
      },
    ];
    console.log('[EMAIL STUB] PDF attachment included');
  }
  
  // In production, send via email service:
  // const result = await emailService.send(emailOptions);
  // return { success: true, messageId: result.messageId };
  
  console.log('[EMAIL STUB] Email would be sent to:', emailOptions.to);
  console.log('[EMAIL STUB] Subject:', emailOptions.subject);
  console.log('[EMAIL STUB] Email sending simulated successfully');
  
  return {
    success: true,
    messageId: `stub-${Date.now()}`,
  };
}

/**
 * Generate HTML email content
 */
function generateEmailHTML(transfer: InternalTransfer): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Internal Transfer Confirmation</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #FF2B00;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background-color: #f9fafb;
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-top: none;
      border-radius: 0 0 8px 8px;
    }
    .info-row {
      margin: 10px 0;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .label {
      font-weight: 600;
      color: #6b7280;
      display: inline-block;
      width: 150px;
    }
    .value {
      color: #111827;
    }
    .footer {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #FF2B00;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0;">Internal Transfer Confirmed</h1>
  </div>
  <div class="content">
    <p>Dear ${transfer.technician},</p>
    <p>Your internal transfer request has been successfully submitted and is now being processed.</p>
    
    <h2>Transfer Details</h2>
    <div class="info-row">
      <span class="label">Transfer ID:</span>
      <span class="value">${transfer.id}</span>
    </div>
    <div class="info-row">
      <span class="label">Department:</span>
      <span class="value">${transfer.department}</span>
    </div>
    <div class="info-row">
      <span class="label">Transfer Type:</span>
      <span class="value">${transfer.transferType}</span>
    </div>
    <div class="info-row">
      <span class="label">Serial Number:</span>
      <span class="value">${transfer.serial}</span>
    </div>
    <div class="info-row">
      <span class="label">Model:</span>
      <span class="value">${transfer.model}</span>
    </div>
    <div class="info-row">
      <span class="label">Part Number:</span>
      <span class="value">${transfer.part}</span>
    </div>
    <div class="info-row">
      <span class="label">Status:</span>
      <span class="value" style="text-transform: capitalize;">${transfer.status}</span>
    </div>
    <div class="info-row">
      <span class="label">Submitted:</span>
      <span class="value">${transfer.createdAt.toLocaleString()}</span>
    </div>
    
    ${transfer.comments ? `
    <div style="margin-top: 15px;">
      <strong>Comments:</strong>
      <p style="background-color: white; padding: 10px; border-radius: 4px;">${transfer.comments}</p>
    </div>
    ` : ''}
    
    <div style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/internal-transfer/${transfer.id}" class="button">
        View Transfer Details
      </a>
    </div>
    
    <p style="margin-top: 20px;">
      <strong>Note:</strong> A PDF copy of this transfer is attached to this email for your records.
    </p>
  </div>
  <div class="footer">
    <p>This is an automated message from PartPulse Internal Transfer System.</p>
    <p>Please do not reply to this email.</p>
  </div>
</body>
</html>
  `;
}

/**
 * Generate plain text email content
 */
function generateEmailText(transfer: InternalTransfer): string {
  return `
Internal Transfer Confirmation

Dear ${transfer.technician},

Your internal transfer request has been successfully submitted and is now being processed.

Transfer Details:
- Transfer ID: ${transfer.id}
- Department: ${transfer.department}
- Transfer Type: ${transfer.transferType}
- Serial Number: ${transfer.serial}
- Model: ${transfer.model}
- Part Number: ${transfer.part}
- Status: ${transfer.status}
- Submitted: ${transfer.createdAt.toLocaleString()}

${transfer.comments ? `Comments:\n${transfer.comments}\n` : ''}

View your transfer at: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/internal-transfer/${transfer.id}

Note: A PDF copy of this transfer is attached to this email for your records.

---
This is an automated message from PartPulse Internal Transfer System.
Please do not reply to this email.
  `;
}

/**
 * Send notification to admin when a new transfer is submitted
 */
export async function sendAdminNotification(
  transfer: InternalTransfer
): Promise<{ success: boolean; messageId?: string }> {
  console.log('[EMAIL STUB] Sending admin notification');
  console.log('[EMAIL STUB] Transfer ID:', transfer.id);
  console.log('[EMAIL STUB] Admin notification simulated successfully');
  
  return {
    success: true,
    messageId: `stub-admin-${Date.now()}`,
  };
}
