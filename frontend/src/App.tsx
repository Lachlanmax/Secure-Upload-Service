import React, { useState, useEffect } from 'react';
import { AuthForm } from './components/AuthForm';
import { FileUploader } from './components/FileUploader';
import { FileList } from './components/FileList';
import { apiClient, UploadedFile } from './api/client';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('authToken');
    const email = localStorage.getItem('userEmail');
    if (token && email) {
      apiClient.setToken(token);
      setIsLoggedIn(true);
      setUserEmail(email);
      loadFiles();
    }
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await apiClient.listFiles();
      setFiles(response.files || []);
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (token: string, email: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', email);
    apiClient.setToken(token);
    setIsLoggedIn(true);
    setUserEmail(email);
    loadFiles();
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    apiClient.clearToken();
    setIsLoggedIn(false);
    setUserEmail('');
    setFiles([]);
  };

  const handleFileUploaded = (file: UploadedFile) => {
    setFiles([...files, file]);
  };

  const handleFileDeleted = (fileId: string) => {
    setFiles(files.filter(f => f.id !== fileId));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔐 Secure Upload Service</h1>
        {isLoggedIn && (
          <div className="header-actions">
            <span className="user-email">{userEmail}</span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        )}
      </header>

      <main className="app-main">
        {!isLoggedIn ? (
          <AuthForm onLoginSuccess={handleLoginSuccess} />
        ) : (
          <div className="dashboard">
            <FileUploader onFileUploaded={handleFileUploaded} />
            {loading ? (
              <div className="loading">Loading your files...</div>
            ) : (
              <FileList files={files} onFileDeleted={handleFileDeleted} />
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>© 2026 Secure Upload Service. Your files, securely stored.</p>
      </footer>
    </div>
  );
}

export default App;
