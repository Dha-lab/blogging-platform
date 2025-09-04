import React, { useState } from 'react';
import { postsAPI } from '../services/api';
import './CreatePost.css';

const CreatePost = ({ user, onPostCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (status = 'published') => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await postsAPI.createPost({
        ...formData,
        status
      });
      
      if (onPostCreated) {
        onPostCreated(response.data);
      }
      
      // Reset form
      setFormData({ title: '', content: '' });
      
      if (status === 'published') {
        alert('Post published successfully!');
      } else {
        alert('Post saved as draft!');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  const currentDate = new Date().toISOString().slice(0, 19) + 'Z';

  return (
    <div className="create-post-container">
      {/* Header */}
      <header className="create-post-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">📱</span>
            <h1>Blogr</h1>
          </div>
        </div>
        
        <nav className="nav-menu">
          <a href="#home">Home</a>
          <a href="#posts">Posts</a>
          <a href="#authors">Authors</a>
        </nav>
        
        <div className="header-right">
          <div className="notification">
            <span>🔔</span>
          </div>
          <div className="user-avatar">
            <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="create-post-form">
          <h2>Create New Post</h2>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter post title"
              value={formData.title}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>Content</label>
            <textarea
              name="content"
              placeholder="Write your post content here"
              value={formData.content}
              onChange={handleChange}
              rows="10"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>Author</label>
            <select disabled>
              <option>{user?.name || 'Select an author'}</option>
            </select>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Created At</label>
              <input
                type="text"
                value={currentDate.replace('T', ' ').slice(0, -1)}
                disabled
              />
            </div>
            <div className="form-group">
              <label>Updated At</label>
              <input
                type="text"
                value={currentDate.replace('T', ' ').slice(0, -1)}
                disabled
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="draft-btn"
              onClick={() => handleSubmit('draft')}
              disabled={loading}
            >
              Save Draft
            </button>
            <button 
              type="button" 
              className="publish-btn"
              onClick={() => handleSubmit('published')}
              disabled={loading}
            >
              {loading ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatePost;
