# Secure Upload Service

A full-stack web application for secure file uploading, storage, and management with user authentication.

## Overview

This project provides a complete file upload service with user registration, login, file management, and public/private file sharing. The application is split into two main parts: a React frontend for the user interface and an Express.js backend for the API and file storage.

## Project Structure

```
secure-upload-service/
├── backend/
│   ├── src/
│   │   ├── index.ts              Main server setup
│   │   ├── routes/               API endpoints
│   │   ├── services/             Business logic
│   │   ├── middleware/           Authentication
│   │   └── types/                TypeScript definitions
│   ├── dist/                     Compiled JavaScript
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx              React entry point
│   │   ├── App.tsx               Main component
│   │   ├── App.css               Styles
│   │   ├── api/                  API client
│   │   └── components/           React components
│   ├── index.html
│   ├── package.json
│   └── tsconfig.json
│
└── package.json                  Root configuration
```

## Features

Backend:
- User registration and login with JWT authentication
- Secure password hashing with bcryptjs
- File upload and storage management
- Public and private file sharing
- User authorization and access control
- RESTful API with 7 endpoints
- TypeScript type safety
- Docker support

Frontend:
- User registration and login interface
- File upload form
- File list display with management options
- Delete and share files
- Responsive web design
- Secure token-based authentication

## Getting Started

### Requirements

- Node.js 18 or higher
- npm

### Installation

Clone the repository and install dependencies:

```bash
cd secure-upload-service
npm install
```

This installs dependencies for both the backend and frontend using npm workspaces.

### Running the Application

Start both the backend server and frontend development server:

```bash
npm run dev
```

This will start:
- Backend API on http://localhost:3000
- Frontend on http://localhost:5173

Open http://localhost:5173 in your browser to use the application.

To run backend and frontend separately:

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

### Building for Production

Build both applications:

```bash
npm run build
```

This creates:
- backend/dist/ with compiled Node.js application
- frontend/dist/ with optimized React bundle

To run the production build:

```bash
cd backend
npm run build
npm start
```

## API Endpoints

Authentication:
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

Files:
- POST /api/files/upload - Upload a file
- GET /api/files/list - List user's files
- GET /api/files/:fileId - Get file details
- DELETE /api/files/:fileId - Delete file
- POST /api/files/:fileId/public - Make file public
- POST /api/files/:fileId/private - Make file private
- GET /api/files/public/list - List public files

All file endpoints require a valid JWT token in the Authorization header.

## Technology Stack

Backend:
- Node.js and Express.js
- TypeScript
- JWT for authentication
- bcryptjs for password hashing
- Multer for file uploads
- Docker support

Frontend:
- React 18
- TypeScript
- Vite build tool
- Axios for API calls
- CSS3 for styling

## Security

The application implements several security measures:

- Passwords are hashed using bcryptjs with salt rounds
- User authentication uses JWT tokens with 24-hour expiration
- Protected routes verify JWT tokens via middleware
- User authorization checks ensure users can only access their own files
- File ownership is verified before allowing modifications
- Public/private file access is enforced

## Development

### Backend Development

```bash
cd backend
npm run dev        # Run in development mode with hot reload
npm run build      # Compile TypeScript
npm run lint       # Run linter
```

### Frontend Development

```bash
cd frontend
npm run dev        # Run Vite development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Docker

To run the backend using Docker:

```bash
cd backend
docker build -t secure-upload-api .
docker run -p 3000:3000 secure-upload-api
```

For Docker Compose:

```bash
cd backend
docker-compose up --build
```

## File Storage

Uploaded files are stored in the /uploads directory. Files are named with a timestamp and random identifier to prevent conflicts.

File metadata is stored in memory but can be upgraded to use a database like PostgreSQL for persistent storage.

## Configuration

Backend environment variables (backend/.env):

```
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=secure-upload-bucket
```

Frontend API URL is configured in frontend/src/api/client.ts and can be changed to point to a different backend.

## Limitations

Current implementation uses in-memory storage for user and file data. This means:
- Data is lost when the server restarts
- Multiple server instances won't share data
- Not suitable for production use without a database

For production use, integrate a database like PostgreSQL to store user accounts and file metadata.

## Future Enhancements

- Database integration (PostgreSQL)
- AWS S3 cloud storage
- File download capability
- File sharing with specific users
- File preview (images, documents)
- User profile management
- Admin dashboard
- Activity logging
- Email notifications

## License

MIT
