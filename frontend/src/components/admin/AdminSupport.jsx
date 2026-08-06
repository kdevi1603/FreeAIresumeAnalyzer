import React, { useState, useEffect } from 'react';

export default function AdminSupport() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = () => {
    fetch('http://localhost:5000/api/admin/messages', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setMessages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    fetch(`http://localhost:5000/api/admin/messages/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(() => fetchMessages());
  };

  return (
    <div style={{ color: 'var(--text-main)' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '24px' }}>Support & Feedback</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        View contact messages and feedback from users.
      </p>

      <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
        {loading ? <p>Loading messages...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px', width: '20%' }}>Name</th>
                <th style={{ padding: '12px', width: '20%' }}>Email</th>
                <th style={{ padding: '12px', width: '40%' }}>Message</th>
                <th style={{ padding: '12px', width: '10%' }}>Date</th>
                <th style={{ padding: '12px', width: '10%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(msg => (
                <tr key={msg.id} style={{ borderBottom: '1px solid var(--border-color)', verticalAlign: 'top' }}>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{msg.name}</td>
                  <td style={{ padding: '12px' }}>{msg.email}</td>
                  <td style={{ padding: '12px', whiteSpace: 'pre-wrap' }}>{msg.message}</td>
                  <td style={{ padding: '12px' }}>{new Date(msg.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => handleDelete(msg.id)} className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr><td colSpan="5" style={{ padding: '12px', textAlign: 'center' }}>No support messages found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
