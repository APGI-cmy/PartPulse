/**
 * Email notification for Warranty Claim Receipt
 * Uses branded HTML template system for professional emails
 * Sends emails via SMTP to configured Gmail address
 */

import type { WarrantyClaim } from '../db/schema';
import {
  createEmailTemplate,
  createInfoRow,
  createButton,
  createStatusBadge,
  createInfoBox,
  createTable,
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
 * Send confirmation email to technician and admin with PDF attached
 * @param claim - The warranty claim data
 * @param pdfContent - Optional PDF content to attach
 * @returns Promise that resolves when email is sent
 */
export async function sendWarrantyClaimReceipt(
  claim: WarrantyClaim,
  pdfContent?: string
): Promise<{ success: boolean; messageId?: string }> {
  console.log('[EMAIL] Sending Warranty Claim Receipt');
  console.log('[EMAIL] Claim ID:', claim.id);
  console.log('[EMAIL] Technician:', claim.technicianName);
  console.log('[EMAIL] Site:', claim.siteName);
  
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
    subject: `Warranty Claim Submitted - ${claim.id}`,
    html: generateEmailHTML(claim),
    text: generateEmailText(claim),
  };
  
  // Add PDF attachment if provided
  if (pdfContent) {
    emailOptions.attachments = [
      {
        filename: `warranty-claim-${claim.id}.pdf`,
        content: pdfContent,
        contentType: 'application/pdf',
      },
    ];
    console.log('[EMAIL] PDF attachment included');
  }
  
  // Send email via SMTP
  const result = await sendEmail(emailOptions);
  
  console.log('[EMAIL] Warranty claim email sent:', result.success ? 'SUCCESS' : 'FAILED');
  
  return result;
}

/**
 * Generate HTML email content using branded templates
 */
function generateEmailHTML(claim: WarrantyClaim): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // Prepare parts table data
  const tableHeaders = ['Part No.', 'Qty', 'Failed Serial', 'Replaced Serial'];
  const tableRows = claim.items.map(item => [
    item.partNo,
    String(item.quantity),
    item.failedPartSerial,
    item.replacedPartSerial,
  ]);
  
  const content = `
    <p style="font-size: 16px; margin-bottom: 20px;">A new warranty claim has been submitted by ${claim.technicianName}.</p>
    
    <h2 style="color: #111827; font-size: 18px; margin: 25px 0 15px 0;">Claim Details</h2>
    <div class="info-box">
      ${createInfoRow('Claim ID', claim.id)}
      ${createInfoRow('Date', new Date(claim.date).toLocaleDateString())}
      ${createInfoRow('Technician', claim.technicianName)}
      ${createInfoRow('Chiller Model', claim.chillerModel)}
      ${createInfoRow('Chiller Serial', claim.chillerSerial)}
      ${createInfoRow('SSID/Job Number', claim.ssidJobNumber)}
      ${claim.buildingName ? createInfoRow('Building Name', claim.buildingName) : ''}
      ${createInfoRow('Site Name', claim.siteName)}
      ${createInfoRow('Warranty Status', claim.coveredByWarranty ? '✓ Covered' : '✗ Not Covered')}
      ${createInfoRow('Status', createStatusBadge(claim.status || 'pending'))}
      ${createInfoRow('Submitted', claim.createdAt.toLocaleString())}
    </div>
    
    ${createDivider()}
    
    <h3 style="color: #374151; font-size: 16px; margin: 20px 0 10px 0;">Parts Details</h3>
    ${createTable(tableHeaders, tableRows)}
    
    ${claim.comments ? `
    ${createDivider()}
    <h3 style="color: #374151; font-size: 16px; margin: 20px 0 10px 0;">Comments</h3>
    <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #FF2B00;">
      <p style="margin: 0; color: #4b5563;">${claim.comments}</p>
    </div>
    ` : ''}
    
    ${createButton('View Claim Details', `${appUrl}/warranty-claims/${claim.id}`)}
    
    ${createInfoBox('📎 <strong>Note:</strong> A PDF copy of this warranty claim is attached to this email.')}
  `;
  
  return createEmailTemplate('Warranty Claim Submitted', content);
}

/**
 * Generate plain text email content
 */
