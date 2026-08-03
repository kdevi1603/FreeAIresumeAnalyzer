import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Trash2, Check, Layout, Palette, User, FileText, Briefcase, Code, GraduationCap, ArrowRight, Upload, X, Image } from 'lucide-react';

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

  const [activeTab, setActiveTab] = useState('templates'); // 'templates' | 'personal' | 'summary' | 'experience' | 'skills'

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
      setSkills(resumeData.fixedSkills || resumeData.skillsFound?.map(s => s.skill).join(', ') || '');
    }
  }, [isOpen]);

  const [isGenerating, setIsGenerating] = useState(false);

  // Template options
  const templates = [
    { id: 'original', name: 'Original PDF', desc: 'Your original uploaded resume without changes.', icon: '📄' },
    { id: 'modern', name: 'Modern Professional', desc: 'Clean two-column layout. Best for IT, Software, Business.', icon: '🏢' },
    { id: 'minimalist', name: 'Minimal ATS', desc: 'Single-column design. Maximum ATS compatibility.', icon: '⚡' },
    { id: 'fresher', name: 'Fresher / Student', desc: 'Focus on education, skills, and projects. Suitable for fresh graduates.', icon: '🎓' },
    { id: 'software', name: 'Software Engineer', desc: 'Highlights technical skills. Includes GitHub, portfolio, certifications.', icon: '💻' },
    { id: 'executive', name: 'Executive', desc: 'Professional design. Emphasizes work experience and leadership.', icon: '💼' },
    { id: 'creative', name: 'Creative', desc: 'Modern colors and icons. Suitable for UI/UX, Graphic Design.', icon: '🎨' },
    { id: 'corporate', name: 'Corporate', desc: 'Formal business style. HR and management roles.', icon: '🏛️' },
    { id: 'academic', name: 'Academic', desc: 'For teachers, researchers. Includes publications and certifications.', icon: '📖' },
    { id: 'onepage', name: 'One-Page ATS', desc: 'Compact layout. Perfect for candidates with 0–5 years of experience.', icon: '📄' },
    { id: 'elegant', name: 'Elegant', desc: 'Premium-looking design. Simple and ATS compatible.', icon: '👑' }
  ];

  // Color options
  const colors = [
    { name: 'Royal Blue', value: '#2563EB', bg: 'bg-blue-600' },
    { name: 'Cyan Tech', value: '#06B6D4', bg: 'bg-cyan-500' },
    { name: 'Emerald Green', value: '#10B981', bg: 'bg-emerald-500' },
    { name: 'Purple Purple', value: '#8B5CF6', bg: 'bg-purple-500' },
    { name: 'Ruby Red', value: '#E11D48', bg: 'bg-rose-600' },
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
      fixedSummary: summary,
      education,
      experienceList: experience,
      fixedProjects: experience.map(e => `${e.company} (${e.role}) — ${e.bullets}`).join('\n\n'),
      fixedSkills: skills
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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  {templates.map(tmpl => (
                    <div
                      key={tmpl.id}
                      onClick={() => onSelectTemplate(tmpl.id)}
                      style={{
                        padding: '18px',
                        borderRadius: '16px',
                        background: selectedTemplate === tmpl.id ? '#e0f2fe' : '#f8fafc',
                        border: selectedTemplate === tmpl.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '1.8rem' }}>{tmpl.icon}</span>
                        {selectedTemplate === tmpl.id && (
                          <span style={{ background: '#2563eb', color: '#fff', padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800 }}>
                            ✓ ACTIVE
                          </span>
                        )}
                      </div>
                      <h4 style={{ color: '#0f172a', margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: 700 }}>{tmpl.name}</h4>
                      <p style={{ color: '#475569', fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>{tmpl.desc}</p>
                    </div>
                  ))}
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
                    {skills.split(',').map((s, idx) => s.trim() && (
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
            Selected: <strong style={{ color: '#0f172a' }}>{templates.find(t => t.id === selectedTemplate)?.name}</strong> ({accentColor})
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={onClose} className="btn" style={{ background: '#fff', color: '#0f172a', border: '1px solid #cbd5e1', padding: '10px 20px' }}>Cancel</button>
            <button onClick={handleSaveAll} className="btn btn-primary" style={{ background: '#10B981', color: '#fff', padding: '10px 24px', fontWeight: 700 }}>
              ✓ Save & Update Live Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
