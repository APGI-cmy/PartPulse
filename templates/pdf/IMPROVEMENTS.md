# PDF Template System - Wave 9 Improvements

This document outlines the improvements made to the PDF template system in Wave 9.

## Overview of Changes

The PDF template system has been enhanced with:

1. **Better Alignment & Spacing**: Improved margins, padding, and element positioning
2. **Enhanced Tables**: Better column widths and row heights for readability
3. **Improved Signatures**: Clearer signature areas with better spacing
4. **High-Resolution Logo Support**: Template structure supports larger, higher-quality logos
5. **Professional Margins**: Consistent 25pt margins matching original forms

## Template Structure

### Page Configuration

Both templates now use consistent page settings:

```json
{
  "page": {
    "size": "A4",
    "margin": 25,
    "orientation": "portrait"
  }
}
```

**Changes**:
- Margin increased from 20pt to 25pt for better print appearance
- Consistent across both internal transfer and warranty claim templates

### Header Configuration

Logos are now positioned with explicit height specifications:

```json
{
  "logos": [
    {
      "src": "/assets/logo/trane-logo.svg",
      "x": 25,
      "y": 25,
      "width": 100,
      "height": 40
    },
    {
      "src": "/assets/logo/trane-tech-logo.svg",
      "x": 470,
      "y": 25,
      "width": 100,
      "height": 40
    }
  ]
}
```

**Changes**:
- Added explicit `height` property for better aspect ratio control
- Increased logo width from 80/100 to 100/100 for better visibility
- Repositioned for better alignment with new margins

### Title Styling

Titles now have improved typography:

```json
{
  "title": {
    "text": "TRANE INTERNAL PARTS",
    "x": 0,
    "y": 95,
    "align": "center",
    "fontSize": 16,
    "bold": true
  }
}
```

**Changes**:
- Font size increased from 14 to 16 for better hierarchy
- Positioning adjusted for logo changes

## Section Improvements

### Spacing Between Sections

All spacers have been reviewed and adjusted:

- Between header and sections: 25pt (increased from 20pt)
- Between section header and fields: 12pt (increased from 10pt)
- Between fields and signatures: 15pt (increased from 10pt)
- Before admin section: 25pt (increased from 20pt)

### Line Separators

Section dividers are now more prominent:

```json
{
  "type": "line",
  "line": {
    "x1": 25,
    "x2": 570,
    "strokeWidth": 1.5
  }
}
```

**Changes**:
- Stroke width increased from 1 to 1.5 for better visibility
- Coordinates adjusted for new margins

### Field Labels

Field labels have improved spacing:

```json
{
  "label": "Technician Name:",
  "binding": "technician",
  "x": 25,
  "labelWidth": 150,
  "width": 270,
  "fontSize": 10,
  "bold": true
}
```

**Changes**:
- More generous label widths to prevent truncation
- Consistent positioning across all fields
- Better alignment with increased margins

## Table Improvements

### Internal Transfer Table

```json
{
  "columns": [
    {
      "header": "QTY",
      "binding": "quantity",
      "width": 70,
      "format": "number"
    },
    {
      "header": "PART NO.",
      "binding": "partNo",
      "width": 160
    },
    {
      "header": "DESCRIPTION",
      "binding": "description",
      "width": 295
    }
  ],
  "headerHeight": 28,
  "rowHeight": 28,
  "fontSize": 9
}
```

**Changes**:
- Header height increased from 25 to 28 for better readability
- Row height increased from 25 to 28 for less cramped appearance
- Column widths rebalanced for better proportions
- Fixed typo: "DISCRIPTION" → "DESCRIPTION"

### Warranty Claim Table

```json
{
  "columns": [
    {
      "header": "Part No.",
      "binding": "partNo",
      "width": 85
    },
    {
      "header": "Qty",
      "binding": "quantity",
      "width": 50,
      "format": "number"
    },
    {
      "header": "Failed Serial",
      "binding": "failedPartSerial",
      "width": 115
    },
    {
      "header": "Replaced Serial",
      "binding": "replacedPartSerial",
      "width": 115
    },
    {
      "header": "Failure Date",
      "binding": "dateOfFailure",
      "width": 85,
      "format": "date"
    },
    {
      "header": "Repair Date",
      "binding": "dateOfRepair",
      "width": 85,
      "format": "date"
    }
  ],
  "headerHeight": 32,
  "rowHeight": 28
}
```

**Changes**:
- Header height increased from 30 to 32 for multi-line headers
- Row height increased from 25 to 28 for better readability
- Column widths optimized for content
- Shortened header text for better fit

## Signature Areas

Signature blocks have been enhanced:

