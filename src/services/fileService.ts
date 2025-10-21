import { UploadedFile } from '../types/index';
import { v4 as uuidv4 } from 'uuid';

const fileDatabase: Map<string, UploadedFile> = new Map();

export class FileService {
  static addFile(userId: string, filename: string, originalName: string, mimeType: string, size: number, s3Key: string): UploadedFile {
    const file: UploadedFile = {
      id: uuidv4(),
      userId,
      filename,
      originalName,
      mimeType,
      size,
      s3Key,
      uploadedAt: new Date(),
      isPublic: false,
    };

    fileDatabase.set(file.id, file);
    return file;
  }

  static getFilesByUserId(userId: string): UploadedFile[] {
    return Array.from(fileDatabase.values()).filter(f => f.userId === userId);
  }

  static getFileById(fileId: string): UploadedFile | undefined {
    return fileDatabase.get(fileId);
  }

  static deleteFile(fileId: string): boolean {
    return fileDatabase.delete(fileId);
  }

  static makeFilePublic(fileId: string): boolean {
    const file = fileDatabase.get(fileId);
    if (file) {
      file.isPublic = true;
      return true;
    }
    return false;
  }

  static makeFilePrivate(fileId: string): boolean {
    const file = fileDatabase.get(fileId);
    if (file) {
      file.isPublic = false;
      return true;
    }
    return false;
  }

  static getAllPublicFiles(): UploadedFile[] {
    return Array.from(fileDatabase.values()).filter(f => f.isPublic);
  }
}
