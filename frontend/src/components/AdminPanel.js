import React from 'react';
import './AdminPanel.css';

const AdminPanel = ({ users, stats, handleUserRoleChange, handleDeleteUser }) => {

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
      </div>

      <div className="admin-overview">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Total Posts</h3>
            <p className="stat-number">{stats.totalPosts || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Published Posts</h3>
            <p className="stat-number">{stats.publishedPosts || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Draft Posts</h3>
            <p className="stat-number">{stats.draftPosts || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Admin Users</h3>
            <p className="stat-number">{stats.adminUsers || 0}</p>
          </div>
        </div>
      </div>

      <div className="admin-users">
        <h2>Users Management</h2>
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
                        onClick={() => handleUserRoleChange(
                          u._id, 
                          u.role === 'admin' ? 'user' : 'admin'
                        )}
                      >
                        {u.role === 'admin' ? 'Demote' : 'Promote'}
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(u._id)}
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
  );
};

export default AdminPanel;
