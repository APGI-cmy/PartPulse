/**
 * Email notification for Password Reset
 * Sends password reset emails with secure reset links
 */

import {
  createEmailTemplate,
  createInfoRow,
  createButton,
  createInfoBox,
} from './templates';
import { sendEmail, type EmailOptions } from './emailService';

export interface PasswordResetEmailParams {
  email: string;
  name?: string;
  resetUrl: string;
  expiresAt: Date;
}

/**
 * Send password reset email to a user
 * @param params - Password reset parameters
 * @returns Promise with success status and message ID
 */
export async function sendPasswordResetEmail(
  params: PasswordResetEmailParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log('[EMAIL] Sending Password Reset');
  console.log('[EMAIL] To:', params.email);
  
  // Build email options
  const emailOptions: EmailOptions = {
    to: params.email,
    subject: 'Reset Your PartPulse Password',
    html: generatePasswordResetHTML(params),
    text: generatePasswordResetText(params),
  };
  
  // Send email via SMTP
  const result = await sendEmail(emailOptions);
  
  console.log('[EMAIL] Password reset email sent:', result.success ? 'SUCCESS' : 'FAILED');
  
  return result;
}

/**
 * Generate HTML email content for password reset
 */
function generatePasswordResetHTML(params: PasswordResetEmailParams): string {
  const formattedDate = params.expiresAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const greeting = params.name ? `Hello ${params.name}` : 'Hello';
  
  const content = `
    <p style="font-size: 16px; margin-bottom: 20px;">${greeting},</p>
    
    <p style="margin-bottom: 20px;">We received a request to reset your password for your <strong>PartPulse</strong> account.</p>
    
    <p style="margin-bottom: 20px;">Click the button below to reset your password:</p>
    
    ${createButton('Reset Password', params.resetUrl)}
    
    ${createInfoBox('⏰ <strong>Important:</strong> This password reset link will expire on ' + formattedDate + '. If you need a new link, please request another password reset.')}
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
        If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
      </p>
      <p style="margin: 0; color: #6b7280; font-size: 14px;">
        For security reasons, please do not share this link with anyone.
      </p>
    </div>
  `;
  
  return createEmailTemplate('Reset Your Password', content);
}

/**
 * Generate plain text email content for password reset
 */
function generatePasswordResetText(params: PasswordResetEmailParams): string {
  const formattedDate = params.expiresAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const greeting = params.name ? `Hello ${params.name}` : 'Hello';
  
  return `
Reset Your PartPulse Password

${greeting},

We received a request to reset your password for your PartPulse account.

Reset your password by visiting:
${params.resetUrl}

⏰ IMPORTANT: This password reset link will expire on ${formattedDate}. If you need a new link, please request another password reset.

If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.

For security reasons, please do not share this link with anyone.

---
This is an automated message from PartPulse User Management System.
  `;
}
