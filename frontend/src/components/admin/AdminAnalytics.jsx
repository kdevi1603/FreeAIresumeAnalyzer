import React from 'react';

export default function AdminAnalytics() {
  return (
    <div style={{ color: 'var(--text-main)' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '24px' }}>Analytics Overview</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        View statistics for user growth, resume downloads, and AI engine usage.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>User Growth (This Month)</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>+142</p>
          <p style={{ fontSize: '0.9rem', color: '#10B981', marginTop: '8px' }}>▲ 12% vs last month</p>
        </div>
        
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>Total Downloads</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3B82F6' }}>1,845</p>
          <p style={{ fontSize: '0.9rem', color: '#10B981', marginTop: '8px' }}>▲ 8% vs last month</p>
        </div>
        
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>AI Usage (API Calls)</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#8B5CF6' }}>12,302</p>
          <p style={{ fontSize: '0.9rem', color: '#10B981', marginTop: '8px' }}>▲ 24% vs last month</p>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Charts and detailed graphs will be rendered here.</p>
      </div>
    </div>
  );
}
