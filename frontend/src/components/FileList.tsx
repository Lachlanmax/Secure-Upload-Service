import React, { useState, useEffect } from 'react';
import { apiClient, UploadedFile } from '../api/client';
import './styles.css';

interface FileListProps {
  files: UploadedFile[];
  onFileDeleted: (fileId: string) => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onFileDeleted }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    setLoading(fileId);
    setError('');

    try {
      await apiClient.deleteFile(fileId);
      onFileDeleted(fileId);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete file');
    } finally {
      setLoading(null);
    }
  };

  const handleTogglePublic = async (file: UploadedFile) => {
    setLoading(file.id);
    setError('');

    try {
      if (file.isPublic) {
        await apiClient.makeFilePrivate(file.id);
      } else {
        await apiClient.makeFilePublic(file.id);
      }
      // File list will be refreshed by parent component
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update file');
    } finally {
      setLoading(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (files.length === 0) {
    return <div className="file-list"><p>No files uploaded yet.</p></div>;
  }

  return (
    <div className="file-list">
      <h2>📁 Your Files ({files.length})</h2>
      {error && <div className="message error">{error}</div>}
      <div className="files-table">
        {files.map((file) => (
          <div key={file.id} className="file-item">
            <div className="file-info">
              <div className="file-name">{file.originalName}</div>
              <div className="file-meta">
                <span>{formatFileSize(file.size)}</span>
                <span className="separator">•</span>
                <span>{formatDate(file.uploadedAt)}</span>
                <span className="separator">•</span>
                <span className={file.isPublic ? 'public' : 'private'}>
                  {file.isPublic ? '🌐 Public' : '🔒 Private'}
                </span>
              </div>
            </div>
            <div className="file-actions">
              <button
                onClick={() => handleTogglePublic(file)}
                disabled={loading === file.id}
                className="btn-toggle"
                title={file.isPublic ? 'Make Private' : 'Make Public'}
              >
                {file.isPublic ? '🔒' : '🌐'}
              </button>
              <button
                onClick={() => handleDelete(file.id)}
                disabled={loading === file.id}
                className="btn-delete"
              >
                {loading === file.id ? '...' : '🗑️'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
