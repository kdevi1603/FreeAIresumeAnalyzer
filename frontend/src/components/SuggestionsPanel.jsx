import React, { useState } from 'react';
import { Lightbulb, Edit3, ArrowRight, ChevronRight, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function SuggestionsPanel({ suggestions = [], grammarCorrections = [] }) {
  const [activeTab, setActiveTab] = useState('suggestions'); // 'suggestions' | 'grammar'
  const [completedItems, setCompletedItems] = useState({});

  const toggleItem = (id) => {
    setCompletedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const currentList = activeTab === 'suggestions' ? suggestions : grammarCorrections;

  return (
    <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Lightbulb size={24} color="var(--accent-cyan)" />
            <span>AI Optimization Checklist</span>
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Check off these actionable improvements as you update your resume draft
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('suggestions')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'suggestions' ? 'var(--gradient-main)' : 'transparent',
              color: activeTab === 'suggestions' ? '#000' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Lightbulb size={16} />
            <span>High Impact Suggestions ({suggestions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('grammar')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'grammar' ? 'var(--gradient-purple)' : 'transparent',
              color: activeTab === 'grammar' ? '#fff' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Edit3 size={16} />
            <span>Grammar & Action Verbs ({grammarCorrections.length})</span>
          </button>
        </div>
      </div>

      {/* Checklist items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {currentList.length > 0 ? (
          currentList.map((item, idx) => {
            const itemId = `${activeTab}-${idx}`;
            const isDone = !!completedItems[itemId];

            return (
              <div
                key={itemId}
                onClick={() => toggleItem(itemId)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  padding: '18px 20px',
                  background: isDone ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isDone ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  opacity: isDone ? 0.75 : 1
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: `2px solid ${isDone ? 'var(--accent-green)' : 'var(--text-dim)'}`,
                  background: isDone ? 'var(--accent-green)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                  transition: 'all 0.2s'
                }}>
                  {isDone && <CheckCircle2 size={16} color="#000" />}
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: '0.95rem',
                    color: isDone ? 'var(--text-muted)' : 'var(--text-main)',
                    textDecoration: isDone ? 'line-through' : 'none',
                    lineHeight: 1.5,
                    margin: 0,
                    fontWeight: 500
                  }}>
                    {item}
                  </p>
                </div>

                <div style={{
                  fontSize: '0.75rem',
                  color: isDone ? 'var(--accent-green)' : 'var(--text-dim)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  alignSelf: 'center'
                }}>
                  {isDone ? 'Resolved ✓' : 'Click to Mark Done'}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <ShieldAlert size={36} style={{ marginBottom: '12px', opacity: 0.5 }} />
            <p>No specific items generated for this tab.</p>
          </div>
        )}
      </div>
    </div>
  );
}
