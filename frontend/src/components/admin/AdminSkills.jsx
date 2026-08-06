import React from 'react';

export default function AdminSkills() {
  return (
    <div style={{ color: 'var(--text-main)' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '24px' }}>Skills Master</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        Manage skills, certifications, and languages available for users.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Manage Skills */}
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Manage Skills</h2>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input 
              type="text" 
              placeholder="Add new skill..." 
              style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }} 
            />
            <button className="btn btn-primary" style={{ padding: '8px 16px' }}>Add</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['JavaScript', 'React', 'Node.js', 'Python', 'AWS'].map(skill => (
              <span key={skill} className="badge badge-cyan" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {skill}
                <span style={{ cursor: 'pointer', opacity: 0.7 }}>&times;</span>
              </span>
            ))}
          </div>
        </div>

        {/* Manage Certifications */}
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Manage Certifications</h2>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input 
              type="text" 
              placeholder="Add new certification..." 
              style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }} 
            />
            <button className="btn btn-primary" style={{ padding: '8px 16px' }}>Add</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['AWS Certified Cloud Practitioner', 'PMP', 'CompTIA Security+'].map(cert => (
              <span key={cert} className="badge" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                {cert}
                <span style={{ cursor: 'pointer', opacity: 0.7 }}>&times;</span>
              </span>
            ))}
          </div>
        </div>

        {/* Manage Languages */}
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Manage Languages</h2>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input 
              type="text" 
              placeholder="Add new language..." 
              style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }} 
            />
            <button className="btn btn-primary" style={{ padding: '8px 16px' }}>Add</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['English', 'Spanish', 'French', 'German'].map(lang => (
              <span key={lang} className="badge" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' }}>
                {lang}
                <span style={{ cursor: 'pointer', opacity: 0.7 }}>&times;</span>
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
