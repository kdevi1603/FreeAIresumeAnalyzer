import React, { useState, useMemo, useEffect } from 'react';
import { X } from 'lucide-react';
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

const CATEGORIES = [
  'All', 'With Photo', 'Without Photo', 'Single Column', 'Two Column', 'ATS Friendly'
];

const TEMPLATES = [
  {
    id: 'modern',
    name: '1. Modern Professional',
    description: 'Premium two-column resume with photo sidebar.',
    image: '/mockups/modern.png?v=3',
    tags: ['Two Column', 'With Photo', 'ATS Friendly']
  },
  {
    id: 'minimalist',
    name: '2. Minimal ATS',
    description: 'Clean ATS optimized single-column layout.',
    image: '/mockups/minimal.png?v=3',
    tags: ['Single Column', 'Without Photo', 'ATS Friendly']
  },
  {
    id: 'software',
    name: '3. Software Engineer',
    description: 'Developer-focused technical resume.',
    image: '/mockups/modern.png?v=3',
    tags: ['Two Column', 'With Photo', 'ATS Friendly']
  },
  {
    id: 'fresher',
    name: '4. Student / Fresher',
    description: 'Best for internships and fresh graduates.',
    image: '/mockups/creative.png?v=3',
    tags: ['Two Column', 'Without Photo']
  },
  {
    id: 'executive',
    name: '5. Executive',
    description: 'Leadership and management resume.',
    image: '/mockups/modern.png?v=3',
    tags: ['Two Column', 'With Photo', 'ATS Friendly']
  },
  {
    id: 'corporate',
    name: '6. Corporate',
    description: 'Formal business resume template.',
    image: '/mockups/minimal.png?v=3',
    tags: ['Two Column', 'With Photo', 'ATS Friendly']
  },
  {
    id: 'academic',
    name: '7. Academic CV',
    description: 'Research and university CV layout.',
    image: '/mockups/minimal.png?v=3',
    tags: ['Single Column', 'Without Photo', 'ATS Friendly']
  },
  {
    id: 'creative',
    name: '8. Creative',
    description: 'Colorful modern design for designers.',
    image: '/mockups/creative.png?v=3',
    tags: ['Two Column', 'With Photo']
  },
  {
    id: 'onepage',
    name: '9. Business Analyst',
    description: 'Professional analytics and consulting layout.',
    image: '/mockups/modern.png?v=3',
    tags: ['Two Column', 'Without Photo', 'ATS Friendly']
  },
  {
    id: 'elegant',
    name: '10. Clean Professional',
    description: 'Simple elegant recruiter-friendly layout.',
    image: '/mockups/minimal.png?v=3',
    tags: ['Single Column', 'Without Photo', 'ATS Friendly']
  }
];

