import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Paperclip, Smile, Sparkles } from 'lucide-react';

export default function AiAgentChat({ resumeData, chatMessages, onSendMessage, isTyping, autoFixMessage, onApplyFix }) {
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const emojis = ['😀', '😂', '🥺', '😎', '👍', '🔥', '🚀', '✨', '💡', '✅'];

  const handleEmojiClick = (emoji) => {
    setInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput(prev => prev + (prev ? ' ' : '') + `[Attached: ${file.name}]`);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping, autoFixMessage]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;
    onSendMessage(input);
    setInput('');
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
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
    }}>
      {/* Blue Header */}
      <div style={{
        background: 'var(--accent-blue)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        position: 'relative'
      }}>
        {/* Wavy bottom border effect - simulated with a slight rounded bottom curve if we want, but clean straight is fine */}
        <div style={{
          width: '42px', height: '42px', borderRadius: '50%', background: '#fff', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <Bot size={24} color="var(--accent-blue)" />
        </div>
        <div>
          <h4 style={{ fontSize: '1.1rem', color: '#fff', margin: '0 0 4px 0', fontWeight: 600 }}>Chat with AI Assistant</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></span>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)' }}>AI Agent</span>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-dark)'
      }}>
        {chatMessages.map((msg, idx) => {
          const isBot = msg.sender === 'bot';
          return (
            <div key={idx} style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              alignSelf: isBot ? 'flex-start' : 'flex-end',
              maxWidth: '85%'
            }}>
              <div style={{
                background: isBot ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-card)',
                color: 'var(--text-main)',
                padding: '14px 18px',
                borderRadius: isBot ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                border: isBot ? '1px solid rgba(37, 99, 235, 0.2)' : '1px solid var(--border-color)',
                fontSize: '0.95rem',
                lineHeight: 1.5,
                boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
              }}>
                {renderMarkdown(msg.text)}

                {msg.proposedFix && (
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ 
                      padding: '12px', 
                      background: isBot ? 'rgba(255,255,255,0.5)' : '#f8fafc', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color)', 
                      fontSize: '0.85rem', 
                      marginBottom: '12px', 
                      color: 'var(--text-main)', 
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}>
                      {msg.proposedFix.content || '/* Formatting updates */'}
                    </div>
                    {!msg.proposedFix.applied && (
                      <button
                        onClick={() => onApplyFix && onApplyFix(msg.proposedFix.section, msg.proposedFix.content)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'var(--accent-blue)',
                          border: 'none',
                          color: '#fff',
                          padding: '10px 16px',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
                      >
                        <Sparkles size={16} />
                        Apply Fix to Resume
                      </button>
                    )}
                  </div>
                )}

                {msg.options && (
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {msg.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => onSendMessage(opt.text || opt)}
                        style={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--accent-blue)',
                          color: 'var(--accent-blue)',
                          padding: '10px 16px',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => { e.target.style.background = 'var(--accent-blue)'; e.target.style.color = '#fff'; }}
                        onMouseOut={(e) => { e.target.style.background = 'var(--bg-card)'; e.target.style.color = 'var(--accent-blue)'; }}
                      >
                        {opt.text || opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {autoFixMessage && (
          <div className="animate-fade-in" style={{
            background: 'var(--bg-card)', border: '1px solid var(--accent-blue)', borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 4px 12px rgba(0, 102, 255, 0.1)'
          }}>
            <Bot size={20} color="var(--accent-blue)" />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>{autoFixMessage}</span>
            </div>
          </div>
        )}

        {isTyping && !autoFixMessage && (
          <div style={{ alignSelf: 'flex-start', background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '12px 18px', borderRadius: '4px 16px 16px 16px', display: 'flex', gap: '6px' }}>
            <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-blue)' }} />
            <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-blue)', animationDelay: '0.2s' }} />
            <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-blue)', animationDelay: '0.4s' }} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div style={{ position: 'relative' }}>
        {showEmojiPicker && (
          <div style={{
            position: 'absolute', bottom: '0px', left: '20px', marginBottom: '10px',
            background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px',
            padding: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap', width: '220px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10
          }}>
            {emojis.map(emoji => (
              <span key={emoji} onClick={() => handleEmojiClick(emoji)} style={{
                cursor: 'pointer', fontSize: '1.2rem', padding: '4px', borderRadius: '4px',
                transition: 'background 0.2s'
              }} onMouseOver={e => e.target.style.background = 'var(--bg-dark)'} onMouseOut={e => e.target.style.background = 'transparent'}>
                {emoji}
              </span>
            ))}
          </div>
        )}
      </div>
      <form onSubmit={handleSend} style={{
        padding: '16px 20px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px', alignItems: 'center'
      }}>
        <Smile size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
        <Paperclip size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()} />
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
        <input
          type="text"
          placeholder="Enter your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent', padding: '8px', fontSize: '0.95rem', color: 'var(--text-main)'
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          style={{
            background: 'var(--accent-blue)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', color: '#fff', opacity: (!input.trim() || isTyping) ? 0.5 : 1
          }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
