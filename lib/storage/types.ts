/**
 * Storage abstraction layer types
 * Enables switching between local filesystem and S3-compatible storage
 */

export interface StorageProvider {
  /**
   * Save a file to storage
   */
  save(path: string, content: string | Buffer, contentType: string): Promise<string>;

  /**
   * Get a file from storage
   */
  get(path: string): Promise<Buffer>;

  /**
   * Delete a file from storage
   */
  delete(path: string): Promise<void>;

  /**
   * Check if a file exists in storage
   */
  exists(path: string): Promise<boolean>;

  /**
   * Get public URL for a file
   */
  getUrl(path: string): string;
}
