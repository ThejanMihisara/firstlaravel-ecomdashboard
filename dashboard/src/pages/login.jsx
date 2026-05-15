import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user-info');
    if (stored) {
      navigate('/home');
    }
  }, [navigate]);

  async function signIn() {
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const response = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const body = await response.json();
        setError(body.message || 'Login failed. Check your credentials.');
        return;
      }

      const result = await response.json();
      const userData = result.user || result;
      localStorage.setItem('user-info', JSON.stringify(userData));
      localStorage.setItem('auth_token', result.token || '');
      if (setUser) setUser(userData);
      navigate('/home');
    } catch (err) {
      setError('Unable to login. Please try again later.');
      console.error(err);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card shadow-sm">
        <h1>Welcome Back</h1>
        <p className="form-text">Sign in to manage your products and view your dashboard.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={signIn}>Login</button>
        <div className="alt-action">
          Don&apos;t have an account? <a href="/register">Register now</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
