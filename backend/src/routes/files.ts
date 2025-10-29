import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { FileService } from '../services/fileService';
import path from 'path';
import fs from 'fs';

const multer = require('multer');
const router = Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, uploadsDir);
  },
  filename: (req: any, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
});

// Upload file
router.post('/upload', authMiddleware, upload.single('file'), (req: any, res: Response) => {
  try {
    if (!req.file || !req.userId) {
      return res.status(400).json({ error: 'No file uploaded or user not authenticated' });
    }

    const uploadedFile = FileService.addFile(
      req.userId,
      req.file.filename,
      req.file.originalname,
      req.file.mimetype,
      req.file.size,
      `uploads/${req.file.filename}`
    );

    res.status(201).json({
      message: 'File uploaded successfully',
      file: uploadedFile,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// List user's files
router.get('/list', authMiddleware, (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const files = FileService.getFilesByUserId(req.userId);
    res.status(200).json({
      files,
      count: files.length,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get file details
router.get('/:fileId', authMiddleware, (req: Request, res: Response) => {
  try {
    const file = FileService.getFileById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (file.userId !== req.userId && !file.isPublic) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.status(200).json({ file });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Delete file
router.delete('/:fileId', authMiddleware, (req: Request, res: Response) => {
  try {
    const file = FileService.getFileById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (file.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete from filesystem
    const filePath = path.join(process.cwd(), file.s3Key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    FileService.deleteFile(req.params.fileId);

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Make file public
router.post('/:fileId/public', authMiddleware, (req: Request, res: Response) => {
  try {
    const file = FileService.getFileById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (file.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    FileService.makeFilePublic(req.params.fileId);
    const updatedFile = FileService.getFileById(req.params.fileId);

    res.status(200).json({
      message: 'File is now public',
      file: updatedFile,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Make file private
router.post('/:fileId/private', authMiddleware, (req: Request, res: Response) => {
  try {
    const file = FileService.getFileById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (file.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    FileService.makeFilePrivate(req.params.fileId);
    const updatedFile = FileService.getFileById(req.params.fileId);

    res.status(200).json({
      message: 'File is now private',
      file: updatedFile,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get public files
router.get('/public/list', (req: Request, res: Response) => {
  try {
    const files = FileService.getAllPublicFiles();
    res.status(200).json({
      files,
      count: files.length,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
