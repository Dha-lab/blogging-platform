import React from "react";

export default function Navbar({ user, currentView, setCurrentView, handleLogout }) {
  return (
    <div className="navbar">
      <div className="navbar-brand">
        <span className="logo-icon">📱</span>
        <h1>Blogr</h1>
      </div>
      <div className="navbar-menu">
        <button
          className={currentView === "posts" ? "active" : ""}
          onClick={() => setCurrentView("posts")}
        >
          Home
        </button>
        <button
          className={currentView === "create" ? "active" : ""}
          onClick={() => setCurrentView("create")}
        >
          Create Post
        </button>
        <button
          className={currentView === "my-posts" ? "active" : ""}
          onClick={() => setCurrentView("my-posts")}
        >
          My Posts
        </button>
        {user.role === "admin" && (
          <button
            className={currentView === "admin" ? "active" : ""}
            onClick={() => setCurrentView("admin")}
          >
            Admin Panel
          </button>
        )}
      </div>
      <div className="navbar-user">
        <span>Welcome, {user.name}!</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
