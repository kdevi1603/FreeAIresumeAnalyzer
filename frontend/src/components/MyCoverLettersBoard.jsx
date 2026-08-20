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
    <div style={{ padding: '0 20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Box */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', padding: '32px', border: '1px solid var(--border-color)', marginBottom: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 12px 0' }}>Your Cover Letters</h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: '0 0 24px 0' }}>
          Generate highly tailored cover letters in seconds using your AI-analyzed resume data.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 24px', backgroundColor: 'transparent', color: 'var(--accent-blue)',
            border: '1px solid var(--accent-blue)', borderRadius: '24px',
            fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer'
          }}
        >
          <PlusCircle size={18} />
          Create Cover Letter
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {savedCoverLetters.map(letter => (
          <div key={letter.id} style={{ 
            backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', 
            padding: '24px', display: 'flex', gap: '24px', alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}>
            {/* Document Format Thumbnail */}
            <div style={{ 
              width: '140px', height: '180px', backgroundColor: 'var(--bg-dark)', 
              border: '1px solid var(--border-color)', borderRadius: '8px', 
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
              padding: '0', overflow: 'hidden', position: 'relative'
            }}>
              <div style={{ 
                position: 'absolute', top: '10px', left: '10px',
                width: '300px', height: '400px', backgroundColor: '#fff',
                transform: 'scale(0.4)', transformOrigin: 'top left',
                padding: '24px', color: '#1a1a1a', fontFamily: "'Times New Roman', serif",
                fontSize: '1.2rem', lineHeight: 1.6, overflow: 'hidden',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)', boxSizing: 'border-box'
              }} dangerouslySetInnerHTML={{ __html: letter.content || '' }} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>{letter.title}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Target Role: {letter.target}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Updated: {letter.date}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => onEditCoverLetter && onEditCoverLetter(letter.id)} style={actionBtnStyle('transparent', 'var(--accent-blue)', 'var(--accent-blue)')}><Edit3 size={16} /> Edit</button>
              <button onClick={() => handleDownload(letter)} style={actionBtnStyle('transparent', 'var(--accent-cyan)', 'var(--accent-cyan)')}><Download size={16} /> Download</button>
              <button onClick={() => handleDelete(letter.id)} style={actionBtnStyle('transparent', '#dc2626', '#dc2626')}><Trash2 size={16} /> Delete</button>
            </div>
          </div>
        ))}
        {savedCoverLetters.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            You haven't created any cover letters yet.
          </div>
        )}
      </div>

      <CoverLetterBuilderModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}

const actionBtnStyle = (bg, color, borderColor) => ({
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
  padding: '8px 16px', backgroundColor: bg, color: color,
  border: `1px solid ${borderColor}`, borderRadius: '24px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
});
