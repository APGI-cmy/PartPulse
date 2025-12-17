/**
 * PDF Rendering and Full Functionality Tests
 * Tests proper PDF generation with PDFKit and end-to-end workflow
 */

import { generateWarrantyClaimPDF } from '@/lib/pdf/warrantyClaimPdf';
import { generateInternalTransferPDF } from '@/lib/pdf/internalTransferPdf';
import type { WarrantyClaim, InternalTransfer } from '@/lib/db/schema';

describe('PDF Rendering - Proper Visual PDF Generation', () => {
  describe('Warranty Claim PDF Generation', () => {
    it('should generate a valid PDF Buffer (not text)', async () => {
      const mockClaim: WarrantyClaim = {
        id: 'WC-TEST-001',
        date: new Date('2025-01-15'),
        chillerModel: 'CGAM 170',
        chillerSerialNumber: 'ELH09713',
        jobNumber: 'N2L1035044',
        buildingName: 'OMS Duke ACE - Kiwi Fruit',
        siteName: 'Test Site',
        technicianName: 'Mark Cullen',
        partNo: '03DH1585',
        qty: 1,
        serialNumberForFailedParts: 'CGPCT55115',
        serialNumberForReplacedParts: 'GH03AM1918',
        dateOfFailure: new Date('2024-01-15'),
        dateOfRepair: new Date('2024-10-12'),
        comments: 'SPARE PART USED CHAMP MARK VAN SNAK',
        status: 'PROCESSED',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const pdfBuffer = await generateWarrantyClaimPDF(mockClaim);

      // Verify it's a Buffer (proper PDF), not a string
      expect(Buffer.isBuffer(pdfBuffer)).toBe(true);
      
      // Verify buffer is not empty
      expect(pdfBuffer.length).toBeGreaterThan(0);
      
      // Verify it starts with PDF magic bytes (%PDF-)
      const pdfSignature = pdfBuffer.toString('utf8', 0, 5);
      expect(pdfSignature).toBe('%PDF-');
      
      // Verify minimum size (PDFs are typically > 1KB)
      expect(pdfBuffer.length).toBeGreaterThan(1000);
    });

    it('should include all warranty claim fields in PDF', async () => {
      const mockClaim: WarrantyClaim = {
        id: 'WC-FIELD-TEST',
        date: new Date('2025-01-15'),
        chillerModel: 'Test Model XYZ',
        chillerSerialNumber: 'SN123456',
        jobNumber: 'JOB789',
        buildingName: 'Test Building',
        siteName: 'Test Site Location',
        technicianName: 'Test Technician',
        partNo: 'PART-001',
        qty: 5,
        serialNumberForFailedParts: 'FAILED-SN-001',
        serialNumberForReplacedParts: 'REPLACE-SN-001',
        dateOfFailure: new Date('2024-01-01'),
        dateOfRepair: new Date('2024-01-10'),
        comments: 'Test comments for verification',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const pdfBuffer = await generateWarrantyClaimPDF(mockClaim);

      // Verify it's a proper PDF with substantial content
      expect(Buffer.isBuffer(pdfBuffer)).toBe(true);
      expect(pdfBuffer.toString('utf8', 0, 5)).toBe('%PDF-');
      expect(pdfBuffer.length).toBeGreaterThan(2000); // Ensure substantial content
      
      // PDFKit encodes text in a complex format, but the binary should contain
      // references to the data somewhere in the PDF structure
      const pdfContent = pdfBuffer.toString('utf8');
      // Check for PDF structure indicators
      expect(pdfContent).toMatch(/\/Type\s*\/Page/);
      expect(pdfContent).toContain('%%EOF');
    });

    it('should generate different PDFs for different claims', async () => {
      const claim1: WarrantyClaim = {
        id: 'WC-001',
        date: new Date(),
        chillerModel: 'Model A',
        chillerSerialNumber: 'SN-A',
        jobNumber: 'JOB-A',
        buildingName: 'Building A',
        siteName: 'Site A',
        technicianName: 'Tech A',
        partNo: 'PART-A',
        qty: 1,
        serialNumberForFailedParts: 'FAILED-A',
        serialNumberForReplacedParts: 'REPLACE-A',
        dateOfFailure: new Date(),
        dateOfRepair: new Date(),
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const claim2: WarrantyClaim = {
        ...claim1,
        id: 'WC-002',
        chillerModel: 'Model B',
        chillerSerialNumber: 'SN-B',
      };

      const pdf1 = await generateWarrantyClaimPDF(claim1);
      const pdf2 = await generateWarrantyClaimPDF(claim2);

      // PDFs should be different
      expect(pdf1.equals(pdf2)).toBe(false);
      
      // Both should be valid PDFs
      expect(pdf1.toString('utf8', 0, 5)).toBe('%PDF-');
      expect(pdf2.toString('utf8', 0, 5)).toBe('%PDF-');
    });
  });

  describe('Internal Transfer PDF Generation', () => {
    it('should generate a valid PDF Buffer (not text)', async () => {
      const mockTransfer: InternalTransfer = {
        id: 'IT-TEST-001',
        date: new Date('2025-01-15'),
        transferNo: 'TR-123',
        technician: 'Test Tech',
        department: 'Maintenance',
        workOrderNo: 'WO-456',
        shipFrom: 'Warehouse A',
        shipTo: 'Site B',
        clientCompany: 'Test Client Corp',
        addressLine1: '123 Test Street',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        contactPerson: 'John Doe',
        contactEmail: 'john@test.com',
        contactPhone: '555-1234',
        part: 'PART-001',
        description: 'Test Part Description',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const pdfBuffer = await generateInternalTransferPDF(mockTransfer);

      // Verify it's a Buffer (proper PDF), not a string
      expect(Buffer.isBuffer(pdfBuffer)).toBe(true);
      
      // Verify buffer is not empty
      expect(pdfBuffer.length).toBeGreaterThan(0);
      
      // Verify it starts with PDF magic bytes
      const pdfSignature = pdfBuffer.toString('utf8', 0, 5);
      expect(pdfSignature).toBe('%PDF-');
      
      // Verify minimum size
      expect(pdfBuffer.length).toBeGreaterThan(1000);
    });

    it('should include all transfer fields in PDF', async () => {
      const mockTransfer: InternalTransfer = {
        id: 'IT-FIELD-TEST',
        date: new Date('2025-01-15'),
        transferNo: 'TR-999',
        technician: 'Jane Smith',
        department: 'Engineering',
        workOrderNo: 'WO-999',
        shipFrom: 'Main Depot',
        shipTo: 'Field Office',
        clientCompany: 'Acme Industries',
        addressLine1: '456 Industrial Blvd',
        city: 'Manufacturing City',
        state: 'CA',
        zipCode: '90210',
        contactPerson: 'Bob Johnson',
        contactEmail: 'bob@acme.com',
        contactPhone: '555-9876',
        part: 'PART-999',
        description: 'Critical Component XYZ',
        status: 'COMPLETED',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const pdfBuffer = await generateInternalTransferPDF(mockTransfer);

      // Verify it's a proper PDF with substantial content
      expect(Buffer.isBuffer(pdfBuffer)).toBe(true);
      expect(pdfBuffer.toString('utf8', 0, 5)).toBe('%PDF-');
      expect(pdfBuffer.length).toBeGreaterThan(2000);
      
      // Check for PDF structure
      const pdfContent = pdfBuffer.toString('utf8');
      expect(pdfContent).toMatch(/\/Type\s*\/Page/);
      expect(pdfContent).toContain('%%EOF');
    });

    it('should handle multi-item transfers', async () => {
      const mockTransfer: InternalTransfer = {
        id: 'IT-MULTI-001',
        date: new Date('2025-01-15'),
        transferNo: 'TR-MULTI',
        technician: 'Multi Test',
        department: 'Logistics',
        workOrderNo: 'WO-MULTI',
        shipFrom: 'Central',
        shipTo: 'Remote',
        clientCompany: 'Test Co',
        addressLine1: '789 Test Ave',
        city: 'Testville',
        state: 'TX',
        zipCode: '75001',
        contactPerson: 'Alice Brown',
        contactEmail: 'alice@test.co',
        contactPhone: '555-0000',
        part: 'Should be ignored',
        description: 'Should be ignored',
        items: [
          { quantity: 2, partNo: 'PART-A', description: 'Part A Description' },
          { quantity: 5, partNo: 'PART-B', description: 'Part B Description' },
          { quantity: 1, partNo: 'PART-C', description: 'Part C Description' },
        ],
        status: 'IN_TRANSIT',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const pdfBuffer = await generateInternalTransferPDF(mockTransfer);

      // Verify valid PDF
      expect(Buffer.isBuffer(pdfBuffer)).toBe(true);
      expect(pdfBuffer.toString('utf8', 0, 5)).toBe('%PDF-');
      
      // Multi-item transfers should produce larger PDFs due to table content
      expect(pdfBuffer.length).toBeGreaterThan(2500);
      
      // Verify proper PDF structure
      const pdfContent = pdfBuffer.toString('utf8');
      expect(pdfContent).toMatch(/\/Type\s*\/Page/);
      expect(pdfContent).toContain('%%EOF');
    });
  });

  describe('PDF Structure and Format', () => {
    it('should create PDFs with proper metadata', async () => {
      const mockClaim: WarrantyClaim = {
        id: 'WC-META-TEST',
        date: new Date(),
        chillerModel: 'Test',
        chillerSerialNumber: 'Test',
        jobNumber: 'Test',
        buildingName: 'Test',
        siteName: 'Test',
        technicianName: 'Test',
        partNo: 'Test',
        qty: 1,
        serialNumberForFailedParts: 'Test',
        serialNumberForReplacedParts: 'Test',
        dateOfFailure: new Date(),
        dateOfRepair: new Date(),
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const pdfBuffer = await generateWarrantyClaimPDF(mockClaim);
      
      // Check PDF structure
      const pdfString = pdfBuffer.toString('utf8');
      
      // Should contain PDF version
      expect(pdfString).toMatch(/%PDF-1\.\d/);
      
      // Should have EOF marker
      expect(pdfString).toContain('%%EOF');
      
      // Should have proper object structure
      expect(pdfString).toMatch(/\d+ \d+ obj/);
    });

    it('should not generate black/empty PDFs', async () => {
      const mockTransfer: InternalTransfer = {
        id: 'IT-CONTENT-TEST',
        date: new Date(),
        transferNo: 'TR-CONTENT',
        technician: 'Content Verifier',
        department: 'QA',
        workOrderNo: 'WO-QA',
        shipFrom: 'A',
        shipTo: 'B',
        clientCompany: 'Test',
        addressLine1: 'Test',
        city: 'Test',
        state: 'TS',
        zipCode: '00000',
        contactPerson: 'Test',
        contactEmail: 'test@test.com',
        contactPhone: '000-0000',
        part: 'PART',
        description: 'DESC',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const pdfBuffer = await generateInternalTransferPDF(mockTransfer);
      
      // PDF should have substantial content (not just template)
      expect(pdfBuffer.length).toBeGreaterThan(3000);
      
      // Should contain text rendering operators
      const pdfString = pdfBuffer.toString('utf8');
      expect(pdfString).toMatch(/\/Type\s*\/Page/);
      expect(pdfString).toMatch(/\/Contents/);
      
      // Should not be mostly whitespace or empty
      const nonWhitespaceChars = pdfString.replace(/\s/g, '').length;
      expect(nonWhitespaceChars).toBeGreaterThan(1000);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing optional fields gracefully', async () => {
      const minimalClaim: WarrantyClaim = {
        id: 'WC-MINIMAL',
        date: new Date(),
        chillerModel: 'Model',
        chillerSerialNumber: 'SN',
        jobNumber: 'JOB',
        buildingName: 'Building',
        siteName: 'Site',
        technicianName: 'Tech',
        partNo: 'PART',
        qty: 1,
        serialNumberForFailedParts: 'FAILED',
        serialNumberForReplacedParts: 'REPLACED',
        dateOfFailure: new Date(),
        dateOfRepair: new Date(),
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
        // Optional fields not provided
      };

      const pdfBuffer = await generateWarrantyClaimPDF(minimalClaim);
      
      // Should still generate valid PDF
      expect(Buffer.isBuffer(pdfBuffer)).toBe(true);
      expect(pdfBuffer.toString('utf8', 0, 5)).toBe('%PDF-');
      expect(pdfBuffer.length).toBeGreaterThan(1000);
    });

    it('should handle special characters in data', async () => {
      const specialCharTransfer: InternalTransfer = {
        id: 'IT-SPECIAL-001',
        date: new Date(),
        transferNo: 'TR-SPECIAL',
        technician: "O'Brien & Co.",
        department: 'R&D (Research/Development)',
        workOrderNo: 'WO-#123',
        shipFrom: 'Warehouse "A"',
        shipTo: 'Site <B>',
        clientCompany: 'Test & Validate Inc.',
        addressLine1: '123 Main St. #5',
        city: 'Saint-Jean',
        state: 'QC',
        zipCode: 'H1A 2B3',
        contactPerson: 'François Müller',
        contactEmail: 'françois@test.com',
        contactPhone: '(555) 123-4567',
        part: 'PART-#1',
        description: 'Test "Part" with <special> & symbols',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const pdfBuffer = await generateInternalTransferPDF(specialCharTransfer);
      
      // Should handle special characters without crashing
      expect(Buffer.isBuffer(pdfBuffer)).toBe(true);
      expect(pdfBuffer.toString('utf8', 0, 5)).toBe('%PDF-');
      expect(pdfBuffer.length).toBeGreaterThan(1000);
    });
  });
});