function generateEmailText(claim: WarrantyClaim): string {
  const partsText = claim.items.map((item, index) => 
    `  ${index + 1}. Part No: ${item.partNo}, Qty: ${item.quantity}, Failed: ${item.failedPartSerial}, Replaced: ${item.replacedPartSerial}`
  ).join('\n');
  
  return `
Warranty Claim Submitted

A new warranty claim has been submitted by ${claim.technicianName}.

Claim Details:
- Claim ID: ${claim.id}
- Date: ${new Date(claim.date).toLocaleDateString()}
- Technician: ${claim.technicianName}
- Chiller Model: ${claim.chillerModel}
- Chiller Serial Number: ${claim.chillerSerial}
- Job Number / SSID #: ${claim.ssidJobNumber}
${claim.buildingName ? `- Building Name: ${claim.buildingName}\n` : ''}- Site Name: ${claim.siteName}
- Warranty Status: ${claim.coveredByWarranty ? 'Covered by Warranty' : 'Not Covered'}
- Status: ${claim.status || 'pending'}
- Submitted: ${claim.createdAt.toLocaleString()}

Parts Details:
${partsText}

${claim.comments ? `Comments:\n${claim.comments}\n` : ''}

View claim at: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/warranty-claims/${claim.id}

Note: A PDF copy of this warranty claim is attached to this email.

---
This is an automated message from PartPulse Warranty Claims System.
  `;
}

/**
 * Send notification to admin when a warranty claim is submitted
 */
export async function sendAdminNotification(
  claim: WarrantyClaim
): Promise<{ success: boolean; messageId?: string }> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  
  const content = `
    <p style="font-size: 16px; margin-bottom: 20px;">A new warranty claim has been submitted and requires review.</p>
    
    <h2 style="color: #111827; font-size: 18px; margin: 25px 0 15px 0;">Claim Summary</h2>
    <div class="info-box">
      ${createInfoRow('Claim ID', claim.id)}
      ${createInfoRow('Technician', claim.technicianName)}
      ${createInfoRow('Chiller Model', claim.chillerModel)}
      ${createInfoRow('SSID/Job Number', claim.ssidJobNumber)}
      ${createInfoRow('Parts Count', String(claim.items.length))}
      ${createInfoRow('Warranty Status', claim.coveredByWarranty ? '✓ Covered' : '✗ Not Covered')}
      ${createInfoRow('Submitted', claim.createdAt.toLocaleString())}
    </div>
    
    ${createButton('Review Claim', `${appUrl}/warranty-claims/${claim.id}/admin`)}
    
    ${createInfoBox('⚡ <strong>Action Required:</strong> Please review and process this warranty claim.')}
  `;
  
  // Generate email HTML (in production, this would be sent via email service)
  createEmailTemplate('New Warranty Claim - Action Required', content);
  
  console.log('[EMAIL STUB] Sending admin notification');
  console.log('[EMAIL STUB] Claim ID:', claim.id);
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
  claim: WarrantyClaim,
  adminName: string,
  pdfContent?: string
): Promise<{ success: boolean; messageId?: string }> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const content = `
    <p style="font-size: 16px; margin-bottom: 20px;">Dear ${claim.technicianName},</p>
    <p style="margin-bottom: 20px;">Good news! Your warranty claim has been <strong style="color: #059669;">approved</strong>.</p>
    
    <h2 style="color: #111827; font-size: 18px; margin: 25px 0 15px 0;">Claim Details</h2>
    <div class="info-box">
      ${createInfoRow('Claim ID', claim.id)}
      ${createInfoRow('Status', createStatusBadge('approved'))}
      ${createInfoRow('Approved By', adminName)}
      ${createInfoRow('Approved On', new Date().toLocaleString())}
      ${createInfoRow('Chiller Model', claim.chillerModel)}
      ${createInfoRow('SSID/Job Number', claim.ssidJobNumber)}
    </div>
    
    ${createButton('View Claim', `${appUrl}/warranty-claims/${claim.id}`)}
    
    ${createInfoBox('✅ <strong>Next Steps:</strong> Your warranty claim has been processed and approved for reimbursement.')}
  `;
  
  const emailOptions: EmailOptions = {
    to: getTechnicianEmail(claim.technicianName),
    subject: `Warranty Claim Approved - ${claim.id}`,
    html: createEmailTemplate('Warranty Claim Approved', content),
    text: `Your warranty claim ${claim.id} has been approved by ${adminName}.`,
  };
  
  if (pdfContent) {
    emailOptions.attachments = [
      {
        filename: `warranty-claim-${claim.id}-approved.pdf`,
        content: pdfContent,
        contentType: 'application/pdf',
      },
    ];
  }
  
  console.log('[EMAIL STUB] Sending approval notification');
  console.log('[EMAIL STUB] Claim ID:', claim.id);
  console.log('[EMAIL STUB] Email would be sent to:', emailOptions.to);
  
  return {
    success: true,
    messageId: `stub-approval-${Date.now()}`,
  };
}
