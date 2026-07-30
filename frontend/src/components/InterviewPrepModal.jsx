import React, { useState } from 'react';
import { resumeService } from '../services/api.js';
import { HelpCircle, MessageSquare, Lightbulb, CheckCircle2, Loader2, Sparkles, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function InterviewPrepModal({ isOpen, onClose, resumeId }) {
  const [jobTitle, setJobTitle] = useState('Software Engineer');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!jobTitle.trim()) {
      setError('Please enter a target job title.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await resumeService.generateInterviewQuestions(resumeId, jobTitle);
      setQuestions(data.questions || []);
      if (data.questions?.length > 0) setOpenIndex(0);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating interview questions.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const getCategoryColor = (cat) => {
    if (cat === 'Technical') return 'badge-cyan';
    if (cat === 'Behavioral') return 'badge-purple';
    if (cat === 'System Design') return 'badge-green';
    return 'badge-warning';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }} className="animate-fade-in">
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '32px',
        position: 'relative',
        borderRadius: '24px'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={22} color="var(--accent-green)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', margin: 0 }}>AI Interview Question Generator</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Practice with custom questions tailored to your exact resume experience</span>
          </div>
        </div>

        {questions.length === 0 ? (
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '16px' }}>
              Enter the job title you are applying for. Our AI will analyze your specific technologies and projects to generate likely technical & behavioral interview questions.
            </p>

            {error && (
              <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-danger)', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Target Role / Specialization</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Senior Full Stack Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            <button
              onClick={handleGenerate}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', justifyContent: 'center', fontSize: '1rem' }}
              disabled={loading || !jobTitle.trim()}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-pulse" style={{ animation: 'spin 1.5s linear infinite' }} />
                  <span>AI Analyzing Resume Experience...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Generate Tailored Questions</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span className="badge badge-green">🎯 {questions.length} Questions Generated for {jobTitle}</span>
              <button
                onClick={() => setQuestions([])}
                className="btn btn-secondary"
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                Change Role
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {questions.map((q, idx) => {
                const isOpenItem = openIndex === idx;
                return (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.2s' }}>
                    <div
                      onClick={() => toggleAccordion(idx)}
                      style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: isOpenItem ? 'rgba(255,255,255,0.05)' : 'transparent' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                          {idx + 1}
                        </span>
                        <div>
                          <span className={`badge ${getCategoryColor(q.category)}`} style={{ fontSize: '0.65rem', marginBottom: '6px' }}>
                            {q.category || 'General'}
                          </span>
                          <h4 style={{ fontSize: '1rem', color: '#fff', margin: 0, lineHeight: 1.4 }}>{q.question}</h4>
                        </div>
                      </div>
                      {isOpenItem ? <ChevronUp size={20} color="var(--accent-cyan)" /> : <ChevronDown size={20} color="var(--text-dim)" />}
                    </div>

                    {isOpenItem && (
                      <div style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'rgba(0, 242, 254, 0.05)', padding: '14px', borderRadius: '12px', borderLeft: '3px solid var(--accent-cyan)' }}>
                          <Lightbulb size={18} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                              Recruiter Tip — Why they ask this
                            </span>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.5 }}>
                              {q.tip}
                            </p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'rgba(16, 185, 129, 0.05)', padding: '14px', borderRadius: '12px', borderLeft: '3px solid var(--accent-green)' }}>
                          <CheckCircle2 size={18} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: 2 }} />
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                              Sample STAR Framework Answer
                            </span>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.5 }}>
                              {q.sampleAnswer}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={onClose} className="btn btn-primary">
                Done Studying
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
