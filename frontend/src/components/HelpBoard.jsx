import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, BookOpen, MessageCircle, PlayCircle, HelpCircle, 
  Mail, Bot, ChevronDown, ChevronUp, FileText, Briefcase, X, Send
} from 'lucide-react';

export default function HelpBoard({ setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [contactSent, setContactSent] = useState(false);
  
  // Modals state
  const [showChatModal, setShowChatModal] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hi there! I am your AI Support Assistant. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  const allFaqs = [
    { question: 'How do I upload a resume?', answer: 'Click on the "My Resumes" tab and click the "Create New" button to upload a PDF, DOCX, or image file of your resume.' },
    { question: 'What does the ATS Score mean?', answer: 'The ATS Score represents how well your resume matches a specific job description based on keywords, skills, and formatting. A score above 80% is considered highly competitive.' },
    { question: 'How can the AI help me?', answer: 'Our AI can rewrite sections of your resume (like the summary or work experience) to use stronger action verbs, correct grammar, and embed high-priority keywords from your target job.' },
    { question: 'Are my cover letters saved automatically?', answer: 'Yes! Once you generate a cover letter, it is saved under the "My Cover Letters" tab where you can view, edit, or download it later.' },
    { question: 'How do I delete my account?', answer: 'Currently, account deletion must be requested via Contact Support. Send us a message and we will process it within 24 hours.' }
  ];

  const filteredFaqs = allFaqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSent(true);
    e.target.reset();
    setTimeout(() => setContactSent(false), 3000);
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [...prev, { sender: 'user', text: chatInput }]);
    const currentInput = chatInput;
    setChatInput('');

    // Simulate AI typing response
    setTimeout(() => {
      let reply = "I'm a simulated AI assistant for this demo. If this were live, I'd give you a highly accurate answer!";
      if (currentInput.toLowerCase().includes('ats')) {
        if (currentInput.toLowerCase().includes('mean') || currentInput.toLowerCase().includes('what')) {
          reply = "The ATS Score represents how well your resume matches a specific job description based on keywords, skills, and formatting. A score above 80% is considered highly competitive.";
        } else {
          reply = "To improve your ATS score, navigate to the 'Jobs' tab, paste a job description, and apply the AI's suggested keywords to your resume.";
        }
      } else if (currentInput.toLowerCase().includes('cover letter')) {
        reply = "You can generate a cover letter by going to the 'My Cover Letters' tab and clicking 'Create New Cover Letter'.";
      } else if (currentInput.toLowerCase().includes('upload') || currentInput.toLowerCase().includes('resume')) {
        reply = "Click on the 'My Resumes' tab and click the 'Create New' button to upload a PDF, DOCX, or image file of your resume.";
      } else if (currentInput.toLowerCase().includes('template')) {
        reply = "All our resume templates are completely free to use! You can switch between them anytime in the Resume editor.";
      }
      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 1000);
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, showChatModal]);

  return (
    <div style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header & Search */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px' }}>
          How can we help you?
        </h1>
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search for guides, FAQs, or tutorials..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setOpenFaq(null); // Reset accordion when searching
            }}
            style={{
              width: '100%', padding: '16px 20px 16px 52px',
              backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: '30px', fontSize: '1rem', color: 'var(--text-main)',
              outline: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--accent-blue)'; e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        
        {/* Quick Help Cards */}
        <div style={cardStyle} onClick={() => setActiveTab && setActiveTab('My Resumes')}>
          <div style={iconWrapperStyle('var(--accent-blue)')}><BookOpen size={24} color="var(--accent-blue)" /></div>
          <h3 style={cardTitleStyle}>Quick Guide</h3>
          <p style={cardTextStyle}>Learn the basics of creating, editing, and optimizing your first resume with AI.</p>
        </div>

        <div style={cardStyle} onClick={() => setActiveTab && setActiveTab('Jobs')}>
          <div style={iconWrapperStyle('var(--accent-purple)')}><Briefcase size={24} color="var(--accent-purple)" /></div>
          <h3 style={cardTitleStyle}>Job Matching</h3>
          <p style={cardTextStyle}>Understand how to use the job matching feature to boost your ATS score and get hired.</p>
        </div>

        <div style={cardStyle} onClick={() => setActiveTab && setActiveTab('My Cover Letters')}>
          <div style={iconWrapperStyle('var(--accent-cyan)')}><FileText size={24} color="var(--accent-cyan)" /></div>
          <h3 style={cardTitleStyle}>Cover Letters</h3>
          <p style={cardTextStyle}>Discover how to automatically generate tailored cover letters for any job description.</p>
        </div>

        {/* AI Help Assistant Card (Highlight) */}
        <div 
          onClick={() => setShowChatModal(true)}
          style={{...cardStyle, background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(59, 130, 246, 0.05) 100%)', border: '1px solid rgba(59, 130, 246, 0.2)'}}
        >
          <div style={iconWrapperStyle('#3b82f6')}><Bot size={24} color="#3b82f6" /></div>
          <h3 style={cardTitleStyle}>AI Help Assistant</h3>
          <p style={cardTextStyle}>Stuck? Chat with our AI support agent to get instant, personalized help and answers.</p>
          <button style={{
            marginTop: '16px', padding: '10px 20px', backgroundColor: 'var(--accent-blue)', color: '#fff',
            border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'none'
          }}>
            <MessageCircle size={16} /> Start Chat
          </button>
        </div>

      </div>

      <div className="responsive-grid responsive-grid-2-1" style={{ alignItems: 'start' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* FAQ Section */}
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '32px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <HelpCircle color="var(--accent-cyan)" /> Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <div key={index} style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                    <div 
                      onClick={() => toggleFaq(index)}
                      style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: 'var(--bg-dark)' }}
                    >
                      <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>{faq.question}</span>
                      {openFaq === index ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                    </div>
                    {openFaq === index && (
                      <div className="animate-fade-in" style={{ padding: '20px', fontSize: '0.95rem', color: 'var(--text-dim)', backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', lineHeight: '1.6' }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No FAQs found for "{searchQuery}". Try a different keyword!
                </div>
              )}
            </div>
          </div>

          {/* Video Tutorials */}
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '32px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <PlayCircle color="var(--accent-purple)" /> Video Tutorials
            </h2>
            <div className="responsive-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div style={videoPlaceholderStyle} onClick={() => setActiveVideoUrl('https://www.youtube.com/embed/Tt08KmFfIYQ')}>
                <PlayCircle size={40} color="#fff" style={{ opacity: 0.8 }} />
                <span style={{ color: '#fff', fontWeight: 600, marginTop: '8px', zIndex: 1 }}>How to Optimize your Resume</span>
              </div>
              <div style={videoPlaceholderStyle} onClick={() => setActiveVideoUrl('https://www.youtube.com/embed/mxOli8laZos')}>
                <PlayCircle size={40} color="#fff" style={{ opacity: 0.8 }} />
                <span style={{ color: '#fff', fontWeight: 600, marginTop: '8px', zIndex: 1 }}>Using the AI Cover Letter Gen</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '32px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Mail color="var(--text-main)" /> Contact Support
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Can't find what you're looking for? Send us a message and our team will get back to you shortly.
          </p>
          
          <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Subject</label>
              <input type="text" placeholder="How can we help?" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Message</label>
              <textarea placeholder="Describe your issue..." rows="4" required style={{...inputStyle, resize: 'vertical'}}></textarea>
            </div>
            
            <button type="submit" style={{
              width: '100%', padding: '14px', backgroundColor: 'var(--text-main)', color: '#fff',
              border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
              marginTop: '8px'
            }}>
              Send Message
            </button>
            
            {contactSent && (
              <div className="animate-fade-in" style={{ color: '#10B981', fontSize: '0.9rem', textAlign: 'center', fontWeight: 600, marginTop: '8px' }}>
                Message sent successfully! We'll reply soon.
              </div>
            )}
          </form>
        </div>

      </div>

      {/* AI Chat Modal */}
      {showChatModal && (
        <div style={modalOverlayStyle}>
          <div style={{...modalContentStyle, maxWidth: '400px', height: '600px', display: 'flex', flexDirection: 'column', padding: 0}}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-dark)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={18} color="#fff" />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>AI Support Agent</h3>
              </div>
              <button onClick={() => setShowChatModal(false)} style={iconButtonStyle}><X size={20} /></button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-card)' }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{ 
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.sender === 'user' ? 'var(--accent-blue)' : 'var(--bg-dark)',
                  color: msg.sender === 'user' ? '#fff' : 'var(--text-main)',
                  padding: '12px 16px', borderRadius: '12px', maxWidth: '80%',
                  fontSize: '0.95rem', lineHeight: '1.4',
                  borderBottomRightRadius: msg.sender === 'user' ? 0 : '12px',
                  borderBottomLeftRadius: msg.sender === 'bot' ? 0 : '12px',
                }}>
                  {msg.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendChatMessage} style={{ padding: '16px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="Type your question..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none' }}
              />
              <button type="submit" disabled={!chatInput.trim()} style={{
                width: '44px', height: '44px', borderRadius: '50%', backgroundColor: chatInput.trim() ? 'var(--accent-blue)' : 'var(--bg-card)', 
                color: chatInput.trim() ? '#fff' : 'var(--text-muted)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: chatInput.trim() ? 'pointer' : 'default', transition: 'all 0.2s'
              }}>
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {activeVideoUrl && (
        <div style={modalOverlayStyle} onClick={() => setActiveVideoUrl(null)}>
          <div style={{...modalContentStyle, width: '800px', height: '500px', padding: 0, overflow: 'hidden'}} onClick={(e) => e.stopPropagation()}>
            <div style={{ position: 'absolute', top: '-40px', right: 0 }}>
              <button onClick={() => setActiveVideoUrl(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <iframe 
              width="100%" 
              height="100%" 
              src={activeVideoUrl} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

    </div>
  );
}

// Reusable Styles
const cardStyle = {
  backgroundColor: 'var(--bg-card)',
  borderRadius: '16px',
  padding: '24px',
  border: '1px solid var(--border-color)',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  cursor: 'pointer',
};

const iconWrapperStyle = (color) => ({
  width: '48px', height: '48px', 
  borderRadius: '12px', 
  backgroundColor: `${color}15`, 
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  marginBottom: '16px'
});

const cardTitleStyle = {
  fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 8px 0'
};

const cardTextStyle = {
  fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5'
};

const labelStyle = {
  display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px'
};

const inputStyle = {
  width: '100%', padding: '12px',
  backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)',
  borderRadius: '8px', fontSize: '0.95rem', color: 'var(--text-main)',
  outline: 'none', boxSizing: 'border-box'
};

const videoPlaceholderStyle = {
  width: '100%', height: '160px', 
  backgroundColor: 'var(--bg-dark)', 
  borderRadius: '12px', 
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  position: 'relative', cursor: 'pointer', overflow: 'hidden',
  backgroundImage: 'linear-gradient(45deg, var(--bg-card), var(--bg-dark))',
  transition: 'transform 0.2s',
  border: '1px solid var(--border-color)'
};

const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 9999, animation: 'fadeIn 0.2s ease-out'
};

const modalContentStyle = {
  backgroundColor: 'var(--bg-card)', borderRadius: '16px',
  width: '100%', border: '1px solid var(--border-color)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.2)', position: 'relative'
};

const iconButtonStyle = {
  background: 'none', border: 'none', color: 'var(--text-muted)',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px'
};
