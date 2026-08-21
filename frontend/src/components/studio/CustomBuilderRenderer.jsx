import React from 'react';
import { Mail, Phone, Linkedin, Github } from 'lucide-react';

export default function CustomBuilderRenderer({
  builderConfig,
  candidateName,
  email,
  phone,
  city,
  linkedin,
  github,
  mJobTitle,
  mSummary,
  mProjects,
  mEducation,
  mSkills,
  mCertifications,
  mAchievements,
  mLanguages,
  profilePicture,
  accentColor // Fallback if not in builderConfig
}) {
  if (!builderConfig) return null;

  const {
    layout = 'single-column',
    fontFamily = 'Inter',
    primaryColor = accentColor || '#2563EB',
    secondaryColor = '#F3F4F6',
    textColor = '#1F2937',
    fontSize = '12px',
    sectionSpacing = '12px',
    headingStyle = 'uppercase',
    showProfilePhoto = true,
    sectionOrder = [
      'contact',
      'summary',
      'experience',
      'projects',
      'education',
      'skills',
      'certifications',
      'achievements',
      'languages'
    ]
  } = builderConfig;

  // Helper to format text with bullets
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
      
      const isNewItem = /^([*\-•·➢>]|\d+\.)\s*/.test(trimmed) || /^[\w\s]{2,40}:/.test(trimmed) || /^([A-Z0-9\s&]{4,})$/.test(trimmed);
      
      if (!mergeLines || isNewItem || mergedLines.length === 0 || mergedLines[mergedLines.length - 1] === '') {
        mergedLines.push(trimmed);
      } else {
        mergedLines[mergedLines.length - 1] += ' ' + trimmed;
      }
    }
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {mergedLines.map((line, i) => {
          if (!line) return <div key={i} style={{ height: '4px' }} />;
          
          const bulletMatch = line.match(/^([*\-•·➢>])\s*(.*)/);
          if (bulletMatch) {
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', paddingLeft: '4px' }}>
                <span style={{ flexShrink: 0, width: '10px', textAlign: 'center', fontSize: '1em', lineHeight: '1.3', color: primaryColor }}>•</span>
                <span style={{ flex: 1, textAlign: 'left', lineHeight: '1.3' }}>{bulletMatch[2]}</span>
              </div>
            );
          }
          return <div key={i} style={{ textAlign: 'left', lineHeight: '1.3' }}>{line}</div>;
        })}
      </div>
    );
  };

  const hasContact = email || phone || city || linkedin || github;

  const renderSectionHeader = (title) => (
    <div style={{
      fontSize: '1.1em',
      fontWeight: '700',
      color: primaryColor,
      textTransform: headingStyle === 'uppercase' ? 'uppercase' : 'capitalize',
      marginBottom: '6px',
      borderBottom: `2px solid ${secondaryColor}`,
      paddingBottom: '4px'
    }}>
      {title}
    </div>
  );

  const sectionsMap = {
    contact: hasContact && (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: layout === 'two-column' ? 'flex-start' : 'center', color: textColor, fontSize: '0.9em', marginBottom: sectionSpacing }}>
        {email && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} color={primaryColor} /> {email}</span>}
        {phone && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} color={primaryColor} /> {phone}</span>}
        {linkedin && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Linkedin size={14} color={primaryColor} /> {linkedin}</span>}
        {github && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Github size={14} color={primaryColor} /> {github}</span>}
        {city && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>📍 {city}</span>}
      </div>
    ),
    summary: mSummary && (
      <div style={{ marginBottom: sectionSpacing }}>
        {renderSectionHeader('Professional Summary')}
        <div style={{ lineHeight: '1.6' }}>{formatText(mSummary, false)}</div>
      </div>
    ),
    experience: mProjects && (
      <div style={{ marginBottom: sectionSpacing }}>
        {renderSectionHeader('Experience')}
        <div style={{ lineHeight: '1.6' }}>{formatText(mProjects, true)}</div>
      </div>
    ),
    projects: null, // Experience and Projects are often merged in `mProjects`. If separate, add logic here.
    education: mEducation && (
      <div style={{ marginBottom: sectionSpacing }}>
        {renderSectionHeader('Education')}
        <div style={{ lineHeight: '1.6' }}>{formatText(mEducation, false)}</div>
      </div>
    ),
    skills: mSkills && (
      <div style={{ marginBottom: sectionSpacing }}>
        {renderSectionHeader('Skills')}
        <div style={{ lineHeight: '1.6' }}>{formatText(mSkills, false)}</div>
      </div>
    ),
    certifications: mCertifications && (
      <div style={{ marginBottom: sectionSpacing }}>
        {renderSectionHeader('Certifications')}
        <div style={{ lineHeight: '1.6' }}>{formatText(mCertifications, false)}</div>
      </div>
    ),
    achievements: mAchievements && (
      <div style={{ marginBottom: sectionSpacing }}>
        {renderSectionHeader('Achievements')}
        <div style={{ lineHeight: '1.6' }}>{formatText(mAchievements, false)}</div>
      </div>
    ),
    languages: mLanguages && (
      <div style={{ marginBottom: sectionSpacing }}>
        {renderSectionHeader('Languages')}
        <div style={{ lineHeight: '1.6' }}>{formatText(mLanguages, false)}</div>
      </div>
    )
  };

  const getFontFamilyString = () => {
    switch(fontFamily) {
      case 'Inter': return "'Inter', sans-serif";
      case 'Times New Roman': return "'Times New Roman', serif";
      case 'Courier New': return "'Courier New', monospace";
      case 'Roboto': return "'Roboto', sans-serif";
      case 'Merriweather': return "'Merriweather', serif";
      default: return "'Inter', sans-serif";
    }
  };

  return (
    <div style={{
      fontFamily: getFontFamilyString(),
      color: textColor,
      fontSize: fontSize,
      width: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: layout === 'two-column' ? 'row' : 'column',
      lineHeight: '1.6'
    }}>
      {layout === 'two-column' ? (
        <>
          {/* Left Column */}
          <div style={{ width: '30%', backgroundColor: secondaryColor, padding: '40px 24px' }}>
            {showProfilePhoto && profilePicture && (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <img src={profilePicture} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${primaryColor}` }} alt="Profile" />
              </div>
            )}
            <h1 style={{ fontSize: '1.8em', fontWeight: '800', color: primaryColor, marginBottom: '4px', textAlign: 'center' }}>
              {candidateName}
            </h1>
            {mJobTitle && (
              <h2 style={{ fontSize: '1.1em', fontWeight: '500', color: textColor, opacity: 0.8, marginBottom: '24px', textAlign: 'center' }}>
                {mJobTitle}
              </h2>
            )}
            {/* Sidebar Sections */}
            {sectionOrder.map(sec => {
              // Usually Contact, Skills, Languages, Certifications go well in Sidebar
              if (['contact', 'skills', 'languages', 'certifications'].includes(sec)) {
                return <React.Fragment key={sec}>{sectionsMap[sec]}</React.Fragment>;
              }
              return null;
            })}
          </div>
          {/* Right Column */}
          <div style={{ width: '70%', padding: '40px 32px' }}>
            {sectionOrder.map(sec => {
              if (!['contact', 'skills', 'languages', 'certifications'].includes(sec)) {
                return <React.Fragment key={sec}>{sectionsMap[sec]}</React.Fragment>;
              }
              return null;
            })}
          </div>
        </>
      ) : (
        /* Single Column Layout */
        <div style={{ width: '100%', padding: '0', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ 
            backgroundColor: secondaryColor, 
            padding: '40px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '32px',
            flexDirection: 'row',
            borderBottom: `4px solid ${primaryColor}`,
            marginBottom: sectionSpacing
          }}>
            {showProfilePhoto && profilePicture && (
              <img src={profilePicture} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${primaryColor}` }} alt="Profile" />
            )}
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '2.5em', fontWeight: '800', color: primaryColor, marginBottom: '8px' }}>
                {candidateName}
              </h1>
              {mJobTitle && (
                <h2 style={{ fontSize: '1.3em', fontWeight: '500', color: textColor, opacity: 0.8 }}>
                  {mJobTitle}
                </h2>
              )}
            </div>
          </div>
          
          {/* Main Body */}
          <div style={{ padding: '0 40px 40px 40px' }}>
            {sectionOrder.map(sec => <React.Fragment key={sec}>{sectionsMap[sec]}</React.Fragment>)}
          </div>
        </div>
      )}
    </div>
  );
}
