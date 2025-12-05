/**
 * PDF Generation for Warranty Claims
 * Now using JSON-driven template engine with storage abstraction
 */

import type { WarrantyClaim } from '../db/schema';
import { renderPdfFromTemplate } from './templateEngine';
import { getStorage } from '../storage';

/**
 * Generate a PDF representation of the Trane Warranty Parts Claims Form
 * Uses the JSON template engine for consistent, configurable output
 */
export async function generateWarrantyClaimPDF(
  claim: WarrantyClaim
): Promise<string> {
  // Use the template engine to render the PDF
  return await renderPdfFromTemplate('warranty', claim);
}

/**
 * Save PDF using configured storage provider
 * @param content - The PDF content (text for MVP, will be actual PDF buffer in production)
 * @param filename - The filename to save as
 * @returns Promise with success status and path
 */
export async function savePDF(
  content: string,
  filename: string
): Promise<{ success: boolean; path?: string; url?: string }> {
  try {
    const storage = getStorage();
    const storagePath = `pdfs/warranty-claims/${filename}`;
    
    const result = await storage.save(storagePath, content, 'application/pdf');
    
    if (result.success) {
      console.log(`[PDF] Saved warranty claim PDF using storage provider: ${result.path}`);
      return {
        success: true,
        path: result.path,
        url: result.url,
      };
    } else {
      console.error('[PDF] Storage provider returned error:', result.error);
      return {
        success: false,
      };
    }
  } catch (error) {
    console.error('[PDF] Error saving warranty claim PDF:', error);
    return {
      success: false,
    };
  }
}
