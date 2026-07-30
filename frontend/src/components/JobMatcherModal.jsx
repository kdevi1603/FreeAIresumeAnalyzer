import React, { useState } from 'react';
import { resumeService } from '../services/api.js';
import { Target, CheckCircle, AlertCircle, ArrowRight, Loader2, Sparkles, X } from 'lucide-react';

export default function JobMatcherModal({ isOpen, onClose, resumeId }) {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleMatch = async () => {
    if (!jobDescription || jobDescription.trim().length < 20) {
      setError('Please enter a detailed job description (at least 20 characters).');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await resumeService.matchJob(resumeId, jobDescription);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error matching job description.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }} className="animate-fade-in">
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '32px',
        position: 'relative',
        borderRadius: '24px'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0, 242, 254, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={22} color="var(--accent-cyan)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Resume vs. Job Description Matcher</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Compare your active resume against any target vacancy</span>
          </div>
        </div>

        {!result ? (
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '16px' }}>
              Paste the full text of the job description below. Our AI will analyze skill alignment, keyword overlap, and give you a compatibility percentage.
            </p>

            {error && (
              <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-danger)', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Target Job Description</label>
              <textarea
                className="form-textarea"
                rows="8"
                placeholder="Paste job responsibilities, requirements, and qualifications here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <button
              onClick={handleMatch}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', justifyContent: 'center', fontSize: '1rem' }}
              disabled={loading || !jobDescription.trim()}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-pulse" style={{ animation: 'spin 1.5s linear infinite' }} />
                  <span>AI Analyzing Compatibility...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Calculate Match Score</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.4)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Compatibility Rating</span>
                <h2 style={{ fontSize: '2.5rem', margin: 0, color: result.matchScore >= 75 ? 'var(--accent-green)' : result.matchScore >= 60 ? 'var(--accent-cyan)' : 'var(--accent-warning)' }}>
                  {result.matchScore}%
                </h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '280px' }}>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', marginBottom: '8px', display: 'inline-block' }}>
                  AI Tailoring Report
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  {result.matchScore >= 75 ? 'Strong alignment with core qualifications.' : 'Consider incorporating more keywords from the job post.'}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-green)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={16} />
                  <span>Matching Qualifications</span>
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {result.matchingSkills?.map((sk, idx) => (
                    <span key={idx} className="badge badge-green" style={{ fontSize: '0.7rem' }}>{sk}</span>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-danger)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={16} />
                  <span>Missing Requirements</span>
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {result.missingRequirements?.map((sk, idx) => (
                    <span key={idx} className="badge badge-danger" style={{ fontSize: '0.7rem' }}>{sk}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '12px' }}>AI Tailoring Recommendations</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {result.recommendations?.map((rec, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setResult(null)} className="btn btn-secondary">
                Test Another Job Post
              </button>
              <button onClick={onClose} className="btn btn-primary">
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
