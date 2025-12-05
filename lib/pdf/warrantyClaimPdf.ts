/**
 * PDF Generation for Warranty Claims
 * Now using JSON-driven template engine
 */

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import type { WarrantyClaim } from '../db/schema';
import { renderPdfFromTemplate } from './templateEngine';

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
 * Save PDF to storage directory
 * @param content - The PDF content (text for MVP, will be actual PDF buffer in production)
 * @param filename - The filename to save as
 * @returns Promise with success status and path
 */
export async function savePDF(
  content: string,
  filename: string
): Promise<{ success: boolean; path?: string }> {
  try {
    // Determine storage path
    const storagePath = join(process.cwd(), 'storage', 'pdfs', 'warranty-claims');
    
    // Ensure directory exists
    await mkdir(storagePath, { recursive: true });
    
    const filePath = join(storagePath, filename);
    
    // Save PDF content to file
    // In MVP, this is text content. In production, this would be actual PDF buffer
    await writeFile(filePath, content, 'utf-8');
    
    console.log(`[PDF] Saved warranty claim PDF to: ${filePath}`);
    
    return {
      success: true,
      path: `/storage/pdfs/warranty-claims/${filename}`,
    };
  } catch (error) {
    console.error('[PDF] Error saving warranty claim PDF:', error);
    return {
      success: false,
    };
  }
}
