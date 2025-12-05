# Email Template System

The PartPulse application includes a professional, branded HTML email template system for all notification emails.

## Features

- **Consistent Branding**: All emails use the same Trane-branded template
- **Responsive Design**: Emails look good on desktop and mobile devices
- **Reusable Components**: Common elements like buttons, tables, and info boxes
- **Status Badges**: Visual status indicators for pending, approved, rejected states
- **HTML & Plain Text**: Dual-format emails for better compatibility

## Email Types

### 1. Transfer Submission Confirmation
Sent to technicians when they submit an internal transfer request.

**Trigger**: Internal transfer form submission  
**Recipients**: Submitting technician  
**Attachments**: PDF copy of transfer form

### 2. Warranty Claim Submission Confirmation
Sent to technicians when they submit a warranty claim.

**Trigger**: Warranty claim form submission  
**Recipients**: Submitting technician  
**Attachments**: PDF copy of warranty claim form

### 3. Admin Notification - New Submission
Sent to administrators when a new request requires review.

**Trigger**: New internal transfer or warranty claim submission  
**Recipients**: System administrators  
**Attachments**: None (link to review page)

### 4. Transfer/Claim Approval Notification
Sent to technicians when their request is approved.

**Trigger**: Admin approves request  
**Recipients**: Original submitting technician  
**Attachments**: Updated PDF with admin approval

### 5. Technician Assignment Notification
Sent to technicians when they are assigned to a task.

**Trigger**: Admin assigns technician to request  
**Recipients**: Assigned technician  
**Attachments**: Relevant PDF

## Template Components

### Base Template
Located in: `lib/email/templates.ts`

```typescript
createEmailTemplate(title: string, content: string, branding?: EmailBranding): string
```

Creates a full HTML email with header, footer, and consistent styling.

### Components

#### Info Row
Display key-value pairs in emails:
```typescript
createInfoRow('Label', 'Value')
```

#### Status Badge
Colored badge for status display:
```typescript
createStatusBadge('pending')    // Yellow badge
createStatusBadge('approved')   // Green badge
createStatusBadge('rejected')   // Red badge
```

#### Button/CTA
Call-to-action button:
```typescript
createButton('View Details', 'https://example.com/details')
```

#### Table
Data table for parts/items:
```typescript
createTable(
  ['Header 1', 'Header 2', 'Header 3'],
  [
    ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
    ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3']
  ]
)
```

#### Info Box
Highlighted information box:
```typescript
createInfoBox('<strong>Note:</strong> Important information here')
```

#### Divider
Horizontal separator:
```typescript
createDivider()
```

## Branding Configuration

Default branding uses Trane colors and styling:

```typescript
{
  primaryColor: '#FF2B00',  // Trane red
  logoUrl: '/assets/logo/trane-logo.svg',
  companyName: 'Trane',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}
```

## Email Styling

The email templates use inline CSS for maximum compatibility:

- **Colors**:
  - Primary: `#FF2B00` (Trane red)
  - Text: `#333333`
  - Light text: `#6b7280`
  - Background: `#f3f4f6`
  
- **Fonts**:
  - System font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...`
  
- **Layout**:
  - Max width: `600px`
  - Responsive on mobile devices
  - Safe padding for all email clients

## Usage Examples

### Sending Transfer Confirmation

```typescript
import { sendInternalTransferReceipt } from '@/lib/email/sendInternalTransferReceipt';

await sendInternalTransferReceipt(transfer, pdfContent);
```

### Sending Admin Notification

```typescript
import { sendAdminNotification } from '@/lib/email/sendInternalTransferReceipt';

await sendAdminNotification(transfer);
```

### Sending Approval Email

```typescript
import { sendApprovalNotification } from '@/lib/email/sendInternalTransferReceipt';

await sendApprovalNotification(transfer, 'John Admin', pdfContent);
```

## Email Service Integration

The current implementation is a stub that logs emails to the console. For production, integrate with an email service provider:

### Recommended Providers

1. **Resend** - Modern, developer-friendly
2. **SendGrid** - Established, feature-rich
3. **AWS SES** - Cost-effective for high volume
4. **Postmark** - Focused on transactional emails

### Integration Steps

1. Install email service SDK:
   ```bash
   npm install resend  # or sendgrid, @aws-sdk/client-ses, etc.
   ```

2. Update email functions to use the service:
   ```typescript
   import { Resend } from 'resend';
   
   const resend = new Resend(process.env.RESEND_API_KEY);
   
   await resend.emails.send({
     from: 'noreply@example.com',
     to: emailOptions.to,
     subject: emailOptions.subject,
     html: emailOptions.html,
     text: emailOptions.text,
     attachments: emailOptions.attachments
   });
   ```

3. Configure environment variables:
   ```env
   EMAIL_DOMAIN=example.com
   EMAIL_FROM=noreply@example.com
   ADMIN_EMAIL=admin@example.com
   RESEND_API_KEY=your_api_key
   ```

## Testing Emails

### Development Testing

1. **Console Output**: Current stub logs email details to console
2. **Email Preview Tools**: Use tools like Litmus or Email on Acid
3. **Test Email Services**: Use services like Mailtrap or MailHog

### Production Testing

1. Send test emails to multiple email clients (Gmail, Outlook, Apple Mail)
2. Test on both desktop and mobile
3. Verify links and attachments work correctly
4. Check spam score using tools like Mail Tester

## Email Content Guidelines

### Subject Lines
- Keep under 50 characters
- Be specific and actionable
- Include relevant IDs or reference numbers

### Body Content
- Start with personalized greeting
- State purpose clearly in first paragraph
- Include all relevant details in organized sections
- Provide clear call-to-action
- End with professional closing

### Accessibility
- Use semantic HTML
- Provide alt text for images
- Ensure sufficient color contrast
- Use readable font sizes (minimum 14px for body)

## Compliance

### CAN-SPAM / GDPR Requirements
- Include company name and address in footer
- Provide unsubscribe mechanism (if applicable)
- Honor opt-out requests
- Don't use misleading subject lines

### Data Privacy
- Don't include sensitive information in plain text
- Use secure links (HTTPS)
- Consider data retention policies for email logs

## Troubleshooting

### Common Issues

1. **Email not rendering correctly**
   - Test in multiple email clients
   - Validate HTML with email testing tools
   - Check inline CSS

2. **Images not loading**
   - Use absolute URLs for images
   - Host images on reliable CDN
   - Provide alt text

3. **Links not working**
   - Use absolute URLs
   - Test all links before sending
   - Ensure app URL is configured correctly

4. **Emails going to spam**
   - Set up SPF, DKIM, DMARC records
   - Use reputable email service
   - Avoid spam trigger words
   - Maintain good sender reputation

## Future Enhancements

Potential improvements:

1. **Email Templates in Database**: Store templates in database for easy editing
2. **Personalization**: More dynamic content based on user preferences
3. **Localization**: Multi-language support
4. **Email Analytics**: Track open rates, click rates
5. **A/B Testing**: Test different templates and content
6. **Scheduled Sends**: Queue emails for optimal send times
7. **Batch Processing**: Send bulk emails efficiently
