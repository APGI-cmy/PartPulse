import fs from 'fs/promises';
import path from 'path';
import type { StorageProvider } from './types';

/* eslint-disable @typescript-eslint/no-unused-vars */
export class LocalStorageProvider implements StorageProvider {
  private basePath: string;
  private publicUrl: string;

  constructor(config?: { basePath?: string; publicUrl?: string }) {
    this.basePath = config?.basePath || path.join(process.cwd(), 'storage');
    this.publicUrl = config?.publicUrl || '/storage';
  }

  async save(filePath: string, content: string | Buffer, _contentType: string): Promise<string> {
    const fullPath = path.join(this.basePath, filePath);
    const dir = path.dirname(fullPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fullPath, content);
    return filePath;
  }

  async get(filePath: string): Promise<Buffer> {
    const fullPath = path.join(this.basePath, filePath);
    return await fs.readFile(fullPath);
  }

  async delete(filePath: string): Promise<void> {
    const fullPath = path.join(this.basePath, filePath);
    await fs.unlink(fullPath);
  }

  async exists(filePath: string): Promise<boolean> {
    const fullPath = path.join(this.basePath, filePath);
    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  getUrl(filePath: string): string {
    return `${this.publicUrl}/${filePath}`;
  }
}
