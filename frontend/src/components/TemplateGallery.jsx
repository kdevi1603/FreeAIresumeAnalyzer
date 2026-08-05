import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Check } from 'lucide-react';

export const TEMPLATES = [
  {
    id: 'modern',
    name: '1. Modern Professional',
    badge: 'Default',
    description: 'Two-column layout with sidebar',
    image: '/mockups/modern.png?v=2',
    tags: ['Two column', 'With photo', 'ATS'],
    displayTags: ['Two Column', 'With Photo', 'ATS Friendly']
  },
  {
    id: 'minimalist',
    name: '2. Minimal ATS',
    description: 'Single column ATS-friendly design',
    image: '/mockups/minimal.png?v=2',
    tags: ['Single column', 'ATS'],
    displayTags: ['Single Column', 'ATS Friendly']
  },
  {
    id: 'software',
    name: '3. Software Engineer',
    description: 'Technical layout for developers',
    image: '/mockups/modern.png?v=2',
    tags: ['Two column', 'With photo', 'ATS'],
    displayTags: ['Two Column', 'With Photo', 'ATS Friendly']
  },
  {
    id: 'fresher',
    name: '4. Student / Fresher',
    description: 'Perfect for students & freshers',
    image: '/mockups/creative.png?v=2',
    tags: ['Two column', 'With photo'],
    displayTags: ['Two Column', 'With Photo']
  },
  {
    id: 'executive',
    name: '5. Executive',
    description: 'For senior professionals & leaders',
    image: '/mockups/modern.png?v=2',
    tags: ['Two column', 'With photo'],
    displayTags: ['Two Column', 'With Photo']
  },
  {
    id: 'corporate',
    name: '6. Corporate',
    description: 'Professional corporate layout',
    image: '/mockups/minimal.png?v=2',
    tags: ['Two column', 'With photo', 'ATS'],
    displayTags: ['Two Column', 'With Photo', 'ATS Friendly']
  },
  {
    id: 'academic',
    name: '7. Academic CV',
    description: 'For academics & researchers',
    image: '/mockups/minimal.png?v=2',
    tags: ['Single column', 'ATS'],
    displayTags: ['Single Column', 'ATS Friendly']
  },
  {
    id: 'creative',
    name: '8. Creative',
    description: 'Creative design with visual elements',
    image: '/mockups/creative.png?v=2',
    tags: ['Two column', 'With photo'],
    displayTags: ['Two Column', 'With Photo']
  },
  {
    id: 'onepage',
    name: '9. Business Analyst',
    description: 'Data-driven professional layout',
    image: '/mockups/modern.png?v=2',
    tags: ['Two column', 'ATS'],
    displayTags: ['Two Column', 'ATS Friendly']
  },
  {
    id: 'elegant',
    name: '10. Clean Professional',
    description: 'Simple & clean single column',
    image: '/mockups/minimal.png?v=2',
    tags: ['Single column', 'ATS'],
    displayTags: ['Single Column', 'ATS Friendly']
  }
];

export default function TemplateGallery({ onSelectTemplate, onBack }) {
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

  return (
    <div className="animate-fade-in font-sans" style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
        <button
          onClick={onBack}
          className="transition-all flex items-center gap-2 cursor-pointer"
          style={{ 
            padding: '10px 20px', 
            borderRadius: '12px', 
            background: 'rgba(0, 242, 254, 0.1)', 
            color: 'var(--accent-cyan)', 
            border: '1px solid rgba(0, 242, 254, 0.3)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0, 242, 254, 0.2)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0, 242, 254, 0.1)'}
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>
        <div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            <Sparkles size={28} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(0,242,254,0.5)]" />
            Recommended Free Resume Templates
          </h2>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.05rem' }}>
            Select a starting template to launch the AI Resume Analyzer Studio. You can change this later.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3" style={{ gap: '32px' }}>
        {TEMPLATES.map(template => {
          const isHovered = hoveredTemplate === template.id;
          return (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              className={`group cursor-pointer flex flex-col bg-white border rounded-xl overflow-hidden p-4 transition-all duration-300 ${isHovered
                  ? 'border-blue-500 shadow-xl ring-1 ring-blue-500 transform -translate-y-1'
                  : 'border-gray-200 hover:shadow-lg hover:border-gray-300'
                }`}
            >
              {/* Preview Area */}
              <div
                className="border border-gray-200 rounded-lg mb-4 bg-white flex justify-center items-start overflow-hidden relative"
                style={{ width: '100%', height: '380px', overflow: 'hidden', boxSizing: 'border-box', position: 'relative' }}
              >
                <img
                  src={template.image}
                  alt={template.name}
                  className="drop-shadow-sm"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'top', maxWidth: '100%' }}
                />
                {/* Hover Overlay Button */}
                {isHovered && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-lg z-20 transition-all duration-300">
                    <div className="bg-blue-600 text-white text-[0.9rem] font-bold px-6 py-2.5 rounded-lg shadow-lg flex items-center gap-1.5">
                      Use Template <ArrowLeft size={16} className="rotate-180" />
                    </div>
                  </div>
                )}
              </div>

              {/* Text Area */}
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-[1.05rem] font-bold text-gray-900 m-0 leading-tight">
                    {template.name}
                  </h3>
                  {template.badge && (
                    <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[0.65rem] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      {template.badge}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-[0.85rem] leading-snug m-0 mb-4 line-clamp-1">
                  {template.description}
                </p>

                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap mt-auto">
                  {template.displayTags.map(tag => (
                    <span key={tag} className="text-[0.7rem] font-medium text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded text-center">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
