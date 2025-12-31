import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../services/api";

export default function Login({ user, setUser, isAdmin, setIsAdmin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const userData = await userAPI.register(username, email, password);
      
      setSuccess(userData.message || "Account created successfully! Please login.");
      
      // Clear form
      setUsername("");
      setEmail("");
      setPassword("");
      
      // Switch to login tab after 2 seconds
      setTimeout(() => {
        setIsSignUp(false);
        setSuccess("");
      }, 2000);
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const userData = await userAPI.login(username, password);

      setUser({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        isAdmin: userData.isAdmin,
      });

      setIsAdmin(userData.isAdmin);
      localStorage.setItem("isAdmin", userData.isAdmin.toString());

      setUsername("");
      setEmail("");
      setPassword("");

      if (userData.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabSwitch = (tab) => {
    setError("");
    setSuccess("");
    if (tab === "admin") {
      setIsAdminLogin(true);
      setIsSignUp(false);
    } else if (tab === "signup") {
      setIsSignUp(true);
      setIsAdminLogin(false);
    } else {
      setIsSignUp(false);
      setIsAdminLogin(false);
    }
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="login-container">
          <div className="login-card">
            <h1 className="login-title">
              {isSignUp ? "Create Account" : isAdminLogin ? "Admin Login" : "User Login"}
            </h1>

            <div className="login-tabs">
              <button
                className={`tab-btn ${!isAdminLogin && !isSignUp ? "active" : ""}`}
                onClick={() => handleTabSwitch("login")}
              >
                Login
              </button>
              <button
                className={`tab-btn ${isSignUp ? "active" : ""}`}
                onClick={() => handleTabSwitch("signup")}
              >
                Sign Up
              </button>
              <button
                className={`tab-btn ${isAdminLogin ? "active" : ""}`}
                onClick={() => handleTabSwitch("admin")}
              >
                Admin Login
              </button>
            </div>

            {isSignUp ? (
              <form className="login-form" onSubmit={handleRegister}>
                <div className="form-group">
                  <label htmlFor="reg-username">Username *</label>
                  <input
                    type="text"
                    id="reg-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reg-email">Email *</label>
                  <input
                    type="email"
                    id="reg-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reg-password">Password *</label>
                  <input
                    type="password"
                    id="reg-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    minLength="6"
                    required
                  />
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

                <p className="switch-form-text">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => handleTabSwitch("login")}
                  >
                    Login here
                  </button>
                </p>
              </form>
            ) : (
              <form className="login-form" onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="username">
                    {isAdminLogin ? "Admin Username" : "Username"}
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={
                      isAdminLogin ? "Enter admin username" : "Enter your username"
                    }
                    required
                  />
                </div>

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

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                {isAdminLogin && (
                  <div className="admin-hint">
                    <p>
                      Demo credentials: username: <strong>admin</strong>,
                      password: <strong>admin123</strong>
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading}
                >
                  {loading
                    ? "Logging in..."
                    : isAdminLogin
                    ? "Login as Admin"
                    : "Login"}
                </button>

                {!isAdminLogin && (
                  <p className="switch-form-text">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => handleTabSwitch("signup")}
                    >
                      Sign up here
                    </button>
                  </p>
                )}
              </form>
            )}

            {user && !isAdminLogin && !isSignUp && (
              <div className="login-info">
                <p>
                  Currently logged in as: <strong>{user.username || user}</strong>
                </p>
                <button
                  className="btn btn-secondary btn-block"
                  onClick={() => {
                    setUser(null);
                    setIsAdmin(false);
                    localStorage.removeItem("user");
                    localStorage.removeItem("isAdmin");
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
