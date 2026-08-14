import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Trash2, Check, Layout, Palette, User, FileText, Briefcase, Code, GraduationCap, ArrowRight, Upload, X, Image } from 'lucide-react';
import ResumeContentRenderer from './ResumeContentRenderer.jsx';

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

export default function ResumeBuilderModal({
  isOpen,
  onClose,
  resumeData,
  onUpdateResume,
  selectedTemplate,
  onSelectTemplate,
  accentColor,
  onSelectAccentColor
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('personal'); // 'templates' | 'personal' | 'summary' | 'experience' | 'skills'
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

  const cleanSummary = (text, pInfo) => {
    if (!text) return '';
    let cleaned = text;
    if (pInfo?.email) cleaned = cleaned.replace(pInfo.email, '');
    if (pInfo?.phone) cleaned = cleaned.replace(pInfo.phone, '');
    cleaned = cleaned.replace(/linkedin\.com\/in\/[^\s]+/gi, '').replace(/^[\s-]+/, '').trim();
    cleaned = cleaned.replace(/^[-\s•|*+0-9()]+$/, '').trim();
    let alphaCount = (cleaned.match(/[a-zA-Z]/g) || []).length;
    if (alphaCount < 10) return '';
    return cleaned;
  };

  const cleanEducation = (text) => {
    if (!text) return '';
    let cleaned = text;
    const skillsMatch = cleaned.match(/technical skills|skills & tools|skills/i);
    if (skillsMatch) {
      cleaned = cleaned.substring(0, skillsMatch.index).trim();
    }
    return cleaned || '';
  };

  // Local state initialized from resumeData
  const [personalInfo, setPersonalInfo] = useState({
    name: resumeData?.personalInfo?.name === 'Untitled Resume' ? '' : (resumeData?.personalInfo?.name || ''),
    jobTitle: resumeData?.personalInfo?.jobTitle || '',
    email: resumeData?.personalInfo?.email || '',
    phone: resumeData?.personalInfo?.phone || '',
    city: resumeData?.personalInfo?.city || '',
    linkedin: resumeData?.personalInfo?.linkedin || '',
    portfolio: resumeData?.personalInfo?.portfolio || '',
    github: resumeData?.personalInfo?.github || '',
    profilePicture: resumeData?.personalInfo?.profilePicture || null
  });

  const [summary, setSummary] = useState(() => 
    cleanSummary(resumeData?.fixedSummary || resumeData?.summary, resumeData?.personalInfo)
  );

  const [experience, setExperience] = useState(
    resumeData?.experienceList?.length > 0 ? resumeData.experienceList : []
  );

  const [education, setEducation] = useState(() => 
    cleanEducation(resumeData?.education)
  );

  const [skills, setSkills] = useState(
    resumeData?.fixedSkills || 'C, C++, Java, Oracle, SQL Server, MS Office, HTML, Tally, Python, Operating Systems, Agile Methodology, Git/GitHub'
  );

  const [certifications, setCertifications] = useState(
    resumeData?.certifications || ''
  );

  useEffect(() => {
    if (isOpen && resumeData) {
      setPersonalInfo({
        name: resumeData.personalInfo?.name === 'Untitled Resume' ? '' : (resumeData.personalInfo?.name || ''),
        jobTitle: resumeData.personalInfo?.jobTitle || '',
        email: resumeData.personalInfo?.email || '',
        phone: resumeData.personalInfo?.phone || '',
        city: resumeData.personalInfo?.city || '',
        linkedin: resumeData.personalInfo?.linkedin || '',
        portfolio: resumeData.personalInfo?.portfolio || '',
        github: resumeData.personalInfo?.github || '',
        profilePicture: resumeData.personalInfo?.profilePicture || null
      });
      setSummary(cleanSummary(resumeData.fixedSummary || resumeData.summary, resumeData.personalInfo));
      setExperience(resumeData.experienceList?.length > 0 ? resumeData.experienceList : []);
      setEducation(cleanEducation(resumeData.education));
      setSkills(resumeData.fixedSkills || resumeData.skills || resumeData.skillsFound?.map(s => typeof s === 'string' ? s : s.skill).filter(Boolean).join(', ') || '');
      setCertifications(resumeData.certifications || '');
    }
  }, [isOpen]);

  const [isGenerating, setIsGenerating] = useState(false);

  const allTemplates = [
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

  // Color options
  const colors = [
    { name: 'Obsidian Dark', value: '#1E293B', bg: 'bg-slate-800' }
  ];

  // AI Summary Generator simulation
  const handleGenerateSummary = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setSummary(
        `Results-driven ${personalInfo.jobTitle} with proven expertise in developing scalable software solutions using Java, C++, and SQL. Adept at database optimization, agile methodologies, and delivering robust enterprise-grade applications. Passionate about leveraging cutting-edge AI and cloud technologies to solve complex user challenges.`
      );
      setIsGenerating(false);
    }, 1200);
  };

  // AI Polish Bullet simulation
  const handlePolishBullet = (index) => {
    setIsGenerating(true);
    setTimeout(() => {
      const updated = [...experience];
      updated[index].bullets = `• Engineered high-performance banking transaction modules using VB.Net and SQL Server 2005, supporting 5,000+ daily secure operations.\n• Spearheaded query optimization initiatives that slashed latency by 20% and improved database indexing efficiency by 35%.`;
      setExperience(updated);
      setIsGenerating(false);
    }, 1000);
  };

  const handleSaveAll = () => {
    onUpdateResume({
      personalInfo,
      summary,
      fixedSummary: null, // Clear old AI changes so manual edits take precedence
      education,
      experienceList: experience,
      fixedProjects: null, // Clear old AI changes
      fixedSkills: null, // Clear old AI changes
      certifications
    });
    onClose();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPersonalInfo({ ...personalInfo, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '16px'
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '900px',
        height: '88vh',
        maxHeight: '750px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.2)'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.8rem' }}>🛠️</span>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px' }}>
                AI Resume Builder & Template Studio
              </span>
              <h2 style={{ fontSize: '1.3rem', color: '#0f172a', margin: 0, fontWeight: 800 }}>
                Customize & Build Your ATS Resume
              </h2>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Modal Body with Left Navigation & Right Form Content */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: window.innerWidth <= 768 ? 'column' : 'row' }}>
          {/* Builder Navigation Sidebar / Mobile Scroll Tabs */}
          <div style={{
            width: window.innerWidth <= 768 ? '100%' : '240px',
            borderRight: window.innerWidth <= 768 ? 'none' : '1px solid #e2e8f0',
            borderBottom: window.innerWidth <= 768 ? '1px solid #e2e8f0' : 'none',
            background: '#f1f5f9',
            padding: '16px',
            display: 'flex',
            flexDirection: window.innerWidth <= 768 ? 'row' : 'column',
            gap: '8px',
            overflowX: 'auto'
          }}>
            <button
              onClick={() => setActiveTab('templates')}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 16px', borderRadius: '12px', border: 'none',
                background: activeTab === 'templates' ? '#2563eb' : 'transparent',
                color: activeTab === 'templates' ? '#fff' : '#475569',
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left',
                whiteSpace: 'nowrap'
              }}
            >
              <Palette size={18} />
              <span>Templates & Color</span>
            </button>

            <button
              onClick={() => setActiveTab('personal')}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 16px', borderRadius: '12px', border: 'none',
                background: activeTab === 'personal' ? '#2563eb' : 'transparent',
                color: activeTab === 'personal' ? '#fff' : '#475569',
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left',
                whiteSpace: 'nowrap'
              }}
            >
              <User size={18} />
              <span>Personal Info</span>
            </button>

            <button
              onClick={() => setActiveTab('summary')}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 16px', borderRadius: '12px', border: 'none',
                background: activeTab === 'summary' ? '#2563eb' : 'transparent',
                color: activeTab === 'summary' ? '#fff' : '#475569',
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left',
                whiteSpace: 'nowrap'
              }}
            >
              <FileText size={18} />
              <span>AI Summary</span>
            </button>

            <button
              onClick={() => setActiveTab('experience')}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 16px', borderRadius: '12px', border: 'none',
                background: activeTab === 'experience' ? '#2563eb' : 'transparent',
                color: activeTab === 'experience' ? '#fff' : '#475569',
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left',
                whiteSpace: 'nowrap'
              }}
            >
              <Briefcase size={18} />
              <span>Work Experience</span>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 16px', borderRadius: '12px', border: 'none',
                background: activeTab === 'skills' ? '#2563eb' : 'transparent',
                color: activeTab === 'skills' ? '#fff' : '#475569',
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left',
                whiteSpace: 'nowrap'
              }}
            >
              <Code size={18} />
              <span>Technical Skills</span>
            </button>

            <button
              onClick={() => setActiveTab('education')}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 16px', borderRadius: '12px', border: 'none',
                background: activeTab === 'education' ? '#2563eb' : 'transparent',
                color: activeTab === 'education' ? '#fff' : '#475569',
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left',
                whiteSpace: 'nowrap'
              }}
            >
              <GraduationCap size={18} />
              <span>Education Details</span>
            </button>

            <button
              onClick={() => setActiveTab('certifications')}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 16px', borderRadius: '12px', border: 'none',
                background: activeTab === 'certifications' ? '#2563eb' : 'transparent',
                color: activeTab === 'certifications' ? '#fff' : '#475569',
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left',
                whiteSpace: 'nowrap'
              }}
            >
              <FileText size={18} />
              <span>Certifications</span>
            </button>
          </div>

          {/* Builder Form Content Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
            {/* TAB 1: TEMPLATES & COLOR */}
            {activeTab === 'templates' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: '0 0 6px 0' }}>1. Choose Free ATS-Friendly Template</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>All templates are 100% free, ATS parser compliant, and mobile responsive.</p>
                </div>

                <div className="grid grid-cols-2" style={{ gap: '20px' }}>
                  {allTemplates.map(tmpl => {
                    const isSelected = selectedTemplate === tmpl.id;
                    const isHovered = hoveredTemplate === tmpl.id;
                    
                    return (
                      <div
                        key={tmpl.id}
                        onMouseEnter={() => setHoveredTemplate(tmpl.id)}
                        onMouseLeave={() => setHoveredTemplate(null)}
                        style={{
                          display: 'flex', flexDirection: 'column', background: '#fff',
                          borderRadius: '16px', overflow: 'hidden', padding: '16px',
                          border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                          boxShadow: isSelected ? '0 10px 25px -5px rgba(37,99,235,0.2)' : (isHovered ? '0 10px 25px -5px rgba(0,0,0,0.05)' : 'none'),
                          cursor: 'pointer', transition: 'all 0.3s ease',
                          transform: isHovered && !isSelected ? 'translateY(-3px)' : 'none'
                        }}
                      >
                        {/* Preview Image Area */}
                        <div style={{ border: '1px solid #f1f5f9', borderRadius: '12px', marginBottom: '16px', background: '#f8fafc', height: '280px', position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                            {tmpl.id === 'original' && resumeData?.fileUrl ? (
                                <div style={{ width: '190px', height: '269px', pointerEvents: 'none', background: '#fff', borderRadius: '4px', overflow: 'hidden' }} className="shadow-2xl mt-4">
                                  <iframe
                                    src={`${resumeData.fileUrl}${resumeData.fileUrl.toLowerCase().endsWith('.pdf') ? '#view=Fit&toolbar=0&navpanes=0&scrollbar=0' : ''}`}
                                    style={{ width: '100%', height: '100%', border: 'none' }}
                                    title="Original PDF Preview"
                                  />
                                </div>
                            ) : (
                                <div style={{ transform: 'scale(0.24)', transformOrigin: 'top center', width: '794px', height: '1123px', pointerEvents: 'none', background: '#fff' }} className="shadow-2xl mt-4">
                                  <ResumeContentRenderer 
                                     resumeData={MOCK_RESUME_DATA} 
                                     templateStyle={tmpl.id === 'original' ? 'modern' : tmpl.id} 
                                     zoom={100}
                                  />
                                </div>
                            )}
                           {/* Hover / Active Overlay */}
                           {(isHovered || isSelected) && (
                             <div style={{ position: 'absolute', inset: 0, background: isSelected ? 'transparent' : 'rgba(255,255,255,0.5)', backdropFilter: isSelected ? 'none' : 'blur(1px)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', zIndex: 10 }}>
                               <button 
                                 onClick={() => onSelectTemplate(tmpl.id)}
                                 style={{ background: isSelected ? '#10B981' : '#2563EB', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '8px' }}
                               >
                                 {isSelected ? <><Check size={16} /> ACTIVE TEMPLATE</> : 'Use Template'}
                               </button>
                             </div>
                           )}
                        </div>
                        
                        {/* Info Area */}
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <h4 style={{ color: '#0f172a', margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>{tmpl.name}</h4>
                            {tmpl.badge && (
                              <span style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: '20px' }}>
                                {tmpl.badge}
                              </span>
                            )}
                          </div>
                          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 16px 0', lineHeight: 1.4 }}>{tmpl.description}</p>
                          
                          {/* Tags */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: 'auto' }}>
                            {tmpl.displayTags?.map(tag => (
                              <span key={tag} style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563eb', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '2px 8px', borderRadius: '6px' }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: '16px' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: '0 0 6px 0' }}>2. Select Accent Color Palette</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 16px 0' }}>Applies to headers, dividers, and skill chips.</p>
                  
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    {colors.map(col => (
                      <button
                        key={col.value}
                        onClick={() => onSelectAccentColor(col.value)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 16px',
                          borderRadius: '12px',
                          background: accentColor === col.value ? '#e0f2fe' : '#f8fafc',
                          border: accentColor === col.value ? '2px solid #2563eb' : '1px solid #e2e8f0',
                          color: '#0f172a',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.85rem'
                        }}
                      >
                        <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: col.value, display: 'inline-block', boxShadow: '0 0 4px rgba(0,0,0,0.2)' }} />
                        <span>{col.name}</span>
                        {accentColor === col.value && <Check size={14} color="#2563eb" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PERSONAL INFO */}
            {activeTab === 'personal' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0 }}>👤 Candidate Contact Information</h3>
                
                {/* Profile Picture Upload UI */}
                <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {personalInfo.profilePicture ? (
                    <div style={{ position: 'relative' }}>
                      <img src={personalInfo.profilePicture} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563eb' }} />
                      <button onClick={() => setPersonalInfo({ ...personalInfo, profilePicture: null })} style={{ position: 'absolute', top: -5, right: -5, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={14} /></button>
                    </div>
                  ) : (
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                      <Image size={32} />
                    </div>
                  )}
                  <div>
                    <h4 style={{ color: '#0f172a', margin: '0 0 6px 0', fontSize: '1rem' }}>Profile Picture</h4>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 12px 0' }}>Upload a professional headshot for your resume.</p>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#2563eb', color: '#fff', padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                      <Upload size={14} /> Upload Image
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ color: '#475569' }}>Full Name</label>
                    <input type="text" value={personalInfo.name} onChange={e => setPersonalInfo({...personalInfo, name: e.target.value})} className="form-input" style={{ background: '#fff', color: '#0f172a' }} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ color: '#475569' }}>Target Job Title</label>
                    <input type="text" value={personalInfo.jobTitle} onChange={e => setPersonalInfo({...personalInfo, jobTitle: e.target.value})} className="form-input" style={{ background: '#fff', color: '#0f172a' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ color: '#475569' }}>Email Address</label>
                    <input type="email" value={personalInfo.email} onChange={e => setPersonalInfo({...personalInfo, email: e.target.value})} className="form-input" style={{ background: '#fff', color: '#0f172a' }} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ color: '#475569' }}>Phone Number</label>
                    <input type="text" value={personalInfo.phone} onChange={e => setPersonalInfo({...personalInfo, phone: e.target.value})} className="form-input" style={{ background: '#fff', color: '#0f172a' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ color: '#475569' }}>City / Location</label>
                    <input type="text" value={personalInfo.city} onChange={e => setPersonalInfo({...personalInfo, city: e.target.value})} className="form-input" style={{ background: '#fff', color: '#0f172a' }} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ color: '#475569' }}>LinkedIn URL</label>
                    <input type="text" value={personalInfo.linkedin} onChange={e => setPersonalInfo({...personalInfo, linkedin: e.target.value})} className="form-input" style={{ background: '#fff', color: '#0f172a' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ color: '#475569' }}>Portfolio URL</label>
                    <input type="text" value={personalInfo.portfolio} onChange={e => setPersonalInfo({...personalInfo, portfolio: e.target.value})} className="form-input" style={{ background: '#fff', color: '#0f172a' }} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ color: '#475569' }}>GitHub URL</label>
                    <input type="text" value={personalInfo.github} onChange={e => setPersonalInfo({...personalInfo, github: e.target.value})} className="form-input" style={{ background: '#fff', color: '#0f172a' }} />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SUMMARY */}
            {activeTab === 'summary' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0 }}>📝 Executive Summary & Objective</h3>
                  <button
                    onClick={handleGenerateSummary}
                    disabled={isGenerating}
                    className="btn"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem' }}
                  >
                    <Sparkles size={16} />
                    <span>{isGenerating ? 'Generating AI Summary...' : '⚡ Generate AI Summary'}</span>
                  </button>
                </div>
                <textarea
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  rows={6}
                  className="form-input"
                  style={{ width: '100%', padding: '16px', fontSize: '0.95rem', lineHeight: 1.6, resize: 'vertical', background: '#fff', color: '#0f172a' }}
                  placeholder="Enter your professional summary..."
                />
                <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                  <span style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.85rem' }}>💡 AI Recruiter Tip:</span>
                  <p style={{ color: '#475569', fontSize: '0.8rem', margin: '4px 0 0 0' }}>
                    Keep your summary between 3–4 sentences. Include your years of experience, core technical stack, and a quantifiable career achievement.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: EXPERIENCE */}
            {activeTab === 'experience' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0 }}>💼 Work & Project Experience</h3>
                  <button
                    onClick={() => setExperience([...experience, { company: 'New Company', role: 'Software Engineer', period: '2024 - Present', bullets: '• Developed key features...\n• Optimized system performance...' }])}
                    className="btn"
                    style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', padding: '8px 14px', fontSize: '0.85rem' }}
                  >
                    <Plus size={16} />
                    <span>Add Experience</span>
                  </button>
                </div>

                {experience.map((exp, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: '18px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr auto', gap: '12px', alignItems: 'center' }}>
                      <input type="text" value={exp.company} onChange={e => { const u = [...experience]; u[idx].company = e.target.value; setExperience(u); }} className="form-input" style={{ background: '#fff', color: '#0f172a' }} placeholder="Company / Project Name" />
                      <input type="text" value={exp.role} onChange={e => { const u = [...experience]; u[idx].role = e.target.value; setExperience(u); }} className="form-input" style={{ background: '#fff', color: '#0f172a' }} placeholder="Role / Title" />
                      <input type="text" value={exp.period} onChange={e => { const u = [...experience]; u[idx].period = e.target.value; setExperience(u); }} className="form-input" style={{ background: '#fff', color: '#0f172a' }} placeholder="2023 - 2024" />
                      <button onClick={() => setExperience(experience.filter((_, i) => i !== idx))} style={{ background: '#fef2f2', border: 'none', color: '#EF4444', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Bullet Points (Action Verb + Quantifiable Impact):</span>
                      <button
                        onClick={() => handlePolishBullet(idx)}
                        disabled={isGenerating}
                        style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Sparkles size={14} />
                        <span>⚡ AI Polish & Quantify Bullets</span>
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      value={exp.bullets}
                      onChange={e => { const u = [...experience]; u[idx].bullets = e.target.value; setExperience(u); }}
                      className="form-input"
                      style={{ width: '100%', padding: '12px', fontSize: '0.9rem', lineHeight: 1.5, background: '#fff', color: '#0f172a' }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: SKILLS */}
            {activeTab === 'skills' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0 }}>🛠️ Technical & Professional Skills</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Separate skills with commas. Our ATS engine will automatically format these into high-density keywords.</p>
                
                <textarea
                  rows={6}
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', padding: '16px', fontSize: '0.95rem', lineHeight: 1.6, background: '#fff', color: '#0f172a' }}
                  placeholder="C, C++, Java, Python, SQL Server, Git..."
                />

                <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: '12px', border: '1px solid #a7f3d0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.85rem' }}>🔥 Detected High-Value Keywords:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {skills.split(/,|\n/).filter(s => s.trim()).map((s, idx) => (
                      <span key={idx} style={{ background: '#10B981', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                        ✓ {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: EDUCATION */}
            {activeTab === 'education' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0 }}>🎓 Academic Background</h3>
                </div>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                    Format your education details cleanly. We recommend:<br/>
                    <strong>Degree — Institution Name (Year) | Score/CGPA</strong>
                  </p>
                  <textarea
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="form-input"
                    style={{ height: '220px', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.6, background: '#fff', color: '#0f172a' }}
                    placeholder={`BCA — College Name (2021) | 88%\nHSC — School Name (2018) | 81%`}
                  />
                </div>
              </div>
            )}

            {/* TAB 7: CERTIFICATIONS */}
            {activeTab === 'certifications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0 }}>📜 Certifications</h3>
                </div>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                    List your professional certifications and courses.<br/>
                    <strong>Certification Name — Issuer (Year)</strong>
                  </p>
                  <textarea
                    value={certifications}
                    onChange={(e) => setCertifications(e.target.value)}
                    className="form-input"
                    style={{ height: '220px', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.6, background: '#fff', color: '#0f172a' }}
                    placeholder={`AWS Certified Solutions Architect — Amazon (2023)\nReact Native Complete Guide — Udemy (2022)`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8fafc'
        }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Selected: <strong style={{ color: '#0f172a' }}>{allTemplates.find(t => t.id === selectedTemplate)?.name}</strong> ({accentColor})
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={onClose} className="btn" style={{ background: '#fff', color: '#0f172a', border: '1px solid #cbd5e1', padding: '10px 20px' }}>Close</button>
            <button onClick={handleSaveAll} className="btn btn-primary" style={{ background: '#10B981', color: '#fff', padding: '10px 24px', fontWeight: 700 }}>
              ✓ Save & Update Live Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
