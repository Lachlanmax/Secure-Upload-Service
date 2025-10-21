# Secure Upload Service - API Documentation

## Server Running
- **URL**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## Authentication Endpoints

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response** (201):
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com"
  }
}
```

### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response** (200):
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

## File Endpoints (Require Authentication)

All file endpoints require the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

### Upload File
```bash
POST /api/files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary-file-data>
```

**Response** (201):
```json
{
  "message": "File uploaded successfully",
  "file": {
    "id": "uuid-here",
    "userId": "uuid-here",
    "filename": "1707036000000-123456789.pdf",
    "originalName": "document.pdf",
    "mimeType": "application/pdf",
    "size": 1024000,
    "s3Key": "uploads/1707036000000-123456789.pdf",
    "uploadedAt": "2026-02-04T09:45:00.000Z",
    "isPublic": false
  }
}
```

### List User's Files
```bash
GET /api/files/list
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "files": [
    {
      "id": "uuid-here",
      "userId": "uuid-here",
      "filename": "1707036000000-123456789.pdf",
      "originalName": "document.pdf",
      "mimeType": "application/pdf",
      "size": 1024000,
      "s3Key": "uploads/1707036000000-123456789.pdf",
      "uploadedAt": "2026-02-04T09:45:00.000Z",
      "isPublic": false
    }
  ],
  "count": 1
}
```

### Get File Details
```bash
GET /api/files/:fileId
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "file": {
    "id": "uuid-here",
    "userId": "uuid-here",
    "filename": "1707036000000-123456789.pdf",
    "originalName": "document.pdf",
    "mimeType": "application/pdf",
    "size": 1024000,
    "s3Key": "uploads/1707036000000-123456789.pdf",
    "uploadedAt": "2026-02-04T09:45:00.000Z",
    "isPublic": false
  }
}
```

### Delete File
```bash
DELETE /api/files/:fileId
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "message": "File deleted successfully"
}
```

### Make File Public
```bash
POST /api/files/:fileId/public
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "message": "File is now public",
  "file": {
    "id": "uuid-here",
    "userId": "uuid-here",
    "filename": "1707036000000-123456789.pdf",
    "originalName": "document.pdf",
    "mimeType": "application/pdf",
    "size": 1024000,
    "s3Key": "uploads/1707036000000-123456789.pdf",
    "uploadedAt": "2026-02-04T09:45:00.000Z",
    "isPublic": true
  }
}
```

### Make File Private
```bash
POST /api/files/:fileId/private
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "message": "File is now private",
  "file": {
    "id": "uuid-here",
    "userId": "uuid-here",
    "filename": "1707036000000-123456789.pdf",
    "originalName": "document.pdf",
    "mimeType": "application/pdf",
    "size": 1024000,
    "s3Key": "uploads/1707036000000-123456789.pdf",
    "uploadedAt": "2026-02-04T09:45:00.000Z",
    "isPublic": false
  }
}
```

### List Public Files
```bash
GET /api/files/public/list
```

**Response** (200):
```json
{
  "files": [
    {
      "id": "uuid-here",
      "userId": "uuid-here",
      "filename": "1707036000000-123456789.pdf",
      "originalName": "document.pdf",
      "mimeType": "application/pdf",
      "size": 1024000,
      "s3Key": "uploads/1707036000000-123456789.pdf",
      "uploadedAt": "2026-02-04T09:45:00.000Z",
      "isPublic": true
    }
  ],
  "count": 1
}
```

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Upload File
```bash
curl -X POST http://localhost:3000/api/files/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/file.pdf"
```

### List Files
```bash
curl -X GET http://localhost:3000/api/files/list \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Features Implemented

✅ User Registration & Authentication (JWT)
✅ Secure Password Hashing (bcryptjs)
✅ File Upload & Storage
✅ File Management (list, delete, get details)
✅ Public/Private File Sharing
✅ User Authorization & Access Control
✅ Error Handling
✅ Type-Safe TypeScript Implementation
✅ RESTful API Design
✅ Docker Support
