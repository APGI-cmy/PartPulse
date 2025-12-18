/**
 * Email notification for Internal Transfer Receipt
 * Uses branded HTML template system for professional emails
 * Sends emails via SMTP to configured Gmail address
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
import { sendEmail, type EmailOptions } from './emailService';

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
 * Send confirmation email to admin with PDF attached
 * @param transfer - The internal transfer data
 * @param pdfContent - Optional PDF content to attach (Buffer or string)
 * @returns Promise that resolves when email is sent
 */
export async function sendInternalTransferReceipt(
  transfer: InternalTransfer,
  pdfContent?: Buffer | string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log('[EMAIL] Sending Internal Transfer Receipt');
  console.log('[EMAIL] Transfer ID:', transfer.id);
  console.log('[EMAIL] Technician:', transfer.technician);
  console.log('[EMAIL] Department:', transfer.department);
  
  // Get admin email from environment (PartPulse Gmail)
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  
  if (!adminEmail) {
    console.error('[EMAIL] Admin email not configured');
    return {
      success: false,
      messageId: `error-no-admin-email-${Date.now()}`,
    };
  }
  
  // Build email options
  const emailOptions: EmailOptions = {
    to: adminEmail, // Send to PartPulse Gmail address
    subject: `Internal Transfer Submitted - ${transfer.id}`,
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
    console.log('[EMAIL] PDF attachment included');
  }
  
  // Send email via SMTP
  const result = await sendEmail(emailOptions);
  
  console.log('[EMAIL] Internal transfer email sent:', result.success ? 'SUCCESS' : 'FAILED');
  
  return result;
}

/**
 * Generate HTML email content using branded templates
 */
function generateEmailHTML(transfer: InternalTransfer): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const content = `
    <p style="font-size: 16px; margin-bottom: 20px;">A new internal transfer has been submitted by ${transfer.technician}.</p>
    
    <h2 style="color: #111827; font-size: 18px; margin: 25px 0 15px 0;">Transfer Details</h2>
    <div class="info-box">
      ${createInfoRow('Transfer ID', transfer.id)}
      ${createInfoRow('Technician', transfer.technician)}
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
    
    ${createInfoBox('📎 <strong>Note:</strong> A PDF copy of this transfer is attached to this email.')}
  `;
  
  return createEmailTemplate('Internal Transfer Submitted', content);
}

/**
 * Generate plain text email content
 */
function generateEmailText(transfer: InternalTransfer): string {
  return `
Internal Transfer Submitted

A new internal transfer has been submitted by ${transfer.technician}.

Transfer Details:
- Transfer ID: ${transfer.id}
- Technician: ${transfer.technician}
- Department: ${transfer.department}
- Transfer Type: ${transfer.transferType}
- Serial Number: ${transfer.serial}
- Model: ${transfer.model}
- Part Number: ${transfer.part}
- Status: ${transfer.status}
- Submitted: ${transfer.createdAt.toLocaleString()}

${transfer.comments ? `Comments:\n${transfer.comments}\n` : ''}

View transfer at: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/internal-transfer/${transfer.id}

Note: A PDF copy of this transfer is attached to this email.

---
This is an automated message from PartPulse Internal Transfer System.
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
