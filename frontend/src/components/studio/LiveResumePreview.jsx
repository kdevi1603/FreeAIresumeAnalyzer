import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Download, Check, Eye, X, Maximize } from 'lucide-react';
import confetti from 'canvas-confetti';
import html2pdf from 'html2pdf.js';

export default function LiveResumePreview({ resumeData, templateStyle = 'modern', accentColor = '#2563EB', onManualEdit, onAcceptChanges }) {
  const [zoom, setZoom] = useState(window.innerWidth <= 768 ? 65 : 85);
  const [showDiff, setShowDiff] = useState(true);
  const [changesAccepted, setChangesAccepted] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [customHtml, setCustomHtml] = useState(resumeData?.customHtml || '');
  
  useEffect(() => {
    if (resumeData?.customHtml !== undefined && resumeData?.customHtml !== customHtml) {
      setCustomHtml(resumeData.customHtml);
    }
  }, [resumeData?.customHtml]);

  useEffect(() => {
    if (templateStyle === 'original') {
      setCustomHtml(resumeData?.customHtml || '');
    } else {
      setCustomHtml('');
    }
  }, [templateStyle, resumeData?.customHtml]);

  const containerRef = useRef(null);
  const resumeContentRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (!document.fullscreenElement) {
        if (window.innerWidth <= 500) setZoom(50);
        else if (window.innerWidth <= 768) setZoom(65);
        else setZoom(85);
      }
    };
    window.addEventListener('resize', handleResize);
    
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        setZoom(130);
      } else {
        handleResize();
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(150, prev + 10));
  const handleZoomOut = () => setZoom(prev => Math.max(40, prev - 10));
  const handleResetZoom = () => setZoom(window.innerWidth <= 768 ? 65 : 85);
  
  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) document.exitFullscreen();
      else containerRef.current.requestFullscreen();
    }
  };

  const handleDownloadPDF = () => {
    setShowPrintPreview(true);
  };

  const executeDownload = () => {
    const element = resumeContentRef.current;
    if (!element) return;
    
    const originalTransform = element.style.transform;
    element.style.transform = 'scale(1)';
    
    const opt = {
      margin:       0,
      filename:     `${(resumeData?.fileName || 'resume').replace(/\.pdf$/i, '')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save().then(() => {
      element.style.transform = originalTransform;
      setShowPrintPreview(false);
    });
  };

  const handlePrint = () => {
    const element = resumeContentRef.current;
    if (!element) return;
    const originalTransform = element.style.transform;
    element.style.transform = 'scale(1)';
    window.print();
    element.style.transform = originalTransform;
    setShowPrintPreview(false);
  };

  const handleAcceptAll = () => {
    setChangesAccepted(true);
    setShowDiff(false);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    if (onAcceptChanges) {
      onAcceptChanges();
    }
  };

  const candidateName = resumeData?.personalInfo?.name === 'Untitled Resume' ? '' : (resumeData?.personalInfo?.name || resumeData?.fileName?.replace(/\.pdf$/i, '') || '');
  const email = resumeData?.personalInfo?.email || '';
  const phone = resumeData?.personalInfo?.phone || '';
  const city = resumeData?.personalInfo?.city || '';
  const linkedin = resumeData?.personalInfo?.linkedin || '';
  const github = resumeData?.personalInfo?.github || '';
  const profilePicture = resumeData?.personalInfo?.profilePicture || null;
  const score = resumeData?.atsScore || 0;

  const summaryText = (showDiff && resumeData?.fixedSummary) ? resumeData.fixedSummary : (resumeData?.summary || '');
  const projectsText = (showDiff && resumeData?.fixedProjects) ? resumeData.fixedProjects : (resumeData?.experienceList?.map(exp => `${exp.company} - ${exp.role}\n${exp.bullets}`).join('\n\n') || '');
  const skillsText = (showDiff && resumeData?.fixedSkills) ? resumeData.fixedSkills : (resumeData?.skillsFound?.map(s => s.skill).join(', ') || '');
  const educationText = resumeData?.education || '';

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

  const formatText = (text) => {
    if (!text) return null;
    const rawLines = text.split(/\r?\n/);
    const mergedLines = [];
    
    for (let line of rawLines) {
      const trimmed = line.trim();
      if (!trimmed) {
        mergedLines.push('');
        continue;
      }
      
      const isNewItem = /^([*\-•·➢>]|\d+\.)\s*/.test(trimmed);
      
      if (isNewItem || mergedLines.length === 0 || mergedLines[mergedLines.length - 1] === '') {
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
    { title: 'Executive Summary', content: formatText(summaryText), isModified: !!resumeData?.fixedSummary },
    { title: 'Work & Project Experience', content: formatText(projectsText), isModified: !!resumeData?.fixedProjects },
    { title: 'Education & Academic Details', content: formatText(educationText) },
    { title: 'Technical Skills & Tools', content: formatText(skillsText), isModified: !!resumeData?.fixedSkills },
    { title: 'Languages', content: 'Tamil (Native), English (Professional Working Proficiency)' }
  ];

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', padding: '12px 20px', background: 'var(--bg-card-hover)', borderBottom: '1px solid var(--border-color)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={handleAcceptAll} disabled={changesAccepted} style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '8px', background: changesAccepted ? 'rgba(16, 185, 129, 0.2)' : '#10B981', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
            <span>{changesAccepted ? 'Changes Accepted' : 'Accept Changes'}</span>
          </button>
          <button onClick={() => setShowDiff(!showDiff)} style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '8px', background: showDiff ? '#2563EB' : 'rgba(37, 99, 235, 0.2)', color: '#fff', border: 'none', cursor: 'pointer' }}>
            <span>{showDiff ? 'Hide Changes' : 'Show Changes'}</span>
          </button>
          <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: '12px', color: '#22d3ee', fontWeight: 700 }}>
            Template: {templateStyle.toUpperCase()}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(128,128,128,0.1)', padding: '4px 10px', borderRadius: '30px', border: '1px solid var(--border-color)' }}>
            <button onClick={handleZoomOut} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }} title="Zoom Out"><ZoomOut size={16} /></button>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main, #000)', minWidth: '40px', textAlign: 'center' }}>{zoom}%</span>
            <button onClick={handleZoomIn} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }} title="Zoom In"><ZoomIn size={16} /></button>
            <button onClick={handleResetZoom} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }} title="Reset Zoom"><RotateCcw size={14} /></button>
            <button onClick={handleFullscreen} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', marginLeft: '4px', borderLeft: '1px solid var(--border-color)', paddingLeft: '8px' }} title="Fullscreen"><Maximize size={14} /></button>
          </div>
          <button id="hidden-direct-download-btn" onClick={executeDownload} style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'none' }}>
            Direct Download
          </button>
          <button onClick={handleDownloadPDF} style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Print/Save Preview Overlay */}
      {showPrintPreview && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: '#fff'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--text-main)' }}>Export Your Resume</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Choose how you want to export your optimized resume.</p>
          
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={executeDownload} className="btn" style={{
              background: 'linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%)',
              color: '#000', padding: '16px 32px', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 700,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', minWidth: '200px',
              border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,242,254,0.3)'
            }}>
              <Download size={32} />
              Save as PDF
            </button>
            
            <button onClick={handlePrint} className="btn" style={{
              background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-color)',
              color: '#fff', padding: '16px 32px', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 700,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', minWidth: '200px',
              cursor: 'pointer', transition: 'all 0.2s'
            }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
              <Eye size={32} />
              Print Document
            </button>
          </div>
          
          <button onClick={() => setShowPrintPreview(false)} style={{
            background: 'transparent', border: 'none', color: 'var(--text-muted)',
            marginTop: '40px', fontSize: '1rem', cursor: 'pointer', textDecoration: 'underline'
          }}>
            Cancel and go back
          </button>
        </div>
      )}

      <div style={{ flex: 1, overflow: 'auto', padding: window.innerWidth <= 768 ? '15px 10px' : '30px 20px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', background: 'var(--bg-dark)' }}>
        {templateStyle === 'original' ? (
          <div
            ref={resumeContentRef}
            className="a4-print-container"
            style={{
              transform: `scale(${zoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s ease',
              width: '794px', minHeight: '1123px', backgroundColor: '#ffffff', color: '#1a1a1a',
              padding: '56px 56px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)', borderRadius: '4px',
              fontFamily: "'Inter', sans-serif",
              position: 'relative',
              textAlign: 'left'
            }}
            contentEditable={true}
            suppressContentEditableWarning={true}
            spellCheck={true}
            title="Right-click on red underlined words for spelling suggestions"
            onBlur={(e) => {
              const html = e.currentTarget.innerHTML;
              setCustomHtml(html);
              if (onManualEdit) onManualEdit(html);
            }}
            dangerouslySetInnerHTML={{ __html: customHtml || '<div style="padding: 40px; text-align: center; color: #64748b;">Original formatting not available.</div>' }}
          />
        ) : (
        <div ref={resumeContentRef} className="a4-print-container" style={{
          transform: `scale(${zoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s ease',
          width: '794px', minHeight: '1123px', backgroundColor: '#ffffff', color: '#1a1a1a',
          padding: (templateStyle === 'sidebar' || templateStyle === 'executive') ? '0' : '56px 56px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)', borderRadius: '4px',
          fontFamily: ['academic', 'corporate', 'serif'].includes(templateStyle) ? "'Times New Roman', serif"
            : ['minimalist', 'software'].includes(templateStyle) ? "'Courier New', monospace"
            : "'Inter', sans-serif",
          position: 'relative'
        }}
        contentEditable={templateStyle !== 'original'}
        suppressContentEditableWarning={true}
        spellCheck={true}
        title="Right-click on red underlined words for spelling suggestions"
        onBlur={(e) => {
            if (templateStyle !== 'original') {
                const html = e.currentTarget.innerHTML;
                setCustomHtml(html);
                if (onManualEdit) onManualEdit(html);
            }
        }}>
          
          <style>{resumeData?.formattingCss || ''}</style>
          
          {/* 1. Modern Professional (formerly modern) */}
          {templateStyle === 'modern' && (
            <>
              <div style={{ borderBottom: `2px solid ${accentColor}`, paddingBottom: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>{candidateName.toUpperCase()}</h1>
                  <div style={{ fontSize: '12px', color: '#475569', display: 'flex', flexWrap: 'wrap', gap: '12px' }}><span>📧 {email}</span><span>•</span><span>📱 {phone}</span><span>•</span><span>🔗 {linkedin}</span></div>
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
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '24px' }}>{email} | {phone} | {linkedin}</div>
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
                <div style={{ fontSize: '12px', color: '#475569' }}>{email} • {phone} • {linkedin}</div>
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
                <div style={{ fontSize: '11px', color: '#475569', textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>{email} | {phone}</span>
                  <span>{github} | {linkedin}</span>
                </div>
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
                  <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', gap: '16px' }}>
                    <span>{email}</span><span>{phone}</span><span>{linkedin}</span>
                  </div>
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
                <div style={{ fontSize: '12px', color: '#666', background: '#f8fafc', padding: '8px 16px', borderRadius: '30px', display: 'inline-flex', gap: '16px' }}>
                  <span>{email}</span><span>{phone}</span><span>{linkedin}</span>
                </div>
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

          <div style={{ position: 'absolute', bottom: '15px', left: '40px', right: '40px', fontSize: '10px', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Generated by AI Resume Analyzer</span>
            <span>Score: {score}/100</span>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
