/**
 * JSON-Driven PDF Template Engine
 * Renders PDFs from JSON template definitions
 */

import { readFile } from 'fs/promises';
import { join } from 'path';

/**
 * Template definition types
 */
export interface PageConfig {
  size: 'A4' | 'Letter' | 'Legal';
  margin: number;
  orientation?: 'portrait' | 'landscape';
}

export interface LogoConfig {
  src: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface TitleConfig {
  text: string;
  x?: number;
  y: number;
  align?: 'left' | 'center' | 'right';
  fontSize?: number;
  bold?: boolean;
  underline?: boolean;
}

export interface HeaderConfig {
  logos?: LogoConfig[];
  title?: TitleConfig;
  subtitle?: TitleConfig;
}

export interface FieldConfig {
  label: string;
  binding: string;
  x?: number;
  y?: number;
  width?: number;
  labelWidth?: number;
  fontSize?: number;
  bold?: boolean;
  underline?: boolean;
  format?: 'date' | 'number' | 'text';
}

export interface TableColumnConfig {
  header: string;
  binding: string;
  width: number;
  format?: 'date' | 'number' | 'text';
}

export interface TableConfig {
  columns: TableColumnConfig[];
  rowsBinding: string;
  x?: number;
  headerHeight?: number;
  rowHeight?: number;
  fontSize?: number;
}

export interface TextConfig {
  content?: string;
  binding?: string;
  x?: number;
  width?: number;
  height?: number;
  fontSize?: number;
  align?: 'left' | 'center' | 'right';
  multiline?: boolean;
}

export interface CheckboxConfig {
  label: string;
  binding: string;
  x?: number;
  size?: number;
}

export interface SignatureConfig {
  label?: string;
  binding?: string;
  x?: number;
  width?: number;
}

export interface StampConfig {
  text: string;
  binding: string;
  x?: number;
  fontSize?: number;
  rotation?: number;
  color?: string;
}

export interface LineConfig {
  x1?: number;
  x2?: number;
  strokeWidth?: number;
}

export interface SpacerConfig {
  height: number;
}

export interface Section {
  type: 'fields' | 'table' | 'text' | 'checkbox' | 'signature' | 'stamp' | 'spacer' | 'line';
  label?: string;
  y?: number;
  fields?: FieldConfig[];
  table?: TableConfig;
  text?: TextConfig;
  checkbox?: CheckboxConfig;
  signature?: SignatureConfig;
  stamp?: StampConfig;
  line?: LineConfig;
  spacer?: SpacerConfig;
}

export interface PdfTemplate {
  page: PageConfig;
  header?: HeaderConfig;
  sections: Section[];
}

/**
 * Load a PDF template from the templates/pdf directory
 */
export async function loadTemplate(templateName: 'warranty' | 'internalTransfer'): Promise<PdfTemplate> {
  const templatePath = join(
    process.cwd(),
    'templates',
    'pdf',
    templateName === 'warranty' ? 'warranty-claim-template.json' : 'internal-transfer-template.json'
  );
  
  const templateContent = await readFile(templatePath, 'utf-8');
  return JSON.parse(templateContent) as PdfTemplate;
}

/**
 * Get nested value from object using dot notation path
 */
function getNestedValue(obj: unknown, path: string): unknown {
  if (!obj || typeof obj !== 'object') {
    return undefined;
  }
  
  return path.split('.').reduce((current: unknown, key) => {
    if (current && typeof current === 'object' && Object.prototype.hasOwnProperty.call(current, key)) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Format value based on format type
 */
function formatValue(value: unknown, format?: 'date' | 'number' | 'text'): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  switch (format) {
    case 'date': {
      if (value instanceof Date) {
        return value.toLocaleDateString();
      }
      const dateValue = new Date(value as string | number);
      // Check if date is valid
      if (isNaN(dateValue.getTime())) {
        return String(value);
      }
      return dateValue.toLocaleDateString();
    }
    case 'number':
      return typeof value === 'number' ? value.toString() : String(value);
    case 'text':
    default:
      return String(value);
  }
}

/**
 * Render a PDF from a template and data
 * Uses PDFKit to generate actual PDF documents
 */
export async function renderPdfFromTemplate(
  templateName: 'warranty' | 'internalTransfer',
  data: unknown
): Promise<Buffer> {
  // Use dynamic import for PDFKit since it's a CommonJS module
  const PDFDocument = (await import('pdfkit')).default;
  
  const template = await loadTemplate(templateName);
  
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: template.page.size === 'A4' ? 'A4' : 'LETTER',
      margin: template.page.margin,
      layout: template.page.orientation || 'portrait'
    });
    
    const chunks: Buffer[] = [];
    
    // Collect PDF chunks
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    
    let currentY = template.page.margin;
    const pageWidth = doc.page.width;
    const leftMargin = template.page.margin;
    const rightMargin = pageWidth - template.page.margin;
    const contentWidth = rightMargin - leftMargin;
    
    // Render header with logos
    if (template.header?.logos) {
      for (const logo of template.header.logos) {
        const logoText = logo.src.split('/').pop()?.replace('.svg', '').replace(/-/g, ' ').toUpperCase() || 'LOGO';
        doc.fontSize(12).font('Helvetica-Bold')
          .text(`[${logoText}]`, logo.x, currentY);
      }
      currentY += 40;
    }
    
    // Render title
    if (template.header?.title) {
      const title = template.header.title;
      doc.fontSize(title.fontSize || 18)
        .font(title.bold ? 'Helvetica-Bold' : 'Helvetica');
      
      if (title.align === 'center') {
        doc.text(title.text, leftMargin, currentY, {
          width: contentWidth,
          align: 'center'
        });
      } else {
        doc.text(title.text, title.x || leftMargin, currentY);
      }
      
      if (title.underline) {
        currentY += 20;
        doc.moveTo(leftMargin, currentY)
          .lineTo(rightMargin, currentY)
          .stroke();
      }
      currentY += 30;
    }
    
    // Render subtitle
    if (template.header?.subtitle) {
      const subtitle = template.header.subtitle;
      doc.fontSize(subtitle.fontSize || 12)
        .font(subtitle.bold ? 'Helvetica-Bold' : 'Helvetica');
      
      if (subtitle.align === 'center') {
        doc.text(subtitle.text, leftMargin, currentY, {
          width: contentWidth,
          align: 'center'
        });
      } else {
        doc.text(subtitle.text, subtitle.x || leftMargin, currentY);
      }
      currentY += 25;
    }
    
    // Horizontal line after header
    doc.moveTo(leftMargin, currentY)
      .lineTo(rightMargin, currentY)
      .stroke();
    currentY += 15;
    
    // Render sections
    for (const section of template.sections) {
      switch (section.type) {
        case 'spacer':
          if (section.spacer) {
            currentY += section.spacer.height;
          }
          break;
          
        case 'line':
          doc.moveTo(leftMargin, currentY)
            .lineTo(rightMargin, currentY)
            .stroke();
          currentY += 10;
          break;
          
        case 'text':
          if (section.text) {
            const text = section.text;
            let content = text.content || '';
            
            if (text.binding) {
              content = formatValue(getNestedValue(data, text.binding), 'text');
            }
            
            doc.fontSize(text.fontSize || 10)
              .font('Helvetica')
              .text(content, text.x || leftMargin, currentY, {
                width: text.width || contentWidth,
                align: text.align || 'left'
              });
            currentY += (text.height || 15);
          }
          break;
          
        case 'fields':
          if (section.fields) {
            for (const field of section.fields) {
              const value = formatValue(getNestedValue(data, field.binding), field.format);
              doc.fontSize(field.fontSize || 10)
                .font(field.bold ? 'Helvetica-Bold' : 'Helvetica')
                .text(field.label + ':', field.x || leftMargin, currentY, {
                  continued: true
                })
                .font('Helvetica')
                .text(' ' + value);
              currentY += 18;
            }
          }
          break;
          
        case 'table':
          if (section.table) {
            const table = section.table;
            const rows = getNestedValue(data, table.rowsBinding);
            const rowArray = Array.isArray(rows) ? rows : [];
            
            // Table header
            let tableX = section.table.x || leftMargin;
            doc.fontSize(table.fontSize || 9).font('Helvetica-Bold');
            
            for (const col of table.columns) {
              doc.text(col.header, tableX, currentY, {
                width: col.width,
                align: 'left'
              });
              tableX += col.width;
            }
            currentY += (table.headerHeight || 20);
            
            // Header line
            doc.moveTo(leftMargin, currentY)
              .lineTo(rightMargin, currentY)
              .stroke();
            currentY += 5;
            
            // Table rows
            doc.font('Helvetica');
            for (const row of rowArray) {
              tableX = section.table.x || leftMargin;
              for (const col of table.columns) {
                const value = formatValue(getNestedValue(row, col.binding), col.format);
                doc.text(value, tableX, currentY, {
                  width: col.width,
                  align: 'left'
                });
                tableX += col.width;
              }
              currentY += (table.rowHeight || 20);
            }
            currentY += 10;
          }
          break;
          
        case 'checkbox':
          if (section.checkbox) {
            const checked = getNestedValue(data, section.checkbox.binding);
            const size = section.checkbox.size || 12;
            const boxX = section.checkbox.x || leftMargin;
            
            // Draw checkbox
            doc.rect(boxX, currentY, size, size).stroke();
            
            if (checked) {
              // Draw X for checked
              doc.moveTo(boxX + 2, currentY + 2)
                .lineTo(boxX + size - 2, currentY + size - 2)
                .stroke()
                .moveTo(boxX + size - 2, currentY + 2)
                .lineTo(boxX + 2, currentY + size - 2)
                .stroke();
            }
            
            // Draw label
            doc.fontSize(10).font('Helvetica')
              .text(section.checkbox.label, boxX + size + 10, currentY);
            currentY += 20;
          }
          break;
          
        case 'signature':
          if (section.signature) {
            const sig = section.signature;
            const value = sig.binding ? getNestedValue(data, sig.binding) : null;
            const label = sig.label || 'Signature:';
            const sigX = sig.x || leftMargin;
            const sigWidth = sig.width || 200;
            
            doc.fontSize(10).font('Helvetica')
              .text(label, sigX, currentY);
            currentY += 15;
            
            // Draw signature line
            doc.moveTo(sigX, currentY)
              .lineTo(sigX + sigWidth, currentY)
              .stroke();
            
            if (value) {
              doc.fontSize(8).text('[SIGNED]', sigX, currentY + 5);
            }
            currentY += 30;
          }
          break;
          
        case 'stamp':
          if (section.stamp) {
            const shouldShow = getNestedValue(data, section.stamp.binding);
            if (shouldShow) {
              const stampX = section.stamp.x || leftMargin + 50;
              
              // Save the current state
              doc.save();
              
              // Apply rotation if specified
              if (section.stamp.rotation) {
                doc.rotate(section.stamp.rotation, { origin: [stampX, currentY] });
              }
              
              doc.fontSize(section.stamp.fontSize || 16)
                .font('Helvetica-Bold')
                .fillColor(section.stamp.color || 'red')
                .text(section.stamp.text, stampX, currentY)
                .fillColor('black'); // Reset color
              
              // Restore the state
              doc.restore();
              
              currentY += 40;
            }
          }
          break;
      }
    }
    
    // Footer
    currentY = doc.page.height - template.page.margin - 40;
    doc.fontSize(8).font('Helvetica')
      .text(`Generated: ${new Date().toLocaleString()}`, leftMargin, currentY)
      .text('PartPulse PDF Generation System', leftMargin, currentY + 12);
    
    doc.end();
  });
}

/**
 * Save PDF to file or return as buffer
 * Uses PDFKit to generate actual PDF documents
 */
export async function savePdfFromTemplate(
  templateName: 'warranty' | 'internalTransfer',
  data: unknown,
  filename: string
): Promise<{ success: boolean; path?: string; content: Buffer }> {
  const content = await renderPdfFromTemplate(templateName, data);
  
  console.log(`[PDF TEMPLATE ENGINE] Generated ${templateName} PDF: ${filename}`);
  console.log('[PDF TEMPLATE ENGINE] Content length:', content.length, 'bytes');
  
  return {
    success: true,
    path: `/pdfs/${templateName}/${filename}`,
    content,
  };
}
