import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
  const [postData, setPostData] = useState({ title: '', content: '' });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
        fetchPosts();
        if (user.role === 'admin') {
          fetchAdminData();
        }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const fetchPosts = async () => {
    try {
      const [allPosts, userPosts] = await Promise.all([
        api.get('/posts'),
        user ? api.get('/posts/my') : Promise.resolve({ data: [] })
      ]);
      setPosts(allPosts.data);
      setMyPosts(userPosts.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const fetchAdminData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/stats')
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', loginData);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setUser(response.data.user);
      setCurrentView('posts');
      fetchPosts();
      
      if (response.data.user.role === 'admin') {
        fetchAdminData();
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', registerData);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setUser(response.data.user);
      setCurrentView('posts');
      fetchPosts();
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreatePost = async (e, status = 'published') => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      await api.post('/posts', { ...postData, status });
      setPostData({ title: '', content: '' });
      setCurrentView('posts');
      fetchPosts();
      alert(status === 'published' ? 'Post published!' : 'Post saved as draft!');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error creating post');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${postId}`);
        fetchPosts();
      } catch (err) {
        alert('Error deleting post');
      }
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchAdminData();
    } catch (err) {
      alert('Error updating user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure? This will delete the user and all their posts.')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchAdminData();
        fetchPosts();
      } catch (err) {
        alert('Error deleting user');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('posts');
    setPosts([]);
    setMyPosts([]);
    setUsers([]);
    setStats({});
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Login/Register Form
  if (!user) {
    return (
      <div className="app">
        <div className="login-container">
          <div className="login-header">
            <div className="logo">
              <span className="logo-icon">📝</span>
              <h1>BlogSpace</h1>
            </div>
          </div>
          
          <div className="login-form-wrapper">
            <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
            <p>Enter your credentials to access your account.</p>
            
            <form onSubmit={isLogin ? handleLogin : handleRegister}>
              {!isLogin && (
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                  required={!isLogin}
                />
              )}
              
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={isLogin ? loginData.email : registerData.email}
                onChange={(e) => {
                  if (isLogin) {
                    setLoginData({...loginData, email: e.target.value});
                  } else {
                    setRegisterData({...registerData, email: e.target.value});
                  }
                }}
                required
              />
              
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={isLogin ? loginData.password : registerData.password}
                onChange={(e) => {
                  if (isLogin) {
                    setLoginData({...loginData, password: e.target.value});
                  } else {
                    setRegisterData({...registerData, password: e.target.value});
                  }
                }}
                required
                minLength="6"
              />
              
              <div className="forgot-password">
                <a href="#forgot">Forgot password?</a>
              </div>
              
              <button type="submit" className="sign-in-btn" disabled={formLoading}>
                {formLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
              </button>
              
              {error && <div className="error">{error}</div>}
            </form>
            
            <p className="signup-link">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                className="link-btn" 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setLoginData({ email: '', password: '' });
                  setRegisterData({ name: '', email: '', password: '' });
                }}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main App with Navigation
  return (
    <div className="app">
      {/* Navigation */}
      <div className="navbar">
        <div className="navbar-brand">
          <span className="logo-icon">📱</span>
          <h1>Blogr</h1>
        </div>
        
        <div className="navbar-menu">
          <button 
            className={currentView === 'posts' ? 'active' : ''}
            onClick={() => setCurrentView('posts')}
          >
            Home
          </button>
          <button 
            className={currentView === 'create' ? 'active' : ''}
            onClick={() => setCurrentView('create')}
          >
            Create Post
          </button>
          <button 
            className={currentView === 'my-posts' ? 'active' : ''}
            onClick={() => setCurrentView('my-posts')}
          >
            My Posts ({myPosts.length})
          </button>
          {user.role === 'admin' && (
            <button 
              className={currentView === 'admin' ? 'active' : ''}
              onClick={() => setCurrentView('admin')}
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

      <div className="main-content">
        {/* Posts List View */}
        {currentView === 'posts' && (
          <div className="posts-container">
            <h2>All Blog Posts ({posts.length})</h2>
            <div className="posts-grid">
              {posts.map(post => (
                <div key={post._id} className="post-card">
                  <h3>{post.title}</h3>
                  <div className="post-meta">
                    <span>By {post.author.name}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p>{post.content.substring(0, 150)}...</p>
                  <div className="post-status">
                    <span className={`status ${post.status}`}>{post.status}</span>
                  </div>
                  {(post.author._id === user.id || user.role === 'admin') && (
                    <div className="post-actions">
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeletePost(post._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Posts View */}
        {currentView === 'my-posts' && (
          <div className="posts-container">
            <h2>My Posts ({myPosts.length})</h2>
            <div className="posts-grid">
              {myPosts.map(post => (
                <div key={post._id} className="post-card">
                  <h3>{post.title}</h3>
                  <div className="post-meta">
                    <span>By {post.author.name}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p>{post.content.substring(0, 150)}...</p>
                  <div className="post-status">
                    <span className={`status ${post.status}`}>{post.status}</span>
                  </div>
                  <div className="post-actions">
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeletePost(post._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Post View */}
        {currentView === 'create' && (
          <div className="create-post-container">
            <div className="create-post-form">
              <h2>Create New Post</h2>
              
              {error && <div className="error">{error}</div>}
              
              <form onSubmit={(e) => handleCreatePost(e, 'published')}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter post title"
                    value={postData.title}
                    onChange={(e) => setPostData({...postData, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Content</label>
                  <textarea
                    name="content"
                    placeholder="Write your post content here"
                    value={postData.content}
                    onChange={(e) => setPostData({...postData, content: e.target.value})}
                    required
                    rows="10"
                  />
                </div>
                
                <div className="form-group">
                  <label>Author</label>
                  <select disabled>
                    <option>{user.name}</option>
                  </select>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Created At</label>
                    <input
                      type="text"
                      value={new Date().toISOString().slice(0, 19).replace('T', ' ')}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label>Updated At</label>
                    <input
                      type="text"
                      value={new Date().toISOString().slice(0, 19).replace('T', ' ')}
                      disabled
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setCurrentView('posts')}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="draft-btn"
                    onClick={(e) => handleCreatePost(e, 'draft')}
                    disabled={formLoading}
                  >
                    Save Draft
                  </button>
                  <button 
                    type="submit" 
                    className="publish-btn"
                    disabled={formLoading}
                  >
                    {formLoading ? 'Publishing...' : 'Publish'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Admin Panel View */}
        {currentView === 'admin' && user.role === 'admin' && (
          <div className="admin-container">
            <h2>Admin Panel</h2>
            
            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p>{stats.totalUsers}</p>
              </div>
              <div className="stat-card">
                <h3>Total Posts</h3>
                <p>{stats.totalPosts}</p>
              </div>
              <div className="stat-card">
                <h3>Published Posts</h3>
                <p>{stats.publishedPosts}</p>
              </div>
              <div className="stat-card">
                <h3>Draft Posts</h3>
                <p>{stats.draftPosts}</p>
              </div>
            </div>

            {/* Users Management */}
            <div className="admin-section">
              <h3>Manage Users</h3>
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
                              onClick={() => handleUpdateUserRole(
                                u._id, 
                                u.role === 'admin' ? 'user' : 'admin'
                              )}
                              disabled={u._id === user.id}
                            >
                              {u.role === 'admin' ? 'Demote' : 'Promote'}
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteUser(u._id)}
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
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
