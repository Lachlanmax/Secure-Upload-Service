import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { apiClient, UploadedFile } from '../api/client';
import './styles.css';

interface FileUploaderProps {
  onFileUploaded: (file: UploadedFile) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileUploaded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = fileInputRef.current;
    if (!input?.files?.[0]) {
      setError('Please select a file');
      return;
    }

    const file = input.files[0];
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiClient.uploadFile(file);
      if (response.file) {
        setSuccess(`File "${file.name}" uploaded successfully!`);
        onFileUploaded(response.file);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-uploader">
      <h2>📤 Upload File</h2>
      <form onSubmit={handleFileChange}>
        <div className="form-group">
          <label htmlFor="file">Choose a file (Max 100MB):</label>
          <input
            id="file"
            ref={fileInputRef}
            type="file"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}
    </div>
  );
};