```json
{
  "type": "signature",
  "signature": {
    "label": "Technician Signature:",
    "binding": "signature",
    "x": 25,
    "width": 280
  }
}
```

**Changes**:
- Width increased from 250 to 280 for more generous signature space
- Better spacing before and after signature lines
- Consistent positioning across all signature fields

## Checkboxes

Checkboxes are now larger and more visible:

```json
{
  "type": "checkbox",
  "checkbox": {
    "label": "TICK IF COVERED BY WARRANTY",
    "binding": "coveredByWarranty",
    "x": 25,
    "size": 14
  }
}
```

**Changes**:
- Size increased from 12 to 14 for better visibility
- Better spacing around checkboxes

## Stamps

Admin stamps are more prominent:

```json
{
  "type": "stamp",
  "stamp": {
    "text": "PROCESSED",
    "binding": "adminProcessedStamp",
    "x": 450,
    "fontSize": 18,
    "rotation": -15,
    "color": "#FF2B00"
  }
}
```

**Changes**:
- Font size increased from 16 to 18
- Color updated to match brand: #FF0000 → #FF2B00 (Trane red)
- Better positioning with new margins

## Typography Hierarchy

Font sizes have been standardized:

- **Page Title**: 16pt (bold)
- **Section Headers**: 12pt
- **Field Labels**: 10pt (bold)
- **Field Values**: 10pt
- **Table Headers**: 9pt
- **Table Content**: 9pt
- **Notes/Instructions**: 9pt

## Production Considerations

### Current Implementation (MVP)

The current template engine outputs text-based representations. This is suitable for:
- Development and testing
- Proof of concept
- Understanding the structure

### Future Production Implementation

For production, replace with a proper PDF library:

#### Recommended Libraries

1. **PDFKit** (Node.js)
   ```bash
   npm install pdfkit
   ```
   - Mature and stable
   - Full control over layout
   - Supports images and fonts

2. **jsPDF**
   ```bash
   npm install jspdf
   ```
   - Browser and Node.js support
   - Good documentation
   - Plugin ecosystem

3. **Puppeteer** (HTML to PDF)
   ```bash
   npm install puppeteer
   ```
   - Renders HTML/CSS to PDF
   - Most accurate representation
   - Higher resource usage

#### Migration Path

1. Install chosen PDF library
2. Update `renderPdfFromTemplate` in `lib/pdf/templateEngine.ts`
3. Implement proper rendering:
   - Parse template JSON
   - Draw elements (text, lines, tables, images)
   - Apply positioning and styling
   - Generate PDF buffer
4. Update `savePDF` functions to handle PDF buffers
5. Test thoroughly with real data

### Logo Quality

The templates support high-resolution logos:

- Use SVG format for scalability
- Minimum 300 DPI for print quality
- Ensure logos are properly positioned in `/public/assets/logo/`
- Template specifies both width and height for proper aspect ratio

## Testing Templates

### Visual Testing

1. **Console Output**: Current implementation outputs formatted text
2. **Layout Verification**: Check spacing, alignment, field positions
3. **Data Binding**: Ensure all bindings resolve correctly

### Template Validation

The template schema is defined in `templates/pdf/template-schema.json`. Validate templates against this schema before deployment.

### Sample Data Testing

Test templates with various data scenarios:
- Minimal data (required fields only)
- Complete data (all fields populated)
- Edge cases (long text, special characters)
- Multiple items in tables
- Admin-processed forms

## Template Maintenance

### Best Practices

1. **Version Control**: Keep template changes in git
2. **Documentation**: Document any custom bindings or logic
3. **Testing**: Test changes with sample data before deployment
4. **Backwards Compatibility**: Ensure old data still renders correctly

### Common Customizations

#### Adding a New Field

1. Add to appropriate section in template JSON
2. Specify position, width, label
3. Add binding to data source
4. Test rendering

#### Adjusting Spacing

1. Modify spacer heights between sections
2. Adjust x/y coordinates of elements
3. Update line coordinates if needed
4. Verify no overlaps

#### Changing Branding

1. Update logo sources in header
2. Adjust colors (stamps, etc.)
3. Modify title text
4. Update font sizes if needed

## Performance Considerations

### Template Loading

Templates are loaded on-demand from JSON files:
- Cached in production for performance
- Reload in development for live updates

### PDF Generation

Current text-based implementation is fast. When migrating to proper PDF generation:
- Consider caching rendered PDFs
- Use worker threads for large batches
- Implement queue for background generation

## Accessibility

While PDFs have limitations for accessibility:
- Provide text alternatives via email content
- Ensure proper document structure in production PDFs
- Use readable fonts and sufficient contrast
- Include metadata (title, author, subject)
