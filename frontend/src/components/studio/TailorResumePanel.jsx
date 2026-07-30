import React, { useState } from 'react';
import { CheckCircle2, XCircle, Edit3, Sparkles, HelpCircle, ArrowRight, Send, AlertCircle, RefreshCw, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TailorResumePanel({ resumeData, onApplyTailorChange, isWorking }) {
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'matched' | 'rejected'
  
  // Interactive keyword cards from user screenshots
  const [keywords, setKeywords] = useState([
    {
      id: 'kw-1',
      type: 'MODIFIED',
      typeBadge: 'MODIFICATION',
      badgeColor: 'badge-green',
      keyword: 'database-driven solutions',
      placement: 'Bank Transaction – proj1',
      original: 'To apply and update Bank Transaction in this Project which is developed by VB.Net with SQL SERVER 2005.',
      modified: 'Architected and deployed database-driven solutions for the Bank Transaction platform using VB.Net and SQL Server 2005.',
      status: 'active', // 'active' | 'accepted' | 'rejected' | 'editing'
      reasoning: 'Replacing passive wording with "database-driven solutions" aligns directly with the target job requirements while accurately describing your SQL Server architecture.'
    },
    {
      id: 'kw-2',
      type: 'ADDED',
      typeBadge: '+ ADDITION',
      badgeColor: 'badge-cyan',
      keyword: 'front-end development',
      placement: 'Bank Transaction – proj1',
      suggested: 'Created front-end user interfaces using HTML, enabling customers to view and manage bank transactions within the application.',
      reasoning: 'The candidate lists HTML in their Skills, making it reasonable to claim front-end work on the Bank Transaction project. Adding this bullet showcases a broader skill set without overstating responsibility.',
      status: 'active'
    },
    {
      id: 'kw-3',
      type: 'PENDING',
      typeBadge: '? CONTEXTUAL MATCH',
      badgeColor: 'badge-warning',
      keyword: 'problem-solving skills',
      placement: 'Bank Transaction – proj1',
      question: '1. Did you demonstrate problem-solving skills while addressing challenges in the Bank Transaction project?\n2. If not, could you describe a situation where you solved a technical problem in any role or project?',
      answerText: '',
      status: 'active'
    },
    {
      id: 'kw-4',
      type: 'REINFORCED',
      typeBadge: '🔍 SKILLS REINFORCEMENT',
      badgeColor: 'badge-purple',
      keyword: 'Java, C++',
      placement: 'Skills section',
      explanation: 'Both Java and C++ are listed in the Skills section but do not appear in any work-experience bullet. Highlighting them here reinforces the candidate\'s technical toolkit for the hiring manager.',
      prompt: 'Do you have any concrete project or work experience where you applied Java or C++ that could be added to the resume?',
      status: 'active'
    }
  ]);

  const [editTexts, setEditTexts] = useState({});
  const [answerTexts, setAnswerTexts] = useState({});

  // Calculate stats
  const totalKeywords = 11;
  const acceptedCount = keywords.filter(k => k.status === 'accepted').length + 2; // Start with 2 already matched
  const activeCount = keywords.filter(k => k.status === 'active' || k.status === 'editing').length;
  const rejectedCount = keywords.filter(k => k.status === 'rejected').length;
  const matchPercentage = Math.min(100, Math.round((acceptedCount / totalKeywords) * 100));

  const handleAccept = (item, customText = null) => {
    const textToApply = customText || item.modified || item.suggested || `Demonstrated strong ${item.keyword} throughout project execution.`;
    
    setKeywords(prev => prev.map(k => k.id === item.id ? { ...k, status: 'accepted', finalAppliedText: textToApply } : k));
    
    // Confetti celebration
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });

    // Notify parent to update live resume preview & chat
    onApplyTailorChange(item.keyword, textToApply, item);
  };

  const handleReject = (item) => {
    setKeywords(prev => prev.map(k => k.id === item.id ? { ...k, status: 'rejected' } : k));
  };

  const handleStartEdit = (item) => {
    setEditTexts(prev => ({ ...prev, [item.id]: item.modified || item.suggested || '' }));
    setKeywords(prev => prev.map(k => k.id === item.id ? { ...k, status: 'editing' } : k));
  };

  const handleSaveEdit = (item) => {
    const edited = editTexts[item.id];
    handleAccept(item, edited);
  };

  const handleSendAnswer = (item) => {
    const ans = answerTexts[item.id] || 'Yes, applied problem-solving skills to resolve database deadlocks.';
    const formattedBullet = `Demonstrated exceptional problem-solving skills by troubleshooting and resolving core technical challenges (${ans.slice(0, 40)}...).`;
    handleAccept(item, formattedBullet);
  };

  const displayedKeywords = keywords.filter(k => {
    if (activeTab === 'active') return k.status === 'active' || k.status === 'editing';
    if (activeTab === 'matched') return k.status === 'accepted';
    if (activeTab === 'rejected') return k.status === 'rejected';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Target Role Keyword Match Box */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
              Keyword match
            </span>
            <h4 style={{ fontSize: '1.05rem', color: '#fff', margin: '2px 0 0 0' }}>Tailoring against your target role</h4>
          </div>
          <span className={`badge ${matchPercentage >= 70 ? 'badge-green' : 'badge-warning'}`}>
            {matchPercentage >= 70 ? 'Ready to apply' : 'Needs work'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--accent-cyan)', lineHeight: 1 }}>
            {matchPercentage}%
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
            {acceptedCount} of {totalKeywords} keywords integrated — <span style={{ color: 'var(--accent-warning)' }}>{Math.max(0, totalKeywords - acceptedCount)} to go</span>
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
          <div style={{
            width: `${matchPercentage}%`,
            height: '100%',
            background: 'var(--gradient-main)',
            borderRadius: '4px',
            transition: 'width 0.4s ease'
          }} />
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0 }}>
          ⓘ Job title & education aren't changed by tailoring, so they don't affect your progress.
        </p>
      </div>

      {/* Filter Tabs: Active | Already Matched | Rejected */}
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        <button
          onClick={() => setActiveTab('active')}
          style={{
            background: 'none', border: 'none', color: activeTab === 'active' ? 'var(--accent-cyan)' : 'var(--text-muted)',
            fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', paddingBottom: '4px',
            borderBottom: activeTab === 'active' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}
        >
          <span>Active</span>
          <span style={{ background: 'rgba(0, 242, 254, 0.15)', color: 'var(--accent-cyan)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem' }}>{activeCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('matched')}
          style={{
            background: 'none', border: 'none', color: activeTab === 'matched' ? 'var(--accent-green)' : 'var(--text-muted)',
            fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', paddingBottom: '4px',
            borderBottom: activeTab === 'matched' ? '2px solid var(--accent-green)' : '2px solid transparent',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}
        >
          <span>Already Matched</span>
          <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-green)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem' }}>{acceptedCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('rejected')}
          style={{
            background: 'none', border: 'none', color: activeTab === 'rejected' ? 'var(--accent-danger)' : 'var(--text-muted)',
            fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', paddingBottom: '4px',
            borderBottom: activeTab === 'rejected' ? '2px solid var(--accent-danger)' : '2px solid transparent',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}
        >
          <span>Rejected</span>
          <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-danger)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem' }}>{rejectedCount}</span>
        </button>
      </div>

      {/* Keywords Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {displayedKeywords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px dashed var(--border-color)' }}>
            No keywords currently in this category.
          </div>
        ) : (
          displayedKeywords.map((item) => (
            <div key={item.id} style={{
              background: item.status === 'accepted' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${item.status === 'accepted' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              position: 'relative'
            }}>
              {/* Card Header: Badge & Keyword */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>
                    KEYWORDS {item.type}
                  </span>
                  <h4 style={{ fontSize: '1.1rem', color: '#fff', margin: '2px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--accent-cyan)' }}>•</span>
                    <span>{item.keyword}</span>
                  </h4>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className={`badge ${item.badgeColor}`} style={{ fontSize: '0.65rem' }}>
                    {item.typeBadge}
                  </span>
                  {item.status === 'accepted' && (
                    <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>
                      ✓ Applied
                    </span>
                  )}
                </div>
              </div>

              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                PLACEMENT: {item.placement}
              </span>

              {/* Card Body depending on item type */}
              {item.type === 'MODIFIED' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      Original Bullet:
                    </span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>
                      {item.original}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-green)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      ⚡ AI Modified Bullet:
                    </span>
                    {item.status === 'editing' ? (
                      <textarea
                        value={editTexts[item.id] || ''}
                        onChange={(e) => setEditTexts(prev => ({ ...prev, [item.id]: e.target.value }))}
                        className="form-textarea"
                        style={{ minHeight: '80px', fontSize: '0.85rem' }}
                      />
                    ) : (
                      <p style={{ fontSize: '0.9rem', color: '#fff', margin: 0, fontWeight: 600, lineHeight: 1.5 }}>
                        {item.finalAppliedText || item.modified}
                      </p>
                    )}
                  </div>

                  {item.reasoning && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: '4px 0 0 0', borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                      💡 <strong>REASONING:</strong> {item.reasoning}
                    </p>
                  )}
                </div>
              )}

              {item.type === 'ADDED' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0, 242, 254, 0.04)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0, 242, 254, 0.15)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} />
                    <span>AI-Suggested Addition</span>
                  </span>

                  {item.status === 'editing' ? (
                    <textarea
                      value={editTexts[item.id] || ''}
                      onChange={(e) => setEditTexts(prev => ({ ...prev, [item.id]: e.target.value }))}
                      className="form-textarea"
                      style={{ minHeight: '80px', fontSize: '0.85rem' }}
                    />
                  ) : (
                    <p style={{ fontSize: '0.9rem', color: '#fff', margin: 0, fontWeight: 600, lineHeight: 1.5 }}>
                      {item.finalAppliedText || item.suggested}
                    </p>
                  )}

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0 0', borderTop: '1px dashed rgba(255,255,255,0.08)', paddingTop: '8px', lineHeight: 1.5 }}>
                    <strong>REASONING:</strong> {item.reasoning}
                  </p>
                </div>
              )}

              {item.type === 'PENDING' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(245, 158, 11, 0.04)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <HelpCircle size={14} />
                    <span>Clarifying Question:</span>
                  </span>

                  <p style={{ fontSize: '0.85rem', color: '#fff', margin: 0, lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                    {item.question}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Your Answer:</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Please provide details about your experience with these keywords..."
                        value={answerTexts[item.id] || ''}
                        onChange={(e) => setAnswerTexts(prev => ({ ...prev, [item.id]: e.target.value }))}
                        className="form-input"
                        style={{ flex: 1, fontSize: '0.85rem', padding: '8px 12px' }}
                      />
                      <button onClick={() => handleSendAnswer(item)} className="btn btn-primary" style={{ padding: '8px 14px', borderRadius: '8px' }}>
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {item.type === 'REINFORCED' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(159, 85, 255, 0.04)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(159, 85, 255, 0.2)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c48fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={14} />
                    <span>Explanation:</span>
                  </span>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.5 }}>
                    {item.explanation}
                  </p>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-warning)', display: 'block', marginBottom: '4px' }}>
                      Clarifying Prompt:
                    </span>
                    <p style={{ fontSize: '0.85rem', color: '#fff', margin: 0 }}>
                      {item.prompt}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons Footer (Exact from Screenshots: Reject | Accept | Edit / Fix with AI) */}
              {item.status !== 'accepted' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: '10px' }}>
                  <button
                    onClick={() => handleReject(item)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 16px', fontSize: '0.8rem', borderRadius: '8px' }}
                  >
                    <X size={14} />
                    <span>Reject</span>
                  </button>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {item.status === 'editing' ? (
                      <>
                        <button
                          onClick={() => setKeywords(prev => prev.map(k => k.id === item.id ? { ...k, status: 'active' } : k))}
                          className="btn btn-secondary"
                          style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '8px' }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(item)}
                          className="btn btn-primary"
                          style={{ padding: '6px 16px', fontSize: '0.8rem', borderRadius: '8px', background: '#10B981', color: '#fff' }}
                        >
                          <Check size={14} />
                          <span>Save & Apply</span>
                        </button>
                      </>
                    ) : (
                      <>
                        {(item.type === 'MODIFIED' || item.type === 'ADDED') && (
                          <>
                            <button
                              onClick={() => handleAccept(item)}
                              className="btn btn-primary"
                              style={{ padding: '6px 18px', fontSize: '0.85rem', borderRadius: '8px', background: '#2563EB', color: '#fff' }}
                            >
                              <span>{item.type === 'ADDED' ? 'Accept Addition' : 'Accept'}</span>
                            </button>
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="btn"
                              style={{ padding: '6px 16px', fontSize: '0.85rem', borderRadius: '8px', background: '#FACC15', color: '#000', fontWeight: 700 }}
                            >
                              <span>Edit</span>
                            </button>
                          </>
                        )}

                        {item.type === 'PENDING' && (
                          <button
                            onClick={() => handleSendAnswer(item)}
                            className="btn btn-primary"
                            style={{ padding: '6px 20px', fontSize: '0.85rem', borderRadius: '8px', background: '#2563EB', color: '#fff' }}
                          >
                            <span>Yes</span>
                          </button>
                        )}

                        {item.type === 'REINFORCED' && (
                          <button
                            onClick={() => handleAccept(item, "Developed Object-Oriented software architectures using Java and C++ to optimize data processing pipelines.")}
                            className="btn btn-primary"
                            style={{ padding: '6px 18px', fontSize: '0.85rem', borderRadius: '8px', background: '#2563EB', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <Sparkles size={14} />
                            <span>Fix with AI</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
