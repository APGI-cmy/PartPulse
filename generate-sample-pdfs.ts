/**
 * Generate sample PDFs for demonstration
 */

import { generateWarrantyClaimPDF } from './lib/pdf/warrantyClaimPdf';
import { generateInternalTransferPDF } from './lib/pdf/internalTransferPdf';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Sample warranty claim data
const sampleWarrantyClaim = {
  id: 'WC-2025-12-001',
  date: new Date('2025-12-17'),
  chillerModel: 'CGAM 190',
  chillerSerial: 'ELH99713',
  ssidJobNumber: 'N2L 10350461',
  buildingName: 'OMS Pule PACE - KW1 FRONT',
  siteName: 'OMS Pule PACE',
  technicianName: 'MARK JULIAN',
  technicianId: 'tech-001',
  coveredByWarranty: true,
  comments: 'SPARE PART USED FROM WATER VALVE SPOOL',
  items: [
    {
      partNo: 'M30H 1458',
      quantity: 1,
      failedPartSerial: 'SN-98651 8613',
      replacedPartSerial: 'SN-98651 8613',
      dateOfFailure: new Date('2025-11-15'),
      dateOfRepair: new Date('2025-12-10'),
    },
  ],
  status: 'pending',
  createdAt: new Date('2025-12-17'),
  updatedAt: new Date('2025-12-17'),
};

// Sample internal transfer data
const sampleInternalTransfer = {
  id: 'IT-2025-12-001',
  createdAt: new Date('2025-12-17'),
  serial: 'SSID-2025-001',
  department: 'Maintenance - Johannesburg',
  part: 'PO-2025-12345',
  technician: 'John Smith',
  signature: 'J. Smith',
  items: [
    {
      quantity: 2,
      partNo: 'VALVE-001',
      description: 'Water valve spool replacement kit',
    },
    {
      quantity: 1,
      partNo: 'SEAL-KIT-45',
      description: 'High pressure seal kit for compressor',
    },
    {
      quantity: 5,
      partNo: 'FILTER-STD',
      description: 'Standard air filter replacement',
    },
  ],
  clientName: 'ABC Corp',
  clientDate: new Date('2025-12-18'),
  clientSignature: 'A. Manager',
  status: 'pending',
  transferType: 'internal',
  date: new Date('2025-12-17'),
  ssid: 'SSID-2025-001',
  siteName: 'Main Office',
  poNumber: 'PO-2025-12345',
  technicianId: 'tech-002',
  adminStamp: false,
  updatedAt: new Date('2025-12-17'),
};

async function generateSamplePDFs() {
  console.log('Generating sample PDFs...\n');
  
  // Generate warranty claim PDF
  console.log('1. Generating Warranty Claim PDF...');
  const warrantyPDF = await generateWarrantyClaimPDF(sampleWarrantyClaim as any);
  const warrantyPath = join('/tmp', 'sample-warranty-claim.txt');
  writeFileSync(warrantyPath, warrantyPDF);
  console.log(`   ✓ Saved to: ${warrantyPath}`);
  console.log(`   Preview:\n${warrantyPDF.substring(0, 500)}...\n`);
  
  // Generate internal transfer PDF
  console.log('2. Generating Internal Transfer PDF...');
  const transferPDF = await generateInternalTransferPDF(sampleInternalTransfer as any);
  const transferPath = join('/tmp', 'sample-internal-transfer.txt');
  writeFileSync(transferPath, transferPDF);
  console.log(`   ✓ Saved to: ${transferPath}`);
  console.log(`   Preview:\n${transferPDF.substring(0, 500)}...\n`);
  
  console.log('✓ Sample PDFs generated successfully!');
  console.log('\nFull PDF files saved to /tmp/');
}

generateSamplePDFs().catch(console.error);
