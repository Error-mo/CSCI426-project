import React from "react";
import { Link } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

export default function Header({
  cart,
  wishlist,
  user,
  setUser,
  isAdmin,
  isDarkMode,
  toggleDarkMode,
}) {
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">Online Bookstore</span>
        </Link>

        <nav className="main-nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          <Link to="/services" className="nav-link">
            Services
          </Link>
          <Link to="/contact" className="nav-link">
            Contact
          </Link>
        </nav>

        <div className="header-actions">
          <DarkModeToggle
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
          {user && !isAdmin && (
            <>
              <Link
                to="/wishlist"
                className="header-icon-link"
                title="Wishlist"
              >
                <span className="icon">🤍</span>
                {wishlist.length > 0 && (
                  <span className="badge">{wishlist.length}</span>
                )}
              </Link>
              <Link to="/cart" className="header-icon-link" title="Cart">
                <span className="icon">🛒</span>
                {cart.length > 0 && (
                  <span className="badge">{cart.length}</span>
                )}
              </Link>
            </>
          )}

          {user ? (
            <div className="user-menu">
              <span className="user-greeting">Hello, {user}</span>
              {isAdmin && (
                <Link to="/admin" className="admin-link">
                  Admin Panel
                </Link>
              )}
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-small">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
