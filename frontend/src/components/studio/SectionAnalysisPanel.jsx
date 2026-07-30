import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, ChevronDown, Sparkles, AlertCircle, Award, ShieldCheck, ArrowRight, FileText, Target } from 'lucide-react';
import confetti from 'canvas-confetti';
import TailorResumePanel from './TailorResumePanel.jsx';

export default function SectionAnalysisPanel({ resumeData, onTriggerFix, onApplyTailorChange, isFixing }) {
  const [mainTab, setMainTab] = useState('tailor'); // 'analysis' | 'tailor' (Default to tailor to match user screenshots!)
  const [activeStep, setActiveStep] = useState(3);
  const [fixedItems, setFixedItems] = useState({});

  const score = resumeData?.atsScore || 41;
  const pointsNeeded = Math.max(0, 90 - score);
  const candidateName = resumeData?.fileName?.replace(/\.pdf$/i, '') || 'K.DEVAKI';

  const steps = [
    {
      id: 1,
      title: 'Contact & Profile Completeness',
      subtitle: '4 recommended improvements',
      desc: 'Checks for consistency and completeness of your contact information and personal details.',
      items: [
        { id: 'c1', title: 'Add LinkedIn customized URL', badge: 'important', pts: '+2 pts', what: 'Your LinkedIn URL is missing a customized slug.', why: 'Recruiters check professional networking links in 85% of initial screens.' },
        { id: 'c2', title: 'Include portfolio or GitHub link', badge: 'optional', pts: '+1 pt', what: 'No code repository or live project link detected.', why: 'Demonstrates tangible technical execution to hiring managers.' }
      ]
    },
    {
      id: 2,
      title: 'Summary & Objective',
      subtitle: '3 recommended improvements',
      desc: 'Analyzes your summary for impact, clarity, and the inclusion of quantifiable achievements.',
      items: [
        { id: 's1', title: 'Inject target job title in first sentence', badge: 'important', pts: '+3 pts', what: 'The objective statement is generic and does not state the exact vacancy.', why: 'ATS algorithms weigh keywords in the top 10% of text 3x higher.' }
      ]
    },
    {
      id: 3,
      title: 'Experiences & Projects',
      subtitle: '5 recommended improvements',
      desc: 'Reviews work experience, projects, and volunteering sections for impact, clarity, and improvement opportunities.',
      items: [
        {
          id: 'p1',
          title: 'Add quantified impact to Bank Transaction project',
          badge: 'important',
          pts: '+5 pts',
          what: 'The project description contains no numbers or measurable outcomes.',
          why: 'Metrics demonstrate scale. Ask the candidate for figures such as "handled 5,000 transactions per day" and add them.\nBefore: "...apply and update Bank Transaction..."\nAfter: "...implemented a bank transaction system handling 5,000 daily transactions, reducing processing time by 20%..."',
          section: 'Projects',
          index: 0,
          instruction: 'Inject concrete numerical metrics, scale of daily transactions, and latency reduction.'
        },
        {
          id: 'p2',
          title: 'Strengthen weak action verb in Project bullet #1',
          badge: 'important',
          pts: '+2 pts',
          what: 'Bullet starts with a passive phrase ("To apply and update...") instead of a strong executive verb.',
          why: 'Top tech resumes use active ownership verbs like Architected, Engineered, or Spearheaded.',
          section: 'Projects',
          index: 0,
          instruction: 'Replace passive verb with an active ownership engineering verb.'
        }
      ]
    },
    {
      id: 4,
      title: 'Format & Structure',
      subtitle: '1 formatting check',
      desc: 'Verifies ATS readability, font standard compliance, and date alignment.',
      items: [
        { id: 'f1', title: 'Standardize date formatting across entries', badge: 'optional', pts: '+1 pt', what: 'Date separators vary between hyphens and slashes.', why: 'Consistent formatting ensures 100% accurate ATS chronology parsing.' }
      ]
    }
  ];

  const handleFixClick = async (item) => {
    if (isFixing || fixedItems[item.id]) return;

    setFixedItems(prev => ({ ...prev, [item.id]: true }));
    
    if (item.pts?.includes('5')) {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    }

    await onTriggerFix(item.section || 'Projects', item.index || 0, item.instruction || item.title, item);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'var(--bg-card)',
      borderRadius: '20px',
      border: '1px solid var(--border-color)',
      overflowY: 'auto',
      padding: '24px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      gap: '20px'
    }}>
      {/* Top Main Mode Switcher Tabs (From Screenshot 1: Resume Analysis | Tailor Resume) */}
      <div style={{ display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={() => setMainTab('analysis')}
          className={`btn ${mainTab === 'analysis' ? 'btn-secondary' : 'btn'}`}
          style={{
            flex: 1,
            padding: '10px 16px',
            fontSize: '0.9rem',
            borderRadius: '10px',
            background: mainTab === 'analysis' ? 'rgba(255,255,255,0.1)' : 'transparent',
            color: mainTab === 'analysis' ? '#fff' : 'var(--text-muted)'
          }}
        >
          <FileText size={16} />
          <span>Resume Analysis</span>
        </button>

        <button
          onClick={() => setMainTab('tailor')}
          className={`btn ${mainTab === 'tailor' ? 'btn-primary' : 'btn'}`}
          style={{
            flex: 1,
            padding: '10px 16px',
            fontSize: '0.9rem',
            borderRadius: '10px',
            background: mainTab === 'tailor' ? 'var(--gradient-main)' : 'transparent',
            color: mainTab === 'tailor' ? '#000' : 'var(--text-muted)',
            fontWeight: 700,
            boxShadow: mainTab === 'tailor' ? '0 0 20px rgba(0, 242, 254, 0.4)' : 'none'
          }}
        >
          <Target size={16} />
          <span>Tailor Resume</span>
        </button>
      </div>

      {/* Render Tab Content */}
      {mainTab === 'tailor' ? (
        <TailorResumePanel
          resumeData={resumeData}
          onApplyTailorChange={onApplyTailorChange}
          isWorking={isFixing}
        />
      ) : (
        <>
          {/* Detailed ATS Score Dashboard */}
          <div style={{
            background: 'var(--gradient-card)',
            padding: '24px',
            borderRadius: '20px',
            border: '1px solid var(--border-glow)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {/* Top Row: Overall Score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Circular Score */}
              <div style={{
                width: '100px', height: '100px', borderRadius: '50%',
                border: `6px solid ${score >= 80 ? '#10B981' : score >= 60 ? '#00F2FE' : '#F59E0B'}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.4)', flexShrink: 0,
                boxShadow: `0 0 20px ${score >= 80 ? 'rgba(16,185,129,0.3)' : 'rgba(0,242,254,0.3)'}`
              }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{score}<span style={{ fontSize: '1.2rem' }}>%</span></span>
              </div>
              
              {/* Stars & Text */}
              <div>
                <div style={{ color: '#F59E0B', fontSize: '1.4rem', letterSpacing: '4px', marginBottom: '4px' }}>
                  {score >= 90 ? '★★★★★' : score >= 75 ? '★★★★☆' : score >= 50 ? '★★★☆☆' : '★★☆☆☆'}
                </div>
                <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: '0 0 4px 0', fontWeight: 800 }}>
                  {score >= 90 ? 'Excellent Resume' : score >= 75 ? 'Good Resume' : score >= 50 ? 'Fair Resume' : 'Needs Improvement'}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  {score >= 90 ? 'Your resume is highly optimized for ATS and recruiters!' : 'Applying AI fixes will increase your sub-category scores.'}
                </p>
              </div>
            </div>

            {/* Bottom Row: 6 Progress Bars Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { name: 'Resume Structure', val: Math.min(100, score + 4) },
                { name: 'Skills', val: Math.min(100, Math.max(30, score - 2)) },
                { name: 'Keywords', val: Math.min(100, Math.max(25, score - 5)) },
                { name: 'Formatting', val: Math.min(100, score + 8) },
                { name: 'Readability', val: Math.min(100, score + 2) },
                { name: 'Grammar', val: Math.min(100, score + 6) }
              ].map((bar, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    <span>{bar.name}</span>
                    <span style={{ color: bar.val >= 80 ? '#10B981' : bar.val >= 60 ? '#00F2FE' : '#F59E0B' }}>{bar.val}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${bar.val}%`,
                      background: bar.val >= 80 ? '#10B981' : bar.val >= 60 ? 'var(--gradient-main)' : '#F59E0B',
                      borderRadius: '3px',
                      transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>Steps to increase your score</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Here are some recruiter checks that are bringing your score down. Click into each to learn where you went wrong and how to improve your score.
            </p>
          </div>

          {/* Expandable Step Accordions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {steps.map((step) => {
              const isOpen = activeStep === step.id;
              return (
                <div key={step.id} style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isOpen ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}>
                  <div
                    onClick={() => setActiveStep(isOpen ? null : step.id)}
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      background: isOpen ? 'rgba(0, 242, 254, 0.05)' : 'transparent'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', display: 'block' }}>
                        Step {step.id} • {step.subtitle}
                      </span>
                      <h4 style={{ fontSize: '1.05rem', color: '#fff', margin: '2px 0 0 0' }}>{step.title}</h4>
                    </div>
                    {isOpen ? <ChevronDown size={20} color="var(--accent-cyan)" /> : <ChevronRight size={20} color="var(--text-dim)" />}
                  </div>

                  {isOpen && (
                    <div style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        {step.desc}
                      </p>

                      {/* Section Analysis Action Cards */}
                      {step.items.map((item) => {
                        const isFixed = !!fixedItems[item.id];
                        return (
                          <div key={item.id} style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: `1px solid ${isFixed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: '14px',
                            padding: '18px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '14px',
                            position: 'relative'
                          }}>
                            {/* Top Badge bar */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span className={`badge ${item.badge === 'important' ? 'badge-warning' : 'badge-purple'}`} style={{ fontSize: '0.7rem' }}>
                                  {item.badge}
                                </span>
                                {isFixed && (
                                  <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                                    ✓ Fixed with AI
                                  </span>
                                )}
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isFixed ? 'var(--accent-green)' : 'var(--accent-cyan)' }}>
                                  {item.pts}
                                </span>
                              </div>

                              <button
                                onClick={() => handleFixClick(item)}
                                disabled={isFixed || isFixing}
                                className={`btn ${isFixed ? 'btn-secondary' : 'btn-primary'}`}
                                style={{
                                  padding: '6px 14px',
                                  fontSize: '0.8rem',
                                  borderRadius: '8px',
                                  background: isFixed ? 'rgba(16, 185, 129, 0.2)' : 'var(--gradient-main)',
                                  color: isFixed ? 'var(--accent-green)' : '#000',
                                  border: isFixed ? '1px solid rgba(16, 185, 129, 0.4)' : 'none'
                                }}
                              >
                                {isFixed ? (
                                  <>
                                    <CheckCircle2 size={14} />
                                    <span>Fixed with AI</span>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles size={14} />
                                    <span>Fix with AI</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <h4 style={{ fontSize: '1.05rem', color: '#fff', margin: 0 }}>{item.title}</h4>

                            {/* WHAT TO IMPROVE & WHY AND HOW TO FIX */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                              <div>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                                  What To Improve
                                </span>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.5 }}>
                                  {item.what}
                                </p>
                              </div>

                              <div>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                                  Why And How To Fix
                                </span>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                                  {item.why}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
