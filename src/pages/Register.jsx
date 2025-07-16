import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);

      if (res.data.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        throw new Error(res.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center bg-light">
      <form onSubmit={handleRegister} className="bg-white p-4 rounded shadow w-100" style={{ maxWidth: '450px' }}>
        <h2 className="text-center mb-4 fw-bold">📝 Register</h2>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password (min 8 characters)</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            required
            minLength={8}
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {error && <div className="alert alert-danger py-1">{error}</div>}
        {success && <div className="alert alert-success py-1">{success}</div>}

        <button type="submit" className="btn btn-primary w-100">Register</button>

        <p className="mt-3 text-center">
          Already have an account?{' '}
          <a href="/login" className="fw-semibold text-decoration-none">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

export default Register;
