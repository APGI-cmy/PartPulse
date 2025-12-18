/**
 * Email notification for User Invitations
 * Sends invitation emails to new users with signup links
 */

import {
  createEmailTemplate,
  createInfoRow,
  createButton,
  createInfoBox,
} from './templates';
import { sendEmail, type EmailOptions } from './emailService';

export interface InvitationEmailParams {
  email: string;
  name: string;
  role: string;
  invitationUrl: string;
  expiresAt: Date;
  invitedBy?: string;
}

/**
 * Send invitation email to a new user
 * @param params - Invitation parameters
 * @returns Promise with success status and message ID
 */
export async function sendInvitationEmail(
  params: InvitationEmailParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log('[EMAIL] Sending User Invitation');
  console.log('[EMAIL] To:', params.email);
  console.log('[EMAIL] Name:', params.name);
  console.log('[EMAIL] Role:', params.role);
  
  // Build email options
  const emailOptions: EmailOptions = {
    to: params.email,
    subject: `You're invited to join PartPulse`,
    html: generateInvitationHTML(params),
    text: generateInvitationText(params),
  };
  
  // Send email via SMTP
  const result = await sendEmail(emailOptions);
  
  console.log('[EMAIL] Invitation email sent:', result.success ? 'SUCCESS' : 'FAILED');
  
  return result;
}

/**
 * Generate HTML email content for invitation
 */
function generateInvitationHTML(params: InvitationEmailParams): string {
  const formattedDate = params.expiresAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const content = `
    <p style="font-size: 16px; margin-bottom: 20px;">Hello ${params.name},</p>
    
    <p style="margin-bottom: 20px;">You've been invited to join <strong>PartPulse</strong>!</p>
    
    <h2 style="color: #111827; font-size: 18px; margin: 25px 0 15px 0;">Your Invitation Details</h2>
    <div class="info-box">
      ${createInfoRow('Name', params.name)}
      ${createInfoRow('Email', params.email)}
      ${createInfoRow('Role', params.role.charAt(0).toUpperCase() + params.role.slice(1))}
      ${params.invitedBy ? createInfoRow('Invited By', params.invitedBy) : ''}
      ${createInfoRow('Expires', formattedDate)}
    </div>
    
    <p style="margin: 25px 0 20px 0;">Click the button below to accept your invitation and create your account:</p>
    
    ${createButton('Accept Invitation', params.invitationUrl)}
    
    ${createInfoBox('⏰ <strong>Important:</strong> This invitation link will expire on ' + formattedDate + '. Please complete your registration before then.')}
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; color: #6b7280; font-size: 14px;">
        If you didn't expect this invitation, you can safely ignore this email.
      </p>
    </div>
  `;
  
  return createEmailTemplate('Welcome to PartPulse', content);
}

/**
 * Generate plain text email content for invitation
 */
function generateInvitationText(params: InvitationEmailParams): string {
  const formattedDate = params.expiresAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return `
You're invited to join PartPulse!

Hello ${params.name},

You've been invited to join PartPulse.

Your Invitation Details:
- Name: ${params.name}
- Email: ${params.email}
- Role: ${params.role.charAt(0).toUpperCase() + params.role.slice(1)}
${params.invitedBy ? `- Invited By: ${params.invitedBy}` : ''}
- Expires: ${formattedDate}

Accept your invitation by visiting:
${params.invitationUrl}

⏰ IMPORTANT: This invitation link will expire on ${formattedDate}. Please complete your registration before then.

If you didn't expect this invitation, you can safely ignore this email.

---
This is an automated message from PartPulse User Management System.
  `;
}
