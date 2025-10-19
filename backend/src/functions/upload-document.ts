/**
 * StratOS Platform - Upload Document HTTP Function
 * 
 * Handle file uploads, extract text, and index in search
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { validateToken } from '../utils/auth';
import { StorageService } from '../services/storage.service';
import { SearchService } from '../services/search.service';
import { CosmosService } from '../services/cosmos.service';
import { insights } from '../services/insights.service';
import { ValidationError } from '../models';
import { v4 as uuidv4 } from 'uuid';

const storageService = new StorageService();
const searchService = new SearchService();
const cosmosService = new CosmosService();

async function uploadHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Validate authentication
    const user = validateToken(request);

    // Get multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const tags = formData.get('tags') ? (formData.get('tags') as string).split(',') : [];
    const documentType = formData.get('documentType') as string || 'general';

    if (!file) {
      throw new ValidationError('File is required');
    }

    // Validate file size (100MB limit)
    const maxSize = parseInt(process.env.MAX_UPLOAD_SIZE_MB || '100') * 1024 * 1024;
    if (file.size > maxSize) {
      throw new ValidationError(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
    }

    context.log(`Upload request from user: ${user.userId}, file: ${file.name}`);

    const documentId = uuidv4();
    const fileName = `${user.tenantId}/${user.userId}/${documentId}-${file.name}`;

    // 1. Upload to blob storage
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const blobUrl = await storageService.uploadFile(
      'documents',
      fileName,
      fileBuffer,
      {
        tenantId: user.tenantId,
        userId: user.userId,
        fileName: file.name,
        fileType: file.type,
        uploadedAt: new Date().toISOString(),
      }
    );

    // 2. Extract text content (simple implementation - in production use Azure Form Recognizer)
    const content = await extractTextContent(fileBuffer, file.type);

    // 3. Index in Cognitive Search
    const indexId = await searchService.indexDocument({
      id: documentId,
      tenantId: user.tenantId,
      title: title || file.name,
      content,
      tags,
      documentType,
      metadata: {
        fileName: file.name,
        fileSize: file.size.toString(),
        fileType: file.type,
      },
    });

    // 4. Save metadata to Cosmos DB
    await cosmosService.createDocument('documents', {
      id: documentId,
      tenantId: user.tenantId,
      userId: user.userId,
      fileName: file.name,
      fileType: file.type,
      fileSizeBytes: file.size,
      content: content.substring(0, 1000), // Store preview only
      metadata: {
        title: title || file.name,
        tags,
        documentType,
      },
      blobUrl,
      indexed: true,
    });

    // Track upload event
    insights.trackUserActivity('upload', user.userId, user.tenantId, {
      fileName: file.name,
      fileSize: file.size,
      documentType,
    });

    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      jsonBody: {
        documentId,
        fileName: file.name,
        indexed: true,
        url: blobUrl,
        message: 'File uploaded and indexed successfully',
      },
    };

  } catch (error: any) {
    context.error('Upload error:', error);
    
    insights.trackException(error, {
      endpoint: '/api/upload',
    });

    return {
      status: error.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
      },
      jsonBody: {
        error: error.message || 'Upload failed',
        code: error.code || 'UPLOAD_ERROR',
      },
    };
  }
}

/**
 * Extract text content from file buffer
 * (Simple implementation - in production use Azure Form Recognizer)
 */
async function extractTextContent(buffer: Buffer, fileType: string): Promise<string> {
  // For text files, just convert to string
  if (fileType === 'text/plain' || fileType === 'text/csv') {
    return buffer.toString('utf-8');
  }

  // For other file types, return placeholder
  // In production, use Azure Form Recognizer or other document parsing libraries
  return `[Content extracted from ${fileType}]\n\nThis is a placeholder. In production, use Azure Form Recognizer to extract text from PDFs, Word documents, etc.`;
}

app.http('upload-document', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'upload',
  handler: uploadHandler,
});

