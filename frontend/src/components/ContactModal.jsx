import React, { useState } from 'react';
import { Mail, Github, Linkedin, Send, X } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate sending
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
        onClose();
      }, 3000);
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '20px'
    }}>
      <div className="animate-fade-in" style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-glow)',
        borderRadius: '24px', width: '100%', maxWidth: '500px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)', 
        maxHeight: '90vh', display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-main)' }}>Get in Touch</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '32px', overflowY: 'auto' }}>
          {/* Social Links Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '32px' }}>
            <a href="mailto:your.email@gmail.com" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.03)', padding: '16px 12px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
              <Mail size={24} color="#00F2FE" />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email</span>
            </a>
            <a href="https://github.com/your-profile" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.03)', padding: '16px 12px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
              <Github size={24} color="var(--text-main)" />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>GitHub</span>
            </a>
            <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.03)', padding: '16px 12px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
              <Linkedin size={24} color="#0A66C2" />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>LinkedIn</span>
            </a>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ height: '1px', flex: 1, background: 'var(--border-color)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>Or Message Us</span>
            <div style={{ height: '1px', flex: 1, background: 'var(--border-color)' }} />
          </div>

          {/* Form */}
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Send size={32} color="#10B981" />
              </div>
              <h4 style={{ color: 'var(--text-main)', fontSize: '1.2rem', margin: '0 0 8px 0' }}>Message Sent!</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Thank you for reaching out. We will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="form-input" style={{ width: '100%', marginBottom: '6px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="form-input" style={{ width: '100%', marginBottom: '6px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Message</label>
                <textarea required rows="4" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="form-input" style={{ width: '100%', resize: 'none', marginBottom: '6px' }} />
              </div>
              <button disabled={isSubmitting} type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '12px', marginTop: '8px', justifyContent: 'center' }}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