export default function TemplateSelectionModal({ isOpen, onClose, onApply }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedTemplateId, setSelectedTemplateId] = useState('modern');
  const [displayTemplates, setDisplayTemplates] = useState(TEMPLATES);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/templates')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const live = data
            .filter(t => t.status !== 'Suspended' && t.status !== 'Offline')
            .map(t => {
              const staticMatch = TEMPLATES.find(st => st.name.includes(t.name) || t.name.includes(st.name)) 
                                || TEMPLATES.find(st => st.id === t.theme?.toLowerCase()) 
                                || TEMPLATES[0];
              
              return {
                id: staticMatch.id,
                name: t.name,
                description: t.description || staticMatch.description,
                image: staticMatch.image,
                tags: staticMatch.tags,
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
  
  // Handle window resizing for inline grid fallback
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCols(1);
      else if (window.innerWidth < 1024) setCols(2);
      else setCols(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredTemplates = useMemo(() => {
    if (activeCategory === 'All') return displayTemplates;
    return displayTemplates.filter(t => t.tags.includes(activeCategory));
  }, [activeCategory, displayTemplates]);

  if (!isOpen) return null;

  return (
    <div
      style={{ zIndex: 99999 }}
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in font-sans"
    >
      <div 
        className="bg-white shadow-2xl flex flex-col overflow-hidden"
        style={{ width: '95%', maxWidth: '1600px', height: '95vh', borderRadius: '16px' }}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white shrink-0">
          <div>
            <h2 className="text-[1.5rem] font-bold text-gray-900 m-0 leading-tight">Choose Resume Template</h2>
            <p className="text-gray-500 text-[0.95rem] m-0 mt-1">Showing template previews with sample data</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Categories (Filter Chips) */}
        <div className="px-8 py-5 bg-white border-b border-gray-100 flex items-center gap-3 shrink-0 overflow-x-auto">
          {CATEGORIES.map(category => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-6 py-2 rounded-full text-[0.9rem] font-medium transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
                style={{ backgroundColor: isActive ? '#2563EB' : undefined }}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto bg-[#f8fafc] custom-scrollbar" style={{ padding: '32px' }}>
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gap: '32px'
            }}
          >
            {filteredTemplates.map(template => {
              const isSelected = selectedTemplateId === template.id;
              return (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplateId(template.id)}
                  className={`group cursor-pointer flex flex-col bg-white border overflow-hidden transition-all duration-300 ${
                    isSelected
                      ? 'shadow-lg'
                      : 'border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1'
                  }`}
                  style={{ 
                    borderRadius: '16px',
                    borderColor: isSelected ? '#2563EB' : undefined,
                    borderWidth: isSelected ? '2px' : '1px'
                  }}
                >
                  {/* Preview Area - Live Scaled Render */}
                  <div 
                    className="border-b border-gray-100 bg-[#e2e8f0] flex justify-center items-start overflow-hidden relative" 
                    style={{ width: '100%', height: '480px', overflow: 'hidden', boxSizing: 'border-box', paddingTop: '16px' }}
                  >
                    <div style={{ transform: 'scale(0.4)', transformOrigin: 'top center', width: '794px', height: '1123px', pointerEvents: 'none' }} className="shadow-2xl">
                       <ResumeContentRenderer 
                          resumeData={MOCK_RESUME_DATA} 
                          templateStyle={template.id} 
                          zoom={100}
                       />
                    </div>
                  </div>
                  
                  {/* Text & Button Area */}
                  <div className="flex flex-col flex-1" style={{ padding: '24px' }}>
                    <h3 className="text-[1.1rem] font-bold text-gray-900 m-0 mb-1 leading-tight">
                      {template.name}
                    </h3>
                    <p className="text-gray-500 text-[0.9rem] m-0 mb-4 line-clamp-2">
                      {template.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex items-center gap-2 flex-wrap mb-6">
                      {template.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1.5 text-[0.8rem] font-medium text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#2563EB' }}></span>
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Button */}
                    <button 
                      className={`mt-auto w-full py-3 rounded-xl text-[0.95rem] font-bold transition-all duration-300 ${
                        isSelected 
                         ? 'text-white shadow-md'
                         : 'bg-[#EFF6FF] text-[#2563EB] hover:text-white'
                      }`}
                      style={{ 
                        backgroundColor: isSelected ? '#2563EB' : undefined,
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                           e.currentTarget.style.backgroundColor = '#2563EB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                           e.currentTarget.style.backgroundColor = '#EFF6FF';
                        }
                      }}
                    >
                      {isSelected ? 'Selected' : 'Use Template'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-white border-t border-gray-100 flex justify-between items-center shrink-0">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-xl text-[1rem] font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!selectedTemplateId}
            onClick={() => onApply(selectedTemplateId)}
            className={`px-10 py-3 rounded-xl text-[1rem] font-bold transition-all shadow-sm ${
              selectedTemplateId
                ? 'text-white hover:opacity-90'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            style={{ backgroundColor: selectedTemplateId ? '#2563EB' : undefined }}
          >
            Apply Template
          </button>
        </div>
        
      </div>
    </div>
  );
}
