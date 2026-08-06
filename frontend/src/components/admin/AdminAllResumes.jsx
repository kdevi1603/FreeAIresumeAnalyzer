import React, { useState, useEffect } from 'react';
import { Eye, ExternalLink, Trash2, X } from 'lucide-react';
import LiveResumePreview from '../studio/LiveResumePreview.jsx';

export default function AdminAllResumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingResume, setViewingResume] = useState(null);
  const [previewingResume, setPreviewingResume] = useState(null);
  const [previewMode, setPreviewMode] = useState('ai_edited'); // 'original' or 'ai_edited'

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
    setViewingResume(r);
  };

  const handlePreview = (r) => {
    setPreviewingResume(r);
    setPreviewMode(r.fileUrl ? 'ai_edited' : 'ai_edited');
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

      {/* View Details Modal */}
      {viewingResume && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg-card)', width: '90%', maxWidth: '1000px', height: '80%', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Resume Details</h2>
              <button onClick={() => setViewingResume(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}>
                <X size={24} />
              </button>
            </div>
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              <div style={{ width: '35%', padding: '24px', borderRight: '1px solid var(--border-color)', overflowY: 'auto' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--text-main)' }}>Applicant Metadata</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-muted)' }}>
                  <div><strong style={{ color: 'var(--text-main)' }}>Name:</strong> {viewingResume.personalInfo?.name || 'N/A'}</div>
                  <div><strong style={{ color: 'var(--text-main)' }}>Email:</strong> {viewingResume.personalInfo?.email || 'N/A'}</div>
                  <div><strong style={{ color: 'var(--text-main)' }}>Phone:</strong> {viewingResume.personalInfo?.phone || 'N/A'}</div>
                  <div><strong style={{ color: 'var(--text-main)' }}>Job Title:</strong> {viewingResume.personalInfo?.jobTitle || 'N/A'}</div>
                  <div><strong style={{ color: 'var(--text-main)' }}>ATS Score:</strong> <span style={{ color: 'var(--accent-main)', fontWeight: 'bold' }}>{viewingResume.atsScore || 0}%</span></div>
                  <div><strong style={{ color: 'var(--text-main)' }}>Upload Date:</strong> {new Date(viewingResume.createdAt).toLocaleDateString()}</div>
                  <div><strong style={{ color: 'var(--text-main)' }}>Status:</strong> {viewingResume.fileUrl ? 'Original PDF Uploaded' : 'Draft / No PDF'}</div>
                </div>
                {viewingResume.fileUrl && (
                  <a href={`http://localhost:5000${viewingResume.fileUrl}`} download target="_blank" rel="noreferrer" className="btn btn-primary" style={{ marginTop: '32px', display: 'block', textAlign: 'center', padding: '12px' }}>
                    Download Original PDF
                  </a>
                )}
              </div>
              <div style={{ flex: 1, background: '#f3f4f6', display: 'flex', flexDirection: 'column' }}>
                {viewingResume.fileUrl ? (
                  <iframe src={`http://localhost:5000${viewingResume.fileUrl}`} width="100%" height="100%" style={{ border: 'none', flex: 1 }} title="Resume PDF"></iframe>
                ) : (
                  <div style={{ margin: 'auto', color: '#666' }}>No original PDF uploaded for this resume.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewingResume && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-main)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Resume Preview: {previewingResume.personalInfo?.name || 'Untitled'}</h2>
              {previewingResume.fileUrl && (
                <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-main)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <button 
                    onClick={() => setPreviewMode('original')}
                    style={{ 
                      padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                      background: previewMode === 'original' ? 'var(--accent-main)' : 'transparent',
                      color: previewMode === 'original' ? '#fff' : 'var(--text-muted)'
                    }}
                  >
                    Original Resume
                  </button>
                  <button 
                    onClick={() => setPreviewMode('ai_edited')}
                    style={{ 
                      padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                      background: previewMode === 'ai_edited' ? 'var(--accent-main)' : 'transparent',
                      color: previewMode === 'ai_edited' ? '#fff' : 'var(--text-muted)'
                    }}
                  >
                    AI Enhanced Resume
                  </button>
                </div>
              )}
            </div>
            <button onClick={() => setPreviewingResume(null)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <X size={18} /> Close Preview
            </button>
          </div>
          
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative', background: '#f3f4f6' }}>
            {(previewingResume.fileUrl && previewMode === 'original') ? (
              <iframe 
                src={`http://localhost:5000${previewingResume.fileUrl}`} 
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Original Resume"
              />
            ) : (
              <LiveResumePreview 
                resumeData={previewingResume} 
                templateStyle={previewingResume.templateStyle || 'modern'} 
                accentColor={previewingResume.accentColor || '#2563EB'} 
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
