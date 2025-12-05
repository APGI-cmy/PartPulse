/**
 * Serialized types for API/Client usage
 * Converts Date objects to string for JSON serialization
 */

import type { WarrantyClaim, WarrantyItem, InternalTransfer } from '@/lib/db/schema';

/**
 * Helper type to convert Date fields to string for JSON serialization
 */
export type Serialized<T> = {
  [K in keyof T]: T[K] extends Date
    ? string
    : T[K] extends Date | undefined
    ? string | undefined
    : T[K] extends Array<infer U>
    ? Array<Serialized<U>>
    : T[K] extends object
    ? Serialized<T[K]>
    : T[K];
};

/**
 * Serialized warranty item type for client-side use
 */
export type SerializedWarrantyItem = Serialized<WarrantyItem>;

/**
 * Serialized warranty claim type for client-side use
 */
export type SerializedWarrantyClaim = Serialized<WarrantyClaim>;

/**
 * Serialized internal transfer type for client-side use
 */
export type SerializedInternalTransfer = Serialized<InternalTransfer>;
