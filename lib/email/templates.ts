/**
 * HTML Email Template System
 * Provides reusable, branded email templates for all notifications
 */

export interface EmailBranding {
  primaryColor: string;
  logoUrl: string;
  companyName: string;
  appUrl: string;
}

const DEFAULT_BRANDING: EmailBranding = {
  primaryColor: '#FF2B00',
  logoUrl: '/assets/logo/trane-logo.svg',
  companyName: 'Trane',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};

/**
 * Base HTML email template with consistent branding
 */
export function createEmailTemplate(
  title: string,
  content: string,
  branding: EmailBranding = DEFAULT_BRANDING
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f3f4f6;
    }
    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .email-header {
      background: linear-gradient(135deg, ${branding.primaryColor} 0%, #cc2200 100%);
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .email-logo {
      max-width: 150px;
      height: auto;
      margin-bottom: 15px;
    }
    .email-content {
      padding: 30px 20px;
      background-color: #ffffff;
    }
    .email-footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
      border-top: 1px solid #e5e7eb;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background-color: ${branding.primaryColor};
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
      transition: background-color 0.2s;
    }
    .button:hover {
      background-color: #cc2200;
    }
    .info-box {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .info-row {
      margin: 10px 0;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .label {
      font-weight: 600;
      color: #6b7280;
      display: inline-block;
      min-width: 140px;
    }
    .value {
      color: #111827;
      display: inline-block;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-pending {
      background-color: #fef3c7;
      color: #92400e;
    }
    .status-approved {
      background-color: #d1fae5;
      color: #065f46;
    }
    .status-rejected {
      background-color: #fee2e2;
      color: #991b1b;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 14px;
    }
    .table th,
    .table td {
      border: 1px solid #e5e7eb;
      padding: 10px;
      text-align: left;
    }
    .table th {
      background-color: #f3f4f6;
      font-weight: 600;
      color: #374151;
    }
    .divider {
      height: 1px;
      background-color: #e5e7eb;
      margin: 20px 0;
    }
    @media only screen and (max-width: 600px) {
      .email-content {
        padding: 20px 15px;
      }
      .label {
        display: block;
        margin-bottom: 5px;
      }
      .value {
        display: block;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-header">
      <h1>${title}</h1>
    </div>
    <div class="email-content">
      ${content}
    </div>
    <div class="email-footer">
      <p style="margin: 5px 0;">This is an automated message from ${branding.companyName} PartPulse System.</p>
      <p style="margin: 5px 0;">Please do not reply to this email.</p>
      <p style="margin: 15px 0 5px 0;">© ${new Date().getFullYear()} ${branding.companyName}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Create a formatted info row for displaying key-value pairs
 */
export function createInfoRow(label: string, value: string | number | boolean): string {
  return `
    <div class="info-row">
      <span class="label">${label}:</span>
      <span class="value">${value}</span>
    </div>`;
}

/**
 * Create a status badge with appropriate styling
 */
export function createStatusBadge(status: string): string {
  const statusLower = status.toLowerCase();
  let badgeClass = 'status-pending';
  
  if (statusLower === 'approved' || statusLower === 'completed') {
    badgeClass = 'status-approved';
  } else if (statusLower === 'rejected' || statusLower === 'denied') {
    badgeClass = 'status-rejected';
  }
  
  return `<span class="status-badge ${badgeClass}">${status}</span>`;
}

/**
 * Create a call-to-action button
 */
export function createButton(text: string, url: string): string {
  return `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${url}" class="button">${text}</a>
    </div>`;
}

/**
 * Create a table for displaying parts or items
 */
export function createTable(headers: string[], rows: string[][]): string {
  const headerRow = headers.map(h => `<th>${h}</th>`).join('');
  const bodyRows = rows.map(row => 
    `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
  ).join('');
  
  return `
    <table class="table">
      <thead>
        <tr>${headerRow}</tr>
      </thead>
      <tbody>
        ${bodyRows}
      </tbody>
    </table>`;
}

/**
 * Create a divider
 */
export function createDivider(): string {
  return '<div class="divider"></div>';
}

/**
 * Create an info box for important information
 */
export function createInfoBox(content: string): string {
  return `<div class="info-box">${content}</div>`;
}
