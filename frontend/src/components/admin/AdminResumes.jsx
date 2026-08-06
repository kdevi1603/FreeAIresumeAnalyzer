import React, { useState, useEffect } from 'react';

export default function AdminResumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResumes = () => {
    fetch('http://localhost:5000/api/admin/resumes', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setResumes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    fetch(`http://localhost:5000/api/admin/resumes/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(() => fetchResumes());
  };

  return (
    <div style={{ color: 'var(--text-main)' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>AI Resume History</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        View all uploaded & AI-enhanced resumes.
      </p>
      <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
        {loading ? <p>Loading resumes...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px' }}>Name</th>
                <th style={{ padding: '12px' }}>Job Title</th>
                <th style={{ padding: '12px' }}>ATS Score</th>
                <th style={{ padding: '12px' }}>Created</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px' }}>{r.personalInfo?.name || 'Untitled'}</td>
                  <td style={{ padding: '12px' }}>{r.personalInfo?.jobTitle || 'N/A'}</td>
                  <td style={{ padding: '12px' }}>{r.atsScore || 0}%</td>
                  <td style={{ padding: '12px' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => handleDelete(r.id)} className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {resumes.length === 0 && (
                <tr><td colSpan="5" style={{ padding: '12px', textAlign: 'center' }}>No resumes found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
