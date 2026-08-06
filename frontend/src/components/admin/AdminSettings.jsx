import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    logoUrl: '',
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: '',
    seoTitle: '',
    seoDescription: '',
    geminiApiKey: '',
    openaiApiKey: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/settings', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSettings(prev => ({ ...prev, ...data }));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    setMessage('');
    
    fetch('http://localhost:5000/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(settings)
    })
      .then(res => res.json())
      .then(data => {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
        setSaving(false);
      })
      .catch(err => {
        console.error(err);
        setMessage('Error saving settings.');
        setSaving(false);
      });
  };

  if (loading) {
    return <div style={{ color: 'var(--text-main)', padding: '24px' }}>Loading settings...</div>;
  }

  const sectionStyle = {
    background: 'var(--bg-card)', 
    padding: '24px', 
    borderRadius: '16px', 
    border: '1px solid var(--border-color)',
    marginBottom: '24px'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-main)',
    color: 'var(--text-main)',
    marginBottom: '16px',
    marginTop: '6px'
  };

  return (
    <div style={{ color: 'var(--text-main)', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Settings</h1>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="btn" 
          style={{ background: 'var(--gradient-main)', color: '#000', fontWeight: 'bold' }}
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', background: message.includes('Error') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: message.includes('Error') ? '#EF4444' : '#10B981', border: `1px solid ${message.includes('Error') ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}` }}>
          {message}
        </div>
      )}

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Site Branding</h2>
        <label>
          Logo URL
          <input type="text" name="logoUrl" value={settings.logoUrl || ''} onChange={handleChange} style={inputStyle} placeholder="https://example.com/logo.png" />
        </label>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>SEO Settings</h2>
        <label>
          Meta Title
          <input type="text" name="seoTitle" value={settings.seoTitle || ''} onChange={handleChange} style={inputStyle} placeholder="Free AI Resume Analyzer" />
        </label>
        <label>
          Meta Description
          <textarea name="seoDescription" value={settings.seoDescription || ''} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Transform your resume with AI..." />
        </label>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>API Keys</h2>
        <label>
          Google Gemini API Key
          <input type="password" name="geminiApiKey" value={settings.geminiApiKey || ''} onChange={handleChange} style={inputStyle} placeholder="AIzaSy..." />
        </label>
        <label>
          OpenAI API Key
          <input type="password" name="openaiApiKey" value={settings.openaiApiKey || ''} onChange={handleChange} style={inputStyle} placeholder="sk-..." />
        </label>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>SMTP Configuration</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <label>
            SMTP Host
            <input type="text" name="smtpHost" value={settings.smtpHost || ''} onChange={handleChange} style={inputStyle} placeholder="smtp.gmail.com" />
          </label>
          <label>
            SMTP Port
            <input type="text" name="smtpPort" value={settings.smtpPort || ''} onChange={handleChange} style={inputStyle} placeholder="587" />
          </label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <label>
            SMTP Username
            <input type="text" name="smtpUser" value={settings.smtpUser || ''} onChange={handleChange} style={inputStyle} placeholder="email@example.com" />
          </label>
          <label>
            SMTP Password
            <input type="password" name="smtpPass" value={settings.smtpPass || ''} onChange={handleChange} style={inputStyle} placeholder="••••••••" />
          </label>
        </div>
      </div>
    </div>
  );
}
