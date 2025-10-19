/**
 * StratOS Platform - Azure Blob Storage Service
 * 
 * Manages file uploads, downloads, and secure access to blob storage
 * with support for SAS tokens and metadata management.
 */

import {
  BlobServiceClient,
  ContainerClient,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
  BlobUploadCommonResponse,
} from '@azure/storage-blob';

export interface FileMetadata {
  tenantId: string;
  userId: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  [key: string]: string;
}

export interface DownloadResult {
  content: Buffer;
  metadata: Record<string, string>;
  contentType: string;
}

export interface FileInfo {
  name: string;
  url: string;
  size: number;
  lastModified: Date;
  contentType?: string;
  metadata?: Record<string, string>;
}

export class StorageService {
  private blobServiceClient: BlobServiceClient;
  private accountName: string;
  private accountKey: string;

  constructor() {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

    if (!connectionString) {
      throw new Error('Azure Storage connection string not configured');
    }

    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    this.accountName = accountName || '';
    this.accountKey = accountKey || '';
  }

  /**
   * Get container client
   * 
   * @param containerName - Name of the container
   * @returns ContainerClient instance
   */
  private getContainerClient(containerName: string): ContainerClient {
    return this.blobServiceClient.getContainerClient(containerName);
  }

  /**
   * Upload a file to blob storage
   * 
   * @param containerName - Container name
   * @param fileName - File name (can include path)
   * @param content - File content as Buffer or string
   * @param metadata - Optional metadata
   * @returns Blob URL
   */
  async uploadFile(
    containerName: string,
    fileName: string,
    content: Buffer | string,
    metadata?: FileMetadata
  ): Promise<string> {
    try {
      const containerClient = this.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);

      // Determine content type
      const contentType = this.getContentType(fileName);

      // Prepare metadata
      const blobMetadata: Record<string, string> = {
        ...metadata,
        uploadedAt: metadata?.uploadedAt || new Date().toISOString(),
      };

      // Upload blob
      await blockBlobClient.upload(content, Buffer.byteLength(content), {
        blobHTTPHeaders: {
          blobContentType: contentType,
        },
        metadata: blobMetadata,
      });

      const url = blockBlobClient.url;
      console.log(`Uploaded file: ${fileName} to ${containerName}`);

      return url;
    } catch (error: any) {
      console.error('Storage upload error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Download a file from blob storage
   * 
   * @param containerName - Container name
   * @param fileName - File name
   * @returns File content, metadata, and content type
   */
  async downloadFile(containerName: string, fileName: string): Promise<DownloadResult> {
    try {
      const containerClient = this.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);

      // Download blob
      const downloadResponse = await blockBlobClient.download(0);

      if (!downloadResponse.readableStreamBody) {
        throw new Error('Failed to get file stream');
      }

      // Read stream to buffer
      const content = await this.streamToBuffer(downloadResponse.readableStreamBody);

      return {
        content,
        metadata: downloadResponse.metadata || {},
        contentType: downloadResponse.contentType || 'application/octet-stream',
      };
    } catch (error: any) {
      console.error('Storage download error:', error);
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }

  /**
   * Generate a SAS token for secure file access
   * 
   * @param containerName - Container name
   * @param fileName - File name
   * @param expiryMinutes - Token expiry time in minutes
   * @param permissions - Optional permissions (default: read)
   * @returns Signed URL with SAS token
   */
  async generateSasToken(
    containerName: string,
    fileName: string,
    expiryMinutes: number = 60,
    permissions: string = 'r'
  ): Promise<string> {
    try {
      if (!this.accountName || !this.accountKey) {
        throw new Error('Storage account credentials not available for SAS generation');
      }

      const containerClient = this.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);

      // Set expiry time
      const expiresOn = new Date();
      expiresOn.setMinutes(expiresOn.getMinutes() + expiryMinutes);

      // Create SAS permissions
      const blobPermissions = BlobSASPermissions.parse(permissions);

      // Generate SAS token
      const sasToken = generateBlobSASQueryParameters(
        {
          containerName,
          blobName: fileName,
          permissions: blobPermissions,
          startsOn: new Date(),
          expiresOn,
        },
        new StorageSharedKeyCredential(this.accountName, this.accountKey)
      ).toString();

      const sasUrl = `${blockBlobClient.url}?${sasToken}`;
      return sasUrl;
    } catch (error: any) {
      console.error('SAS token generation error:', error);
      throw new Error(`Failed to generate SAS token: ${error.message}`);
    }
  }

  /**
   * List files in a container
   * 
   * @param containerName - Container name
   * @param prefix - Optional path prefix
   * @param tenantId - Optional tenant filter
   * @returns Array of file information
   */
  async listFiles(
    containerName: string,
    prefix?: string,
    tenantId?: string
  ): Promise<FileInfo[]> {
    try {
      const containerClient = this.getContainerClient(containerName);
      const files: FileInfo[] = [];

      // List blobs with prefix
      const iterator = containerClient.listBlobsFlat({ prefix });

      for await (const blob of iterator) {
        const blobClient = containerClient.getBlobClient(blob.name);
        const properties = await blobClient.getProperties();

        // Filter by tenantId if provided
        if (tenantId && properties.metadata?.tenantId !== tenantId) {
          continue;
        }

        files.push({
          name: blob.name,
          url: blobClient.url,
          size: blob.properties.contentLength || 0,
          lastModified: blob.properties.lastModified || new Date(),
          contentType: blob.properties.contentType,
          metadata: properties.metadata,
        });
      }

      return files;
    } catch (error: any) {
      console.error('List files error:', error);
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }

  /**
   * Delete a file from blob storage
   * 
   * @param containerName - Container name
   * @param fileName - File name
   * @returns Success boolean
   */
  async deleteFile(containerName: string, fileName: string): Promise<boolean> {
    try {
      const containerClient = this.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);

      await blockBlobClient.delete();
      console.log(`Deleted file: ${fileName} from ${containerName}`);

      return true;
    } catch (error: any) {
      if (error.statusCode === 404) {
        return false;
      }
      console.error('Storage delete error:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Copy a file between containers
   * 
   * @param sourceContainer - Source container name
   * @param sourceFile - Source file name
   * @param destContainer - Destination container name
   * @param destFile - Destination file name
   * @returns Success boolean
   */
  async copyFile(
    sourceContainer: string,
    sourceFile: string,
    destContainer: string,
    destFile: string
  ): Promise<boolean> {
    try {
      const sourceClient = this.getContainerClient(sourceContainer);
      const sourceBlobClient = sourceClient.getBlockBlobClient(sourceFile);

      const destClient = this.getContainerClient(destContainer);
      const destBlobClient = destClient.getBlockBlobClient(destFile);

      // Copy blob
      const copyPoller = await destBlobClient.beginCopyFromURL(sourceBlobClient.url);
      await copyPoller.pollUntilDone();

      console.log(`Copied file: ${sourceFile} to ${destFile}`);
      return true;
    } catch (error: any) {
      console.error('Storage copy error:', error);
      throw new Error(`Failed to copy file: ${error.message}`);
    }
  }

  /**
   * Check if a file exists
   * 
   * @param containerName - Container name
   * @param fileName - File name
   * @returns True if file exists
   */
  async fileExists(containerName: string, fileName: string): Promise<boolean> {
    try {
      const containerClient = this.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);

      return await blockBlobClient.exists();
    } catch (error: any) {
      console.error('File exists check error:', error);
      return false;
    }
  }

  /**
   * Update file metadata
   * 
   * @param containerName - Container name
   * @param fileName - File name
   * @param metadata - Metadata to set
   * @returns Success boolean
   */
  async updateMetadata(
    containerName: string,
    fileName: string,
    metadata: Record<string, string>
  ): Promise<boolean> {
    try {
      const containerClient = this.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);

      await blockBlobClient.setMetadata(metadata);
      return true;
    } catch (error: any) {
      console.error('Update metadata error:', error);
      throw new Error(`Failed to update metadata: ${error.message}`);
    }
  }

  /**
   * Get file metadata
   * 
   * @param containerName - Container name
   * @param fileName - File name
   * @returns File metadata
   */
  async getMetadata(
    containerName: string,
    fileName: string
  ): Promise<Record<string, string>> {
    try {
      const containerClient = this.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);

      const properties = await blockBlobClient.getProperties();
      return properties.metadata || {};
    } catch (error: any) {
      console.error('Get metadata error:', error);
      throw new Error(`Failed to get metadata: ${error.message}`);
    }
  }

  /**
   * Convert stream to buffer
   * 
   * @param readableStream - Readable stream
   * @returns Buffer
   */
  private async streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      readableStream.on('data', (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on('error', reject);
    });
  }

  /**
   * Get content type from file name
   * 
   * @param fileName - File name
   * @returns Content type
   */
  private getContentType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();

    const contentTypes: Record<string, string> = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      txt: 'text/plain',
      csv: 'text/csv',
      json: 'application/json',
      xml: 'application/xml',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      svg: 'image/svg+xml',
      zip: 'application/zip',
    };

    return contentTypes[extension || ''] || 'application/octet-stream';
  }
}

