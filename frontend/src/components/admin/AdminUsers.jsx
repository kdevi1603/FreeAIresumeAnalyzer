import React, { useState, useEffect } from 'react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    fetch('http://localhost:5000/api/admin/users', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(() => fetchUsers());
  };

  const handleBlock = (id) => {
    fetch(`http://localhost:5000/api/admin/users/${id}/block`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(() => fetchUsers());
  };

  return (
    <div style={{ color: 'var(--text-main)' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '24px' }}>Users</h1>
      <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
        {loading ? <p>Loading users...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px' }}>Name</th>
                <th style={{ padding: '12px' }}>Email</th>
                <th style={{ padding: '12px' }}>Role</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Joined</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px' }}>{u.name}</td>
                  <td style={{ padding: '12px' }}>{u.email}</td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge ${u.role === 'admin' ? 'badge-cyan' : ''}`}>{u.role || 'user'}</span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ color: u.isBlocked ? '#EF4444' : '#10B981' }}>{u.isBlocked ? 'Blocked' : 'Active'}</span>
                  </td>
                  <td style={{ padding: '12px' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleBlock(u.id)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      {u.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                    <button onClick={() => handleDelete(u.id)} className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan="6" style={{ padding: '12px', textAlign: 'center' }}>No users found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
