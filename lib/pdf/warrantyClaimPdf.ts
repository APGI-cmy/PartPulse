/**
 * PDF Generation for Warranty Claims
 * Uses JSON-driven template engine with PDFKit for proper PDF generation
 */

import type { WarrantyClaim } from '../db/schema';
import { renderPdfFromTemplate } from './templateEngine';
import { getStorage } from '../storage';

/**
 * Generate a PDF representation of the Trane Warranty Parts Claims Form
 * Uses the template engine to render the PDF with PDFKit
 */
export async function generateWarrantyClaimPDF(
  claim: WarrantyClaim
): Promise<Buffer> {
  // Use the template engine to render the PDF
  return await renderPdfFromTemplate('warranty', claim);
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
    const storagePath = `pdfs/warranty-claims/${filename}`;
    
    // Convert Buffer to base64 string for storage
    const base64Content = content.toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64Content}`;
    
    const path = await storage.save(storagePath, dataUrl, 'application/pdf');
    const url = storage.getUrl(path);
    
    console.log(`[PDF] Saved warranty claim PDF using storage provider: ${path}`);
    return {
      success: true,
      path,
      url,
    };
  } catch (error) {
    console.error('[PDF] Error saving warranty claim PDF:', error);
    return {
      success: false,
    };
  }
}
