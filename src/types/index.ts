export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export interface UploadedFile {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  s3Key: string;
  uploadedAt: Date;
  isPublic: boolean;
}

export interface AuthToken {
  token: string;
  expiresIn: number;
}

export interface AuthRequest {
  email: string;
  password: string;
}
