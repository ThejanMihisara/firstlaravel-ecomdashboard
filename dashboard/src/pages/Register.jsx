import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api';

function Register() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  async function signUp() {
    setError('');
    setSuccess('');

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await apiRequest('/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      const body = await response.json();
      if (!response.ok) {
        setError(body.error || body.message || 'Registration failed.');
        return;
      }

      setSuccess('Registration successful. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 800);
    } catch (error) {
      console.error('Register request failed', error);
      setError('Unable to register. Please try again later.');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card shadow-sm">
        <h1>Create Account</h1>
        <p className="form-text">Start adding products and manage your own inventory securely.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button onClick={signUp} className="btn btn-primary">Register</button>
        <div className="alt-action">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
}

export default Register;
