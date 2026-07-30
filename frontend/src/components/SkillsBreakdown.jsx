import React from 'react';
import { Check, Zap, AlertCircle, HelpCircle } from 'lucide-react';

export default function SkillsBreakdown({ skillsFound = [], missingSkills = [] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      {/* Detected Skills */}
      <div className="glass-panel" style={{ padding: '28px', borderRadius: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={20} color="var(--accent-green)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Detected Skills</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Indexed by ATS parsing engine</span>
            </div>
          </div>
          <span className="badge badge-green">
            {skillsFound.length} Found
          </span>
        </div>

        {skillsFound.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {skillsFound.map((skill, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                fontSize: '0.85rem',
                color: '#fff',
                transition: 'all 0.2s ease'
              }}>
                <Zap size={14} color="var(--accent-green)" />
                <span>{skill}</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            No specific technical keywords detected in this text.
          </p>
        )}
      </div>

      {/* Missing Skills Gap Analysis */}
      <div className="glass-panel" style={{ padding: '28px', borderRadius: '24px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={20} color="var(--accent-warning)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Missing Industry Skills</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Recommended to boost keyword density</span>
            </div>
          </div>
          <span className="badge badge-warning">
            {missingSkills.length} Gap Identified
          </span>
        </div>

        {missingSkills.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {missingSkills.map((skill, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: 'rgba(245, 158, 11, 0.05)',
                border: '1px dashed rgba(245, 158, 11, 0.4)',
                borderRadius: '12px',
                fontSize: '0.85rem',
                color: 'var(--text-main)',
                transition: 'all 0.2s ease'
              }}>
                <HelpCircle size={14} color="var(--accent-warning)" />
                <span>{skill}</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--accent-green)', fontSize: '0.9rem', fontWeight: 600 }}>
            🎉 Excellent! No major skill gaps identified for your target profile.
          </p>
        )}

        {missingSkills.length > 0 && (
          <div style={{ marginTop: '20px', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', borderLeft: '3px solid var(--accent-warning)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            💡 <strong style={{ color: '#fff' }}>Pro Tip:</strong> If you possess any of these skills, make sure to explicitly include them in your skills or project sections!
          </div>
        )}
      </div>
    </div>
  );
}
