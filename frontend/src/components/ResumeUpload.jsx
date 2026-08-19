import React, { useState, useRef, useEffect } from 'react';
import { resumeService } from '../services/api.js';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ResumeUpload({ onAnalysisComplete, requireAuth }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e) => {
    setError(null);
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;
    const allowedExtensions = ['.pdf', '.docx', '.doc'];
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    
    if (!allowedExtensions.includes(ext)) {
      setError('Invalid file format. Please upload a valid PDF or DOCX resume.');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return;
    }
    setFile(selectedFile);
  };

  useEffect(() => {
    if (file) {
      handleUpload();
    }
  }, [file]);

  const handleUpload = async (e) => {
    if (e) e.preventDefault();
    if (!file) return;
    if (requireAuth) {
      requireAuth();
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(10);

    try {
      const data = await resumeService.uploadResume(file, (percent) => {
        setProgress(Math.min(90, percent));
      });
      
      setProgress(100);
      
      // Fire celebration confetti if ATS score is great
      if (data.atsScore >= 75) {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          console.error("Confetti error:", e);
        }
      }

      setTimeout(() => {
        setLoading(false);
        setFile(null);
        onAnalysisComplete(data);
      }, 600);
    } catch (err) {
      setLoading(false);
      setProgress(0);
      setError(err.response?.data?.message || 'Error processing resume. Please try again.');
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', textAlign: 'center' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>
          Get Instant AI Resume Feedback
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          Upload your PDF or DOCX resume to receive your ATS compatibility score, keyword gap analysis, and tailored formatting recommendations.
        </p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: 'var(--accent-danger)',
            padding: '14px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            <AlertCircle size={20} />
            <span style={{ fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !loading && fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
            borderRadius: '20px',
            padding: '48px 24px',
            backgroundColor: isDragging ? 'rgba(0, 242, 254, 0.05)' : 'rgba(0, 0, 0, 0.25)',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <input
            id="resume-upload-input"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.doc"
            style={{ display: 'none' }}
          />

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                <Loader2 size={48} color="var(--accent-cyan)" className="animate-pulse" style={{ animation: 'spin 1.5s linear infinite' }} />
                <Sparkles size={20} color="var(--accent-purple)" style={{ position: 'absolute', top: -5, right: -5 }} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
                  {progress < 40 ? 'Uploading Document...' : progress < 80 ? 'AI Parsing Keywords & Sections...' : 'Generating ATS Score Report...'}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  This takes just a few seconds. Please don't close this tab.
                </p>
              </div>
              <div style={{ width: '100%', maxWidth: '240px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: 'var(--gradient-main)', transition: 'width 0.4s ease' }} />
              </div>
            </div>
          ) : file ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(0, 242, 254, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={32} color="var(--accent-cyan)" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{file.name}</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI Scan
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: '8px' }}>
                Click to select a different file
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UploadCloud size={36} color="var(--text-muted)" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>
                  Drag & Drop your Resume here
                </h4>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                  or <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>browse files</span> from your computer
                </p>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Supported Formats: PDF, DOCX, TXT, Image (Max size 10MB)
              </span>
            </div>
          )}
        </div>

        {/* Manual upload buttons removed as per user request for automatic upload */}
      </div>
    </div>
  );
}
