import React, { useState, useEffect } from 'react';

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = () => {
    fetch('http://localhost:5000/api/admin/users', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        // Filter only users with admin role
        const adminUsers = data.filter(u => u.role === 'admin');
        setAdmins(adminUsers);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div style={{ color: 'var(--text-main)' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '24px' }}>Admin Management</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        Manage Admin accounts & roles. Only authorized admins are listed here.
      </p>

      <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
        {loading ? <p>Loading admin accounts...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px' }}>Name</th>
                <th style={{ padding: '12px' }}>Email</th>
                <th style={{ padding: '12px' }}>Role</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{admin.name}</td>
                  <td style={{ padding: '12px' }}>{admin.email}</td>
                  <td style={{ padding: '12px' }}>
                    <span className="badge badge-cyan">{admin.role}</span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ color: admin.isBlocked ? '#EF4444' : '#10B981' }}>
                      {admin.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
              {admins.length === 0 && (
                <tr><td colSpan="4" style={{ padding: '12px', textAlign: 'center' }}>No admin accounts found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
