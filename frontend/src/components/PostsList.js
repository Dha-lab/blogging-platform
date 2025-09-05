import React from 'react';
import './PostsList.css';

const PostsList = ({ posts, user, openEditPost, handleDeletePost }) => {

  return (
    <div className="posts-container">
      <div className="posts-header">
        <h2>Blog Posts</h2>
      </div>

      <div className="posts-grid">
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts found.</p>
          </div>
        ) : (
          posts.map(post => (
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
                    onClick={() => openEditPost && openEditPost(post)}
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
