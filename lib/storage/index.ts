import type { StorageProvider } from './types';
import { LocalStorageProvider } from './local';
import { S3StorageProvider } from './s3';

let storageInstance: StorageProvider | null = null;

export function getStorage(): StorageProvider {
  if (storageInstance) {
    return storageInstance;
  }

  const provider = process.env.STORAGE_PROVIDER || 'local';

  if (provider === 's3') {
    storageInstance = new S3StorageProvider({
      region: process.env.STORAGE_S3_REGION || 'us-east-1',
      bucket: process.env.STORAGE_S3_BUCKET || 'partpulse-pdfs',
      accessKeyId: process.env.STORAGE_S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.STORAGE_S3_SECRET_ACCESS_KEY || '',
      publicUrl: process.env.STORAGE_S3_PUBLIC_URL,
    });
  } else {
    storageInstance = new LocalStorageProvider({
      basePath: process.env.STORAGE_LOCAL_PATH,
      publicUrl: process.env.STORAGE_LOCAL_PUBLIC_URL,
    });
  }

  return storageInstance;
}

export type { StorageProvider } from './types';
