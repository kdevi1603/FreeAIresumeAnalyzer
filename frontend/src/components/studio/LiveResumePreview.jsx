import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Download, Check, Eye, X, Maximize, Mail, Phone, Linkedin, Github } from 'lucide-react';
import confetti from 'canvas-confetti';
import html2pdf from 'html2pdf.js';
import ResumeContentRenderer from './ResumeContentRenderer.jsx';

const TEMPLATES = [
  { id: 'modern', name: '1. Modern Professional' },
  { id: 'minimalist', name: '2. Minimal ATS' },
  { id: 'software', name: '3. Software Engineer' },
  { id: 'fresher', name: '4. Student / Fresher' },
  { id: 'executive', name: '5. Executive' },
  { id: 'corporate', name: '6. Corporate' },
  { id: 'academic', name: '7. Academic CV' },
  { id: 'creative', name: '8. Creative' },
  { id: 'onepage', name: '9. Business Analyst' },
  { id: 'elegant', name: '10. Clean Professional' }
];

export default function LiveResumePreview({ resumeData, templateStyle = 'fresher', accentColor = '#2563EB', onManualEdit, onAcceptChanges, onOpenTemplates }) {
  const [zoom, setZoom] = useState(window.innerWidth <= 768 ? 65 : 85);
  const [showDiff, setShowDiff] = useState(true);
  const [changesAccepted, setChangesAccepted] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [customHtml, setCustomHtml] = useState(resumeData?.customHtml || '');
  const [liveCustomTemplate, setLiveCustomTemplate] = useState(null);

  useEffect(() => {
    if (templateStyle === 'original') return;
    fetch('http://localhost:5000/api/admin/templates')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const match = data.find(t => {
            const staticMatch = TEMPLATES.find(st => st.name.includes(t.name) || (t.name && st.name.includes(t.name))) || TEMPLATES.find(st => st.id === t.theme?.toLowerCase()) || TEMPLATES[0];
            return staticMatch.id === templateStyle;
          });
          if (match && match.customHtml) {
            setLiveCustomTemplate(match.customHtml);
          } else {
            setLiveCustomTemplate(null);
          }
        }
      })
      .catch(() => {});
  }, [templateStyle]);
  
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
    
    const printContainer = element.classList?.contains('a4-print-container') ? element : element.querySelector('.a4-print-container');
    
    if (printContainer) {
      const originalTransform = printContainer.style.transform;
      printContainer.style.transform = 'scale(1)';
      
      const clone = printContainer.cloneNode(true);
      const printWrapper = document.createElement('div');
      printWrapper.id = 'print-wrapper';
      printWrapper.appendChild(clone);
      document.body.appendChild(printWrapper);
      
      printContainer.style.transform = originalTransform;
      
      window.print();
      
      document.body.removeChild(printWrapper);
    } else {
      window.print();
    }
    
    setShowPrintPreview(false);
  };

  const handleAcceptAll = () => {
    setChangesAccepted(true);
    setShowDiff(true);
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

  const ContactRow = ({ justify = 'flex-start', color, style = {} }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: justify, color: color || '#475569', ...style }}>
      {email && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12} /> {email}</span>}
      {phone && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {phone}</span>}
      {linkedin && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Linkedin size={12} /> {linkedin}</span>}
      {github && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Github size={12} /> {github}</span>}
    </div>
  );
  const profilePicture = resumeData?.personalInfo?.profilePicture || null;
  const score = resumeData?.atsScore || 0;

  const summaryText = (showDiff && resumeData?.fixedSummary) ? resumeData.fixedSummary : (resumeData?.summary || '');
  const projectsText = (showDiff && resumeData?.fixedProjects) ? resumeData.fixedProjects : (resumeData?.experienceList?.map(exp => {
    let header = '';
    const isPlaceholder = exp.company === 'Extracted Experience' || exp.company === 'Original Content';
    if (!isPlaceholder && exp.company) header += exp.company;
    if (exp.role) header += (header ? ' - ' : '') + exp.role;
    return header ? `${header}\n${exp.bullets}` : exp.bullets;
  }).join('\n\n') || '');
  const skillsText = (showDiff && resumeData?.fixedSkills) ? resumeData.fixedSkills : (resumeData?.skills || resumeData?.skillsFound?.map(s => typeof s === 'string' ? s : s.skill).filter(Boolean).join(', ') || '');
  const educationText = (showDiff && resumeData?.fixedEducation) ? resumeData.fixedEducation : (resumeData?.education || '');

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

  const hasChanges = !!(resumeData?.fixedSummary || resumeData?.fixedProjects || resumeData?.fixedEducation || resumeData?.fixedSkills);

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', padding: '12px 20px', background: 'var(--bg-card-hover)', borderBottom: '1px solid var(--border-color)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {hasChanges && (
            <>
              <button onClick={handleAcceptAll} disabled={changesAccepted} style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '8px', background: changesAccepted ? 'rgba(16, 185, 129, 0.2)' : '#10B981', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                <span>{changesAccepted ? 'Changes Accepted' : 'Accept Changes'}</span>
              </button>
              <button onClick={() => setShowDiff(!showDiff)} style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '8px', background: showDiff ? '#2563EB' : 'rgba(37, 99, 235, 0.2)', color: '#fff', border: 'none', cursor: 'pointer' }}>
                <span>{showDiff ? 'Hide Changes' : 'Show Changes'}</span>
              </button>
            </>
          )}
          <button onClick={onOpenTemplates} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: '12px', color: '#22d3ee', fontWeight: 700, border: '1px solid rgba(34, 211, 238, 0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s' }}>
            Template: {templateStyle.toUpperCase()}
          </button>
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
              zoom: `${zoom}%`, transition: 'zoom 0.2s ease',
              width: '794px', height: '1123px', overflow: 'hidden', backgroundColor: '#ffffff', color: '#1a1a1a',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)', borderRadius: '4px',
              fontFamily: "'Inter', sans-serif",
              position: 'relative',
              textAlign: 'left'
            }}
          >
            {resumeData?.fileUrl ? (
              <iframe
                src={`${resumeData.fileUrl}` + (resumeData.fileUrl.toLowerCase().endsWith('.pdf') ? '#view=FitH&toolbar=0&navpanes=0' : '')}
                style={{ width: '100%', height: '100%', minHeight: '1123px', border: 'none' }}
                title="Original PDF"
              />
            ) : (
              <div
                style={{ padding: '56px 56px' }}
                contentEditable={true}
                suppressContentEditableWarning={true}
                spellCheck={true}
                title="Right-click on red underlined words for spelling suggestions"
                onBlur={(e) => {
                  const html = e.currentTarget.innerHTML;
                  setCustomHtml(html);
                  if (onManualEdit) onManualEdit(html);
                }}
                dangerouslySetInnerHTML={{ __html: customHtml || '<div style="padding: 40px; text-align: center; color: #64748b;">Original formatting not available. Upload a resume to see it here.</div>' }}
              />
            )}
          </div>
        ) : (
          <div ref={resumeContentRef} style={{ display: 'inline-block' }}>
            <ResumeContentRenderer
              resumeData={resumeData}
              templateStyle={templateStyle}
              accentColor={accentColor}
              showDiff={showDiff}
              zoom={zoom}
              contentEditable={true}
              onManualEdit={onManualEdit}
              customTemplateHtml={liveCustomTemplate}
            />
          </div>
        )}
      </div>
    </div>
  );
}
