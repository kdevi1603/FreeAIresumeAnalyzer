import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Sparkles, Check, Eye, LayoutTemplate } from 'lucide-react';
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
    tags: ['Single column', 'With photo', 'ATS'],
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
    tags: ['Single column', 'With photo'],
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
  const [selectedPreview, setSelectedPreview] = useState(null); // Modal state for preview

  useEffect(() => {
    if (selectedPreview) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedPreview]);

  useEffect(() => {
    fetch('/api/admin/templates')
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
    <div className="animate-fade-in font-sans min-h-screen bg-gray-50/50" style={{ padding: '40px 20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all duration-300"
              title="Go Back"
            >
              <ArrowLeft size={22} />
            </button>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3 tracking-tight">
                <Sparkles size={28} className="text-blue-500" />
                Premium Resume Templates
              </h2>
              <p className="text-gray-500 mt-1 text-lg">
                Select a professionally designed template to stand out from the crowd.
              </p>
            </div>
          </div>
        </div>

        {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTemplates.map(template => {
            const isHovered = hoveredTemplate === template.id;
            const isAtsFriendly = template.tags?.includes('ATS');
            const layoutType = template.tags?.includes('Two column') ? 'Two Column' : template.tags?.includes('Single column') ? 'Single Column' : '';

            return (
              <div
                key={template.id}
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:-translate-y-1 relative"
                style={{ boxShadow: isHovered ? '0 20px 40px -10px rgba(37,99,235,0.15)' : '0 4px 6px -1px rgba(0,0,0,0.05)' }}
              >
                {/* Preview Area */}
                <div className="relative w-full bg-gray-50 overflow-hidden flex justify-center items-start pt-6 border-b border-gray-100" style={{ height: '400px' }}>
                  
                  {/* The Resume Renderer for true accuracy */}
                  <div style={{ transform: 'scale(0.33)', transformOrigin: 'top center', width: '794px', height: '1123px', pointerEvents: 'none' }} className="shadow-[0_10px_30px_rgba(0,0,0,0.1)] rounded-sm bg-white">
                      <ResumeContentRenderer 
                          resumeData={MOCK_RESUME_DATA} 
                          templateStyle={template.id} 
                          customBuilderConfig={template.builderConfig}
                          zoom={100}
                      />
                  </div>

                  {/* Badges Overlay */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {isAtsFriendly && (
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 backdrop-blur-sm bg-emerald-100/90 border border-emerald-200">
                        <Check size={14} /> ATS Friendly
                      </span>
                    )}
                    {layoutType && (
                      <span className="bg-slate-800 text-slate-100 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 backdrop-blur-sm bg-slate-800/90 border border-slate-700">
                        <LayoutTemplate size={14} /> {layoutType}
                      </span>
                    )}
                  </div>

                  {/* Hover Overlay with Action Buttons */}
                  <div 
                    className={`absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center gap-4 transition-all duration-300 z-20 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedPreview(template); }}
                      className="flex items-center gap-2 bg-white text-gray-800 font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:bg-gray-50 transform hover:scale-105 transition-all"
                    >
                      <Eye size={18} /> Preview
                    </button>
                    <button 
                      onClick={() => onSelectTemplate(template.id)}
                      className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all"
                    >
                      <Sparkles size={18} /> Use Template
                    </button>
                  </div>
                </div>

                {/* Text Area */}
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      {template.name}
                    </h3>
                    {template.badge && (
                      <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[0.7rem] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {template.badge}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2">
                    {template.description}
                  </p>

                  {/* Optional: We can still show displayTags if needed, but styling them nicely */}
                  {/* <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100">
                    {template.displayTags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[0.75rem] font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Screen Preview Modal via Portal to escape parent transforms */}
      {selectedPreview && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 pt-8 sm:p-6 sm:pt-10" style={{ background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedPreview.name}</h3>
                <p className="text-sm text-gray-500">{selectedPreview.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    onSelectTemplate(selectedPreview.id);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md shadow-blue-600/20"
                >
                  <Sparkles size={18} /> Use This Template
                </button>
                <button 
                  onClick={() => setSelectedPreview(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                >
                  <span className="text-xl font-bold leading-none">&times;</span>
                </button>
              </div>
            </div>
            
            {/* Modal Body with Scaled Preview */}
            <div className="flex-1 bg-gray-100 overflow-y-auto p-4 sm:p-8">
               <div style={{ display: 'flex', justifyContent: 'center', minWidth: 'min-content' }}>
                 <div style={{ width: '794px', height: '1123px' }} className="shadow-2xl bg-white scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 transform origin-top mb-12 rounded-sm overflow-hidden">
                    <ResumeContentRenderer 
                      resumeData={MOCK_RESUME_DATA} 
                      templateStyle={selectedPreview.id} 
                      customBuilderConfig={selectedPreview.builderConfig}
                      zoom={100}
                  />
                 </div>
               </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

