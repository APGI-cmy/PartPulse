/**
 * Data models for PartPulse
 * This file defines the structure for internal transfers
 * Using file-based storage for MVP (no Prisma dependency yet)
 */

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
  data: Omit<InternalTransfer, 'id' | 'createdAt'>
): Promise<InternalTransfer> {
  const transfer: InternalTransfer = {
    ...data,
    id: generateId(),
    createdAt: new Date(),
  };
  
  transfers.set(transfer.id, transfer);
  return transfer;
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
