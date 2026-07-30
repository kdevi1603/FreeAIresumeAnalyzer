import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, Sparkles, Send, Mic, Download, Save,
  Undo2, Redo2, Bold, Italic, Underline, Strikethrough, Link as LinkIcon, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Briefcase, FileText
} from 'lucide-react';
import { aiService } from '../../services/aiService.js';

export default function CoverLetterStudio({ coverLetterName, onBack, onSave, initialContent }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hi there! I can help you improve your cover letter. Ask me for feedback, or improvements for specific sections.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');

  const [documentText, setDocumentText] = useState(initialContent || `[Your Name]<br>
[Position Title]<br>
[Your Address]<br>
[Your Email]<br>
[Your Phone]<br>
<br>
July 30, 2026<br>
<br>
[Hiring Manager Name]<br>
[Company Name]<br>
<br>
Dear Hiring Manager,<br>
<br>
I am writing to express my strong interest in the [Position Title] role at [Company Name]. With a proven track record in [Your Key Skill/Industry], I am confident in my ability to contribute effectively to your team's success. Throughout my career, I have consistently demonstrated a commitment to [specific professional goal or achievement].<br>
<br>
In my previous role at [Previous Company], I successfully [describe a key achievement or responsibility]. This experience has equipped me with the skills necessary to [relate to the job description requirements]. I am particularly drawn to [Company Name] because of [reason you want to work there, e.g., its innovative approach to X or its company culture].<br>
<br>
I would welcome the opportunity to discuss how my background, skills, and certifications will be beneficial to your team. Please find my resume attached for your review.<br>
<br>
Thank you for your time and consideration.<br>
<br>
Sincerely,<br>
<br>
[Your Name]`);

  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== documentText) {
      contentRef.current.innerHTML = documentText;
    }
  }, [documentText]);

  const prompts = [
    { title: 'Make my cover letter more compelling and professional', subtitle: 'Enhance overall impact and tone', icon: <Sparkles size={16} color="#eab308" /> },
    { title: 'Improve the opening paragraph to grab attention', subtitle: 'Create a strong first impression', icon: <Sparkles size={16} color="#3b82f6" /> },
    { title: 'Add more specific examples and achievements', subtitle: 'Make your experience stand out', icon: <Sparkles size={16} color="#10b981" /> }
  ];

  const handleSend = async (overrideText = null) => {
    const userMessage = typeof overrideText === 'string' ? overrideText : inputText;
    if (!userMessage.trim()) return;
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      text: userMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    
    setInputText('');
    
    // Call real AI service
    const response = await aiService.chatWithCoverLetterAgent(userMessage, documentText, messages);
    
    if (response.proposedFix && response.proposedFix.section === 'cover_letter') {
      let formattedContent = response.proposedFix.content
        .replace(/\n\n+/g, '<br><br>') 
        .replace(/(?<!<br>)\n(?!<br>)/g, '<br>');
      setDocumentText(formattedContent);
    }
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'bot',
      text: response.reply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*|### .*$)/g);
      return (
        <span key={i}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j}>{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('### ')) {
              return <strong key={j} style={{ display: 'block', marginTop: '8px', fontSize: '1.05rem', color: 'var(--accent-blue)' }}>{part.slice(4)}</strong>;
            }
            return part;
          })}
          {i < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', backgroundColor: 'var(--bg-dark)', overflow: 'hidden' }}>
      
      {/* Left Panel: Chat */}
      <div style={{ 
        width: '450px', 
        backgroundColor: 'var(--bg-card)', 
        borderRight: '1px solid var(--border-color)',
        display: 'flex', flexDirection: 'column'
      }}>
        
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', padding: '4px' }}>
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
              {coverLetterName || 'Cover Letter'}
            </h1>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI Assistant</span>
          </div>
        </div>

        {/* Top Badges */}
        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ fontSize: '0.8rem', padding: '4px 12px', border: '1px solid var(--border-color)', borderRadius: '16px', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}>Clear</button>
            <button style={{ fontSize: '0.8rem', padding: '4px 12px', border: '1px solid var(--border-color)', borderRadius: '16px', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}>Report Bug</button>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', padding: '4px 12px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '4px', fontWeight: 600 }}>
              <Briefcase size={14} /> No job selected
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', padding: '4px 12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '4px', fontWeight: 600 }}>
              <FileText size={14} /> No resume selected
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {messages.map((msg, i) => (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {msg.sender === 'bot' && <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Sparkles size={14} /></div>}
                <span>{msg.sender === 'bot' ? 'AI Resume Assistant' : 'You'}</span>
                <span>•</span>
                <span>{msg.time}</span>
              </div>
              <div style={{ 
                backgroundColor: msg.sender === 'user' ? 'var(--accent-blue)' : 'var(--bg-dark)', 
                color: msg.sender === 'user' ? '#fff' : 'var(--text-main)',
                padding: '16px', borderRadius: '12px', 
                borderTopLeftRadius: msg.sender === 'bot' ? '4px' : '12px',
                borderTopRightRadius: msg.sender === 'user' ? '4px' : '12px',
                maxWidth: '85%', fontSize: '0.95rem', lineHeight: 1.6
              }}>
                {renderMarkdown(msg.text)}
              </div>
            </div>
          ))}

          {/* Prompt Suggestions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '32px' }}>
            {prompts.map((p, i) => (
              <button key={i} onClick={() => handleSend(p.title)} style={{
                display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px',
                backgroundColor: 'var(--bg-card)', border: '1px dashed var(--border-color)',
                borderRadius: '12px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s'
              }}>
                <div style={{ marginTop: '2px' }}>{p.icon}</div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>{p.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.subtitle}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Box */}
        <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
          <div style={{ padding: '8px 12px', backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', color: '#8b5cf6', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <FileText size={16} /> COVER LETTER EXAMPLES
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', backgroundColor: 'var(--bg-dark)', padding: '12px 16px', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Message..."
              rows={1}
              style={{
                flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)',
                fontSize: '0.95rem', outline: 'none', resize: 'none', maxHeight: '100px'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}><Mic size={20} /></button>
            <button onClick={() => handleSend()} disabled={!inputText.trim()} style={{
              background: inputText.trim() ? 'var(--text-main)' : 'var(--text-muted)',
              color: 'var(--bg-dark)', border: 'none', borderRadius: '50%',
              width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: inputText.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s'
            }}>
              <Send size={16} />
            </button>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px' }}>
            Messages are processed by AI. Verify important information. Tokens left: 499
          </div>
        </div>

      </div>

      {/* Right Panel: Document */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-dark)' }}>
        
        {/* Editor Toolbar */}
        <div style={{ padding: '12px 24px', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onMouseDown={(e) => { e.preventDefault(); handleFormat('undo'); }} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><Undo2 size={18} /></button>
            <button onMouseDown={(e) => { e.preventDefault(); handleFormat('redo'); }} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><Redo2 size={18} /></button>
            <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)' }} />
            
            <select onChange={(e) => handleFormat('formatBlock', e.target.value)} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none', cursor: 'pointer' }}>
              <option value="P">Normal text</option>
              <option value="H1">Heading 1</option>
              <option value="H2">Heading 2</option>
              <option value="H3">Heading 3</option>
            </select>
            <select onChange={(e) => handleFormat('fontName', e.target.value)} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none', cursor: 'pointer' }}>
              <option value="Times New Roman">Default</option>
              <option value="Arial">Arial</option>
              <option value="Courier New">Courier New</option>
            </select>
            
            <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)' }} />
            <button onMouseDown={(e) => { e.preventDefault(); handleFormat('bold'); }} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><Bold size={18} /></button>
            <button onMouseDown={(e) => { e.preventDefault(); handleFormat('italic'); }} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><Italic size={18} /></button>
            <button onMouseDown={(e) => { e.preventDefault(); handleFormat('underline'); }} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><Underline size={18} /></button>
            <button onMouseDown={(e) => { e.preventDefault(); handleFormat('strikethrough'); }} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><Strikethrough size={18} /></button>
            <button onMouseDown={(e) => { e.preventDefault(); const url = prompt('Enter URL:'); if (url) handleFormat('createLink', url); }} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><LinkIcon size={18} /></button>
            
            <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)' }} />
            <button onMouseDown={(e) => { e.preventDefault(); handleFormat('justifyLeft'); }} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><AlignLeft size={18} /></button>
            <button onMouseDown={(e) => { e.preventDefault(); handleFormat('justifyCenter'); }} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><AlignCenter size={18} /></button>
            <button onMouseDown={(e) => { e.preventDefault(); handleFormat('justifyRight'); }} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><AlignRight size={18} /></button>
            <button onMouseDown={(e) => { e.preventDefault(); handleFormat('justifyFull'); }} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><AlignJustify size={18} /></button>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
              <Download size={16} /> PDF
            </button>
            <button onClick={() => { if(onSave) onSave(documentText); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--text-main)', color: 'var(--bg-dark)', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              <Save size={16} /> Save
            </button>
          </div>
        </div>

        {/* Document Canvas */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '40px', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '100%', maxWidth: '800px', backgroundColor: '#fff', 
            minHeight: '1056px', padding: '80px', borderRadius: '4px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', color: '#000',
            position: 'relative'
          }}>
            {/* Template Badge (Mockup) */}
            <div style={{ position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#fef3c7', padding: '8px 24px', borderRadius: '24px', color: '#92400e', border: '1px solid #fde68a' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px' }}>TEMPLATE</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Traditional Format</div>
            </div>

            <div 
              ref={contentRef}
              className="a4-print-container"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => setDocumentText(e.currentTarget.innerHTML)}
              style={{
                width: '100%', minHeight: '100%',
                border: 'none', outline: 'none', background: 'transparent',
                fontSize: '1rem', lineHeight: 1.8,
                fontFamily: "'Times New Roman', serif", color: '#1a1a1a'
              }}
            />
          </div>
        </div>

      </div>

    </div>
  );
}
