/**
 * Email notification for Warranty Claim Receipt
 * This is a stub implementation for MVP
 * In production, this would integrate with an email service like SendGrid, AWS SES, or Resend
 */

import type { WarrantyClaim } from '../db/schema';

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
 * @param claim - The warranty claim data
 * @param pdfContent - Optional PDF content to attach
 * @returns Promise that resolves when email is sent
 */
export async function sendWarrantyClaimReceipt(
  claim: WarrantyClaim,
  pdfContent?: string
): Promise<{ success: boolean; messageId?: string }> {
  // Stub implementation - in production, integrate with email service
  
  console.log('[EMAIL STUB] Sending Warranty Claim Receipt');
  console.log('[EMAIL STUB] Claim ID:', claim.id);
  console.log('[EMAIL STUB] Technician:', claim.technicianName);
  console.log('[EMAIL STUB] Site:', claim.siteName);
  
  // Build email content
  const emailOptions: EmailOptions = {
    to: getTechnicianEmail(claim.technicianName),
    subject: `Warranty Claim Confirmation - ${claim.id}`,
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
function generateEmailHTML(claim: WarrantyClaim): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Warranty Claim Confirmation</title>
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
      width: 180px;
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
    .parts-table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    .parts-table th,
    .parts-table td {
      border: 1px solid #e5e7eb;
      padding: 8px;
      text-align: left;
      font-size: 12px;
    }
    .parts-table th {
      background-color: #f3f4f6;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0;">Warranty Claim Confirmed</h1>
  </div>
  <div class="content">
    <p>Dear ${claim.technicianName},</p>
    <p>Your warranty claim has been successfully submitted and is now being processed.</p>
    
    <h2>Claim Details</h2>
    <div class="info-row">
      <span class="label">Claim ID:</span>
      <span class="value">${claim.id}</span>
    </div>
    <div class="info-row">
      <span class="label">Date:</span>
      <span class="value">${new Date(claim.date).toLocaleDateString()}</span>
    </div>
    <div class="info-row">
      <span class="label">Chiller Model:</span>
      <span class="value">${claim.chillerModel}</span>
    </div>
    <div class="info-row">
      <span class="label">Chiller Serial Number:</span>
      <span class="value">${claim.chillerSerial}</span>
    </div>
    <div class="info-row">
      <span class="label">Job Number / SSID #:</span>
      <span class="value">${claim.ssidJobNumber}</span>
    </div>
    ${claim.buildingName ? `
    <div class="info-row">
      <span class="label">Building Name:</span>
      <span class="value">${claim.buildingName}</span>
    </div>
    ` : ''}
    <div class="info-row">
      <span class="label">Site Name:</span>
      <span class="value">${claim.siteName}</span>
    </div>
    <div class="info-row">
      <span class="label">Warranty Status:</span>
      <span class="value">${claim.coveredByWarranty ? '✓ Covered by Warranty' : '✗ Not Covered'}</span>
    </div>
    <div class="info-row">
      <span class="label">Status:</span>
      <span class="value" style="text-transform: capitalize;">${claim.status || 'pending'}</span>
    </div>
    <div class="info-row">
      <span class="label">Submitted:</span>
      <span class="value">${claim.createdAt.toLocaleString()}</span>
    </div>
    
    <h3>Parts Details</h3>
    <table class="parts-table">
      <thead>
        <tr>
          <th>Part No.</th>
          <th>Qty</th>
          <th>Failed Serial</th>
          <th>Replaced Serial</th>
        </tr>
      </thead>
      <tbody>
        ${claim.items.map(item => `
        <tr>
          <td>${item.partNo}</td>
          <td>${item.quantity}</td>
          <td>${item.failedPartSerial}</td>
          <td>${item.replacedPartSerial}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
    
    ${claim.comments ? `
    <div style="margin-top: 15px;">
      <strong>Comments:</strong>
      <p style="background-color: white; padding: 10px; border-radius: 4px;">${claim.comments}</p>
    </div>
    ` : ''}
    
    <div style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/warranty-claims/${claim.id}" class="button">
        View Claim Details
      </a>
    </div>
    
    <p style="margin-top: 20px;">
      <strong>Note:</strong> A PDF copy of this warranty claim is attached to this email for your records.
    </p>
  </div>
  <div class="footer">
    <p>This is an automated message from PartPulse Warranty Claims System.</p>
    <p>Please do not reply to this email.</p>
  </div>
</body>
</html>
  `;
}

/**
 * Generate plain text email content
 */
function generateEmailText(claim: WarrantyClaim): string {
  const partsText = claim.items.map((item, index) => 
    `  ${index + 1}. Part No: ${item.partNo}, Qty: ${item.quantity}, Failed: ${item.failedPartSerial}, Replaced: ${item.replacedPartSerial}`
  ).join('\n');
  
  return `
Warranty Claim Confirmation

Dear ${claim.technicianName},

Your warranty claim has been successfully submitted and is now being processed.

Claim Details:
- Claim ID: ${claim.id}
- Date: ${new Date(claim.date).toLocaleDateString()}
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

View your claim at: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/warranty-claims/${claim.id}

Note: A PDF copy of this warranty claim is attached to this email for your records.

---
This is an automated message from PartPulse Warranty Claims System.
Please do not reply to this email.
  `;
}

/**
 * Send notification to admin when a warranty claim is processed
 */
export async function sendAdminNotification(
  claim: WarrantyClaim
): Promise<{ success: boolean; messageId?: string }> {
  console.log('[EMAIL STUB] Sending admin notification');
  console.log('[EMAIL STUB] Claim ID:', claim.id);
  console.log('[EMAIL STUB] Admin notification simulated successfully');
  
  return {
    success: true,
    messageId: `stub-admin-${Date.now()}`,
  };
}
