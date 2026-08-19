import React, { useRef, useState } from 'react';
import { FilePlus, Upload, X } from 'lucide-react';
import { resumeService } from '../services/api.js';

export default function CreateResumeModal({ isOpen, onClose, onBuild, onImportSuccess }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedExtensions = ['.pdf', '.docx', '.doc'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!allowedExtensions.includes(ext)) {
      setError('Invalid file format. Please upload a valid PDF or DOCX resume.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const data = await resumeService.uploadResume(file, (percent) => {
        // Optional: show progress bar
      });
      setIsUploading(false);
      onImportSuccess(data);
    } catch (err) {
      setIsUploading(false);
      setError(err.response?.data?.message || 'Error processing resume. Please try again.');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        color: '#000000',
        borderRadius: '24px', padding: '40px', width: '90%', maxWidth: '700px',
        textAlign: 'center', position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
      }}>
        
        {isUploading ? (
          <div style={{ padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="spinner" style={{ 
              width: '40px', height: '40px', border: '3px solid rgba(0, 0, 0, 0.1)', 
              borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite',
              marginBottom: '20px'
            }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px' }}>
              Analyzing Your Resume...
            </h3>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>Our AI is extracting your details</p>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px' }}>Create a Resume</h2>
            <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '32px' }}>Choose an option to get started</p>
            
            {error && (
              <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '24px', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginBottom: '32px' }}>
              
              {/* Build Resume Card */}
              <div 
                onClick={onBuild}
                style={{
                  flex: 1, backgroundColor: '#ffffff', border: '1px solid #eaeaea', borderRadius: '16px',
                  padding: '40px 24px', cursor: 'pointer', transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#eaeaea'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)'; }}
              >
                <div style={{ width: '64px', height: '64px', backgroundColor: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <FilePlus size={28} color="#0284c7" />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>Build Resume</h3>
                <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
                  Create a new resume from scratch with AI assistance
                </p>
              </div>

              {/* Import Resume Card */}
              <div 
                onClick={handleImportClick}
                style={{
                  flex: 1, backgroundColor: '#ffffff', border: '1px solid #eaeaea', borderRadius: '16px',
                  padding: '40px 24px', cursor: 'pointer', transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#eaeaea'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)'; }}
              >
                <div style={{ width: '64px', height: '64px', backgroundColor: '#f3e8ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Upload size={28} color="#9333ea" />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>Import Resume</h3>
                <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
                  Upload your existing resume to get started
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  accept=".pdf,.docx,.doc" 
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <button 
              onClick={onClose}
              style={{
                padding: '10px 28px', backgroundColor: '#f3f4f6', color: '#4b5563',
                border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600,
                cursor: 'pointer', transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            >
              Cancel
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
