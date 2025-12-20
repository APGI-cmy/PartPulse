/**
 * Email Utilities
 * Re-exports email functions for architecture compliance
 */

export { sendInternalTransferReceipt } from './email/sendInternalTransferReceipt';
export { sendWarrantyClaimReceipt } from './email/sendWarrantyClaimReceipt';
export { sendPasswordResetEmail } from './email/sendPasswordResetEmail';
export * from './email/templates';
