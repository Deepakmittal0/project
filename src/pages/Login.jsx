import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        identifier: formData.identifier,
        password: formData.password,
      });

      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/dashboard');
      } else {
        throw new Error('Token not received');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid email/username or password');
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center bg-light">
      <form onSubmit={handleLogin} className="bg-white p-4 rounded shadow w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4 fw-bold">🔐 Login</h2>

        <div className="mb-3">
          <label htmlFor="identifier" className="form-label">
            Email or Username
          </label>
          <input
            type="text"
            name="identifier"
            className="form-control"
            id="identifier"
            value={formData.identifier}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="form-control"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="alert alert-danger py-1">{error}</div>}

        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>

        <p className="mt-3 text-center">
          Don’t have an account?{' '}
          <a href="/register" className="fw-semibold text-decoration-none">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
