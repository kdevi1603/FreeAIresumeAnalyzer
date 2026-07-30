import React, { useState } from 'react';
import { X } from 'lucide-react';

const templates = [
  {
    id: 'standard',
    name: 'Standard',
    badge: 'Default',
    description: 'Clean, professional single-column layout',
    previewColor: '#3B82F6',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Two-column layout with sidebar for contact info',
    previewColor: '#64748B',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Timeline-based design with icons and visual elements',
    previewColor: '#10B981',
  }
];

export default function TemplateModal({ isOpen, onClose, onApply }) {
  const [selectedId, setSelectedId] = useState('standard');
  const [filter, setFilter] = useState('All');

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="animate-fade-in" style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '1200px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
              Choose Resume Template
            </h2>
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Showing template previews with sample data
            </span>
          </div>
          <button 
            type="button"
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#64748b', padding: '4px', display: 'flex'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{
          padding: '16px 24px',
          display: 'flex',
          gap: '12px',
          borderBottom: '1px solid #f1f5f9',
          justifyContent: 'center',
        }}>
          {['All', 'With photo', 'Single column', 'Two column', 'ATS'].map(f => (
            <button
              type="button"
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: filter === f ? 'none' : '1px solid #cbd5e1',
                backgroundColor: filter === f ? '#2563eb' : 'transparent',
                color: filter === f ? '#fff' : '#475569',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          backgroundColor: '#fff',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignContent: 'start'
        }}>
          {templates.map(tmpl => (
            <div
              key={tmpl.id}
              onClick={() => setSelectedId(tmpl.id)}
              style={{
                borderRadius: '8px',
                border: selectedId === tmpl.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                cursor: 'pointer',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '450px'
              }}
            >
              <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', backgroundColor: selectedId === tmpl.id ? '#eff6ff' : '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                    {tmpl.name}
                  </h3>
                  {tmpl.badge && (
                    <span style={{
                      fontSize: '0.75rem',
                      backgroundColor: '#e0e7ff',
                      color: '#4f46e5',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontWeight: 500
                    }}>
                      {tmpl.badge}
                    </span>
                  )}
                  {selectedId === tmpl.id && (
                    <div style={{ marginLeft: 'auto', width: '16px', height: '16px', borderRadius: '50%', border: '4px solid #2563eb', backgroundColor: '#fff' }} />
                  )}
                </div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  {tmpl.description}
                </p>
              </div>
              
              <div style={{ flex: 1, padding: '16px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
                <div style={{
                  width: '100%',
                  maxWidth: '280px',
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  padding: '16px',
                  borderRadius: '4px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                   <div style={{ textAlign: tmpl.id === 'modern' ? 'left' : 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                     <div style={{ height: '24px', width: '120px', backgroundColor: '#cbd5e1', borderRadius: '4px', margin: tmpl.id === 'modern' ? '0' : '0 auto 8px' }} />
                     <div style={{ height: '12px', width: '180px', backgroundColor: '#e2e8f0', borderRadius: '4px', margin: tmpl.id === 'modern' ? '8px 0 0' : '0 auto' }} />
                   </div>
                   <div style={{ flex: 1, display: 'flex', gap: '16px' }}>
                      {tmpl.id === 'modern' && (
                        <div style={{ width: '30%', display: 'flex', flexDirection: 'column', gap: '8px', borderRight: '1px solid #e2e8f0', paddingRight: '8px' }}>
                          <div style={{ height: '8px', width: '100%', backgroundColor: '#cbd5e1', borderRadius: '4px' }} />
                          <div style={{ height: '8px', width: '80%', backgroundColor: '#cbd5e1', borderRadius: '4px' }} />
                        </div>
                      )}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ height: '12px', width: '60%', backgroundColor: '#94a3b8', borderRadius: '4px' }} />
                        <div style={{ height: '8px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
                        <div style={{ height: '8px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
                        
                        <div style={{ height: '12px', width: '50%', backgroundColor: '#94a3b8', borderRadius: '4px', marginTop: '8px' }} />
                        <div style={{ height: '8px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
                      </div>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#fff',
              color: '#475569',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onApply(selectedId)}
            style={{
              padding: '10px 32px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#111827',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Apply Template
          </button>
        </div>
      </div>
    </div>
  );
}
