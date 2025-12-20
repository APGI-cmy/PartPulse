/**
 * Email Service Implementation
 * Handles actual email sending using SMTP (Gmail)
 */

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

/**
 * Get or create SMTP transporter
 * Uses Gmail SMTP with credentials from environment variables
 * Creates a new transporter instance to avoid shared state issues
 */
function getTransporter(): Transporter {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    console.warn('[EMAIL] SMTP configuration missing. Email sending will be simulated.');
    throw new Error('SMTP configuration incomplete');
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort, 10),
    secure: false, // Use STARTTLS
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  console.log('[EMAIL] SMTP transporter configured:', smtpHost);
  return transporter;
}

/**
 * Send email using SMTP
 * @param options - Email options including recipient, subject, body, and attachments
 * @returns Promise with success status and message ID
 */
export async function sendEmail(
  options: EmailOptions
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Get configured EMAIL_FROM or use SMTP_USER as fallback
    const emailFrom = process.env.EMAIL_FROM || process.env.SMTP_USER;
    const emailFromName = process.env.EMAIL_FROM_NAME || 'PartPulse';
    
    if (!emailFrom) {
      throw new Error('EMAIL_FROM not configured');
    }

    // Format sender with name: "Name <email@address.com>"
    const formattedFrom = `${emailFromName} <${emailFrom}>`;

    // Get transporter
    const transporter = getTransporter();

    // Prepare email options
    const mailOptions = {
      from: formattedFrom,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments?.map(att => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType,
      })),
    };

    console.log('[EMAIL] Sending email to:', mailOptions.to);
    console.log('[EMAIL] Subject:', mailOptions.subject);
    
    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('[EMAIL] Email sent successfully. Message ID:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('[EMAIL] Failed to send email:', error);
    
    // Return failure status - do NOT simulate success
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Verify SMTP connection
 * Useful for testing email configuration
 */
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    console.log('[EMAIL] SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('[EMAIL] SMTP connection verification failed:', error);
    return false;
  }
}
