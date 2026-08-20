import React from 'react';
import { Mail, Phone, Linkedin, Github } from 'lucide-react';

export default function ResumeContentRenderer({ 
  resumeData: originalResumeData, 
  templateStyle, 
  accentColor = '#2563EB', 
  showDiff = false,
  zoom = 100,
  contentEditable = false,
  onManualEdit = null,
  customTemplateHtml = null
}) {
  const hasStructuredData = Boolean(
    originalResumeData?.summary || 
    originalResumeData?.education || 
    originalResumeData?.skills || 
    (originalResumeData?.experienceList && originalResumeData.experienceList.length > 0)
  );

  const resumeData = {
    ...originalResumeData,
    summary: hasStructuredData ? originalResumeData?.summary : (originalResumeData?.rawText || originalResumeData?.summary)
  };

  const candidateName = resumeData?.personalInfo?.name === 'Untitled Resume' ? '' : (resumeData?.personalInfo?.name || resumeData?.fileName?.replace(/\.pdf$/i, '')?.replace(/-/g, ' ')?.replace(/_/g, ' ') || '');
  const rawText = String(resumeData?.rawText || resumeData?.summary || '');
  
  let email = resumeData?.personalInfo?.email || '';
  if (!email && rawText) {
    const emailMatch = rawText.match(/[a-zA-Z0-9._-]+(?:\s*)?@(?:\s*)?[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/i);
    if (emailMatch) email = emailMatch[0].replace(/\s+/g, '');
  }

  let phone = resumeData?.personalInfo?.phone || '';
  if (!phone && rawText) {
    const phoneMatch = rawText.match(/(?:\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/);
    if (phoneMatch) phone = phoneMatch[0];
  }

  const city = resumeData?.personalInfo?.city || '';
  
  let linkedin = resumeData?.personalInfo?.linkedin ? String(resumeData.personalInfo.linkedin) : '';
  if (!linkedin && rawText) {
    const liMatch = rawText.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
    if (liMatch) linkedin = liMatch[0];
  }

  let github = resumeData?.personalInfo?.github ? String(resumeData.personalInfo.github) : '';
  if (!github && rawText) {
    const ghMatch = rawText.match(/github\.com\/[a-zA-Z0-9_-]+/i);
    if (ghMatch) github = ghMatch[0];
  }
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

    const isDemoName = originalResumeData?.personalInfo?.name === 'Parsed Resume' || originalResumeData?.personalInfo?.name === 'Untitled Resume';
  const mName = String(isDemoName ? (originalResumeData?.fileName?.replace(/\.pdf$/i, '') || '') : (originalResumeData?.personalInfo?.name || candidateName || ''));
  const mJobTitle = originalResumeData?.personalInfo?.jobTitle || '';
  const mEmail = email; 
  const mPhone = phone; 
  const mCity = city; 
  const mLinkedin = String(linkedin || ''); 
  const mGithub = String(github || ''); 

  let mSummary = (showDiff && originalResumeData?.fixedSummary) ? originalResumeData.fixedSummary : originalResumeData?.summary;
  if (mSummary === '...') mSummary = '';

  const mEducation = (showDiff && originalResumeData?.fixedEducation) ? originalResumeData.fixedEducation : originalResumeData?.education;
  
  let mSkills = (showDiff && originalResumeData?.fixedSkills) ? originalResumeData.fixedSkills : (originalResumeData?.skills || (Array.isArray(originalResumeData?.skillsFound) ? originalResumeData.skillsFound.map(s => typeof s === 'string' ? s : s.skill).filter(Boolean).join(', ') : '') || '');
  if (mSkills === 'Communication, Problem Solving, Project Management, Teamwork, Data Analysis') mSkills = '';

  const mCertifications = (showDiff && originalResumeData?.fixedCertifications) ? originalResumeData.fixedCertifications : originalResumeData?.certifications;
  const mLanguages = (showDiff && originalResumeData?.fixedLanguages) ? originalResumeData.fixedLanguages : (originalResumeData?.languages || originalResumeData?.personalInfo?.languages || '');
  const mAchievements = (showDiff && originalResumeData?.fixedAchievements) ? originalResumeData.fixedAchievements : originalResumeData?.achievements;

  const mProjects = (showDiff && originalResumeData?.fixedProjects) ? originalResumeData.fixedProjects : (Array.isArray(originalResumeData?.experienceList) && originalResumeData.experienceList.length > 0 ? originalResumeData.experienceList.map(exp => {
    let header = '';
    const isPlaceholder = exp.company === 'Extracted Experience' || exp.company === 'Original Content' || exp.company === 'Resume Experience Section';
    if (!isPlaceholder && exp.company) header += exp.company;
    if (exp.role) header += (header ? ' - ' : '') + exp.role;
    return header ? header + '\n' + exp.bullets : exp.bullets;
  }).join('\n\n') : null);

  const hasContact = mEmail || mPhone || mCity || mLinkedin || mGithub;

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
    { title: 'Executive Summary', content: formatText(mSummary, false), isModified: !!originalResumeData?.fixedSummary },
    { title: 'Work & Project Experience', content: formatText(mProjects, false), isModified: !!originalResumeData?.fixedProjects },
    { title: 'Education & Academic Details', content: formatText(mEducation, false), isModified: !!originalResumeData?.fixedEducation },
    { title: 'Certifications', content: formatText(mCertifications, false), isModified: !!originalResumeData?.fixedCertifications },
    { title: 'Achievements', content: formatText(mAchievements, false), isModified: !!originalResumeData?.fixedAchievements },
    { title: 'Technical Skills & Tools', content: formatText(mSkills, false), isModified: !!originalResumeData?.fixedSkills },
    { title: 'Languages', content: formatText(mLanguages, false), isModified: !!originalResumeData?.fixedLanguages }
  ].filter(sec => sec.content);

  return (
    <div className="a4-print-container" style={{
      zoom: `${zoom}%`,
      width: '794px', minHeight: '1123px', backgroundColor: '#ffffff', color: '#1a1a1a',
      padding: (templateStyle === 'sidebar' || templateStyle === 'executive' || templateStyle === 'modern' || templateStyle === 'fresher' || templateStyle === 'corporate' || templateStyle === 'creative' || templateStyle === 'onepage') ? '0' : '56px 56px',
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
      
      {customTemplateHtml ? (
         <div dangerouslySetInnerHTML={{ 
             __html: customTemplateHtml
                 .replace(/{{name}}/g, candidateName)
                 .replace(/{{email}}/g, email)
                 .replace(/{{phone}}/g, phone)
                 .replace(/{{jobTitle}}/g, resumeData?.personalInfo?.jobTitle || '') 
         }} />
      ) : (
      <>
      {/* 1. Modern Professional (formerly modern) */}
      {templateStyle === 'modern' && (
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100%', width: '100%' }}>
          {/* Left Sidebar */}
          <div style={{ background: '#f8fafc', padding: '40px 30px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {profilePicture && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={profilePicture} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accentColor}` }} />
              </div>
            )}
            
            {hasContact && (
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: 800, color: accentColor, borderBottom: '2px solid #e2e8f0', paddingBottom: '6px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '11px', color: '#475569' }}>
                  {mEmail && <span style={{ display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-all' }}><Mail size={14} style={{ color: accentColor }} /> {mEmail}</span>}
                  {mPhone && <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} style={{ color: accentColor }} /> {mPhone}</span>}
                  {mCity && <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    {mCity}
                  </span>}
                  {mLinkedin && <span style={{ display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-all' }}><Linkedin size={14} style={{ color: accentColor }} /> {mLinkedin.replace('https://', '')}</span>}
                  {mGithub && <span style={{ display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-all' }}><Github size={14} style={{ color: accentColor }} /> {mGithub.replace('https://', '')}</span>}
                </div>
              </div>
            )}

            {mSkills && (
               <div>
                 <h3 style={{ fontSize: '13px', fontWeight: 800, color: accentColor, borderBottom: '2px solid #e2e8f0', paddingBottom: '6px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skills</h3>
                 <div style={{ fontSize: '11px', lineHeight: 1.6, color: '#334155' }}>
                   {formatText(mSkills, false)}
                 </div>
               </div>
            )}

            {mLanguages && (
              <div>
                 <h3 style={{ fontSize: '13px', fontWeight: 800, color: accentColor, borderBottom: '2px solid #e2e8f0', paddingBottom: '6px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Languages</h3>
                 <div style={{ fontSize: '11px', lineHeight: 1.6, color: '#334155' }}>
                   {formatText(mLanguages, false)}
                 </div>
              </div>
            )}
          </div>

          {/* Right Main Content */}
          <div style={{ padding: '40px 48px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
             <div style={{ borderBottom: `3px solid ${accentColor}`, paddingBottom: '20px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{mName.toUpperCase()}</h1>
                {mJobTitle && <h2 style={{ fontSize: '18px', color: accentColor, margin: 0, fontWeight: 700, letterSpacing: '0.02em' }}>{mJobTitle}</h2>}
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
               {mSummary && (
                 <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '10px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: accentColor }} /> Executive Summary
                    </h3>
                    <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#334155', textAlign: 'justify' }}>
                      {formatText(mSummary, false)}
                    </div>
                 </div>
               )}

               {mProjects && (
                 <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '10px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: accentColor }} /> Experience
                    </h3>
                    <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#334155', textAlign: 'justify' }}>
                      {formatText(mProjects)}
                    </div>
                 </div>
               )}

               {mEducation && (
                 <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '10px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: accentColor }} /> Education
                    </h3>
                    <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#334155', textAlign: 'justify' }}>
                      {formatText(mEducation)}
                    </div>
                 </div>
               )}

               {mCertifications && (
                 <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '10px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: accentColor }} /> Certifications
                    </h3>
                    <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#334155', textAlign: 'justify' }}>
                      {formatText(mCertifications)}
                    </div>
                 </div>
               )}

               {mAchievements && (
                 <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', marginBottom: '12px', borderBottom: '2px solid #e2e8f0', paddingBottom: '6px' }}>
                       Achievements
                    </h3>
                    <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#334155', textAlign: 'justify' }}>
                      {formatText(mAchievements)}
                    </div>
                 </div>
               )}
             </div>
          </div>
        </div>
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
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100%', width: '100%' }}>
            {/* Left Sidebar */}
            <div style={{ background: '#f8fafc', padding: '40px 24px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {profilePicture && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img src={profilePicture} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }} />
                </div>
              )}
              
              {hasContact && (
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#111', marginBottom: '12px', borderBottom: '2px solid #e2e8f0', paddingBottom: '6px' }}>Contact</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11px', color: '#475569' }}>
                    {mEmail && <span style={{ display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-all' }}><Mail size={14} style={{ color: accentColor }} /> {mEmail}</span>}
                    {mPhone && <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} style={{ color: accentColor }} /> {mPhone}</span>}
                    {mCity && <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> {mCity}</span>}
                    {mLinkedin && <span style={{ display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-all' }}><Linkedin size={14} style={{ color: accentColor }} /> {mLinkedin.replace('https://', '')}</span>}
                    {mGithub && <span style={{ display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-all' }}><Github size={14} style={{ color: accentColor }} /> {mGithub.replace('https://', '')}</span>}
                  </div>
                </div>
              )}

              {mSkills && (
                 <div>
                   <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#111', marginBottom: '12px', borderBottom: '2px solid #e2e8f0', paddingBottom: '6px' }}>Skills</h3>
                   <div style={{ fontSize: '11px', lineHeight: 1.6, color: '#334155' }}>{formatText(mSkills, false)}</div>
                 </div>
              )}

              {mLanguages && (
                <div>
                   <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#111', marginBottom: '12px', borderBottom: '2px solid #e2e8f0', paddingBottom: '6px' }}>Languages</h3>
                   <div style={{ fontSize: '11px', lineHeight: 1.6, color: '#334155' }}>{formatText(mLanguages, false)}</div>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ borderBottom: `2px solid ${accentColor}`, paddingBottom: '16px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111', margin: '0 0 8px 0' }}>{mName}</h1>
                {mJobTitle && <h2 style={{ fontSize: '18px', color: '#334155', margin: 0, fontWeight: 600 }}>{mJobTitle}</h2>}
              </div>

              {mSummary && (
                <div>
                   <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#111', background: '#f1f5f9', padding: '6px 10px', borderRadius: '4px', textTransform: 'uppercase', marginBottom: '10px' }}>Career Objective</h3>
                   <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#334155', textAlign: 'justify' }}>{formatText(mSummary, false)}</div>
                </div>
              )}

              {/* Education First for Fresher */}
              {mEducation && (
                <div>
                   <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#111', background: '#f1f5f9', padding: '6px 10px', borderRadius: '4px', textTransform: 'uppercase', marginBottom: '10px' }}>Education</h3>
                   <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#334155', textAlign: 'justify' }}>{formatText(mEducation)}</div>
                </div>
              )}

              {mCertifications && (
                <div>
                   <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#111', background: '#f1f5f9', padding: '6px 10px', borderRadius: '4px', textTransform: 'uppercase', marginBottom: '10px' }}>Certifications</h3>
                   <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#334155', textAlign: 'justify' }}>{formatText(mCertifications)}</div>
                </div>
              )}

              {mAchievements && (
                <div>
                   <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#111', background: '#f1f5f9', padding: '6px 10px', borderRadius: '4px', textTransform: 'uppercase', marginBottom: '10px' }}>Achievements</h3>
                   <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#334155', textAlign: 'justify' }}>{formatText(mAchievements)}</div>
                </div>
              )}

              {mProjects && (
                <div>
                   <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#111', background: '#f1f5f9', padding: '6px 10px', borderRadius: '4px', textTransform: 'uppercase', marginBottom: '10px' }}>Projects & Experience</h3>
                   <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#334155', textAlign: 'justify' }}>{formatText(mProjects)}</div>
                </div>
              )}
            </div>
          </div>
        )}

      {/* 4. Software Engineer */}
      {templateStyle === 'software' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: `2px solid ${accentColor}`, paddingBottom: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {profilePicture && <img src={profilePicture} style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }} />}
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>{candidateName}</h1>
                {resumeData?.personalInfo?.jobTitle && <span style={{ fontSize: '14px', color: accentColor, fontWeight: 700 }}>{resumeData.personalInfo.jobTitle}</span>}
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
                <h1 style={{ fontSize: '32px', fontWeight: 400, margin: '0 0 10px 0', letterSpacing: '2px', color: '#fff' }}>{(mName || candidateName).toUpperCase()}</h1>
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
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100%', width: '100%' }}>
            {/* Left Sidebar */}
            <div style={{ background: `${accentColor}10`, padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div style={{ textAlign: 'center' }}>
                {profilePicture ? (
                  <img src={profilePicture} style={{ width: '120px', height: '120px', borderRadius: '40px', objectFit: 'cover', margin: '0 auto 16px', border: `3px solid ${accentColor}` }} />
                ) : (
                  <div style={{ width: '120px', height: '120px', borderRadius: '40px', background: accentColor, color: getContrastColor(accentColor), fontSize: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 800 }}>
                    {mName ? mName.charAt(0).toUpperCase() : 'C'}
                  </div>
                )}
                <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#111', margin: '0 0 4px 0', lineHeight: 1.1 }}>{mName}</h1>
                {mJobTitle && <h2 style={{ fontSize: '13px', color: accentColor, margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{mJobTitle}</h2>}
              </div>
              
              {hasContact && (
                <div>
                  <h3 style={{ fontSize: '13px', fontWeight: 900, color: accentColor, borderBottom: `2px solid ${accentColor}30`, paddingBottom: '6px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '2px' }}>Contact</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '11px', color: '#475569' }}>
                    {mEmail && <span style={{ display: 'flex', alignItems: 'center', gap: '12px', wordBreak: 'break-all' }}><Mail size={16} style={{ color: accentColor }} /> {mEmail}</span>}
                    {mPhone && <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Phone size={16} style={{ color: accentColor }} /> {mPhone}</span>}
                    {mCity && <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> {mCity}</span>}
                    {mLinkedin && <span style={{ display: 'flex', alignItems: 'center', gap: '12px', wordBreak: 'break-all' }}><Linkedin size={16} style={{ color: accentColor }} /> {mLinkedin.replace('https://', '')}</span>}
                    {mGithub && <span style={{ display: 'flex', alignItems: 'center', gap: '12px', wordBreak: 'break-all' }}><Github size={16} style={{ color: accentColor }} /> {mGithub.replace('https://', '')}</span>}
                  </div>
                </div>
              )}

              {mSkills && (
                 <div>
                   <h3 style={{ fontSize: '13px', fontWeight: 900, color: accentColor, borderBottom: `2px solid ${accentColor}30`, paddingBottom: '6px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '2px' }}>Skills</h3>
                   <div style={{ fontSize: '11px', lineHeight: 1.6, color: '#334155' }}>{formatText(mSkills, false)}</div>
                 </div>
              )}
              
              {mLanguages && (
                 <div>
                   <h3 style={{ fontSize: '13px', fontWeight: 900, color: accentColor, borderBottom: `2px solid ${accentColor}30`, paddingBottom: '6px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '2px' }}>Languages</h3>
                   <div style={{ fontSize: '11px', lineHeight: 1.6, color: '#334155' }}>{formatText(mLanguages, false)}</div>
                 </div>
              )}
            </div>

            {/* Main Content */}
            <div style={{ padding: '40px 48px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {mSummary && (
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: `1px solid ${accentColor}30` }}>
                   <h3 style={{ fontSize: '14px', fontWeight: 900, color: accentColor, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Profile</h3>
                   <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#334155', textAlign: 'justify' }}>{formatText(mSummary, false)}</div>
                </div>
              )}

              {mProjects && (
                <div style={{ background: '#fff', padding: '10px 0' }}>
                   <h3 style={{ fontSize: '14px', fontWeight: 900, color: accentColor, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>Experience</h3>
                   <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#334155', textAlign: 'justify' }}>{formatText(mProjects)}</div>
                </div>
              )}

              {mEducation && (
                <div style={{ background: '#fff', padding: '10px 0' }}>
                   <h3 style={{ fontSize: '14px', fontWeight: 900, color: accentColor, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>Education</h3>
                   <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#334155', textAlign: 'justify' }}>{formatText(mEducation)}</div>
                </div>
              )}

              {mCertifications && (
                <div style={{ background: '#fff', padding: '10px 0' }}>
                   <h3 style={{ fontSize: '14px', fontWeight: 900, color: accentColor, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>Certifications</h3>
                   <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#334155', textAlign: 'justify' }}>{formatText(mCertifications)}</div>
                </div>
              )}

              {mAchievements && (
                <div style={{ background: '#fff', padding: '10px 0' }}>
                   <h3 style={{ fontSize: '14px', fontWeight: 900, color: accentColor, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>Achievements</h3>
                   <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#334155', textAlign: 'justify' }}>{formatText(mAchievements)}</div>
                </div>
              )}
            </div>
          </div>
        )}

      {/* 7. Corporate */}
      {templateStyle === 'corporate' && (
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100%', width: '100%' }}>
            {/* Left Sidebar */}
            <div style={{ background: '#1e293b', color: '#f8fafc', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {profilePicture && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img src={profilePicture} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #334155' }} />
                </div>
              )}
              
              {hasContact && (
                <div>
                  <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#94a3b8', borderBottom: '1px solid #334155', paddingBottom: '8px', marginBottom: '16px', textTransform: 'uppercase' }}>Contact</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '11px', color: '#cbd5e1' }}>
                    {mEmail && <span style={{ display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-all' }}><Mail size={14} style={{ color: '#94a3b8' }} /> {mEmail}</span>}
                    {mPhone && <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} style={{ color: '#94a3b8' }} /> {mPhone}</span>}
                    {mCity && <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> {mCity}</span>}
                    {mLinkedin && <span style={{ display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-all' }}><Linkedin size={14} style={{ color: '#94a3b8' }} /> {mLinkedin.replace('https://', '')}</span>}
                    {mGithub && <span style={{ display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-all' }}><Github size={14} style={{ color: '#94a3b8' }} /> {mGithub.replace('https://', '')}</span>}
                  </div>
                </div>
              )}

              {mSkills && (
                 <div>
                   <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#94a3b8', borderBottom: '1px solid #334155', paddingBottom: '8px', marginBottom: '16px', textTransform: 'uppercase' }}>Expertise</h3>
                   <div style={{ fontSize: '11px', lineHeight: 1.6, color: '#cbd5e1' }}>{formatText(mSkills, false)}</div>
                 </div>
              )}

              {mLanguages && (
                <div>
                   <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#94a3b8', borderBottom: '1px solid #334155', paddingBottom: '8px', marginBottom: '16px', textTransform: 'uppercase' }}>Languages</h3>
                   <div style={{ fontSize: '11px', lineHeight: 1.6, color: '#cbd5e1' }}>{formatText(mLanguages, false)}</div>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div style={{ borderBottom: '3px solid #1e293b', paddingBottom: '20px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#1e293b', margin: '0 0 8px 0', fontFamily: "'Times New Roman', serif" }}>{mName.toUpperCase()}</h1>
                {mJobTitle && <h2 style={{ fontSize: '18px', color: '#475569', margin: 0, fontWeight: 600 }}>{mJobTitle}</h2>}
              </div>

              {mSummary && (
                <div>
                   <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', background: '#1e293b', padding: '4px 8px', textTransform: 'uppercase', marginBottom: '12px', display: 'inline-block' }}>Professional Summary</h3>
                   <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#334155', textAlign: 'justify' }}>{formatText(mSummary, false)}</div>
                </div>
              )}

              {mProjects && (
                <div>
                   <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', background: '#1e293b', padding: '4px 8px', textTransform: 'uppercase', marginBottom: '12px', display: 'inline-block' }}>Experience</h3>
                   <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#334155', textAlign: 'justify' }}>{formatText(mProjects)}</div>
                </div>
              )}

              {mEducation && (
                <div>
                   <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', background: '#1e293b', padding: '4px 8px', textTransform: 'uppercase', marginBottom: '12px', display: 'inline-block' }}>Education</h3>
                   <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#334155', textAlign: 'justify' }}>{formatText(mEducation)}</div>
                </div>
              )}

              {mCertifications && (
                <div>
                   <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', background: '#1e293b', padding: '4px 8px', textTransform: 'uppercase', marginBottom: '12px', display: 'inline-block' }}>Certifications</h3>
                   <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#334155', textAlign: 'justify' }}>{formatText(mCertifications)}</div>
                </div>
              )}

              {mAchievements && (
                <div>
                   <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', background: '#1e293b', padding: '4px 8px', textTransform: 'uppercase', marginBottom: '12px', display: 'inline-block' }}>Achievements</h3>
                   <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#334155', textAlign: 'justify' }}>{formatText(mAchievements)}</div>
                </div>
              )}
            </div>
          </div>
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
                <h3 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '5px' }}>{sec.title}</h3>
                <div style={{ fontSize: '12px', textAlign: 'justify', whiteSpace: 'pre-line' }}>{sec.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. One-Page ATS (Business Analyst) */}
      {templateStyle === 'onepage' && (
          <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', minHeight: '100%', width: '100%' }}>
            {/* Left Sidebar */}
            <div style={{ background: '#f1f5f9', padding: '30px 20px', borderRight: '2px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                {profilePicture && <img src={profilePicture} style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover', margin: '0 auto 12px', border: '1px solid #94a3b8' }} />}
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0', lineHeight: 1.1 }}>{mName}</h1>
                {mJobTitle && <h2 style={{ fontSize: '13px', color: accentColor, margin: 0, fontWeight: 700 }}>{mJobTitle}</h2>}
              </div>
              
              {hasContact && (
                <div>
                  <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '10px' }}>Contact Info</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: '#334155' }}>
                    {mEmail && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', wordBreak: 'break-all' }}><Mail size={12} /> {mEmail}</span>}
                    {mPhone && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={12} /> {mPhone}</span>}
                    {mCity && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> {mCity}</span>}
                    {mLinkedin && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', wordBreak: 'break-all' }}><Linkedin size={12} /> {mLinkedin.replace('https://', '')}</span>}
                    {mGithub && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', wordBreak: 'break-all' }}><Github size={12} /> {mGithub.replace('https://', '')}</span>}
                  </div>
                </div>
              )}

              {mSkills && (
                 <div>
                   <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '10px' }}>Core Competencies</h3>
                   <div style={{ fontSize: '11px', lineHeight: 1.6, color: '#334155' }}>{formatText(mSkills, false)}</div>
                 </div>
              )}

              {mLanguages && (
                 <div>
                   <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '10px' }}>Languages</h3>
                   <div style={{ fontSize: '11px', lineHeight: 1.6, color: '#334155' }}>{formatText(mLanguages, false)}</div>
                 </div>
              )}

              {mCertifications && (
                 <div>
                   <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '10px' }}>Certifications</h3>
                   <div style={{ fontSize: '11px', lineHeight: 1.6, color: '#334155' }}>{formatText(mCertifications, false)}</div>
                 </div>
              )}
            </div>

            {/* Main Content */}
            <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {mSummary && (
                <div>
                   <h3 style={{ fontSize: '13px', fontWeight: 800, color: accentColor, textTransform: 'uppercase', borderBottom: `1px solid ${accentColor}`, paddingBottom: '4px', marginBottom: '10px' }}>Professional Summary</h3>
                   <div style={{ fontSize: '12px', lineHeight: 1.6, color: '#1e293b', textAlign: 'justify' }}>{formatText(mSummary, false)}</div>
                </div>
              )}

              {mProjects && (
                <div>
                   <h3 style={{ fontSize: '13px', fontWeight: 800, color: accentColor, textTransform: 'uppercase', borderBottom: `1px solid ${accentColor}`, paddingBottom: '4px', marginBottom: '10px' }}>Work Experience</h3>
                   <div style={{ fontSize: '12px', lineHeight: 1.6, color: '#1e293b', textAlign: 'justify' }}>{formatText(mProjects)}</div>
                </div>
              )}

              {mEducation && (
                <div>
                   <h3 style={{ fontSize: '13px', fontWeight: 800, color: accentColor, textTransform: 'uppercase', borderBottom: `1px solid ${accentColor}`, paddingBottom: '4px', marginBottom: '10px' }}>Education</h3>
                   <div style={{ fontSize: '12px', lineHeight: 1.6, color: '#1e293b', textAlign: 'justify' }}>{formatText(mEducation)}</div>
                </div>
              )}

              {mAchievements && (
                <div>
                   <h3 style={{ fontSize: '13px', fontWeight: 800, color: accentColor, textTransform: 'uppercase', borderBottom: `1px solid ${accentColor}`, paddingBottom: '4px', marginBottom: '10px' }}>Achievements</h3>
                   <div style={{ fontSize: '12px', lineHeight: 1.6, color: '#1e293b', textAlign: 'justify' }}>{formatText(mAchievements)}</div>
                </div>
              )}
            </div>
          </div>
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
      </>
      )}
    </div>
  );
}
