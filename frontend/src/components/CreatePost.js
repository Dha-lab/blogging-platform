import React from "react";
import "./CreatePost.css";

const CreatePost = ({ postData, setPostData, handleCreatePost, postLoading, user, setCurrentView, error }) => {
  const handleChange = (e) => {
    setPostData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isoDate = new Date().toISOString();
  const displayDate = isoDate.replace("T", " ").slice(0, 19);

  return (
    <div className="create-post-container">
      {/* Header */}
      <header className="create-post-header">
        <div className="header-left" role="banner">
          <div className="logo" tabIndex={0} aria-label="Blog logo">
            <span className="logo-icon">📱</span>
            <span className="logo-text">Blogr</span>
          </div>
        </div>

        <nav className="nav-menu" role="navigation" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#posts">Posts</a>
          <a href="#authors">Authors</a>
        </nav>

        <div className="header-right" aria-label="User panel">
          <div className="notification" role="button" tabIndex={0} aria-label="Notifications">
            <span>🔔</span>
          </div>
          <div className="user-avatar" aria-label="User avatar" tabIndex={0}>
            <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <form className="create-post-form" onSubmit={(e) => { e.preventDefault(); handleCreatePost(e); }}>
          <h2>Create New Post</h2>

          {error && <div className="error-message" role="alert">{error}</div>}

          <div className="form-group">
            <label htmlFor="post-title">Title</label>
            <input
              id="post-title"
              type="text"
              name="title"
              placeholder="Enter post title"
              value={postData.title}
              onChange={handleChange}
              disabled={postLoading}
              required
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label htmlFor="post-content">Content</label>
            <textarea
              id="post-content"
              name="content"
              placeholder="Write your post content here"
              value={postData.content}
              onChange={handleChange}
              disabled={postLoading}
              rows={10}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="post-author">Author</label>
            <select id="post-author" disabled>
              <option>{user?.name || "Unavailable"}</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Created At</label>
              <input type="text" value={displayDate} disabled aria-readonly="true" />
            </div>
            <div className="form-group">
              <label>Updated At</label>
              <input type="text" value={displayDate} disabled aria-readonly="true" />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => setCurrentView("posts")} disabled={postLoading}>
              Cancel
            </button>
            <button
              type="button"
              className="draft-btn"
              onClick={(e) => handleCreatePost(e, "draft")}
              disabled={postLoading}
              aria-label="Save post as draft"
            >
              Save Draft
            </button>
            <button
              type="button"
              className="publish-btn"
              onClick={(e) => handleCreatePost(e, "published")}
              disabled={postLoading}
              aria-label="Publish post"
            >
              {postLoading ? "Publishing..." : "Publish"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreatePost;
