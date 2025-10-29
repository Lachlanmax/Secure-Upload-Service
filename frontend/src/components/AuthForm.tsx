import React, { useState } from 'react';
import { apiClient } from '../api/client';
import './styles.css';

interface AuthFormProps {
  onLoginSuccess: (token: string, email: string) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await apiClient.login({ email, password });
        if (response.token) {
          onLoginSuccess(response.token, response.user.email);
        }
      } else {
        await apiClient.register({ email, password });
        setError('Registration successful! Now logging in...');
        setTimeout(async () => {
          const response = await apiClient.login({ email, password });
          if (response.token) {
            onLoginSuccess(response.token, response.user.email);
          }
        }, 1000);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <button
        className="toggle-btn"
        onClick={() => {
          setIsLogin(!isLogin);
          setError('');
        }}
      >
        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
      </button>
      {error && <div className={`message ${error.includes('successful') ? 'success' : 'error'}`}>{error}</div>}
    </div>
  );
};
