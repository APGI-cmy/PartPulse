# PDF Template Engine

This directory contains the JSON-driven PDF template engine for PartPulse, which generates PDFs for Internal Parts Transfer and Warranty Parts Claim forms.

## Overview

The template engine separates PDF layout configuration from code, allowing form layouts to be modified by editing JSON templates instead of TypeScript code.

## Files

- **`template-schema.json`**: JSON Schema defining the structure for PDF templates
- **`warranty-claim-template.json`**: Layout template for Trane Warranty Parts Claims Form
- **`internal-transfer-template.json`**: Layout template for Trane Internal Parts Transfer Order Form

## Template Structure

Each template JSON file contains:

### Page Configuration
```json
{
  "page": {
    "size": "A4",           // Page size: A4, Letter, or Legal
    "margin": 20,           // Page margin in points
    "orientation": "portrait"  // portrait or landscape
  }
}
```

### Header Configuration
```json
{
  "header": {
    "logos": [
      {
        "src": "/assets/logo/trane-logo.svg",
        "x": 20,
        "y": 20,
        "width": 80
      }
    ],
    "title": {
      "text": "FORM TITLE",
      "x": 0,
      "y": 90,
      "align": "center",
      "fontSize": 14,
      "bold": true
    }
  }
}
```

### Sections

Templates can include various section types:

#### 1. Text Section
Static or data-bound text content:
```json
{
  "type": "text",
  "text": {
    "content": "Static text",
    "binding": "dataPath",  // Alternative: bind to data
    "x": 20,
    "fontSize": 10
  }
}
```

#### 2. Fields Section
Multiple labeled fields with data bindings:
```json
{
  "type": "fields",
  "fields": [
    {
      "label": "DATE:",
      "binding": "date",
      "x": 20,
      "labelWidth": 100,
      "width": 200,
      "fontSize": 10,
      "bold": true,
      "format": "date"
    }
  ]
}
```

#### 3. Table Section
Dynamic tables with row data:
```json
{
  "type": "table",
  "table": {
    "columns": [
      {
        "header": "Part No.",
        "binding": "partNo",
        "width": 80
      }
    ],
    "rowsBinding": "items",
    "x": 20,
    "headerHeight": 30,
    "rowHeight": 25,
    "fontSize": 9
  }
}
```

#### 4. Checkbox Section
Boolean value displayed as checkbox:
```json
{
  "type": "checkbox",
  "checkbox": {
    "label": "TICK IF COVERED BY WARRANTY",
    "binding": "coveredByWarranty",
    "x": 20,
    "size": 12
  }
}
```

#### 5. Signature Section
Signature line with optional binding:
```json
{
  "type": "signature",
  "signature": {
    "label": "Technician Signature:",
    "binding": "technicianSignature",
    "x": 20,
    "width": 250
  }
}
```

#### 6. Stamp Section
Conditional stamp (e.g., "PROCESSED"):
```json
{
  "type": "stamp",
  "stamp": {
    "text": "PROCESSED",
    "binding": "adminProcessedStamp",
    "x": 450,
    "fontSize": 16,
    "rotation": -15,
    "color": "#FF0000"
  }
}
```

#### 7. Line Section
Horizontal separator line:
```json
{
  "type": "line",
  "line": {
    "x1": 20,
    "x2": 575,
    "strokeWidth": 1
  }
}
```

#### 8. Spacer Section
Vertical spacing:
```json
{
  "type": "spacer",
  "spacer": {
    "height": 20
  }
}
```

## Data Binding

### Dot Notation
Use dot notation to access nested data:
- `"date"` - top-level field
- `"items.0.partNo"` - first item's part number
- `"technicianSignature"` - signature field

### Format Types
- **`date`**: Formats Date objects or date strings using `toLocaleDateString()`
- **`number`**: Formats numbers as strings
- **`text`**: Default - converts any value to string

## Usage

```typescript
import { renderPdfFromTemplate } from '@/lib/pdf/templateEngine';

// Render warranty claim PDF
const pdfContent = await renderPdfFromTemplate('warranty', warrantyClaim);

// Render internal transfer PDF
const pdfContent = await renderPdfFromTemplate('internalTransfer', transfer);
```

## Adding New Templates

1. Create a new JSON file in `templates/pdf/`
2. Follow the structure defined in `template-schema.json`
3. Update `lib/pdf/templateEngine.ts` to include the new template name in the type union
4. Add corresponding load path in `loadTemplate()` function

## Current Implementation

The current implementation renders **text-based PDFs** suitable for console output or plain text files. This serves as an MVP implementation.

## Future Enhancements

When ready to generate actual PDF files, integrate a PDF library such as:
- **PDFKit**: Node.js PDF generation library
- **jsPDF**: Client-side PDF generation
- **react-pdf**: React components for PDF generation

The template structure is designed to be compatible with these libraries - the section types and properties map directly to common PDF rendering operations.

## Notes

- Logo paths are relative to the `public` directory
- Coordinates are in points (1/72 inch)
- The "DISCRIPTION" typo in the internal transfer template is intentional (preserves original form)
- Width-to-character ratio for console output is defined as `WIDTH_TO_CHARS_RATIO = 5` in the template engine
