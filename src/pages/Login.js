import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ user, setUser, isAdmin, setIsAdmin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Admin credentials (in a real app, this would be handled server-side)
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (isAdminLogin) {
      // Admin login
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        setIsAdmin(true);
        setUser(username);
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin');
      } else {
        setError('Invalid admin credentials');
      }
    } else {
      // Regular user login
      if (!username.trim()) {
        setError('Please enter your name');
        return;
      }
      setIsAdmin(false);
      setUser(username);
      localStorage.setItem('isAdmin', 'false');
      navigate('/');
    }

    setUsername('');
    setPassword('');
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="login-container">
          <div className="login-card">
            <h1 className="login-title">Login</h1>
            
            <div className="login-tabs">
              <button
                className={`tab-btn ${!isAdminLogin ? 'active' : ''}`}
                onClick={() => {
                  setIsAdminLogin(false);
                  setError('');
                }}
              >
                User Login
              </button>
              <button
                className={`tab-btn ${isAdminLogin ? 'active' : ''}`}
                onClick={() => {
                  setIsAdminLogin(true);
                  setError('');
                }}
              >
                Admin Login
              </button>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="username">
                  {isAdminLogin ? 'Admin Username' : 'Your Name'}
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={isAdminLogin ? 'Enter admin username' : 'Enter your name'}
                  required
                />
              </div>

              {isAdminLogin && (
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </div>
              )}

              {error && <div className="error-message">{error}</div>}

              {isAdminLogin && (
                <div className="admin-hint">
                  <p>Demo credentials: username: <strong>admin</strong>, password: <strong>admin123</strong></p>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-block">
                {isAdminLogin ? 'Login as Admin' : 'Login as User'}
              </button>
            </form>

            {user && !isAdminLogin && (
              <div className="login-info">
                <p>Currently logged in as: <strong>{user}</strong></p>
                <button
                  className="btn btn-secondary btn-block"
                  onClick={() => {
                    setUser(null);
                    setIsAdmin(false);
                    localStorage.removeItem('user');
                    localStorage.removeItem('isAdmin');
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
