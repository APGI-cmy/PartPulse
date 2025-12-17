/**
 * PDF Generation for Internal Transfers
 * Uses JSON-driven template engine with PDFKit for proper PDF generation
 */

import type { InternalTransfer } from '../db/schema';
import { renderPdfFromTemplate } from './templateEngine';
import { getStorage } from '../storage';

/**
 * Generate a PDF representation of the Internal Transfer form
 * Uses the template engine to render the PDF with PDFKit
 */
export async function generateInternalTransferPDF(
  transfer: InternalTransfer
): Promise<Buffer> {
  // Prepare data for template
  // If no items array, create one from the single part fields
  const templateData = {
    ...transfer,
    items: transfer.items || [
      {
        quantity: 1,
        partNo: transfer.part,
        description: transfer.description,
      },
    ],
  };
  
  // Use the template engine to render the PDF
  return await renderPdfFromTemplate('internalTransfer', templateData);
}

/**
 * Save PDF using configured storage provider
 * @param content - The PDF content as a Buffer
 * @param filename - The filename to save as
 * @returns Promise with success status and path
 */
export async function savePDF(
  content: Buffer,
  filename: string
): Promise<{ success: boolean; path?: string; url?: string }> {
  try {
    const storage = getStorage();
    const storagePath = `pdfs/internal-transfer/${filename}`;
    
    // Convert Buffer to base64 string for storage
    const base64Content = content.toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64Content}`;
    
    const path = await storage.save(storagePath, dataUrl, 'application/pdf');
    const url = storage.getUrl(path);
    
    console.log(`[PDF] Saved PDF using storage provider: ${path}`);
    return {
      success: true,
      path,
      url,
    };
  } catch (error) {
    console.error('[PDF] Error saving PDF:', error);
    return {
      success: false,
    };
  }
}
