import React, { useState } from 'react';
import { Search, MapPin, Briefcase, ExternalLink, X, FileText, ArrowRight, CheckCircle2, ChevronRight, DollarSign, LayoutGrid, Bookmark } from 'lucide-react';

export default function JobSearchBoard({ resumes = [], currentAnalysis }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(1);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [showMoreSources, setShowMoreSources] = useState(false);

  // Determine active resume
  const defaultResume = resumes.length > 0 ? resumes[0] : { id: 'dummy', title: 'Devi', jobTitle: 'Software Project Manager', education: 'B.Tech Computer Science' };
  
  let activeResume = defaultResume;
  if (selectedResumeId) {
    activeResume = resumes.find(r => r.id === selectedResumeId) || defaultResume;
  } else if (currentAnalysis && !currentAnalysis.isScratch) {
    activeResume = {
      id: currentAnalysis.id || 'current',
      title: currentAnalysis.fileName?.replace('.pdf', '') || currentAnalysis.personalInfo?.name || 'My Resume',
      jobTitle: currentAnalysis.personalInfo?.jobTitle || 'Software Engineer',
      education: currentAnalysis.education || 'Computer Science'
    };
  }

  const role = activeResume.jobTitle || 'Software Engineer';
  const edu = (activeResume.education || '').split('—')[0]?.trim() || 'Degree'; // simple parsing for dummy data
  
  const quickPrompts = [
    `${role} jobs in India`,
    `remote ${role} roles`,
    `${edu} fresher jobs`,
    `entry level ${role}`,
    `senior ${role} positions`,
    `jobs for ${edu} graduates`,
    `startup ${role} roles`,
    `contract ${role} openings`
  ];

  const handleSearch = (e, query = searchQuery) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    
    setSearchQuery(query);
    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate network delay
    setTimeout(() => {
      setIsSearching(false);
      setSelectedJobId(1);
    }, 1200);
  };

  const handleChooseResume = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResumeModalOpen(true);
  };

  const handleClearResume = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedResumeId(null);
  };

  // Dynamic Job Data based on search query
  const getDynamicJobs = (query) => {
    const baseTitle = query ? query.trim() : role;
    const titleCap = baseTitle.charAt(0).toUpperCase() + baseTitle.slice(1);
    
    return [
      { 
        id: 1, 
        role: `Senior ${titleCap} Role`, 
        company: 'TechNova', 
        location: 'Remote (Canada / Global)', 
        type: 'Full-time', 
        salary: '$120,000 - $160,000',
        match: '96%',
        posted: '2 hours ago',
        logo: 'T',
        description: `TechNova is seeking a Senior candidate for our ${titleCap} role to lead the end-to-end process for our core enterprise SaaS product. You will collaborate closely with engineering and product management to deliver intuitive, beautiful experiences.

**Key Responsibilities:**
- Lead complex workflows and projects.
- Conduct research and testing related to ${titleCap}.
- Maintain and evolve our systems.
- Mentor junior team members.

**Requirements:**
- Relevant degree or experience in ${titleCap}.
- 5+ years of industry experience.
- Strong portfolio showcasing complex problem solving.`,
        howToApply: `Please submit your application through our portal and ensure you include a link to your portfolio. We do not require a cover letter, but please ensure your resume highlights your ${titleCap} degree and experience.`,
        link: 'https://www.linkedin.com/jobs/'
      },
      { 
        id: 2, 
        role: `${titleCap} Specialist`, 
        company: 'PixelForge Studios', 
        location: 'Toronto, ON (Hybrid)', 
        type: 'Contract', 
        salary: '$80 - $100 / hr',
        match: '89%',
        posted: '1 day ago',
        logo: 'P',
        description: `PixelForge is looking for a versatile ${titleCap} Specialist to help us overhaul our experience. This is a 6-month contract with the possibility of extension.`,
        howToApply: `Send your resume and portfolio directly to careers@pixelforge.io. Make sure to mention your ${titleCap} background in the subject line.`,
        link: 'https://www.indeed.com/'
      },
      { 
        id: 3, 
        role: `Entry Level ${titleCap}`, 
        company: 'DataFlow Inc.', 
        location: 'Remote (US)', 
        type: 'Full-time', 
        salary: '$80,000 - $110,000',
        match: '82%',
        posted: '3 days ago',
        logo: 'D',
        description: `DataFlow needs an Entry Level ${titleCap} to establish our practices from the ground up while staying hands-on with the team.`,
        howToApply: `Apply via our Workable page. Applicants must be eligible to work in the United States and hold a valid degree in ${titleCap} or related fields.`,
        link: 'https://www.glassdoor.com/Job/'
      }
    ];
  };

  const mockJobs = getDynamicJobs(searchQuery);
  const selectedJob = mockJobs.find(j => j.id === selectedJobId) || mockJobs[0];

  return (
    <div style={{ minHeight: '100%', backgroundColor: 'var(--bg-dark)', margin: 0, padding: 0, fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Search Hero State (Default) */}
      {!hasSearched && (
        <div style={{ 
          minHeight: '85vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'var(--bg-card)',
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>AI JOB SEARCH</span>
            <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-warning)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              ⚡ BETA
            </span>
          </div>

          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1, maxWidth: '800px', marginBottom: '40px', letterSpacing: '-0.02em' }}>
            Describe your ideal role. We will find it from:
          </h1>

          {/* Platform Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', maxWidth: '800px', marginBottom: '60px' }}>
            <Badge text="indeed" color="#2563eb" bg="#dbeafe" font="Times New Roman, serif" href="https://www.indeed.com" />
            <Badge text="LinkedIn" color="#1e40af" bg="#e0e7ff" font="Arial, sans-serif" href="https://www.linkedin.com/jobs" />
            <Badge text="seek" color="#1e3a8a" bg="#dbeafe" icon href="https://www.seek.com.au" />
            <Badge text="workable" color="#065f46" bg="#d1fae5" font="monospace" href="https://www.workable.com" />
            <Badge text="greenhouse" color="#10b981" bg="#ecfdf5" href="https://www.greenhouse.io" />
            <Badge text="naukri" color="#3b82f6" bg="#eff6ff" href="https://www.naukri.com" />
            <Badge text="GLASSDOOR" color="#16a34a" bg="#dcfce7" font="Impact, sans-serif" href="https://www.glassdoor.com" />
            
            {showMoreSources && (
              <>
                <Badge text="Monster" color="#6b21a8" bg="#f3e8ff" font="Arial, sans-serif" href="https://www.monster.com" />
                <Badge text="ZipRecruiter" color="#166534" bg="#dcfce7" href="https://www.ziprecruiter.com" />
                <Badge text="Dice" color="#dc2626" bg="#fee2e2" font="monospace" href="https://www.dice.com" />
                <Badge text="Wellfound" color="#1e3a8a" bg="#dbeafe" href="https://wellfound.com" />
                <Badge text="SimplyHired" color="#0f766e" bg="#ccfbf1" href="https://www.simplyhired.com" />
                <Badge text="Y Combinator" color="#ea580c" bg="#ffedd5" href="https://www.ycombinator.com/jobs" />
                <Badge text="FlexJobs" color="#0369a1" bg="#e0f2fe" href="https://www.flexjobs.com" />
                <Badge text="Remote.co" color="#4f46e5" bg="#e0e7ff" href="https://remote.co" />
              </>
            )}

            <button 
              onClick={() => setShowMoreSources(!showMoreSources)}
              style={{ backgroundColor: 'var(--text-main)', color: 'var(--bg-dark)', border: 'none', padding: '8px 16px', borderRadius: '24px', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'opacity 0.2s' }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              <LayoutGrid size={14} /> {showMoreSources ? '- show less sources' : '+ 8 more sources'}
            </button>
          </div>

          {/* Search Bar Container */}
          <form onSubmit={handleSearch} style={{ 
            width: '100%', maxWidth: '900px', backgroundColor: 'var(--bg-card-hover)', borderRadius: '20px', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)', padding: '12px 12px 12px 24px',
            display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px',
            border: '1px solid var(--border-color)'
          }}>
            <Search size={22} color="var(--text-muted)" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., remote product designer in cana" 
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '1.2rem', color: 'var(--text-main)' }}
            />
            

            <button type="submit" style={{ 
              backgroundColor: 'var(--accent-blue)', color: '#ffffff', border: 'none', borderRadius: '14px', 
              padding: '16px 32px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s'
            }}>
              Search <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick Prompts */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', maxWidth: '900px' }}>
            {quickPrompts.map((prompt, idx) => (
              <button 
                key={idx} 
                onClick={() => handleSearch(null, prompt)}
                style={{ 
                  backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(4px)',
                  border: '1px solid var(--border-color)', borderRadius: '24px', padding: '8px 16px',
                  fontSize: '0.85rem', color: 'var(--text-main)', cursor: 'pointer', transition: 'all 0.2s',
                  fontWeight: 500
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

        </div>
      )}

      {/* Search Results State */}
      {hasSearched && (
        <div className="job-search-layout" style={{ backgroundColor: 'var(--bg-dark)' }}>
          
          {/* Left Panel: Job List */}
          <div className="job-search-list" style={{ borderRight: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', display: 'flex', flexDirection: 'column' }}>
            
            {/* Small Search Bar inside Results */}
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <button onClick={() => setHasSearched(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Search Results</h2>
              </div>
              <form onSubmit={handleSearch} style={{ position: 'relative' }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', fontSize: '0.95rem', boxSizing: 'border-box', outlineColor: 'var(--accent-blue)' }}
                />
              </form>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              {isSearching ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <div className="spinner" style={{ width: '30px', height: '30px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-blue)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                  <p>Searching thousands of jobs...</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {mockJobs.map(job => (
                    <div 
                      key={job.id} 
                      onClick={() => setSelectedJobId(job.id)}
                      style={{ 
                        padding: '20px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s',
                        border: selectedJobId === job.id ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
                        backgroundColor: selectedJobId === job.id ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-card-hover)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--bg-dark)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {job.logo}
                        </div>
                        <div style={{ backgroundColor: 'rgba(21, 128, 61, 0.2)', color: 'var(--accent-green)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                          Match {job.match}
                        </div>
                      </div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px 0' }}>{job.role}</h3>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>{job.company}</p>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--bg-dark)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                          <MapPin size={12} /> {job.location}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--bg-dark)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                          <Briefcase size={12} /> {job.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Job Details */}
          <div className="job-search-details" style={{ overflowY: 'auto', padding: '32px' }}>
            {!isSearching && selectedJob && (
              <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                
                {/* Header */}
                <div style={{ padding: '40px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card-hover)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--bg-dark)', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {selectedJob.logo}
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button style={{ width: '44px', height: '44px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s' }}>
                        <Bookmark size={20} />
                      </button>
                    </div>
                  </div>

                  <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 8px 0' }}>{selectedJob.role}</h1>
                  <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '24px' }}>{selectedJob.company}</div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', color: 'var(--text-main)', backgroundColor: 'var(--bg-dark)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontWeight: 500 }}>
                      <MapPin size={16} color="var(--text-muted)" /> {selectedJob.location}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', color: 'var(--text-main)', backgroundColor: 'var(--bg-dark)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontWeight: 500 }}>
                      <Briefcase size={16} color="var(--text-muted)" /> {selectedJob.type}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', color: 'var(--text-main)', backgroundColor: 'var(--bg-dark)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontWeight: 500 }}>
                      <DollarSign size={16} color="var(--text-muted)" /> {selectedJob.salary}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                  
                  {/* Description Section */}
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 16px 0' }}>Job Description</h3>
                    <div style={{ fontSize: '1rem', color: 'var(--text-main)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                      {selectedJob.description}
                    </div>
                  </div>

                  {/* How to Apply Section */}
                  <div style={{ backgroundColor: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '16px', padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ backgroundColor: 'var(--accent-blue)', color: '#ffffff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle2 size={20} />
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>How to Apply</h3>
                    </div>
                    <div style={{ fontSize: '1rem', color: 'var(--accent-blue)', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: '32px' }}>
                      {selectedJob.howToApply}
                    </div>
                    <button 
                      onClick={() => window.open(selectedJob.link, '_blank')}
                      style={{ 
                        backgroundColor: 'var(--accent-blue)', color: '#ffffff', border: 'none', borderRadius: '12px',
                        padding: '16px 32px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s',
                        width: '100%', justifyContent: 'center'
                      }}
                    >
                      Apply on Website <ExternalLink size={20} />
                    </button>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Select Resume Modal */}
      {isResumeModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '32px', width: '400px', maxWidth: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Select Resume to Match</h3>
              <button onClick={() => setIsResumeModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {resumes.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-dark)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  No resumes found. Please create one first!
                </div>
              ) : (
                resumes.map(r => (
                  <div 
                    key={r.id} 
                    onClick={() => { setSelectedResumeId(r.id); setIsResumeModalOpen(false); }}
                    style={{ 
                      padding: '16px', borderRadius: '12px', cursor: 'pointer', 
                      border: activeResume.id === r.id ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
                      backgroundColor: activeResume.id === r.id ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-dark)',
                      display: 'flex', alignItems: 'center', gap: '12px'
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--bg-card-hover)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{r.title}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{r.jobTitle}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const Badge = ({ text, color, bg, font, icon, href }) => (
  <a 
    href={href || '#'}
    target={href ? "_blank" : undefined}
    rel={href ? "noopener noreferrer" : undefined}
    style={{ 
      backgroundColor: bg, color: color, padding: '8px 16px', borderRadius: '24px', 
      fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px',
      fontFamily: font || 'inherit', textDecoration: 'none', cursor: 'pointer', transition: 'transform 0.2s'
    }}
    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
    onMouseOut={e => e.currentTarget.style.transform = 'none'}
  >
    {icon && <div style={{ width: '12px', height: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
      <div style={{ backgroundColor: color }} /><div style={{ backgroundColor: color }} />
      <div style={{ backgroundColor: color }} /><div style={{ backgroundColor: color }} />
    </div>}
    {text}
  </a>
);
