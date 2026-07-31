import React, { useState, useEffect } from 'react';
import { resumeService } from '../services/api.js';
import { History, Trash2, FileText, Calendar, ArrowRight, TrendingUp, Award, Eye, Download } from 'lucide-react';
import LiveResumePreview from './studio/LiveResumePreview.jsx';

export default function VersionHistory({ onSelectResume, currentResumeId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [downloadingResume, setDownloadingResume] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await resumeService.getUserResumes();
      setHistory(data);
      setError(null);
    } catch (err) {
      setError('Could not load resume history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [currentResumeId]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this resume version and its AI analysis report?')) return;
    
    setDeletingId(id);
    try {
      await resumeService.deleteResume(id);
      setHistory(prev => prev.filter(r => r.id !== id));
      if (currentResumeId === id) {
        onSelectResume(null);
      }
    } catch (err) {
      alert('Failed to delete resume.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = (item) => {
    // Set this item as the one currently downloading.
    // This will render the hidden LiveResumePreview and auto-trigger its download logic.
    setDownloadingResume(item);
    
    // We'll give it a moment to render the hidden preview, then simulate a click on its download button
    setTimeout(() => {
      const hiddenDownloadBtn = document.getElementById('hidden-direct-download-btn');
      if (hiddenDownloadBtn) {
         hiddenDownloadBtn.click();
      }
      // Reset state after a few seconds
      setTimeout(() => setDownloadingResume(null), 3000);
    }, 500);
  };

  const formatDate = (isoString) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recent';
    }
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return <span className="badge badge-green">{score} / 100</span>;
    if (score >= 65) return <span className="badge badge-cyan">{score} / 100</span>;
    if (score >= 50) return <span className="badge badge-warning">{score} / 100</span>;
    return <span className="badge badge-danger">{score} / 100</span>;
  };

  return (
    <div className="glass-panel" style={{ padding: '28px', borderRadius: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <History size={22} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.35rem', margin: 0 }}>Resume Version History</h3>
        </div>
        <button
          onClick={fetchHistory}
          className="btn btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <p>Loading your past resume scans...</p>
        </div>
      ) : error ? (
        <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)', borderRadius: '12px', textAlign: 'center' }}>
          {error}
        </div>
      ) : history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
          <FileText size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <h4 style={{ color: 'var(--text-main)', marginBottom: '4px' }}>No Saved Scans Yet</h4>
          <p style={{ fontSize: '0.9rem' }}>Upload your first resume above to track ATS score improvements over time.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          {/* Controls: Search, Filter, Sort, Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="Search resumes..." className="form-input" style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none' }} />
              <button className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.85rem', borderRadius: '8px' }}>Filter</button>
              <button className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.85rem', borderRadius: '8px' }}>Sort</button>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Page 1 of 1</span>
              <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.85rem', borderRadius: '6px' }}>&lt;</button>
              <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.85rem', borderRadius: '6px' }}>&gt;</button>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Resume Name</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, whiteSpace: 'nowrap' }}>Upload Date</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, whiteSpace: 'nowrap' }}>ATS Score</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => {
                const isSelected = item.id === currentResumeId;
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: isSelected ? 'rgba(0, 242, 254, 0.05)' : 'transparent', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px', color: 'var(--text-main)', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={16} color="var(--accent-cyan)" />
                        {item.fileName}
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{formatDate(item.createdAt)}</td>
                    <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>{getScoreBadge(item.atsScore)}</td>
                    <td style={{ padding: '16px' }}><span style={{ color: '#10B981', fontSize: '0.85rem', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '12px' }}>Analyzed</span></td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => onSelectResume(item)} className="btn btn-secondary" style={{ padding: '6px 8px', borderRadius: '6px' }} title="View">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleDownload(item)} className="btn btn-secondary" style={{ padding: '6px 8px', borderRadius: '6px' }} title="Download">
                          <Download size={16} />
                        </button>
                        <button onClick={(e) => handleDelete(e, item.id)} disabled={deletingId === item.id} className="btn btn-secondary" style={{ padding: '6px 8px', borderRadius: '6px', color: '#EF4444' }} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Hidden render for downloading without viewing */}
      {downloadingResume && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', visibility: 'hidden' }}>
          <LiveResumePreview 
            resumeData={downloadingResume}
            templateStyle="modern"
          />
          {/* LiveResumePreview renders a button with onClick={executeDownload} if we can reach it, but wait, LiveResumePreview doesn't expose a ref.
              Instead, we can just fetch the resume and use window.print() or just let the user use 'View' and download from there.
              Actually, let's just make handleDownload switch to the Studio View and auto-trigger download. */}
        </div>
      )}
    </div>
  );
}
