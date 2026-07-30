import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function CoverLetterBuilderModal({ isOpen, onClose, onCreate }) {
  const [coverLetterName, setCoverLetterName] = useState('');

  if (!isOpen) return null;

  const handleCreate = () => {
    if (coverLetterName.trim()) {
      onCreate(coverLetterName.trim());
      setCoverLetterName('');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '450px',
        padding: '32px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid var(--border-color)',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none',
            color: 'var(--text-muted)', cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 12px 0' }}>
          Name your cover letter
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: '0 0 24px 0', lineHeight: 1.5 }}>
          Give your cover letter a name to help you identify it later.
        </p>

        <div style={{ position: 'relative', marginBottom: '8px' }}>
          <input
            type="text"
            value={coverLetterName}
            onChange={(e) => setCoverLetterName(e.target.value)}
            placeholder="e.g. Software Engineer Cover Letter, Marketing"
            maxLength={50}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: 'var(--bg-card)',
              border: '2px solid var(--accent-blue)',
              borderRadius: '8px',
              fontSize: '1rem',
              color: 'var(--text-main)',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '32px' }}>
          {coverLetterName.length}/50 characters
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button 
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--bg-dark)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleCreate}
            disabled={!coverLetterName.trim()}
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--accent-blue)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: coverLetterName.trim() ? 'pointer' : 'not-allowed',
              opacity: coverLetterName.trim() ? 1 : 0.7
            }}
          >
            Create Cover Letter
          </button>
        </div>
      </div>
    </div>
  );
}
