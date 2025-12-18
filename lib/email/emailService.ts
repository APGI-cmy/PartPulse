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
 * Check if email sending should be disabled
 * Email is disabled in test/CI environments to prevent external service calls
 */
function isEmailDisabled(): boolean {
  // Disable email in test environment
  if (process.env.NODE_ENV === 'test') {
    return true;
  }
  
  // Disable email if EMAIL_MODE is explicitly set to 'disabled'
  if (process.env.EMAIL_MODE === 'disabled') {
    return true;
  }
  
  return false;
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
  // CI Architecture Guard: Never attempt real SMTP in test/CI environments
  if (isEmailDisabled()) {
    const stubMessageId = `stub-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    console.log(`[EMAIL] Email disabled in ${process.env.NODE_ENV || 'test'} mode. Stub message ID: ${stubMessageId}`);
    console.log(`[EMAIL] Would send to: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
    console.log(`[EMAIL] Subject: ${options.subject}`);
    
    return {
      success: false,
      messageId: stubMessageId,
      error: 'Email sending disabled in test/CI environment',
    };
  }

  try {
    // Get configured EMAIL_FROM or use SMTP_USER as fallback
    const emailFrom = process.env.EMAIL_FROM || process.env.SMTP_USER;
    
    if (!emailFrom) {
      throw new Error('EMAIL_FROM not configured');
    }

    // Get transporter
    const transporter = getTransporter();

    // Prepare email options
    const mailOptions = {
      from: emailFrom,
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
    
    // Fall back to stub mode if SMTP fails
    console.log('[EMAIL STUB] Simulating email send due to SMTP failure');
    console.log('[EMAIL STUB] To:', options.to);
    console.log('[EMAIL STUB] Subject:', options.subject);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      messageId: `stub-fallback-${Date.now()}`,
    };
  }
}

/**
 * Verify SMTP connection
 * Useful for testing email configuration
 */
export async function verifyEmailConfig(): Promise<boolean> {
  // CI Architecture Guard: Never attempt real SMTP in test/CI environments
  if (isEmailDisabled()) {
    console.log(`[EMAIL] Email verification skipped in ${process.env.NODE_ENV || 'test'} mode`);
    return false;
  }

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
