import type { StorageProvider } from './types';

export class S3StorageProvider implements StorageProvider {
  private bucket: string;
  private region: string;
  private publicUrl?: string;

  constructor(config: {
    region: string;
    bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
    publicUrl?: string;
  }) {
    this.bucket = config.bucket;
    this.region = config.region;
    this.publicUrl = config.publicUrl;
    console.warn('S3StorageProvider is a stub. Install @aws-sdk/client-s3 for production use.');
  }

  async save(path: string, _content: string | Buffer, _contentType: string): Promise<string> {
    console.log(`S3 save stub: ${path}`);
    return path;
  }

  async get(_path: string): Promise<Buffer> {
    return Buffer.from('');
  }

  async delete(_path: string): Promise<void> {
    // Stub
  }

  async exists(_path: string): Promise<boolean> {
    return false;
  }

  getUrl(path: string): string {
    if (this.publicUrl) {
      return `${this.publicUrl}/${path}`;
    }
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${path}`;
  }
}
