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
 * Conversion ratio from template width units (points) to character count for text padding
 * This approximates how many characters fit in a given width for monospace console output
 */
const WIDTH_TO_CHARS_RATIO = 5;

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
 * This is a text-based implementation for MVP
 * In production, this would use a PDF library like PDFKit or jsPDF
 */
export async function renderPdfFromTemplate(
  templateName: 'warranty' | 'internalTransfer',
  data: unknown
): Promise<string> {
  const template = await loadTemplate(templateName);
  
  let output = '';
  
  // Page header
  output += '='.repeat(80) + '\n';
  
  // Render logos (text representation)
  if (template.header?.logos) {
    const logoNames = template.header.logos.map(logo => {
      const name = logo.src.split('/').pop()?.replace('.svg', '').replace('-', ' ').toUpperCase();
      return `[${name}]`;
    }).join('     ');
    output += logoNames + '\n';
  }
  
  output += '='.repeat(80) + '\n\n';
  
  // Render title
  if (template.header?.title) {
    const title = template.header.title;
    if (title.align === 'center') {
      const padding = Math.floor((80 - title.text.length) / 2);
      output += ' '.repeat(Math.max(0, padding)) + title.text + '\n';
    } else {
      output += title.text + '\n';
    }
  }
  
  // Render subtitle
  if (template.header?.subtitle) {
    const subtitle = template.header.subtitle;
    if (subtitle.align === 'center') {
      const padding = Math.floor((80 - subtitle.text.length) / 2);
      output += ' '.repeat(Math.max(0, padding)) + subtitle.text + '\n';
    } else {
      output += subtitle.text + '\n';
    }
  }
  
  output += '\n' + '='.repeat(80) + '\n\n';
  
  // Render sections
  for (const section of template.sections) {
    switch (section.type) {
      case 'spacer':
        if (section.spacer) {
          output += '\n';
        }
        break;
        
      case 'line':
        output += '-'.repeat(80) + '\n';
        break;
        
      case 'text':
        if (section.text) {
          const text = section.text;
          let content = text.content || '';
          
          // If binding is specified, use data value
          if (text.binding) {
            content = formatValue(getNestedValue(data, text.binding), 'text');
          }
          
          if (text.multiline && text.height) {
            // For multiline text, wrap content
            output += content + '\n';
          } else {
            output += content + '\n';
          }
        }
        break;
        
      case 'fields':
        if (section.fields) {
          for (const field of section.fields) {
            const value = formatValue(getNestedValue(data, field.binding), field.format);
            const label = field.label.padEnd(field.labelWidth || 20);
            output += `${label} ${value}\n`;
          }
        }
        break;
        
      case 'table':
        if (section.table) {
          const table = section.table;
          const rows = getNestedValue(data, table.rowsBinding);
          const rowArray = Array.isArray(rows) ? rows : [];
          
          // Table header
          const headerRow = table.columns.map(col => col.header.padEnd(col.width / WIDTH_TO_CHARS_RATIO)).join(' | ');
          output += headerRow + '\n';
          output += '-'.repeat(80) + '\n';
          
          // Table rows
          for (const row of rowArray) {
            const rowData = table.columns.map(col => {
              const value = formatValue(getNestedValue(row, col.binding), col.format);
              return value.padEnd(col.width / WIDTH_TO_CHARS_RATIO);
            }).join(' | ');
            output += rowData + '\n';
          }
          
          output += '\n';
        }
        break;
        
      case 'checkbox':
        if (section.checkbox) {
          const checked = getNestedValue(data, section.checkbox.binding);
          output += `[${checked ? 'X' : ' '}] ${section.checkbox.label}\n`;
        }
        break;
        
      case 'signature':
        if (section.signature) {
          const sig = section.signature;
          const value = sig.binding ? getNestedValue(data, sig.binding) : null;
          const label = sig.label || 'Signature:';
          
          if (value) {
            output += `${label} [SIGNED]\n`;
          } else {
            output += `${label} ${'_'.repeat(30)}\n`;
          }
        }
        break;
        
      case 'stamp':
        if (section.stamp) {
          const shouldShow = getNestedValue(data, section.stamp.binding);
          if (shouldShow) {
            output += `\n*** ${section.stamp.text} ***\n\n`;
          }
        }
        break;
    }
  }
  
  output += '\n' + '='.repeat(80) + '\n';
  output += `Generated: ${new Date().toISOString()}\n`;
  output += 'PartPulse PDF Generation System\n';
  output += '='.repeat(80) + '\n';
  
  return output;
}

/**
 * Save PDF to file or return as buffer
 * This is a stub - in production would use proper PDF library
 */
export async function savePdfFromTemplate(
  templateName: 'warranty' | 'internalTransfer',
  data: unknown,
  filename: string
): Promise<{ success: boolean; path?: string; content: string }> {
  const content = await renderPdfFromTemplate(templateName, data);
  
  console.log(`[PDF TEMPLATE ENGINE] Generated ${templateName} PDF: ${filename}`);
  console.log('[PDF TEMPLATE ENGINE] Content length:', content.length);
  
  return {
    success: true,
    path: `/pdfs/${templateName}/${filename}`,
    content,
  };
}
