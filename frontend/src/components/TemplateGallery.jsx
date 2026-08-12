import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Check } from 'lucide-react';
import ResumeContentRenderer from './studio/ResumeContentRenderer.jsx';

const MOCK_RESUME_DATA = {
  personalInfo: {
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 123-4567',
    city: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/sarahj',
    github: 'github.com/sarahj',
    profilePicture: 'https://i.pravatar.cc/150?u=sarah'
  },
  summary: 'Creative and detail-oriented professional with over 5 years of experience in delivering high-impact solutions. Proven track record of leading cross-functional teams and improving operational efficiency by 30%.',
  experienceList: [
    {
      company: 'Tech Innovations Inc.',
      role: 'Senior Project Lead',
      bullets: '• Directed a team of 10 developers to launch a flagship product 2 months ahead of schedule.\n• Optimized internal processes, reducing deployment time by 40%.'
    },
    {
      company: 'Creative Solutions',
      role: 'Product Specialist',
      bullets: '• Managed client relationships and increased retention rate by 25%.\n• Designed and implemented automated reporting dashboards.'
    }
  ],
  education: 'Master of Business Administration\nStanford University - 2020\n\nBachelor of Science in Computer Science\nUniversity of California, Berkeley - 2018',
  skills: 'Project Management, Agile Methodologies, Data Analysis, Python, SQL, Cross-functional Leadership, Strategic Planning',
  atsScore: 98
};

export const TEMPLATES = [
  {
    id: 'modern',
    name: '1. Modern Professional',
    badge: 'Default',
    description: 'Two-column layout, left sidebar with photo',
    image: '/mockups/modern.png?v=2',
    tags: ['Two column', 'With photo', 'ATS'],
    displayTags: ['Two-column layout', 'Left sidebar with photo', 'Best for IT, Software, Business', 'ATS Friendly']
  },
  {
    id: 'minimalist',
    name: '2. Minimal ATS',
    description: 'Single-column layout, maximum ATS compatibility',
    image: '/mockups/minimal.png?v=2',
    tags: ['Single column', 'ATS'],
    displayTags: ['Single-column layout', 'Maximum ATS compatibility', 'No graphics', 'Best for online job applications']
  },
  {
    id: 'software',
    name: '3. Software Engineer',
    description: 'Technical skills section, projects highlighted',
    image: '/mockups/software.png?v=2',
    tags: ['Two column', 'With photo', 'ATS'],
    displayTags: ['Technical skills section', 'Projects highlighted', 'GitHub & portfolio links', 'Best for developers']
  },
  {
    id: 'fresher',
    name: '4. Student / Fresher',
    description: 'Education first, projects & internships',
    image: '/mockups/fresher.png?v=2',
    tags: ['Two column', 'With photo'],
    displayTags: ['Education first', 'Projects & internships', 'Certifications', 'Best for fresh graduates']
  },
  {
    id: 'executive',
    name: '5. Executive',
    description: 'Professional summary, leadership achievements',
    image: '/mockups/executive.png?v=2',
    tags: ['Two column', 'With photo'],
    displayTags: ['Professional summary', 'Leadership achievements', 'Work experience focus', 'Best for managers']
  },
  {
    id: 'corporate',
    name: '6. Corporate',
    description: 'Clean corporate style, balanced sections',
    image: '/mockups/corporate.png?v=2',
    tags: ['Two column', 'With photo', 'ATS'],
    displayTags: ['Clean corporate style', 'Balanced sections', 'Business professionals', 'ATS Friendly']
  },
  {
    id: 'academic',
    name: '7. Academic CV',
    description: 'Education, research, publications',
    image: '/mockups/academic.png?v=2',
    tags: ['Single column', 'ATS'],
    displayTags: ['Education', 'Research', 'Publications', 'Teaching experience', 'Best for higher studies']
  },
  {
    id: 'creative',
    name: '8. Creative',
    description: 'Modern colors, stylish typography',
    image: '/mockups/creative.png?v=2',
    tags: ['Two column', 'With photo'],
    displayTags: ['Modern colors', 'Stylish typography', 'Portfolio links', 'Best for designers']
  },
  {
    id: 'onepage',
    name: '9. Business Analyst',
    description: 'Business skills, data analysis, certifications',
    image: '/mockups/business.png?v=2',
    tags: ['Two column', 'ATS'],
    displayTags: ['Business skills', 'Data analysis', 'Certifications', 'Projects', 'Professional appearance']
  },
  {
    id: 'elegant',
    name: '10. Simple Elegant',
    description: 'Minimal modern design, excellent readability',
    image: '/mockups/elegant.png?v=2',
    tags: ['Single column', 'ATS'],
    displayTags: ['Minimal modern design', 'Excellent readability', 'Suitable for any profession', 'ATS Friendly']
  }
];

export default function TemplateGallery({ onSelectTemplate, onBack }) {
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const [displayTemplates, setDisplayTemplates] = useState(TEMPLATES);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/templates')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Merge live templates with hardcoded assets
          const live = data
            .filter(t => t.status !== 'Suspended' && t.status !== 'Offline')
            .map(t => {
              // Try to find matching static template by name or category to borrow its image
              const staticMatch = TEMPLATES.find(st => st.name.includes(t.name) || t.name.includes(st.name)) 
                                || TEMPLATES.find(st => st.id === t.theme?.toLowerCase()) 
                                || TEMPLATES[0];
              
              return {
                id: staticMatch.id, // Keep the same renderer ID
                name: t.name,
                description: t.description || staticMatch.description,
                image: staticMatch.image,
                tags: staticMatch.tags,
                displayTags: staticMatch.displayTags,
                badge: t.isDefault ? 'Default' : null
              };
            });
          
          if (live.length > 0) {
            setDisplayTemplates(live);
          }
        }
      })
      .catch(err => console.error("Error fetching live templates:", err));
  }, []);

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
        {displayTemplates.map(template => {
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
                className="border border-gray-200 rounded-lg mb-4 bg-gray-50 flex justify-center items-start overflow-hidden relative shadow-inner"
                style={{ width: '100%', height: '380px', overflow: 'hidden', boxSizing: 'border-box', position: 'relative', paddingTop: '16px' }}
              >
                <div style={{ transform: 'scale(0.31)', transformOrigin: 'top center', width: '794px', height: '1123px', pointerEvents: 'none' }} className="shadow-2xl">
                    <ResumeContentRenderer 
                        resumeData={MOCK_RESUME_DATA} 
                        templateStyle={template.id} 
                        zoom={100}
                    />
                </div>
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
