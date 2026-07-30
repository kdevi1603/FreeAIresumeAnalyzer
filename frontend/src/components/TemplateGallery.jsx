import React from 'react';
import { ArrowLeft, Sparkles, Layout, Layers, GraduationCap, Code, Briefcase, Paintbrush, Building, BookOpen, FileText, Crown } from 'lucide-react';

const templates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean two-column layout. Best for IT, Software, Business. ATS-friendly.',
    icon: <Layout size={24} />,
    color: '#3B82F6' // Blue
  },
  {
    id: 'minimalist',
    name: 'Minimal ATS',
    description: 'Single-column design. Maximum ATS compatibility. Best for online job applications.',
    icon: <Layers size={24} />,
    color: '#64748B' // Slate
  },
  {
    id: 'fresher',
    name: 'Fresher / Student',
    description: 'Focus on education, skills, and projects. Suitable for fresh graduates.',
    icon: <GraduationCap size={24} />,
    color: '#10B981' // Emerald
  },
  {
    id: 'software',
    name: 'Software Engineer',
    description: 'Highlights technical skills. Includes GitHub, portfolio, certifications, and projects.',
    icon: <Code size={24} />,
    color: '#8B5CF6' // Violet
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Professional design. Emphasizes work experience and leadership.',
    icon: <Briefcase size={24} />,
    color: '#F59E0B' // Amber
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Modern colors and icons. Suitable for UI/UX, Graphic Design, Marketing.',
    icon: <Paintbrush size={24} />,
    color: '#EC4899' // Pink
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Formal business style. HR and management roles.',
    icon: <Building size={24} />,
    color: '#1E293B' // Slate Dark
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'For teachers, researchers, and higher education. Includes publications and certifications.',
    icon: <BookOpen size={24} />,
    color: '#06B6D4' // Cyan
  },
  {
    id: 'onepage',
    name: 'One-Page ATS',
    description: 'Compact layout. Perfect for candidates with 0–5 years of experience.',
    icon: <FileText size={24} />,
    color: '#14B8A6' // Teal
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Premium-looking design. Simple and ATS compatible.',
    icon: <Crown size={24} />,
    color: '#D946EF' // Fuchsia
  }
];

export default function TemplateGallery({ onSelectTemplate, onBack }) {
  return (
    <div className="animate-fade-in" style={{ padding: '20px 0', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button
          onClick={onBack}
          className="btn btn-secondary"
          style={{ padding: '8px 16px', borderRadius: '12px' }}
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={24} color="var(--accent-cyan)" />
            Recommended Free Resume Templates
          </h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            Select a starting template to launch the AI Resume Analyzer Studio. You can change this later.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {templates.map(tmpl => (
          <div
            key={tmpl.id}
            onClick={() => onSelectTemplate(tmpl.id)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '24px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.border = `1px solid ${tmpl.color}`;
              e.currentTarget.style.boxShadow = `0 12px 30px rgba(0,0,0,0.2), 0 0 20px ${tmpl.color}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.border = '1px solid var(--border-color)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
            }}
          >
            {/* Top color bar accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: tmpl.color }} />

            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: `${tmpl.color}20`,
              color: tmpl.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {tmpl.icon}
            </div>

            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 8px 0' }}>
                {tmpl.name}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                {tmpl.description}
              </p>
            </div>
            
            <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: tmpl.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                Select Template <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
