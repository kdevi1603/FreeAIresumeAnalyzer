import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { resumeService } from '../services/api.js';
import ResumeUpload from '../components/ResumeUpload.jsx';
import AtsScoreCard from '../components/AtsScoreCard.jsx';
import SkillsBreakdown from '../components/SkillsBreakdown.jsx';
import SuggestionsPanel from '../components/SuggestionsPanel.jsx';
import VersionHistory from '../components/VersionHistory.jsx';
import JobMatcherModal from '../components/JobMatcherModal.jsx';
import CoverLetterModal from '../components/CoverLetterModal.jsx';
import InterviewPrepModal from '../components/InterviewPrepModal.jsx';
import StudioWorkspace from '../components/studio/StudioWorkspace.jsx';
import TemplateGallery from '../components/TemplateGallery.jsx';
import TemplateSelectionModal from '../components/TemplateSelectionModal.jsx';
import BeforeAfterGraphic from '../components/BeforeAfterGraphic.jsx';
import { Award, Zap, Lightbulb, History, Target, FileText, MessageSquare, Download, Sparkles, PlusCircle, Search, Bot, Layers, ArrowRight, CheckCircle2, DollarSign, UploadCloud, LayoutGrid, FileSearch, Wand2 } from 'lucide-react';

export default function Dashboard({ onOpenAuth, viewMode, setViewMode, onOpenTemplateModal, currentAnalysis, setCurrentAnalysis, onTemplateSelect, setSavedResumes, selectedTemplateId, setSelectedTemplateId }) {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Interactive demo prompt state for hero
  const [demoPrompt, setDemoPrompt] = useState('Yes, so the team productivity increased by over 15% in code quality scor');

  // Modals
  const [isJobMatcherOpen, setIsJobMatcherOpen] = useState(false);
  const [isCoverLetterOpen, setIsCoverLetterOpen] = useState(false);
  const [isInterviewPrepOpen, setIsInterviewPrepOpen] = useState(false);

  const handleAnalysisComplete = (data) => {
    const newRes = { ...data, id: data.id || 'upload-' + Date.now() };
    setCurrentAnalysis(newRes);
    if (setSavedResumes) {
      setSavedResumes(prev => {
        if (prev.find(r => r.id === newRes.id)) {
          return prev.map(r => r.id === newRes.id ? newRes : r);
        }
        return [newRes, ...prev];
      });
    }
    if (setViewMode) {
      setViewMode('templates');
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleSelectTemplate = (templateId) => {
    if (setSelectedTemplateId) setSelectedTemplateId(templateId);
    if (onTemplateSelect) {
      onTemplateSelect(templateId);
    } else {
      setViewMode('studio');
    }
  };

  if (viewMode === 'templates') {
    return (
      <div className="container" style={{ padding: '20px 15px' }}>
        <TemplateGallery
          onSelectTemplate={handleSelectTemplate}
          onBack={() => setViewMode('sidebar_dashboard')}
        />
      </div>
    );
  }

  if (viewMode === 'studio') {
    return (
      <div className="container" style={{ padding: '20px 15px' }}>
        <StudioWorkspace
          key={(currentAnalysis?.id || 'new') + '-' + selectedTemplateId}
          resumeData={currentAnalysis}
          onUpdateResume={async (updatedResume) => {
            if (updatedResume) {
              if (setSavedResumes) {
                setSavedResumes(prev => {
                  const exists = prev.find(r => r.id === updatedResume.id);
                  if (exists) return prev.map(r => r.id === updatedResume.id ? updatedResume : r);
                  return [updatedResume, ...prev];
                });
              }
              try {
                await resumeService.updateResume(updatedResume.id, updatedResume);
              } catch (err) {
                console.error("Failed to save resume updates to backend:", err);
              }
              setCurrentAnalysis(updatedResume);
            }
          }}
          onBackToDashboard={async (updatedResume) => {
            if (updatedResume) {
              if (setSavedResumes) {
                setSavedResumes(prev => {
                  const exists = prev.find(r => r.id === updatedResume.id);
                  if (exists) {
                    return prev.map(r => r.id === updatedResume.id ? updatedResume : r);
                  }
                  return [updatedResume, ...prev];
                });
              }
              try {
                await resumeService.updateResume(updatedResume.id, updatedResume);
              } catch (e) { }
              setCurrentAnalysis(updatedResume);
            }
            setViewMode('sidebar_dashboard');
          }}
          initialTemplate={selectedTemplateId}
        />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      {/* Light Clean Hero Section */}
      <div className="light-hero-section animate-fade-in">
        <h1>
          Transform your <span>resume</span>
        </h1>
        <p>
          Turn a basic resume into a professional, ATS-friendly format with improved structure, clarity, and impact faster.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '50px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              const fileInput = document.getElementById('resume-upload-input');
              if (fileInput) fileInput.click();
              else document.getElementById('uploader-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="light-hero-btn"
            style={{ marginBottom: 0 }}
          >
            Upload Existing Resume
          </button>
          <button
            type="button"
            onClick={() => {
              if (setViewMode) setViewMode('sidebar_dashboard');
            }}
            className="light-hero-btn"
            style={{ marginBottom: 0 }}
          >
            Create New Resume
          </button>
        </div>

        <BeforeAfterGraphic />
      </div>

      {/* Simple Steps Section */}
      <div style={{ maxWidth: '1000px', margin: '0 auto 80px', padding: '0 20px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '30px', paddingBottom: '80px', paddingTop: '60px', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '16px' }}>
          Build your <span style={{ color: '#00A3FF' }}>resume</span><br/>in simple steps
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '60px', maxWidth: '700px', margin: '0 auto 80px', lineHeight: 1.6 }}>
          Choose a template, add your details, and download a polished, ATS-friendly resume ready to apply with.
        </p>

        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
          {/* Vertical Line */}
          <div style={{ position: 'absolute', left: '50%', top: '20px', bottom: '20px', width: '2px', backgroundColor: '#e2e8f0', transform: 'translateX(-50%)' }}></div>

          {/* Step 1 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '80px', position: 'relative' }}>
            {/* Graphic (Left) */}
            <div style={{ width: '45%', display: 'flex', justifyContent: 'flex-end', paddingRight: '50px' }}>
              <div style={{ padding: '24px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', gap: '16px', alignItems: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-20px', width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#00A3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,163,255,0.3)' }}>
                  <PlusCircle size={24} color="#fff" />
                </div>
                <div style={{ padding: '0 15px' }}>
                   <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#666', marginBottom: '10px' }}>Your Resume</div>
                   <div style={{ width: '50px', height: '4px', backgroundColor: '#cbd5e1', marginBottom: '8px', borderRadius: '2px' }}></div>
                   <div style={{ width: '90px', height: '4px', backgroundColor: '#cbd5e1', marginBottom: '8px', borderRadius: '2px' }}></div>
                   <div style={{ width: '70px', height: '4px', backgroundColor: '#cbd5e1', marginBottom: '8px', borderRadius: '2px' }}></div>
                   <div style={{ width: '100px', height: '4px', backgroundColor: '#cbd5e1', marginBottom: '8px', borderRadius: '2px' }}></div>
                   <div style={{ width: '60px', height: '4px', backgroundColor: '#cbd5e1', borderRadius: '2px' }}></div>
                </div>
                <div style={{ position: 'absolute', right: '-20px', width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#00A3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,163,255,0.3)' }}>
                  <UploadCloud size={24} color="#fff" />
                </div>
              </div>
            </div>
            
            {/* Number */}
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#00A3FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', position: 'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: 2, border: '4px solid #fff', boxShadow: '0 0 0 4px #fff' }}>
              1
            </div>

            {/* Text (Right) */}
            <div style={{ width: '45%', paddingLeft: '50px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '12px' }}>Create or import resume</h3>
              <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>Start from scratch or upload your existing resume to quickly continue where you left off.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '80px', position: 'relative' }}>
            {/* Text (Left) */}
            <div style={{ width: '45%', paddingRight: '50px', textAlign: 'right' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '12px' }}>AI Parsing & Data Extraction</h3>
              <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>Our smart engine seamlessly extracts your work experience, education, and skills from your uploaded document.</p>
            </div>
            
            {/* Number */}
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#00A3FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', position: 'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: 2, border: '4px solid #fff', boxShadow: '0 0 0 4px #fff' }}>
              2
            </div>

            {/* Graphic (Right) */}
            <div style={{ width: '45%', display: 'flex', justifyContent: 'flex-start', paddingLeft: '50px' }}>
              <div style={{ padding: '24px 32px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Bot size={48} color="#00A3FF" />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
                  <div style={{ width: '80px', height: '6px', backgroundColor: '#00A3FF', borderRadius: '4px' }}></div>
                  <div style={{ width: '120px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}></div>
                  <div style={{ width: '90px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '80px', position: 'relative' }}>
            {/* Graphic (Left) */}
            <div style={{ width: '45%', display: 'flex', justifyContent: 'flex-end', paddingRight: '50px' }}>
              <div style={{ padding: '24px 32px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <FileSearch size={48} color="#00A3FF" />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
                  <div style={{ width: '100px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}></div>
                  <div style={{ width: '60px', height: '6px', backgroundColor: '#ef4444', borderRadius: '4px' }}></div>
                  <div style={{ width: '110px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>
            
            {/* Number */}
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#00A3FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', position: 'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: 2, border: '4px solid #fff', boxShadow: '0 0 0 4px #fff' }}>
              3
            </div>

            {/* Text (Right) */}
            <div style={{ width: '45%', paddingLeft: '50px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '12px' }}>ATS Keyword Gap Analysis</h3>
              <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>We scan your resume against industry standards and job descriptions to identify critical missing keywords.</p>
            </div>
          </div>

          {/* Step 4 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '80px', position: 'relative' }}>
            {/* Text (Left) */}
            <div style={{ width: '45%', paddingRight: '50px', textAlign: 'right' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '12px' }}>Real-time Content Optimization</h3>
              <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>Get AI-powered suggestions to rewrite your bullet points for maximum impact and readability.</p>
            </div>
            
            {/* Number */}
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#00A3FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', position: 'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: 2, border: '4px solid #fff', boxShadow: '0 0 0 4px #fff' }}>
              4
            </div>

            {/* Graphic (Right) */}
            <div style={{ width: '45%', display: 'flex', justifyContent: 'flex-start', paddingLeft: '50px' }}>
              <div style={{ padding: '24px 32px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Wand2 size={48} color="#00A3FF" />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
                  <div style={{ width: '90px', height: '6px', backgroundColor: '#10b981', borderRadius: '4px' }}></div>
                  <div style={{ width: '110px', height: '6px', backgroundColor: '#10b981', borderRadius: '4px' }}></div>
                  <div style={{ width: '70px', height: '6px', backgroundColor: '#10b981', borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            {/* Graphic (Left) */}
            <div style={{ width: '45%', display: 'flex', justifyContent: 'flex-end', paddingRight: '50px' }}>
              <div style={{ padding: '24px 32px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', gap: '24px', alignItems: 'center' }}>
                <LayoutGrid size={48} color="#00A3FF" strokeWidth={1.5} />
                <div style={{ width: '1px', height: '40px', backgroundColor: '#e2e8f0' }}></div>
                <Download size={36} color="#10b981" />
              </div>
            </div>
            
            {/* Number */}
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#00A3FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', position: 'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: 2, border: '4px solid #fff', boxShadow: '0 0 0 4px #fff' }}>
              5
            </div>

            {/* Text (Right) */}
            <div style={{ width: '45%', paddingLeft: '50px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '12px' }}>Choose Template & Download</h3>
              <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>Select from our premium ATS-friendly templates, see live previews, and download your polished resume instantly.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '32px', marginBottom: '32px' }}>
        {[
          { label: 'Resumes Analyzed', value: '10,000+' },
          { label: 'ATS Accuracy', value: '95%' },
          { label: 'Free Templates', value: '10+' },
          { label: 'Free to Use', value: '100%' }
        ].map((stat, idx) => (
          <div key={idx} style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: '0 0 4px 0' }}>{stat.value}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Trusted By Banner */}
      <div style={{ marginBottom: '50px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
          Trusted by Students, Freshers & Professionals
        </p>
      </div>

      {/* Interactive Simulated Studio Demo Box from Image 1 */}
      <div style={{
        maxWidth: '850px',
        margin: '0 auto 48px',
        background: 'var(--bg-card)',
        border: '2px solid var(--border-glow)',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F56', display: 'inline-block' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FFBD2E', display: 'inline-block' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#27C93F', display: 'inline-block' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginLeft: '12px', fontWeight: 600 }}>AI Resume Analyzer Interactive Tailoring Prompt</span>
        </div>

        <div className="responsive-flex-wrap" style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <input
            type="text"
            value={demoPrompt}
            onChange={(e) => setDemoPrompt(e.target.value)}
            className="form-input"
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.95rem', outline: 'none' }}
          />
          <button onClick={() => setViewMode('studio')} className="btn btn-primary" style={{ padding: '8px 18px', borderRadius: '10px' }}>
            <span>Send</span>
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-dim)', padding: '0 8px' }}>
          <span>Messages are processed by AI. Verify important information.</span>
          <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>Chat tokens left: ∞</span>
        </div>
      </div>

      {/* 3-Step Guarantee Banner from Image 1 */}
      <div className="stack-grid-on-mobile" style={{
        maxWidth: '1000px',
        margin: '0 auto 50px',
        background: 'var(--gradient-card)',
        border: '1px solid rgba(0, 242, 254, 0.25)',
        borderRadius: '24px',
        padding: '28px 32px',
        display: 'grid',
        gridTemplateColumns: 'minmax(200px, 1fr) 2fr',
        gap: '24px',
        alignItems: 'center',
        textAlign: 'left'
      }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: '0 0 8px 0' }}>
            Get Interviews or Get Your <span style={{ color: 'var(--accent-cyan)' }}>Money Back</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Use our AI tailoring engine on 50 job applications. If you don't receive any interviews, we'll refund you 100%. No questions asked.
          </p>
        </div>

        <div className="stack-grid-on-mobile" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px 12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0, 242, 254, 0.2)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontWeight: 800 }}>1</div>
            <FileText size={20} color="var(--accent-cyan)" style={{ margin: '0 auto 6px' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>Tailor 50 resumes</span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px 12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(159, 85, 255, 0.2)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontWeight: 800 }}>2</div>
            <Target size={20} color="var(--accent-purple)" style={{ margin: '0 auto 6px' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>Apply to 50 jobs</span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px 12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontWeight: 800 }}>3</div>
            <DollarSign size={20} color="var(--accent-green)" style={{ margin: '0 auto 6px' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>Get interviewed</span>
          </div>
        </div>
      </div>

      {/* Main Upload Zone */}
      <div id="uploader-section" className="animate-fade-in" style={{ maxWidth: '850px', margin: '0 auto 60px' }}>
        <ResumeUpload
          onAnalysisComplete={handleAnalysisComplete}
          requireAuth={!isAuthenticated ? onOpenAuth : null}
        />
      </div>

      {/* Resume Version History */}
      {isAuthenticated && (
        <div className="animate-fade-in" style={{ maxWidth: '850px', margin: '0 auto 60px' }}>
          <VersionHistory
            onSelectResume={handleAnalysisComplete}
            currentResumeId={currentAnalysis?.id}
          />
        </div>
      )}

      {/* 6 Numbered Feature Showcase Grid from Image 2 */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Everything You Need to Win the Hire</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Six integrated intelligence modules engineered into one unified studio.</p>
      </div>

      <div id="features" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {/* Card 01 */}
        <div className="glass-panel feature-card" style={{ padding: '28px', borderRadius: '24px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', opacity: 0.1, display: 'block', marginBottom: '12px' }}>01</span>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(0, 242, 254, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Search size={24} color="var(--accent-cyan)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '10px' }}>Resume Analysis</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Algorithmic deep dive into your formatting, grammar, and ATS keyword visibility. Know your score before you submit.
            </p>
          </div>
          <button onClick={() => setViewMode('studio')} className="btn btn-secondary" style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}>
            <span>Try Analysis Studio</span>
          </button>
        </div>

        {/* Card 02 */}
        <div className="glass-panel feature-card" style={{ padding: '28px', borderRadius: '24px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', opacity: 0.1, display: 'block' }}>02</span>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>Popular</span>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(0, 242, 254, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Layers size={24} color="var(--accent-cyan)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '10px' }}>Resume Tailoring</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6, margin: 0 }}>
              Tailor your resume to any job description in seconds. Aligns your experience with the role and rewrites content to match key requirements.
            </p>
          </div>
          <button onClick={() => setViewMode('studio')} className="btn btn-secondary" style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}>
            <span>Launch Tailoring Demo</span>
          </button>
        </div>

        {/* Card 03 */}
        <div className="glass-panel feature-card" style={{ padding: '28px', borderRadius: '24px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', opacity: 0.1, display: 'block', marginBottom: '12px' }}>03</span>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(159, 85, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Bot size={24} color="var(--accent-purple)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '10px' }}>Resume Agent</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Your 24/7 conversational AI recruiter coach. Ask for feedback, rewrite bullets in real time, and get instant guidance.
            </p>
          </div>
          <button onClick={() => setViewMode('studio')} className="btn btn-secondary" style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}>
            <span>Chat with Agent</span>
          </button>
        </div>

        {/* Card 04 */}
        <div className="glass-panel feature-card" style={{ padding: '28px', borderRadius: '24px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', opacity: 0.1, display: 'block', marginBottom: '12px' }}>04</span>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <FileText size={24} color="var(--accent-green)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '10px' }}>ATS-friendly Templates</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Proven, recruiter-approved document layouts engineered specifically to parse cleanly without algorithmic garbling.
            </p>
          </div>
          <button onClick={() => setViewMode('studio')} className="btn btn-secondary" style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}>
            <span>Preview Templates</span>
          </button>
        </div>

        {/* Card 05 */}
        <div className="glass-panel feature-card" style={{ padding: '28px', borderRadius: '24px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', opacity: 0.1, display: 'block', marginBottom: '12px' }}>05</span>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Sparkles size={24} color="#F59E0B" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '10px' }}>Cover Letter Generator</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Automatically draft persuasive, tailored 3-paragraph cover letters matching your resume background to any target role.
            </p>
          </div>
          <button onClick={() => setIsCoverLetterOpen(true)} className="btn btn-secondary" style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}>
            <span>Generate Cover Letter</span>
          </button>
        </div>

        {/* Card 06 */}
        <div className="glass-panel feature-card" style={{ padding: '28px', borderRadius: '24px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', opacity: 0.1, display: 'block', marginBottom: '12px' }}>06</span>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(0, 242, 254, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Target size={24} color="var(--accent-cyan)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '10px' }}>Job Application Tracker</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Organize your career search, track submitted resumes, and prepare for interviews with STAR-method Q&A.
            </p>
          </div>
          <button onClick={() => setIsJobMatcherOpen(true)} className="btn btn-secondary" style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}>
            <span>Track Application</span>
          </button>
        </div>
      </div>

      {/* Bonus AI Modals */}
      <JobMatcherModal
        isOpen={isJobMatcherOpen}
        onClose={() => setIsJobMatcherOpen(false)}
        resumeId={currentAnalysis?.id}
      />
      <CoverLetterModal
        isOpen={isCoverLetterOpen}
        onClose={() => setIsCoverLetterOpen(false)}
        resumeId={currentAnalysis?.id}
      />
      <InterviewPrepModal
        isOpen={isInterviewPrepOpen}
        onClose={() => setIsInterviewPrepOpen(false)}
        resumeId={currentAnalysis?.id}
      />
    </div>
  );
}
