import React, { useState } from "react";
import "./Navbar.css";

const Navbar = ({ user, handleLogout, currentView, setCurrentView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when changing view
  const handleViewChange = (view) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <span className="logo-icon">📱</span>
          <span className="logo-text">Blogr</span>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          <button
            className={currentView === "posts" ? "active" : ""}
            onClick={() => handleViewChange("posts")}
          >
            Home
          </button>
          <button
            className={currentView === "create" ? "active" : ""}
            onClick={() => handleViewChange("create")}
          >
            Create Post
          </button>
          {user && user.role === "admin" && (
            <button
              className={currentView === "admin" ? "active" : ""}
              onClick={() => handleViewChange("admin")}
            >
              Admin Panel
            </button>
          )}
        </div>

        {/* User Section */}
        <div className="navbar-user">
          <div className="notification" title="Notifications">
            <span>🔔</span>
          </div>
          <div className="user-menu" tabIndex={0} aria-label="User menu">
            <div className="user-avatar">{user?.name?.charAt(0).toUpperCase() || "U"}</div>
            <div className="user-dropdown">
              <div className="user-info">
                <p className="user-name">{user?.name}</p>
                <p className="user-email">{user?.email}</p>
                <p className="user-role">{user?.role}</p>
              </div>
              <hr />
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          className={`mobile-menu-toggle ${isMobileMenuOpen ? "open" : ""}`}
          onClick={toggleMobileMenu}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <button onClick={() => handleViewChange("posts")} className={currentView === "posts" ? "active" : ""}>
            Home
          </button>
          <button onClick={() => handleViewChange("create")} className={currentView === "create" ? "active" : ""}>
            Create Post
          </button>
          {user && user.role === "admin" && (
            <button onClick={() => handleViewChange("admin")} className={currentView === "admin" ? "active" : ""}>
              Admin Panel
            </button>
          )}
          <hr />
          <div className="mobile-user-info">
            <p>{user?.name}</p>
            <p>{user?.email}</p>
          </div>
          <button className="mobile-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
