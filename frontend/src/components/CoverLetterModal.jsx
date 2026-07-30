import React, { useState } from 'react';
import { resumeService } from '../services/api.js';
import { FileText, Copy, Check, Loader2, Sparkles, X, Download } from 'lucide-react';

export default function CoverLetterModal({ isOpen, onClose, resumeId }) {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!jobTitle.trim()) {
      setError('Please enter a target job title.');
      return;
    }
    setLoading(true);
    setError(null);
    setCoverLetter('');
    try {
      const data = await resumeService.generateCoverLetter(resumeId, jobTitle, companyName, jobDescription);
      setCoverLetter(data.coverLetter || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating cover letter.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([coverLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${companyName || 'Company'}_${jobTitle || 'Cover_Letter'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
        maxWidth: '750px',
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
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(159, 85, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={22} color="var(--accent-purple)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', margin: 0 }}>AI Cover Letter Generator</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Draft persuasive application letters using your resume experience</span>
          </div>
        </div>

        {!coverLetter ? (
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '16px' }}>
              Enter the target role and company. Our AI will weave your specific qualifications into a tailored cover letter.
            </p>

            {error && (
              <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-danger)', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Target Job Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Senior Frontend Developer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Google DeepMind"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Job Description / Notes (Optional)</label>
              <textarea
                className="form-textarea"
                rows="4"
                placeholder="Paste key responsibilities or culture notes to make the letter extra personal..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <button
              onClick={handleGenerate}
              className="btn btn-purple"
              style={{ width: '100%', padding: '14px', justifyContent: 'center', fontSize: '1rem' }}
              disabled={loading || !jobTitle.trim()}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-pulse" style={{ animation: 'spin 1.5s linear infinite' }} />
                  <span>Drafting Cover Letter...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Generate AI Cover Letter</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span className="badge badge-purple">✨ Generated for {jobTitle}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleCopy} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
                  {copied ? <Check size={16} color="var(--accent-green)" /> : <Copy size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>
                <button onClick={handleDownloadTxt} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
                  <Download size={16} />
                  <span>Save .TXT</span>
                </button>
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              whiteSpace: 'pre-wrap',
              fontSize: '0.95rem',
              lineHeight: 1.8,
              color: 'var(--text-main)',
              maxHeight: '400px',
              overflowY: 'auto',
              marginBottom: '20px',
              fontFamily: 'var(--font-body)'
            }}>
              {coverLetter}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setCoverLetter('')} className="btn btn-secondary">
                Draft Another Letter
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
