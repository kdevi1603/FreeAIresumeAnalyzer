import React, { useState } from 'react';
import { PlusCircle, Search, FileText, Edit3, Trash2, Download } from 'lucide-react';
import CoverLetterBuilderModal from './studio/CoverLetterBuilderModal.jsx';

export default function MyCoverLettersBoard({ onCreateCoverLetter, savedCoverLetters = [], setSavedCoverLetters, onEditCoverLetter }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = (name) => {
    setIsModalOpen(false);
    if (onCreateCoverLetter) {
      onCreateCoverLetter(name);
    }
  };

  const handleDelete = (id) => {
    if (setSavedCoverLetters) {
      setSavedCoverLetters(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleDownload = (letter) => {
    // Generate simple html text blob download
    const element = document.createElement('a');
    const file = new Blob([letter.content || 'Empty Cover Letter'], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${letter.title}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Header Box */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', padding: '32px', border: '1px solid var(--border-color)', marginBottom: '32px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 12px 0' }}>Your Cover Letters</h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: '0 0 24px 0' }}>
          Generate highly tailored cover letters in seconds using your AI-analyzed resume data.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 24px', backgroundColor: 'var(--bg-dark)', color: 'var(--accent-blue)',
            border: '1px solid var(--accent-blue)', borderRadius: '24px',
            fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.target.style.background = 'var(--accent-blue)'; e.target.style.color = '#fff'; }}
          onMouseOut={(e) => { e.target.style.background = 'var(--bg-dark)'; e.target.style.color = 'var(--accent-blue)'; }}
        >
          <PlusCircle size={18} />
          Create Cover Letter
        </button>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>Cover Letters</h2>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>({(savedCoverLetters || []).length})</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {savedCoverLetters.map(letter => (
          <div key={letter.id} style={{ 
            backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', 
            padding: '24px', display: 'flex', gap: '24px', alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            {/* Document Format Thumbnail */}
            <div className="document-thumbnail" style={{ 
              width: '160px', height: '200px', backgroundColor: 'var(--bg-dark)', 
              border: '1px solid var(--border-color)', borderRadius: '8px', 
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
              padding: '0', overflow: 'hidden', position: 'relative'
            }}>
              <div style={{ 
                position: 'absolute', top: '0', left: '0',
                width: '794px', height: '1123px', backgroundColor: '#fff',
                transform: 'scale(0.201)', transformOrigin: 'top left',
                padding: '40px', color: '#1a1a1a', fontFamily: "'Times New Roman', serif",
                fontSize: '14px', lineHeight: 1.6, overflow: 'hidden',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)', boxSizing: 'border-box'
              }} dangerouslySetInnerHTML={{ __html: letter.content || '' }} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Cover Letter Title:</span>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>{letter.title || 'Untitled'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Target Role:</span>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-dim)' }}>{letter.target || 'General'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Updated:</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{letter.date}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '220px' }}>
              <button onClick={() => onEditCoverLetter && onEditCoverLetter(letter.id)} style={actionBtnStyle('var(--accent-blue)')}><Edit3 size={16} /> Edit</button>
              <button onClick={() => handleDownload(letter)} style={actionBtnStyle('var(--accent-cyan)')}><Download size={16} /> Download</button>
              <button onClick={() => handleDelete(letter.id)} style={actionBtnStyle('var(--accent-danger)')}><Trash2 size={16} /> Delete</button>
            </div>
          </div>
        ))}
        {savedCoverLetters.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            You haven't created any cover letters yet.
          </div>
        )}
      </div>
      </div>

      <CoverLetterBuilderModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}

const actionBtnStyle = (color) => ({
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
  padding: '10px 20px', backgroundColor: 'transparent', color: color,
  border: `1px solid ${color}`, borderRadius: '24px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer'
});
