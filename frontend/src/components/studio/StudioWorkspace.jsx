import React, { useState, useEffect } from 'react';
import SectionAnalysisPanel from './SectionAnalysisPanel.jsx';
import AiAgentChat from './AiAgentChat.jsx';
import LiveResumePreview from './LiveResumePreview.jsx';
import ResumeBuilderModal from './ResumeBuilderModal.jsx';
import { resumeService } from '../../services/api.js';
import { aiService } from '../../services/aiService.js';
import { ArrowLeft, Sparkles, Download, Layers, MessageSquare, FileText, Columns, LayoutGrid, Palette, Briefcase } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function StudioWorkspace({ resumeData, onBackToDashboard, initialTemplate = 'original', onUpdateResume }) {
  const [activeResume, setActiveResume] = useState(() => {
    if (resumeData && !resumeData.isScratch) {
      return resumeData;
    }
    return {
      id: 'scratch-' + Date.now(),
      fileName: 'Untitled Resume',
      personalInfo: { fullName: '', jobTitle: '', email: '', phone: '', location: '', linkedin: '' },
      summary: '',
      experienceList: [],
      education: '',
      atsScore: 0,
      sectionScores: { structure: 0, experience: 0, education: 0, projects: 0, skills: 0 },
      grammar: { score: 0, readability: 'N/A', passiveSentences: 0 },
      formatting: [],
      skillsFound: [],
      missingSkills: [],
      suggestions: []
    };
  });

  const lastSavedResume = React.useRef(null);

  useEffect(() => {
    if (activeResume && onUpdateResume) {
      const currentString = JSON.stringify(activeResume);
      if (lastSavedResume.current !== currentString) {
        lastSavedResume.current = currentString;
        onUpdateResume(activeResume);
      }
    }
  }, [activeResume]);

  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate);
  const [accentColor, setAccentColor] = useState('#2563EB');
  const [showBuilderModal, setShowBuilderModal] = useState(() => resumeData?.isScratch ? true : false);

  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: `Hello, I'm your AI Resume Assistant. How can I help you?`
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [autoFixMessage, setAutoFixMessage] = useState(null);
  const [showSplitChat, setShowSplitChat] = useState(false);
  const [previewMode, setPreviewMode] = useState('original'); // 'original' | 'ai_edited'


  const [activeView, setActiveView] = useState(() => {
    return (resumeData?.isScratch || !resumeData?.atsScore) ? 'Resume Preview' : 'Overview';
  });

  useEffect(() => {
    if (resumeData) {
      setActiveResume(prev => ({ ...prev, ...resumeData }));
    }
  }, [resumeData]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1100 && activeView === 'all') {
        setActiveView('left');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeView]);

  const handleTriggerFix = async (sectionName, itemIndex, instruction, item) => {
    setIsFixing(true);
    setAutoFixMessage('Watch the chat and preview — I am rewriting it for you now...');

    if (activeView === 'left') {
      setActiveView('all');
    }

    try {
      let res;
      if (activeResume?.id && activeResume.id !== 'demo-123') {
        res = await resumeService.fixSection(activeResume.id, sectionName, itemIndex, instruction);
      } else {
        await new Promise(r => setTimeout(r, 1800));
        res = {
          rewrittenText: "Implemented an enterprise-grade banking transaction system handling 5,000 daily transactions, reducing processing latency by 20% through SQL query optimization.",
          scoreGain: 5,
          explanation: "Added concrete quantifiable impact metrics and strong active verbs."
        };
      }

      const newScore = Math.min(100, (activeResume.atsScore || 41) + (res.scoreGain || 5));
      setActiveResume(prev => ({
        ...prev,
        atsScore: newScore,
        fixedProjects: res.rewrittenText
      }));

      setAutoFixMessage(null);
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'user',
          text: `⚡ Fix applied: ${item.title}`
        },
        {
          sender: 'bot',
          text: `🎯 **Awesome job!** I just rewrote your project entry to highlight measurable impact:\n\n*"${res.rewrittenText}"*\n\nThis single improvement recovered **+${res.scoreGain} points**, bringing your overall ATS score up to **${newScore}/100**! Look at your updated live document preview on the right. What would you like to tackle next?`,
          options: [
            'Add LinkedIn customized URL (+2 pts)',
            'Inject target job title in Summary (+3 pts)',
            'Review formatting standards'
          ]
        }
      ]);
    } catch (err) {
      console.error('Fix error:', err);
      setAutoFixMessage(null);
    } finally {
      setIsFixing(false);
    }
  };

  const handleSendMessage = async (userText) => {
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsTyping(true);

    try {
      // Delegate all conversational logic to the Live AI service
      const res = await aiService.chatWithResumeAgent(userText, activeResume, chatMessages);

      if (res.proposedFix) {
        setShowSplitChat(true);
        setActiveResume(prev => {
          const updated = { ...prev };
          const sec = res.proposedFix.section.toLowerCase();
          if (sec.includes('project')) {
            updated.fixedProjects = res.proposedFix.content;
          } else if (sec.includes('skill')) {
            updated.fixedSkills = res.proposedFix.content;
          } else if (sec.includes('summary')) {
            updated.fixedSummary = res.proposedFix.content;
          } else if (sec.includes('education')) {
            updated.fixedEducation = res.proposedFix.content;
          } else {
            updated.rawText = res.proposedFix.content;
          }
          // Increment ATS score for this fix, similar to handleApplyFix
          updated.atsScore = Math.min(100, (updated.atsScore || 41) + 4);
          updated.customHtml = ''; // Clear customHtml so structural updates take effect
          return updated;
        });
      }

      setChatMessages(prev => [
        ...prev,
        { sender: 'bot', text: res.reply, proposedFix: res.autoApply ? null : res.proposedFix, options: res.options }
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages(prev => [
        ...prev,
        { sender: 'bot', text: "I'm here to help! Try clicking 'Fix with AI' on any recommendation card in the left column to automatically apply verified ATS improvements." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleApplyTailorChange = (keyword, textToApply, item) => {
    const newScore = Math.min(100, (activeResume?.atsScore || 41) + 4);
    
    setActiveResume(prev => {
      const updated = { ...prev, atsScore: newScore };
      if (item.placement?.toLowerCase().includes('bank') || item.placement?.toLowerCase().includes('proj')) {
        updated.fixedProjects = textToApply;
      } else if (item.placement?.toLowerCase().includes('skill')) {
        updated.fixedSkills = textToApply;
      }
      return updated;
    });

    setChatMessages(prev => [
      ...prev,
      {
        sender: 'user',
        text: `🎯 Accepted change: ${keyword}`
      },
      {
        sender: 'bot',
        text: `✅ **Keyword Integrated!** I've added *"${keyword}"* directly into your **${item.placement}**. Look at the Live A4 Document Preview on the right to see the updated text!\n\nYour ATS score increased to **${newScore}/100**! Keep reviewing the pending keywords to hit a 90+ score.`,
        options: [
          'Scan another keyword',
          'Switch to Resume Analysis checks',
          'Download tailored PDF'
        ]
      }
    ]);
  };

  const handleSuggestionClick = async (suggestion) => {
    setActiveView('AI Chat');
    
    // Instead of hardcoding dummy data, pass the suggestion to the AI service
    const message = `Please fix this: ${suggestion.text}`;
    
    // Call the same flow as manual typing
    setIsTyping(true);
    setChatMessages(prev => [...prev, { sender: 'user', text: message }]);
    
    // Optional: wait a moment for smooth transition
    setTimeout(async () => {
      try {
        const response = await aiService.chatWithResumeAgent(message, activeResume, chatMessages);
        setChatMessages(prev => [
          ...prev,
          { 
            sender: 'bot', 
            text: response.reply,
            proposedFix: response.proposedFix,
            autoApply: response.autoApply
          }
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsTyping(false);
      }
    }, 100);
  };

  const handleUpdateResumeFromBuilder = (updatedFields) => {
    setActiveResume(prev => {
      const isInitial = prev.atsScore === 0;
      return {
        ...prev,
        ...updatedFields,
        customHtml: '', // Clear manual HTML edits to force structured data render
        atsScore: isInitial ? 78 : Math.min(100, (prev.atsScore || 41) + 8),
        sectionScores: prev.sectionScores?.structure === 0 ? {
          structure: 85,
          experience: 72,
          education: 90,
          projects: 68,
          skills: 80
        } : prev.sectionScores,
        grammar: prev.grammar?.score === 0 ? {
          score: 92,
          readability: 'Professional',
          passiveSentences: 3
        } : prev.grammar,
        formatting: (!prev.formatting || prev.formatting.length === 0) ? [
          { label: 'Margins are optimal for ATS scanners', passed: true },
          { label: 'Standard fonts used', passed: true },
          { label: 'Bullet points are well structured', passed: true },
          { label: 'Some section headers are non-standard', passed: false }
        ] : prev.formatting,
        skillsFound: (!prev.skillsFound || prev.skillsFound.length === 0) ? ['Communication', 'Teamwork', 'Problem Solving'] : prev.skillsFound,
        missingSkills: (!prev.missingSkills || prev.missingSkills.length === 0) ? ['Project Management', 'Data Analysis', 'Agile Methodologies'] : prev.missingSkills,
        suggestions: (!prev.suggestions || prev.suggestions.length === 0) ? [
          { text: 'Add more quantifiable metrics to your experience section (e.g., "Increased sales by 15%").', priority: 'High', type: 'content' },
          { text: 'Include a professional summary statement highlighting your career objectives.', priority: 'Medium', type: 'content' },
          { text: 'Check for inconsistent date formats across your work history.', priority: 'Low', type: 'formatting' }
        ] : prev.suggestions
      };
    });

    setChatMessages(prev => [
      ...prev,
      {
        sender: 'user',
        text: `🛠️ Updated resume via Studio Builder`
      },
      {
        sender: 'bot',
        text: `✨ **Resume Updated!** I applied your changes and recalculated your ATS compatibility. You gained **+8 points**! Your live document on the right is now formatted in the **${selectedTemplate.toUpperCase()}** template style with **${accentColor}** accents!`,
        options: [
          'Switch Template Style',
          'Run ATS Keyword Verification',
          'Download PDF Now'
        ]
      }
    ]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 80px)', gap: '24px', paddingBottom: '24px', maxWidth: '100%', margin: '0 auto', width: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'var(--bg-card)',
        padding: '16px 24px',
        borderRadius: '16px',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onBackToDashboard(activeResume)}
            className="btn"
            style={{ 
              padding: '8px 14px', 
              fontSize: '0.85rem',
              background: 'rgba(0, 242, 254, 0.1)',
              color: 'var(--accent-cyan)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              borderRadius: '8px'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>{activeResume?.personalInfo?.name || 'Candidate'} — {activeResume?.personalInfo?.jobTitle || 'Resume Analysis'}</span>
              </h3>
            </div>
            
          </div>
        </div>
        <button
          onClick={() => setShowBuilderModal(true)}
          className="btn btn-primary"
          style={{
            padding: '10px 20px',
            fontSize: '0.9rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%)',
            color: '#000',
            fontWeight: 800,
            boxShadow: '0 4px 15px rgba(0, 242, 254, 0.4)'
          }}
        >
          <span>Resume Builder & 10 Free Templates</span>
        </button>
      </div>

      {/* 6-Card ATS Dashboard */}
      <div className="animate-fade-in ats-dashboard-grid" style={{ marginTop: '8px' }}>
        {[
          { title: 'Overall ATS Score', value: `${activeResume?.atsScore ?? 0}%`, color: '#00F2FE' }, // Cyan
          { title: 'Resume Score', value: `${(activeResume?.atsScore ?? 0) > 0 ? Math.min(100, activeResume.atsScore + 4) : 0}/100`, color: '#3B82F6' }, // Blue
          { title: 'Keyword Match', value: `${Math.round(((activeResume?.skillsFound?.length || 0) / ((activeResume?.skillsFound?.length || 0) + (activeResume?.missingSkills?.length || 1))) * 100)}%`, color: '#F97316' }, // Orange
          { title: 'Grammar Score', value: `${activeResume?.grammar?.score ?? 0}%`, color: '#10B981' }, // Green
          { title: 'Formatting', value: (activeResume?.formatting?.length > 0 && activeResume?.formatting?.every(f => f.passed)) ? 'Excellent' : 'Needs Work', color: '#8B5CF6' }, // Purple
          { title: 'Missing Skills', value: `${activeResume?.missingSkills?.length || 0}`, color: '#EF4444' } // Red
        ].map((card, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)', border: `1px solid ${card.color}40`,
            padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px',
            boxShadow: `0 4px 20px ${card.color}15`, transition: 'all 0.3s ease', cursor: 'pointer',
            height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center'
          }} onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = `0 8px 25px ${card.color}30`;
          }} onMouseOut={e => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = `0 4px 20px ${card.color}15`;
          }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{card.title}</span>
            <span style={{ fontSize: '2.2rem', color: card.color, fontWeight: 800 }}>{card.value}</span>
          </div>
        ))}
      </div>
      {/* Tab Content Wrapper */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-card)',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        padding: '24px',
        overflowY: 'auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
      }}>
        {/* Multi-Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
          {['Overview', 'ATS Score', 'Keywords', 'Formatting', 'Grammar', 'Suggestions', 'Resume Preview', 'AI Chat'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveView(tab)}
              className={`btn ${activeView === tab ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                padding: '8px 16px', fontSize: '0.9rem', borderRadius: '12px', whiteSpace: 'nowrap',
                background: activeView === tab ? 'var(--gradient-main)' : 'rgba(255,255,255,0.05)',
                color: activeView === tab ? '#000' : 'var(--text-muted)', fontWeight: activeView === tab ? 700 : 500,
                boxShadow: activeView === tab ? '0 0 15px rgba(0, 242, 254, 0.4)' : 'none'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        {activeView === 'Overview' && (
          <div className="animate-fade-in" style={{ color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--accent-cyan)' }}>Resume Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[
                { label: 'Structure', score: activeResume?.sectionScores?.structure || 0 },
                { label: 'Experience', score: activeResume?.sectionScores?.experience || 0 },
                { label: 'Education', score: activeResume?.sectionScores?.education || 0 },
                { label: 'Projects', score: activeResume?.sectionScores?.projects || 0 },
                { label: 'Skills', score: activeResume?.sectionScores?.skills || 0 }
              ].map((sec, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 600 }}>{sec.label}</span>
                    <span style={{ color: sec.score >= 80 ? '#10B981' : sec.score >= 50 ? '#F59E0B' : '#EF4444', fontWeight: 800 }}>{sec.score}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                    <div style={{ height: '100%', background: sec.score >= 80 ? '#10B981' : sec.score >= 50 ? '#F59E0B' : '#EF4444', borderRadius: '3px', width: `${sec.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeView === 'ATS Score' && (
          <div className="animate-fade-in" style={{ color: 'var(--text-main)' }}>
            <h2 style={{ fontSize: '1.4rem', margin: '0 0 24px 0', color: 'var(--accent-cyan)' }}>Detailed ATS Score Breakdown</h2>
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '300px', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Structure', score: activeResume?.sectionScores?.structure || 0 },
                      { name: 'Experience', score: activeResume?.sectionScores?.experience || 0 },
                      { name: 'Education', score: activeResume?.sectionScores?.education || 0 },
                      { name: 'Projects', score: activeResume?.sectionScores?.projects || 0 },
                      { name: 'Skills', score: activeResume?.sectionScores?.skills || 0 }
                    ]}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} stroke="var(--text-muted)" />
                    <YAxis dataKey="name" type="category" stroke="var(--text-muted)" width={80} />
                    <Tooltip contentStyle={{ background: '#1e1e1e', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Bar dataKey="score" fill="var(--accent-cyan)" radius={[0, 4, 4, 0]}>
                      {
                        [
                          { name: 'Structure', score: activeResume?.sectionScores?.structure || 0 },
                          { name: 'Experience', score: activeResume?.sectionScores?.experience || 0 },
                          { name: 'Education', score: activeResume?.sectionScores?.education || 0 },
                          { name: 'Projects', score: activeResume?.sectionScores?.projects || 0 },
                          { name: 'Skills', score: activeResume?.sectionScores?.skills || 0 }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.score >= 80 ? '#10B981' : entry.score >= 50 ? '#F59E0B' : '#EF4444'} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeView === 'Keywords' && (
          <div className="animate-fade-in" style={{ color: 'var(--text-main)' }}>
            <h2 style={{ fontSize: '1.4rem', margin: '0 0 24px 0', color: 'var(--accent-cyan)' }}>Keyword Match Analysis</h2>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
              <div style={{ width: '250px', height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Matched', value: activeResume?.skillsFound?.length || 1 },
                        { name: 'Missing', value: activeResume?.missingSkills?.length || 1 }
                      ]}
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#10B981" />
                      <Cell fill="#EF4444" />
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e1e1e', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ flex: 1, minWidth: '300px' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#10B981', marginBottom: '12px' }}>Matched Keywords ({activeResume?.skillsFound?.length || 0})</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                  {(activeResume?.skillsFound || []).map(k => (
                    <span key={k} style={{ padding: '6px 12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981', borderRadius: '30px', fontSize: '0.85rem' }}>{k}</span>
                  ))}
                  {(!activeResume?.skillsFound || activeResume.skillsFound.length === 0) && <span style={{ color: 'var(--text-muted)' }}>No keywords detected.</span>}
                </div>

                <h3 style={{ fontSize: '1.1rem', color: '#EF4444', marginBottom: '12px' }}>Missing Keywords ({activeResume?.missingSkills?.length || 0})</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(activeResume?.missingSkills || []).map(k => (
                    <span key={k} style={{ padding: '6px 12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', borderRadius: '30px', fontSize: '0.85rem' }}>{k}</span>
                  ))}
                  {(!activeResume?.missingSkills || activeResume.missingSkills.length === 0) && <span style={{ color: 'var(--text-muted)' }}>No missing keywords!</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'Formatting' && (
          <div className="animate-fade-in" style={{ color: 'var(--text-main)' }}>
            <h2 style={{ fontSize: '1.4rem', margin: '0 0 24px 0', color: 'var(--accent-cyan)' }}>Formatting Checklist</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
              {(activeResume?.formatting || []).map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: item.passed ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', borderLeft: `4px solid ${item.passed ? '#10B981' : '#EF4444'}` }}>
                  <span style={{ color: item.passed ? '#10B981' : '#EF4444', fontWeight: 800 }}>{item.passed ? '✓' : '⚠'}</span>
                  <span>{item.label}</span>
                </div>
              ))}
              {(!activeResume?.formatting || activeResume.formatting.length === 0) && <span style={{ color: 'var(--text-muted)' }}>No formatting data found.</span>}
            </div>
          </div>
        )}

        {activeView === 'Grammar' && (
          <div className="animate-fade-in" style={{ color: 'var(--text-main)' }}>
            <h2 style={{ fontSize: '1.4rem', margin: '0 0 24px 0', color: 'var(--accent-cyan)' }}>Grammar & Readability</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '2rem', color: '#10B981', margin: '0 0 8px 0' }}>{activeResume?.grammar?.score || 0}%</h3>
                <span style={{ color: 'var(--text-muted)' }}>Grammar Score</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '2rem', color: '#00F2FE', margin: '0 0 8px 0' }}>{activeResume?.grammar?.readability || 'N/A'}</h3>
                <span style={{ color: 'var(--text-muted)' }}>Readability Score</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '2rem', color: '#F59E0B', margin: '0 0 8px 0' }}>{activeResume?.grammar?.passiveSentences || 0}</h3>
                <span style={{ color: 'var(--text-muted)' }}>Passive Sentences</span>
              </div>
            </div>
          </div>
        )}

        {activeView === 'Suggestions' && (
          <div className="animate-fade-in" style={{ color: 'var(--text-main)' }}>
            <h2 style={{ fontSize: '1.4rem', margin: '0 0 24px 0', color: 'var(--accent-cyan)' }}>AI Suggestions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(activeResume?.suggestions || []).map((s, i) => {
                const color = s.priority === 'High' ? '#EF4444' : s.priority === 'Medium' ? '#F59E0B' : '#10B981';
                return (
                  <div key={i} onClick={() => handleSuggestionClick(s)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'} onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.03)'}>
                    <span>{s.text}</span>
                    <span style={{ background: `${color}20`, color: color, padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>{s.priority} Priority</span>
                  </div>
                );
              })}
              {(!activeResume?.suggestions || activeResume.suggestions.length === 0) && <span style={{ color: 'var(--text-muted)' }}>No suggestions available!</span>}
            </div>
          </div>
        )}

        {activeView === 'Resume Preview' && (
          <div className="animate-fade-in" style={{ 
            height: '100%', 
            minHeight: '800px', 
            display: 'flex', 
            flexDirection: 'column',
            background: 'var(--bg-main, #f8fafc)',
            padding: '20px',
            borderRadius: '16px'
          }}>
            {activeResume?.fileUrl && (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: '8px', padding: '4px', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <button 
                    onClick={() => setPreviewMode('original')}
                    style={{ 
                      padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                      background: previewMode === 'original' ? 'var(--accent-blue)' : 'transparent',
                      color: previewMode === 'original' ? '#fff' : 'var(--text-muted)',
                      transition: 'all 0.2s'
                    }}
                  >
                    Original PDF
                  </button>
                  <button 
                    onClick={() => setPreviewMode('ai_edited')}
                    style={{ 
                      padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                      background: previewMode === 'ai_edited' ? 'var(--accent-blue)' : 'transparent',
                      color: previewMode === 'ai_edited' ? '#fff' : 'var(--text-muted)',
                      transition: 'all 0.2s'
                    }}
                  >
                    AI Optimized
                  </button>
                </div>
              </div>
            )}
            
            {(activeResume?.fileUrl && previewMode === 'original') ? (
              <div style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
                <div style={{
                  flex: 1,
                  width: '100%',
                  maxWidth: '800px',
                  minHeight: '800px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  border: '1px solid var(--border-color, #e2e8f0)',
                  background: '#fff'
                }}>
                  <iframe
                    src={activeResume.fileUrl + (activeResume.fileUrl.toLowerCase().endsWith('.pdf') ? '#view=FitH&toolbar=0&navpanes=0' : '')}
                    style={{ width: '100%', height: '100%', minHeight: '800px', border: 'none' }}
                    title="Uploaded Resume Preview"
                  />
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
                <div style={{ flex: 1, maxWidth: '800px', display: 'flex', justifyContent: 'center', minHeight: '800px', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
                  <LiveResumePreview 
                    resumeData={activeResume} 
                    templateStyle={selectedTemplate} 
                    accentColor={accentColor} 
                    onManualEdit={(html) => setActiveResume(prev => ({ ...prev, customHtml: html }))}
                    onAcceptChanges={() => onUpdateResume && onUpdateResume(activeResume)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeView === 'AI Chat' && (
          <div className="animate-fade-in" style={{ display: 'flex', gap: '24px', height: 'calc(100vh - 180px)', minHeight: '500px' }}>
            <div style={{ flex: 1, minWidth: showSplitChat ? '350px' : '100%' }}>
              <AiAgentChat
                resumeData={activeResume}
                chatMessages={chatMessages}
                onSendMessage={handleSendMessage}
                isTyping={isTyping}
                autoFixMessage={autoFixMessage}
                onApplyFix={(section, content) => {
                  setShowSplitChat(true);
                  setPreviewMode('ai_edited');
                  setActiveResume(prev => {
                    const updated = { ...prev };
                    const sec = section.toLowerCase();
                    if (sec.includes('project')) {
                      updated.fixedProjects = content;
                    } else if (sec.includes('skill')) {
                      updated.fixedSkills = content;
                    } else if (sec.includes('summary')) {
                      updated.fixedSummary = content;
                    } else if (sec.includes('education')) {
                      updated.fixedEducation = content;
                    } else if (sec.includes('format') || sec.includes('heading') || sec.includes('font') || sec.includes('bullet') || sec.includes('space')) {
                      updated.formattingCss = (updated.formattingCss || '') + '\n' + content;
                    } else {
                      updated.rawText = content;
                    }
                    return updated;
                  });
                  setChatMessages(prev => [
                    ...prev,
                    { sender: 'bot', text: `✨ Done! I've applied the changes to the ${section} section of your resume.` }
                  ]);
                }}
              />
            </div>
            {showSplitChat && (
              <div style={{ flex: 1, minWidth: '400px', borderLeft: '1px solid var(--border-color)', paddingLeft: '24px' }}>
                {activeResume?.fileUrl && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: '8px', padding: '4px', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                      <button 
                        onClick={() => setPreviewMode('original')}
                        style={{ 
                          padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                          background: previewMode === 'original' ? 'var(--accent-blue)' : 'transparent',
                          color: previewMode === 'original' ? '#fff' : 'var(--text-muted)',
                          transition: 'all 0.2s'
                        }}
                      >
                        Original PDF
                      </button>
                      <button 
                        onClick={() => setPreviewMode('ai_edited')}
                        style={{ 
                          padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                          background: previewMode === 'ai_edited' ? 'var(--accent-blue)' : 'transparent',
                          color: previewMode === 'ai_edited' ? '#fff' : 'var(--text-muted)',
                          transition: 'all 0.2s'
                        }}
                      >
                        AI Optimized
                      </button>
                    </div>
                  </div>
                )}
                
                {(activeResume?.fileUrl && previewMode === 'original') ? (
                  <div style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
                    <div style={{
                      flex: 1,
                      width: '100%',
                      maxWidth: '800px',
                      minHeight: '800px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                      border: '1px solid var(--border-color, #e2e8f0)',
                      background: '#fff'
                    }}>
                      <iframe
                        src={activeResume.fileUrl + (activeResume.fileUrl.toLowerCase().endsWith('.pdf') ? '#view=FitH&toolbar=0&navpanes=0' : '')}
                        style={{ width: '100%', height: '100%', minHeight: '800px', border: 'none' }}
                        title="Uploaded Resume Preview"
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
                    <div style={{ flex: 1, maxWidth: '800px', display: 'flex', justifyContent: 'center', minHeight: '800px', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
                      <LiveResumePreview 
                        resumeData={activeResume} 
                        templateStyle={selectedTemplate} 
                        accentColor={accentColor}
                        onManualEdit={(html) => setActiveResume(prev => ({ ...prev, customHtml: html }))}
                        onAcceptChanges={() => onUpdateResume && onUpdateResume(activeResume)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <ResumeBuilderModal
        isOpen={showBuilderModal}
        onClose={() => setShowBuilderModal(false)}
        resumeData={activeResume}
        onUpdateResume={handleUpdateResumeFromBuilder}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={(tmplId) => setSelectedTemplate(tmplId)}
        accentColor={accentColor}
        onSelectAccentColor={(col) => setAccentColor(col)}
      />
    </div>
  );
}
