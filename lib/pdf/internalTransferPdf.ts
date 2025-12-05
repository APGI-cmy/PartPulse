/**
 * PDF Generation for Internal Transfers
 * Now using JSON-driven template engine
 */

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import type { InternalTransfer } from '../db/schema';
import { renderPdfFromTemplate } from './templateEngine';

/**
 * Generate a PDF representation of the Internal Transfer form
 * Uses the JSON template engine for consistent, configurable output
 */
export async function generateInternalTransferPDF(
  transfer: InternalTransfer
): Promise<string> {
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
    const storagePath = join(process.cwd(), 'storage', 'pdfs', 'internal-transfer');
    
    // Ensure directory exists
    await mkdir(storagePath, { recursive: true });
    
    const filePath = join(storagePath, filename);
    
    // Save PDF content to file
    // In MVP, this is text content. In production, this would be actual PDF buffer
    await writeFile(filePath, content, 'utf-8');
    
    console.log(`[PDF] Saved PDF to: ${filePath}`);
    
    return {
      success: true,
      path: `/storage/pdfs/internal-transfer/${filename}`,
    };
  } catch (error) {
    console.error('[PDF] Error saving PDF:', error);
    return {
      success: false,
    };
  }
}

