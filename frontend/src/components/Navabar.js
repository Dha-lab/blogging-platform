import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ user, onLogout, currentView, onViewChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
            className={currentView === 'posts' ? 'active' : ''}
            onClick={() => onViewChange('posts')}
          >
            Home
          </button>
          <button 
            className={currentView === 'create' ? 'active' : ''}
            onClick={() => onViewChange('create')}
          >
            Create Post
          </button>
          {user && user.role === 'admin' && (
            <button 
              className={currentView === 'admin' ? 'active' : ''}
              onClick={() => onViewChange('admin')}
            >
              Admin Panel
            </button>
          )}
        </div>
        
        {/* User Section */}
        <div className="navbar-user">
          <div className="notification-icon">
            <span>🔔</span>
          </div>
          <div className="user-menu">
            <div className="user-avatar">
              <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
            <div className="user-dropdown">
              <div className="user-info">
                <p className="user-name">{user?.name}</p>
                <p className="user-email">{user?.email}</p>
                <p className="user-role">{user?.role}</p>
              </div>
              <hr />
              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Toggle */}
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <button 
            className={currentView === 'posts' ? 'active' : ''}
            onClick={() => {
              onViewChange('posts');
              setIsMobileMenuOpen(false);
            }}
          >
            Home
          </button>
          <button 
            className={currentView === 'create' ? 'active' : ''}
            onClick={() => {
              onViewChange('create');
              setIsMobileMenuOpen(false);
            }}
          >
            Create Post
          </button>
          {user && user.role === 'admin' && (
            <button 
              className={currentView === 'admin' ? 'active' : ''}
              onClick={() => {
                onViewChange('admin');
                setIsMobileMenuOpen(false);
              }}
            >
              Admin Panel
            </button>
          )}
          <hr />
          <div className="mobile-user-info">
            <p>{user?.name}</p>
            <p>{user?.email}</p>
          </div>
          <button className="mobile-logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
