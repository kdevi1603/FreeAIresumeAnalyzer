import React from 'react';
import { Mail, Phone, Linkedin, Github } from 'lucide-react';

export default function ResumeContentRenderer({ 
  resumeData, 
  templateStyle, 
  accentColor = '#2563EB', 
  showDiff = false,
  zoom = 100,
  contentEditable = false,
  onManualEdit = null
}) {
  const candidateName = resumeData?.personalInfo?.name === 'Untitled Resume' ? '' : (resumeData?.personalInfo?.name || resumeData?.fileName?.replace(/\.pdf$/i, '') || 'John Doe');
  const email = resumeData?.personalInfo?.email || 'john.doe@example.com';
  const phone = resumeData?.personalInfo?.phone || '+1 234 567 890';
  const city = resumeData?.personalInfo?.city || 'New York, NY';
  const linkedin = resumeData?.personalInfo?.linkedin || 'linkedin.com/in/johndoe';
  const github = resumeData?.personalInfo?.github || 'github.com/johndoe';
  const profilePicture = resumeData?.personalInfo?.profilePicture || null;
  const score = resumeData?.atsScore || 95;

  const ContactRow = ({ justify = 'flex-start', color, style = {} }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: justify, color: color || '#475569', ...style }}>
      {email && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12} /> {email}</span>}
      {phone && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {phone}</span>}
      {linkedin && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Linkedin size={12} /> {linkedin}</span>}
      {github && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Github size={12} /> {github}</span>}
    </div>
  );

  const summaryText = (showDiff && resumeData?.fixedSummary) ? resumeData.fixedSummary : (resumeData?.summary || 'Experienced professional with a track record of delivering high-quality results. Strong background in project management and team leadership. Passionate about leveraging technology to solve complex business problems.');
  
  let defaultProjects = "TechCorp Inc. - Senior Developer\n• Led the development of a scalable microservices architecture.\n• Improved system performance by 40% through optimization.\n\nWebSolutions LLC - Software Engineer\n• Built responsive web applications using React and Node.js.\n• Mentored junior developers and conducted code reviews.";
  
  const projectsText = (showDiff && resumeData?.fixedProjects) ? resumeData.fixedProjects : (resumeData?.experienceList?.length > 0 ? resumeData.experienceList.map(exp => {
    let header = '';
    const isPlaceholder = exp.company === 'Extracted Experience' || exp.company === 'Original Content';
    if (!isPlaceholder && exp.company) header += exp.company;
    if (exp.role) header += (header ? ' - ' : '') + exp.role;
    return header ? `${header}\n${exp.bullets}` : exp.bullets;
  }).join('\n\n') : defaultProjects);
  
  const skillsText = (showDiff && resumeData?.fixedSkills) ? resumeData.fixedSkills : (resumeData?.skills || resumeData?.skillsFound?.map(s => typeof s === 'string' ? s : s.skill).filter(Boolean).join(', ') || 'JavaScript, React, Node.js, Python, SQL, Git, Docker, Agile Methodologies');
  
  const educationText = (showDiff && resumeData?.fixedEducation) ? resumeData.fixedEducation : (resumeData?.education || 'Master of Science in Computer Science\nUniversity of Technology - 2020\n\nBachelor of Science in Information Technology\nState University - 2018');

  const getContrastColor = (hexcolor) => {
    if (!hexcolor) return '#ffffff';
    let hex = hexcolor.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    if (hex.length !== 6) return '#ffffff';
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128 ? '#0f172a' : '#ffffff';
  };

  const formatText = (text, mergeLines = true) => {
    if (!text) return null;
    const rawLines = String(text).split(/\r?\n/);
    const mergedLines = [];
    
    for (let line of rawLines) {
      const trimmed = line.trim();
      if (!trimmed) {
        mergedLines.push('');
        continue;
      }
      
      const isNewItem = /^([*\-•·➢>]|\d+\.)\s*/.test(trimmed);
      
      if (!mergeLines || isNewItem || mergedLines.length === 0 || mergedLines[mergedLines.length - 1] === '') {
        mergedLines.push(trimmed);
      } else {
        mergedLines[mergedLines.length - 1] += ' ' + trimmed;
      }
    }
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {mergedLines.map((line, i) => {
          if (!line) return <div key={i} style={{ height: '8px' }} />;
          
          const bulletMatch = line.match(/^([*\-•·➢>])\s*(.*)/);
          if (bulletMatch) {
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ flexShrink: 0, width: '12px', textAlign: 'center', fontSize: '14px', lineHeight: '1.4' }}>•</span>
                <span style={{ flex: 1, textAlign: 'left' }}>{bulletMatch[2]}</span>
              </div>
            );
          }
          return <div key={i} style={{ textAlign: 'left' }}>{line}</div>;
        })}
      </div>
    );
  };

  const sections = [
    { title: 'Executive Summary', content: formatText(summaryText, false), isModified: !!resumeData?.fixedSummary },
    { title: 'Work & Project Experience', content: formatText(projectsText), isModified: !!resumeData?.fixedProjects },
    { title: 'Education & Academic Details', content: formatText(educationText), isModified: !!resumeData?.fixedEducation },
    { title: 'Technical Skills & Tools', content: formatText(skillsText, false), isModified: !!resumeData?.fixedSkills },
    { title: 'Languages', content: 'Tamil (Native), English (Professional Working Proficiency)' }
  ].filter(sec => sec.content);

  return (
    <div className="a4-print-container" style={{
      transform: `scale(${zoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s ease',
      width: '794px', height: '1123px', overflow: 'hidden', backgroundColor: '#ffffff', color: '#1a1a1a',
      padding: (templateStyle === 'sidebar' || templateStyle === 'executive') ? '0' : '56px 56px',
      boxShadow: zoom < 100 ? 'none' : '0 20px 60px rgba(0,0,0,0.6)', 
      borderRadius: '4px',
      fontFamily: ['academic', 'corporate', 'serif'].includes(templateStyle) ? "'Times New Roman', serif"
        : ['minimalist', 'software'].includes(templateStyle) ? "'Courier New', monospace"
        : "'Inter', sans-serif",
      position: 'relative'
    }}
    contentEditable={contentEditable}
    suppressContentEditableWarning={true}
    spellCheck={true}
    onBlur={(e) => {
        if (contentEditable && onManualEdit) {
            onManualEdit(e.currentTarget.innerHTML);
        }
    }}>
      
      <style>{resumeData?.formattingCss || ''}</style>
      
      {/* 1. Modern Professional (formerly modern) */}
      {templateStyle === 'modern' && (
        <>
          <div style={{ borderBottom: `2px solid ${accentColor}`, paddingBottom: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>{candidateName.toUpperCase()}</h1>
              <ContactRow color="#475569" style={{ fontSize: '12px' }} />
            </div>
            {profilePicture && <img src={profilePicture} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {sections.map((sec, idx) => (
              <div key={idx}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: accentColor, borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', textTransform: 'uppercase' }}>{sec.title}</h3>
                <div style={{ fontSize: '12px', lineHeight: 1.8, color: '#334155', whiteSpace: 'pre-line', textAlign: 'justify' }}>{sec.content}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 2. Minimal ATS (formerly minimalist) */}
      {templateStyle === 'minimalist' && (
        <div style={{ borderLeft: `6px solid ${accentColor}`, paddingLeft: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.5px' }}>{candidateName}</h1>
              <ContactRow color="#64748b" style={{ fontSize: '11px', marginBottom: '24px' }} />
            </div>
            {profilePicture && <img src={profilePicture} style={{ width: '64px', height: '64px', objectFit: 'cover', border: `2px solid ${accentColor}` }} />}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {sections.map((sec, idx) => (
              <div key={idx}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' }}>
                  <span style={{ width: '8px', height: '8px', background: accentColor }} /> {sec.title}
                </h3>
                <div style={{ fontSize: '12px', lineHeight: 1.8, paddingLeft: '16px', whiteSpace: 'pre-line', textAlign: 'justify' }}>{sec.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Fresher / Student (Education First) */}
      {templateStyle === 'fresher' && (
        <>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            {profilePicture && <img src={profilePicture} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px', display: 'inline-block' }} />}
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: accentColor, margin: '0 0 5px 0' }}>{candidateName}</h1>
            <ContactRow justify="center" color="#475569" style={{ fontSize: '12px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {sections.map((sec, idx) => sec && (
              <div key={idx}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#111', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>{sec.title}</h3>
                <div style={{ fontSize: '12px', lineHeight: 1.8, color: '#334155', whiteSpace: 'pre-line', padding: '4px 8px', textAlign: 'justify' }}>{sec.content}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 4. Software Engineer */}
      {templateStyle === 'software' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: `2px solid ${accentColor}`, paddingBottom: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {profilePicture && <img src={profilePicture} style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }} />}
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>{candidateName}</h1>
                <span style={{ fontSize: '14px', color: accentColor, fontWeight: 700 }}>Software Engineer</span>
              </div>
            </div>
              <ContactRow justify="flex-end" color="#475569" style={{ fontSize: '11px', maxWidth: '300px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {sections.map((sec, idx) => (
              <div key={idx}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', display: 'inline-block', borderBottom: `2px solid ${accentColor}`, paddingBottom: '2px', marginBottom: '8px' }}>{'//'} {sec.title}</h3>
                <div style={{ fontSize: '12px', lineHeight: 1.8, color: '#334155', whiteSpace: 'pre-line' }}>{sec.content}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 5. Executive */}
      {templateStyle === 'executive' && (
        <div>
          <div style={{ background: '#0f172a', color: '#fff', padding: '40px 40px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 400, margin: '0 0 10px 0', letterSpacing: '2px', color: '#fff' }}>{candidateName.toUpperCase()}</h1>
              <ContactRow color="#94a3b8" style={{ fontSize: '12px' }} />
            </div>
            {profilePicture && <img src={profilePicture} style={{ width: '80px', height: '80px', objectFit: 'cover', border: '2px solid #fff' }} />}
          </div>
          <div style={{ padding: '30px 40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {sections.map((sec, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '32px' }}>
                <div style={{ width: '140px', flexShrink: 0 }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', textAlign: 'right' }}>{sec.title}</h3>
                </div>
                <div style={{ fontSize: '12px', lineHeight: 1.8, color: '#334155', whiteSpace: 'pre-line', flex: 1, borderLeft: '1px solid #e2e8f0', paddingLeft: '24px', textAlign: 'justify' }}>
                  {sec.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Creative */}
      {templateStyle === 'creative' && (
        <>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            {profilePicture ? (
              <img src={profilePicture} style={{ width: '80px', height: '80px', borderRadius: '40px', objectFit: 'cover', margin: '0 auto 16px', border: `3px solid ${accentColor}` }} />
            ) : (
              <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: accentColor, color: getContrastColor(accentColor), fontSize: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 800 }}>
                {candidateName.charAt(0)}
              </div>
            )}
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111', margin: '0 0 8px 0' }}>{candidateName}</h1>
            <ContactRow justify="center" color="#666" style={{ fontSize: '12px', background: '#f8fafc', padding: '8px 16px', borderRadius: '30px', display: 'inline-flex' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {sections.map((sec, idx) => sec && (
              <div key={idx} style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: idx % 2 !== 0 ? `1px solid ${accentColor}30` : 'none' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', marginBottom: '8px' }}>{sec.title}</h3>
                <div style={{ fontSize: '12px', lineHeight: 1.8, color: '#334155', whiteSpace: 'pre-line' }}>{sec.content}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 7. Corporate */}
      {templateStyle === 'corporate' && (
        <>
          <div style={{ borderBottom: '3px solid #1e293b', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#000', margin: 0, fontFamily: "'Times New Roman', serif" }}>{candidateName.toUpperCase()}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '11px', color: '#333', textAlign: 'right' }}>
                <div>{email}</div>
                <div>{phone}</div>
                <div>{linkedin}</div>
              </div>
              {profilePicture && <img src={profilePicture} style={{ width: '60px', height: '75px', objectFit: 'cover', border: '1px solid #1e293b' }} />}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {sections.map((sec, idx) => (
              <div key={idx}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', background: '#1e293b', padding: '4px 8px', textTransform: 'uppercase', marginBottom: '8px' }}>{sec.title}</h3>
                <div style={{ fontSize: '12px', lineHeight: 1.8, color: '#111', whiteSpace: 'pre-line', padding: '0 8px', textAlign: 'justify' }}>{sec.content}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 8. Academic (formerly serif) */}
      {templateStyle === 'academic' && (
        <div style={{ textAlign: 'center' }}>
          {profilePicture && <img src={profilePicture} style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px', display: 'inline-block', border: '2px solid #000' }} />}
          <h1 style={{ fontSize: '28px', fontWeight: 700, borderBottom: '1px solid #000', paddingBottom: '10px' }}>{candidateName.toUpperCase()}</h1>
          <div style={{ fontSize: '12px', color: '#333', marginTop: '8px' }}>{email} • {phone} • {city}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
            {sections.map((sec, idx) => (
              <div key={idx}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px', fontWeight: 700 }}>{sec.title}</h3>
                <div style={{ fontSize: '12px', textAlign: 'justify', whiteSpace: 'pre-line' }}>{sec.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. One-Page ATS */}
      {templateStyle === 'onepage' && (
        <>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              {profilePicture && <img src={profilePicture} style={{ width: '32px', height: '32px', borderRadius: '16px', objectFit: 'cover' }} />}
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#000', margin: 0 }}>{candidateName}</h1>
            </div>
            <div style={{ fontSize: '11px', color: '#444' }}>{email} | {phone} | {linkedin} | {github}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sections.map((sec, idx) => (
              <div key={idx}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', borderBottom: '1px solid #ccc', margin: '0 0 4px 0' }}>{sec.title}</h3>
                <div style={{ fontSize: '12px', lineHeight: 1.4, color: '#222', whiteSpace: 'pre-line', textAlign: 'justify' }}>{sec.content}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 10. Elegant */}
      {templateStyle === 'elegant' && (
        <div style={{ border: `1px solid ${accentColor}40`, padding: '30px', minHeight: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            {profilePicture && <img src={profilePicture} style={{ width: '64px', height: '64px', borderRadius: '32px', objectFit: 'cover', marginBottom: '16px', display: 'inline-block', border: `1px solid ${accentColor}` }} />}
            <h1 style={{ fontSize: '30px', fontWeight: 300, color: '#111', margin: '0 0 8px 0', letterSpacing: '4px', textTransform: 'uppercase' }}>{candidateName}</h1>
            <div style={{ width: '40px', height: '2px', background: accentColor, margin: '0 auto 12px' }} />
            <div style={{ fontSize: '11px', color: '#666', letterSpacing: '1px' }}>{email} • {phone} • {city}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {sections.map((sec, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>{sec.title}</h3>
                <div style={{ fontSize: '12px', lineHeight: 1.8, color: '#444', whiteSpace: 'pre-line', textAlign: 'justify' }}>{sec.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legacy sidebar alias for any previously selected sidebar template */}
      {templateStyle === 'sidebar' && (
        <div style={{ display: 'grid', gridTemplateColumns: '190px 1fr', minHeight: '842px' }}>
          <div style={{ background: accentColor, color: getContrastColor(accentColor), padding: '36px 20px' }}>
            <h2 style={{ fontSize: '18px' }}>{candidateName}</h2>
            <div style={{ fontSize: '10px', marginTop: '20px' }}>{email}<br/>{phone}</div>
          </div>
          <div style={{ padding: '36px 30px' }}>
            {sections.map((sec, idx) => (
              <div key={idx} style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: accentColor, textTransform: 'uppercase' }}>{sec.title}</h3>
                <p style={{ fontSize: '12px', whiteSpace: 'pre-line', textAlign: 'justify' }}>{sec.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {zoom >= 100 && (
        <div style={{ position: 'absolute', bottom: '15px', left: '40px', right: '40px', fontSize: '10px', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
          <span>Generated by AI Resume Analyzer</span>
          <span>Score: {score}/100</span>
        </div>
      )}
    </div>
  );
}
