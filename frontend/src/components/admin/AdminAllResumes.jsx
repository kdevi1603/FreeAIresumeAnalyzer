import React, { useState, useEffect } from 'react';
import { Eye, ExternalLink, Trash2 } from 'lucide-react';

export default function AdminAllResumes() {
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

  const handleView = (r) => {
    alert(`Viewing Details for: ${r.personalInfo?.name || 'Untitled'}\nJob Title: ${r.personalInfo?.jobTitle || 'N/A'}\nEmail: ${r.personalInfo?.email || 'N/A'}`);
  };

  const handlePreview = (r) => {
    alert(`Previewing Resume for: ${r.personalInfo?.name || 'Untitled'}`);
  };

  return (
    <div style={{ color: 'var(--text-main)' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Resumes</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        View, Preview, and Delete all resumes across the platform.
      </p>

      <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
        {loading ? <p>Loading resumes...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px' }}>Name</th>
                <th style={{ padding: '12px' }}>Job Title</th>
                <th style={{ padding: '12px' }}>Created</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{r.personalInfo?.name || 'Untitled'}</td>
                  <td style={{ padding: '12px' }}>{r.personalInfo?.jobTitle || 'N/A'}</td>
                  <td style={{ padding: '12px' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleView(r)} className="btn btn-secondary" style={{ padding: '6px', title: 'View Details' }}>
                      <Eye size={16} /> <span style={{ fontSize: '0.8rem', marginLeft: '4px' }}>View</span>
                    </button>
                    <button onClick={() => handlePreview(r)} className="btn btn-secondary" style={{ padding: '6px', title: 'Preview' }}>
                      <ExternalLink size={16} /> <span style={{ fontSize: '0.8rem', marginLeft: '4px' }}>Preview</span>
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="btn btn-secondary" style={{ padding: '6px', color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', title: 'Delete' }}>
                      <Trash2 size={16} /> <span style={{ fontSize: '0.8rem', marginLeft: '4px' }}>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
              {resumes.length === 0 && (
                <tr><td colSpan="4" style={{ padding: '12px', textAlign: 'center' }}>No resumes found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
