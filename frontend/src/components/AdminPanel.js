import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './AdminPanel.css';

const AdminPanel = ({ user }) => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, postsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/posts')
      ]);
      
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setPosts(postsRes.data);
    } catch (err) {
      setError('Error fetching admin data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      
      // Update local state
      setUsers(users.map(u => 
        u._id === userId ? { ...u, role: newRole } : u
      ));
      
      // Update stats
      fetchData();
    } catch (err) {
      alert('Error updating user role');
      console.error(err);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure? This will delete the user and all their posts.')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
        setPosts(posts.filter(p => p.author._id !== userId));
        fetchData();
      } catch (err) {
        alert('Error deleting user');
        console.error(err);
      }
    }
  };

  const deletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${postId}`);
        setPosts(posts.filter(p => p._id !== postId));
        fetchData();
      } catch (err) {
        alert('Error deleting post');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading admin panel...</div>;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Welcome back, {user.name}</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length})
        </button>
        <button 
          className={activeTab === 'posts' ? 'active' : ''}
          onClick={() => setActiveTab('posts')}
        >
          Posts ({posts.length})
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="admin-overview">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Total Posts</h3>
              <p className="stat-number">{stats.totalPosts}</p>
            </div>
            <div className="stat-card">
              <h3>Published Posts</h3>
              <p className="stat-number">{stats.publishedPosts}</p>
            </div>
            <div className="stat-card">
              <h3>Draft Posts</h3>
              <p className="stat-number">{stats.draftPosts}</p>
            </div>
            <div className="stat-card">
              <h3>Admin Users</h3>
              <p className="stat-number">{stats.adminUsers}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="admin-users">
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge ${u.role}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="role-btn"
                          onClick={() => updateUserRole(
                            u._id, 
                            u.role === 'admin' ? 'user' : 'admin'
                          )}
                          disabled={u._id === user.id}
                        >
                          {u.role === 'admin' ? 'Demote' : 'Promote'}
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => deleteUser(u._id)}
                          disabled={u._id === user.id}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'posts' && (
        <div className="admin-posts">
          <div className="posts-grid">
            {posts.map(post => (
              <div key={post._id} className="admin-post-card">
                <div className="post-header">
                  <h3>{post.title}</h3>
                  <span className={`status-badge ${post.status}`}>
                    {post.status}
                  </span>
                </div>
                <div className="post-meta">
                  <span>By: {post.author.name}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="post-content">
                  <p>{post.content.substring(0, 100)}...</p>
                </div>
                <div className="post-actions">
                  <button
                    className="delete-btn"
                    onClick={() => deletePost(post._id)}
                  >
                    Delete Post
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
