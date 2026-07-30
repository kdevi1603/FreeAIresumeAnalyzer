import React from 'react';
import { Award, CheckCircle, AlertTriangle, XCircle, TrendingUp, ShieldCheck } from 'lucide-react';

export default function AtsScoreCard({ atsScore = 0, summary = '', strengths = [], weaknesses = [] }) {
  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 65) return '#00F2FE'; // Cyan
    if (score >= 50) return '#F59E0B'; // Warning
    return '#EF4444'; // Danger
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return { label: 'Exceptional ATS Match', desc: 'Highly optimized for top recruiter visibility' };
    if (score >= 65) return { label: 'Good Compatibility', desc: 'Solid structure, minor keyword tweaks needed' };
    if (score >= 50) return { label: 'Needs Improvement', desc: 'Missing key metrics or formatting markers' };
    return { label: 'Low ATS Visibility', desc: 'Requires major structural & keyword revisions' };
  };

  const color = getScoreColor(atsScore);
  const { label, desc } = getScoreLabel(atsScore);
  
  // Radial SVG calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (atsScore / 100) * circumference;

  return (
    <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Radial Gauge */}
          <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="14"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={color}
                strokeWidth="14"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{atsScore}</span>
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)', display: 'block' }}>/ 100</span>
            </div>
          </div>

          {/* Score Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Award size={22} color={color} />
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color }}>{label}</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '400px', marginBottom: '12px' }}>
              {desc}
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                ⚡ ATS Algorithm Tested
              </span>
              <span className="badge" style={{ background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-cyan)' }}>
                🛡️ AI Verified
              </span>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div style={{ flex: '1 1 300px', background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-cyan)' }}>
            <ShieldCheck size={18} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Executive Assessment Summary
            </span>
          </div>
          <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {summary || 'No summary available for this analysis.'}
          </p>
        </div>
      </div>

      {/* Strengths and Weaknesses Grid */}
      {(strengths.length > 0 || weaknesses.length > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
          {/* Strengths */}
          <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--accent-green)' }}>
              <CheckCircle size={18} />
              <h4 style={{ fontSize: '1rem', color: '#fff' }}>Key Resume Strengths</h4>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {strengths.map((str, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--accent-danger)' }}>
              <AlertTriangle size={18} />
              <h4 style={{ fontSize: '1rem', color: '#fff' }}>Areas for Optimization</h4>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {weaknesses.map((weak, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  <span style={{ color: 'var(--accent-danger)', fontWeight: 700 }}>•</span>
                  <span>{weak}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
