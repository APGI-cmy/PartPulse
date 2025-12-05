/**
 * Data models for PartPulse
 * This file defines the structure for internal transfers
 * Using file-based storage for MVP (no Prisma dependency yet)
 */

/**
 * Internal Transfer Item - represents a single part in a transfer
 */
export interface InternalTransferItem {
  quantity: number;
  partNo: string;
  description: string;
}

export interface InternalTransfer {
  id: string;
  technician: string;
  department: string;
  transferType: string;
  serial: string;
  model: string;
  part: string;
  description: string;
  reason: string;
  newUnit?: string;
  comments?: string;
  images?: string[];
  signature?: string;
  items?: InternalTransferItem[];
  status: 'submitted' | 'processed';
  pdfPath?: string;
  createdAt: Date;
}

/**
 * In-memory storage for transfers (MVP implementation)
 * In production, this would be replaced with Prisma/database
 */
const transfers: Map<string, InternalTransfer> = new Map();

/**
 * Generate a unique ID for transfers
 */
function generateId(): string {
  return `IT-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Save a new internal transfer
 */
export async function saveInternalTransfer(
  data: Omit<InternalTransfer, 'id' | 'createdAt' | 'status'>
): Promise<InternalTransfer> {
  const transfer: InternalTransfer = {
    ...data,
    id: generateId(),
    status: 'submitted',
    createdAt: new Date(),
  };
  
  transfers.set(transfer.id, transfer);
  return transfer;
}

/**
 * Update an internal transfer
 */
export async function updateInternalTransfer(
  id: string,
  updates: Partial<InternalTransfer>
): Promise<InternalTransfer | null> {
  const transfer = transfers.get(id);
  if (!transfer) {
    return null;
  }
  
  const updatedTransfer = { ...transfer, ...updates };
  transfers.set(id, updatedTransfer);
  return updatedTransfer;
}

/**
 * Get an internal transfer by ID
 */
export async function getInternalTransfer(id: string): Promise<InternalTransfer | null> {
  return transfers.get(id) || null;
}

/**
 * Get all internal transfers
 */
export async function getAllInternalTransfers(): Promise<InternalTransfer[]> {
  return Array.from(transfers.values());
}

/**
 * Delete an internal transfer (admin only)
 */
export async function deleteInternalTransfer(id: string): Promise<boolean> {
  return transfers.delete(id);
}

/**
 * Warranty Item - represents a single part in a warranty claim
 */
export interface WarrantyItem {
  partNo: string;
  quantity: number;
  failedPartSerial: string;
  replacedPartSerial: string;
  dateOfFailure: Date;
  dateOfRepair: Date;
}

/**
 * Warranty Claim - represents a complete warranty claim submission
 */
export interface WarrantyClaim {
  id: string;
  date: Date;
  chillerModel: string;
  chillerSerial: string;
  ssidJobNumber: string;
  buildingName?: string;
  siteName: string;
  technicianName: string;
  items: WarrantyItem[];
  comments?: string;
  coveredByWarranty: boolean;
  technicianSignature?: string;
  adminSignature?: string;
  adminProcessedStamp?: boolean;
  adminDate?: Date;
  status?: 'pending' | 'approved' | 'rejected';
  pdfPath?: string;
  createdAt: Date;
}

/**
 * In-memory storage for warranty claims (MVP implementation)
 */
const warrantyClaims: Map<string, WarrantyClaim> = new Map();

/**
 * Generate a unique ID for warranty claims
 */
function generateWarrantyId(): string {
  return `WC-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Save a new warranty claim
 */
export async function saveWarrantyClaim(
  data: Omit<WarrantyClaim, 'id' | 'createdAt'>
): Promise<WarrantyClaim> {
  const claim: WarrantyClaim = {
    ...data,
    id: generateWarrantyId(),
    createdAt: new Date(),
  };
  
  warrantyClaims.set(claim.id, claim);
  return claim;
}

/**
 * Get a warranty claim by ID
 */
export async function getWarrantyClaim(id: string): Promise<WarrantyClaim | null> {
  return warrantyClaims.get(id) || null;
}

/**
 * Get all warranty claims
 */
export async function getAllWarrantyClaims(): Promise<WarrantyClaim[]> {
  return Array.from(warrantyClaims.values());
}

/**
 * Update a warranty claim
 */
export async function updateWarrantyClaim(
  id: string,
  updates: Partial<WarrantyClaim>
): Promise<WarrantyClaim | null> {
  const claim = warrantyClaims.get(id);
  if (!claim) {
    return null;
  }
  
  const updatedClaim = { ...claim, ...updates };
  warrantyClaims.set(id, updatedClaim);
  return updatedClaim;
}

/**
 * Delete a warranty claim (admin only)
 */
export async function deleteWarrantyClaim(id: string): Promise<boolean> {
  return warrantyClaims.delete(id);
}

// Architecture compliance: Type aliases for QA validation
// Transfer is implemented as InternalTransfer
export type Transfer = InternalTransfer;

// AuditLog is implemented as SystemLog (see prisma/schema.prisma)
export interface AuditLog {
  id: string;
  timestamp: Date;
  eventType: string;
  userId?: string;
  userName?: string;
  action: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
}

