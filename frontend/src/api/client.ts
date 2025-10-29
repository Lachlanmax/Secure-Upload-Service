import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
  };
  token?: string;
  expiresIn?: number;
}

export interface UploadedFile {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  s3Key: string;
  uploadedAt: string;
  isPublic: boolean;
}

export interface FileResponse {
  message?: string;
  file?: UploadedFile;
  files?: UploadedFile[];
  count?: number;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken() {
    this.token = null;
  }

  private getHeaders() {
    const headers: any = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return headers;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await axios.post(`${API_BASE}/auth/register`, data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post(`${API_BASE}/auth/login`, data);
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  async uploadFile(file: File): Promise<FileResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE}/files/upload`, formData, {
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async listFiles(): Promise<FileResponse> {
    const response = await axios.get(`${API_BASE}/files/list`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async getFile(fileId: string): Promise<FileResponse> {
    const response = await axios.get(`${API_BASE}/files/${fileId}`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async deleteFile(fileId: string): Promise<{ message: string }> {
    const response = await axios.delete(`${API_BASE}/files/${fileId}`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async makeFilePublic(fileId: string): Promise<FileResponse> {
    const response = await axios.post(
      `${API_BASE}/files/${fileId}/public`,
      {},
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  async makeFilePrivate(fileId: string): Promise<FileResponse> {
    const response = await axios.post(
      `${API_BASE}/files/${fileId}/private`,
      {},
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  async listPublicFiles(): Promise<FileResponse> {
    const response = await axios.get(`${API_BASE}/files/public/list`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
