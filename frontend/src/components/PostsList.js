import React, { useState, useEffect } from 'react';
import { postsAPI } from '../services/api';
import './PostsList.css';

const PostsList = ({ user, onEditPost }) => {
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
    if (user) {
      fetchMyPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getAllPosts();
      setPosts(response.data);
    } catch (err) {
      setError('Error fetching posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPosts = async () => {
    try {
      const response = await postsAPI.getMyPosts();
      setMyPosts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.deletePost(postId);
        setPosts(posts.filter(post => post._id !== postId));
        setMyPosts(myPosts.filter(post => post._id !== postId));
      } catch (err) {
        alert('Error deleting post');
        console.error(err);
      }
    }
  };

  const displayPosts = activeTab === 'all' ? posts : myPosts;

  if (loading) {
    return (
      <div className="posts-container">
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="posts-container">
      <div className="posts-header">
        <h2>Blog Posts</h2>
        <div className="tabs">
          <button 
            className={activeTab === 'all' ? 'active' : ''}
            onClick={() => setActiveTab('all')}
          >
            All Posts ({posts.length})
          </button>
          <button 
            className={activeTab === 'my' ? 'active' : ''}
            onClick={() => setActiveTab('my')}
          >
            My Posts ({myPosts.length})
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="posts-grid">
        {displayPosts.length === 0 ? (
          <div className="no-posts">
            <p>No posts found.</p>
            {activeTab === 'my' && (
              <p>Start by creating your first post!</p>
            )}
          </div>
        ) : (
          displayPosts.map(post => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <h3>{post.title}</h3>
                <div className="post-meta">
                  <span className="author">By {post.author.name}</span>
                  <span className="date">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="post-content">
                <p>{post.content.substring(0, 150)}...</p>
              </div>
              
              <div className="post-status">
                <span className={`status ${post.status}`}>
                  {post.status}
                </span>
              </div>
              
              {(post.author._id === user?.id || user?.role === 'admin') && (
                <div className="post-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => onEditPost && onEditPost(post)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostsList;
