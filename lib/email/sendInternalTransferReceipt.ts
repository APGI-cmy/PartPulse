/**
 * Email notification for Internal Transfer Receipt
 * Uses branded HTML template system for professional emails
 * In production, this would integrate with an email service like SendGrid, AWS SES, or Resend
 */

import type { InternalTransfer } from '../db/schema';
import {
  createEmailTemplate,
  createInfoRow,
  createButton,
  createStatusBadge,
  createInfoBox,
  createDivider,
} from './templates';

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
 * Generate HTML email content using branded templates
 */
function generateEmailHTML(transfer: InternalTransfer): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const content = `
    <p style="font-size: 16px; margin-bottom: 20px;">Dear ${transfer.technician},</p>
    <p style="margin-bottom: 20px;">Your internal transfer request has been successfully submitted and is now being processed.</p>
    
    <h2 style="color: #111827; font-size: 18px; margin: 25px 0 15px 0;">Transfer Details</h2>
    <div class="info-box">
      ${createInfoRow('Transfer ID', transfer.id)}
      ${createInfoRow('Department', transfer.department)}
      ${createInfoRow('Transfer Type', transfer.transferType)}
      ${createInfoRow('Serial Number', transfer.serial)}
      ${createInfoRow('Model', transfer.model)}
      ${createInfoRow('Part Number', transfer.part)}
      ${createInfoRow('Status', createStatusBadge(transfer.status))}
      ${createInfoRow('Submitted', transfer.createdAt.toLocaleString())}
    </div>
    
    ${transfer.comments ? `
    ${createDivider()}
    <h3 style="color: #374151; font-size: 16px; margin: 20px 0 10px 0;">Comments</h3>
    <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #FF2B00;">
      <p style="margin: 0; color: #4b5563;">${transfer.comments}</p>
    </div>
    ` : ''}
    
    ${createButton('View Transfer Details', `${appUrl}/internal-transfer/${transfer.id}`)}
    
    ${createInfoBox('📎 <strong>Note:</strong> A PDF copy of this transfer is attached to this email for your records.')}
  `;
  
  return createEmailTemplate('Internal Transfer Confirmed', content);
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
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  
  const content = `
    <p style="font-size: 16px; margin-bottom: 20px;">A new internal transfer has been submitted and requires review.</p>
    
    <h2 style="color: #111827; font-size: 18px; margin: 25px 0 15px 0;">Transfer Summary</h2>
    <div class="info-box">
      ${createInfoRow('Transfer ID', transfer.id)}
      ${createInfoRow('Technician', transfer.technician)}
      ${createInfoRow('Department', transfer.department)}
      ${createInfoRow('Transfer Type', transfer.transferType)}
      ${createInfoRow('Part Number', transfer.part)}
      ${createInfoRow('Submitted', transfer.createdAt.toLocaleString())}
    </div>
    
    ${createButton('Review Transfer', `${appUrl}/internal-transfer/${transfer.id}/admin`)}
    
    ${createInfoBox('⚡ <strong>Action Required:</strong> Please review and process this transfer request.')}
  `;
  
  // Generate email HTML (in production, this would be sent via email service)
  createEmailTemplate('New Internal Transfer - Action Required', content);
  
  console.log('[EMAIL STUB] Sending admin notification');
  console.log('[EMAIL STUB] Transfer ID:', transfer.id);
  console.log('[EMAIL STUB] Admin email:', adminEmail);
  console.log('[EMAIL STUB] Admin notification simulated successfully');
  
  return {
    success: true,
    messageId: `stub-admin-${Date.now()}`,
  };
}

/**
 * Send approval notification to technician
 */
export async function sendApprovalNotification(
  transfer: InternalTransfer,
  adminName: string,
  pdfContent?: string
): Promise<{ success: boolean; messageId?: string }> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const content = `
    <p style="font-size: 16px; margin-bottom: 20px;">Dear ${transfer.technician},</p>
    <p style="margin-bottom: 20px;">Good news! Your internal transfer request has been <strong style="color: #059669;">approved</strong>.</p>
    
    <h2 style="color: #111827; font-size: 18px; margin: 25px 0 15px 0;">Transfer Details</h2>
    <div class="info-box">
      ${createInfoRow('Transfer ID', transfer.id)}
      ${createInfoRow('Status', createStatusBadge('approved'))}
      ${createInfoRow('Approved By', adminName)}
      ${createInfoRow('Approved On', new Date().toLocaleString())}
      ${createInfoRow('Department', transfer.department)}
      ${createInfoRow('Part Number', transfer.part)}
    </div>
    
    ${createButton('View Transfer', `${appUrl}/internal-transfer/${transfer.id}`)}
    
    ${createInfoBox('✅ <strong>Next Steps:</strong> Your transfer has been processed and is ready for fulfillment.')}
  `;
  
  const emailOptions: EmailOptions = {
    to: getTechnicianEmail(transfer.technician),
    subject: `Transfer Approved - ${transfer.id}`,
    html: createEmailTemplate('Transfer Approved', content),
    text: `Your internal transfer ${transfer.id} has been approved by ${adminName}.`,
  };
  
  if (pdfContent) {
    emailOptions.attachments = [
      {
        filename: `transfer-${transfer.id}-approved.pdf`,
        content: pdfContent,
        contentType: 'application/pdf',
      },
    ];
  }
  
  console.log('[EMAIL STUB] Sending approval notification');
  console.log('[EMAIL STUB] Transfer ID:', transfer.id);
  console.log('[EMAIL STUB] Email would be sent to:', emailOptions.to);
  
  return {
    success: true,
    messageId: `stub-approval-${Date.now()}`,
  };
}
