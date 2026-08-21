import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Palette, FileText, Cpu, Mail, Key, Search, Shield, 
  Database, RefreshCw, Link2, Bell, Info, Save, RotateCcw, 
  CheckCircle, AlertTriangle, Eye, EyeOff, Activity, Upload, Server,
  X, Download, Trash2, Check, ExternalLink, HardDrive, ShieldCheck
} from 'lucide-react';

// --- Components ---
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.3 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium
      ${type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : ''}
      ${type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : ''}
      ${type === 'info' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : ''}
    `}
  >
    {type === 'success' && <CheckCircle size={18} />}
    {type === 'error' && <AlertTriangle size={18} />}
    {type === 'info' && <Activity size={18} />}
    {message}
    <button onClick={onClose} className="ml-2 hover:opacity-70"><X size={16} /></button>
  </motion.div>
);

const ToggleSwitch = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
  </label>
);

const InputField = ({ label, name, type = 'text', value, onChange, placeholder, isPassword }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">{label}</label>
      <div className="relative">
        <input 
          type={isPassword && !show ? 'password' : type} 
          name={name} 
          value={value || ''} 
          onChange={onChange} 
          placeholder={placeholder}
          className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-[var(--text-main)] transition-all" 
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[var(--text-main)]">
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

// --- Main Application ---
export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [originalSettings, setOriginalSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [activeSection, setActiveSection] = useState('General');
  const [toasts, setToasts] = useState([]);
  
  // Test states
  const [testingAI, setTestingAI] = useState(false);
  const [testingSMTP, setTestingSMTP] = useState(false);

  const SECTIONS = [
    { id: 'General', icon: Settings },
    { id: 'Branding', icon: Palette },
    { id: 'Resume Settings', icon: FileText },
    { id: 'AI Configuration', icon: Cpu },
    { id: 'SMTP Configuration', icon: Mail },
    { id: 'API Keys', icon: Key },
    { id: 'SEO Settings', icon: Search },
    { id: 'Security', icon: Shield },
    { id: 'Storage', icon: Database },
    { id: 'Backup & Restore', icon: RefreshCw },
    { id: 'Integrations', icon: Link2 },
    { id: 'Notifications', icon: Bell },
    { id: 'System Information', icon: Info },
    { id: 'Activity Log', icon: Activity }
  ];

  const getHeaders = () => ({ 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' });

  useEffect(() => {
    fetch('/api/admin/settings', { headers: getHeaders() })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSettings(data);
          setOriginalSettings(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        showToast('Failed to load settings', 'error');
        setLoading(false);
      });
  }, []);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleToggle = (name) => {
    setSettings(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const hasUnsavedChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        setOriginalSettings(settings);
        showToast('Settings saved successfully!');
      } else {
        showToast('Error saving settings', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    }
    setSaving(false);
  };

  const handleReset = () => {
    setSettings(originalSettings);
    showToast('Changes discarded', 'info');
  };

  const simulateTest = (setter, name) => {
    setter(true);
    setTimeout(() => {
      setter(false);
      showToast(`${name} Connection Successful!`, 'success');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="text-[var(--text-muted)] font-medium">Loading settings...</p>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'General':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Website Name" name="websiteName" value={settings.websiteName} onChange={handleChange} placeholder="e.g. AI Resume Builder" />
              <InputField label="Website URL" name="websiteUrl" value={settings.websiteUrl} onChange={handleChange} placeholder="https://example.com" />
              <InputField label="Admin Email" name="adminEmail" value={settings.adminEmail} onChange={handleChange} placeholder="admin@example.com" />
              <InputField label="Support Email" name="supportEmail" value={settings.supportEmail} onChange={handleChange} placeholder="support@example.com" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Timezone</label>
                <select name="timezone" value={settings.timezone || 'UTC'} onChange={handleChange} className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-[var(--text-main)]">
                  <option value="UTC">UTC (Universal Coordinated Time)</option>
                  <option value="EST">EST (Eastern Standard Time)</option>
                  <option value="PST">PST (Pacific Standard Time)</option>
                  <option value="IST">IST (Indian Standard Time)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Default Theme</label>
                <select name="defaultTheme" value={settings.defaultTheme || 'System'} onChange={handleChange} className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-[var(--text-main)]">
                  <option value="System">System Default</option>
                  <option value="Light">Light Mode</option>
                  <option value="Dark">Dark Mode</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mt-4">
              <div>
                <p className="text-sm font-semibold text-amber-600">Maintenance Mode</p>
                <p className="text-xs text-amber-600/80 mt-0.5">When enabled, the site will be inaccessible to standard users.</p>
              </div>
              <ToggleSwitch checked={settings.maintenanceMode} onChange={() => handleToggle('maintenanceMode')} />
            </div>
          </div>
        );

      case 'Branding':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-5">
                <InputField label="Logo URL" name="logoUrl" value={settings.logoUrl} onChange={handleChange} placeholder="https://example.com/logo.png" />
                <InputField label="Favicon URL" name="faviconUrl" value={settings.faviconUrl} onChange={handleChange} placeholder="https://example.com/favicon.ico" />
                <InputField label="Website Title (Header)" name="websiteTitle" value={settings.websiteTitle} onChange={handleChange} placeholder="AI Resume Analyzer" />
                <InputField label="Footer Copyright" name="footerCopyright" value={settings.footerCopyright} onChange={handleChange} placeholder="© 2026 AI Resume Analyzer. All rights reserved." />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Primary Color</label>
                    <div className="flex gap-3 items-center">
                      <input type="color" name="primaryColor" value={settings.primaryColor || '#3B82F6'} onChange={handleChange} className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                      <span className="text-sm font-mono text-[var(--text-muted)]">{settings.primaryColor || '#3B82F6'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Secondary Color</label>
                    <div className="flex gap-3 items-center">
                      <input type="color" name="secondaryColor" value={settings.secondaryColor || '#8B5CF6'} onChange={handleChange} className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                      <span className="text-sm font-mono text-[var(--text-muted)]">{settings.secondaryColor || '#8B5CF6'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Live Preview Mock */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Live Preview</label>
                <div className="border border-[var(--border-color)] rounded-2xl overflow-hidden bg-[var(--bg-main)] shadow-sm">
                  <div className="h-12 border-b border-[var(--border-color)] flex items-center px-4 justify-between bg-[var(--bg-card)]">
                    <div className="flex items-center gap-2">
                      {settings.logoUrl ? <img src={settings.logoUrl} alt="Logo" className="h-6" /> : <div className="w-6 h-6 rounded-md bg-blue-500"></div>}
                      <span className="font-bold text-sm" style={{ color: settings.primaryColor || '#3B82F6' }}>{settings.websiteTitle || 'Brand Name'}</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-12 h-3 rounded-full bg-[var(--border-color)]"></div>
                      <div className="w-8 h-3 rounded-full bg-[var(--border-color)]"></div>
                    </div>
                  </div>
                  <div className="p-6 text-center space-y-4">
                    <h2 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>Build Your Future</h2>
                    <p className="text-xs text-[var(--text-muted)]">Powered by advanced AI</p>
                    <button className="px-6 py-2 text-white text-xs font-medium rounded-lg" style={{ background: settings.primaryColor || '#3B82F6' }}>Get Started</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Resume Settings':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Default Template</label>
                <select name="defaultResumeTemplate" value={settings.defaultResumeTemplate || 'Modern'} onChange={handleChange} className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-[var(--text-main)]">
                  <option value="Modern">Modern</option>
                  <option value="Professional">Professional</option>
                  <option value="Creative">Creative</option>
                  <option value="Minimalist">Minimalist</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Default Font Family</label>
                <select name="defaultResumeFont" value={settings.defaultResumeFont || 'Inter'} onChange={handleChange} className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-[var(--text-main)]">
                  <option value="Inter">Inter (Sans-serif)</option>
                  <option value="Roboto">Roboto (Sans-serif)</option>
                  <option value="Merriweather">Merriweather (Serif)</option>
                  <option value="Lora">Lora (Serif)</option>
                </select>
              </div>
              <InputField label="Default Font Size (px)" name="defaultFontSize" type="number" value={settings.defaultFontSize || 14} onChange={handleChange} />
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Default Language</label>
                <select name="defaultResumeLanguage" value={settings.defaultResumeLanguage || 'EN'} onChange={handleChange} className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-[var(--text-main)]">
                  <option value="EN">English</option>
                  <option value="FR">French</option>
                  <option value="ES">Spanish</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-main)]">Auto Save</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Automatically save user resumes while typing.</p>
                </div>
                <ToggleSwitch checked={settings.autoSave !== false} onChange={() => handleToggle('autoSave')} />
              </div>
              <div className="flex items-center justify-between p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-main)]">A4 Paper Size Enforcement</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Force all resumes to export in standard A4 size.</p>
                </div>
                <ToggleSwitch checked={settings.forceA4 !== false} onChange={() => handleToggle('forceA4')} />
              </div>
            </div>
          </div>
        );

      case 'AI Configuration':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 text-purple-600 rounded-lg"><Cpu size={20} /></div>
                <div>
                  <p className="text-sm font-semibold text-purple-600">AI Features</p>
                  <p className="text-xs text-purple-600/80 mt-0.5">Enable or disable AI generation across the platform.</p>
                </div>
              </div>
              <ToggleSwitch checked={settings.enableAI !== false} onChange={() => handleToggle('enableAI')} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-100 transition-opacity" style={{ opacity: settings.enableAI === false ? 0.5 : 1, pointerEvents: settings.enableAI === false ? 'none' : 'auto' }}>
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Primary AI Provider</label>
                <select name="aiProvider" value={settings.aiProvider || 'Google Gemini'} onChange={handleChange} className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-[var(--text-main)]">
                  <option value="Google Gemini">Google Gemini</option>
                  <option value="OpenAI">OpenAI (ChatGPT)</option>
                  <option value="Claude">Anthropic Claude</option>
                  <option value="Grok">Grok</option>
                </select>
              </div>
              <InputField label="Model Name" name="aiModelName" value={settings.aiModelName || 'gemini-pro'} onChange={handleChange} />
              
              <div className="col-span-1 md:col-span-2">
                <label className="flex justify-between text-sm font-medium text-[var(--text-muted)] mb-3">
                  <span>Temperature (Creativity)</span>
                  <span className="font-mono text-blue-500">{settings.aiTemperature || 0.7}</span>
                </label>
                <input type="range" name="aiTemperature" min="0" max="1" step="0.1" value={settings.aiTemperature || 0.7} onChange={handleChange} className="w-full h-2 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer accent-blue-500" />
                <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>
              
              <InputField label="Maximum Tokens" name="aiMaxTokens" type="number" value={settings.aiMaxTokens || 2048} onChange={handleChange} />
              <InputField label="Request Timeout (ms)" name="aiTimeout" type="number" value={settings.aiTimeout || 15000} onChange={handleChange} />
            </div>

            <div className="border-t border-[var(--border-color)] pt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-[var(--text-muted)]">Status: <span className="text-green-500 font-semibold">Connected</span></span>
              </div>
              <button 
                onClick={() => simulateTest(setTestingAI, 'AI')} 
                disabled={testingAI}
                className="px-4 py-2 border border-[var(--border-color)] text-sm font-medium rounded-xl hover:bg-[var(--bg-main)] transition-colors flex items-center gap-2"
              >
                {testingAI ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div> Testing...</> : <><RefreshCw size={16} /> Test Connection</>}
              </button>
            </div>
          </div>
        );

      case 'SMTP Configuration':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="SMTP Host" name="smtpHost" value={settings.smtpHost} onChange={handleChange} placeholder="smtp.gmail.com" />
              <InputField label="SMTP Port" name="smtpPort" type="number" value={settings.smtpPort} onChange={handleChange} placeholder="587" />
              <InputField label="SMTP Username / Email" name="smtpUser" value={settings.smtpUser} onChange={handleChange} placeholder="hello@example.com" />
              <InputField label="SMTP Password" name="smtpPass" isPassword={true} value={settings.smtpPass} onChange={handleChange} placeholder="••••••••" />
              <InputField label="Sender Name" name="smtpSenderName" value={settings.smtpSenderName} onChange={handleChange} placeholder="AI Resume Support" />
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Encryption</label>
                <select name="smtpEncryption" value={settings.smtpEncryption || 'TLS'} onChange={handleChange} className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-[var(--text-main)]">
                  <option value="TLS">TLS</option>
                  <option value="SSL">SSL</option>
                  <option value="None">None</option>
                </select>
              </div>
            </div>
            
            <div className="border-t border-[var(--border-color)] pt-6 flex items-center justify-between">
              <div className="text-sm text-[var(--text-muted)]">
                Last successful email: <span className="font-medium text-[var(--text-main)]">Today, 10:42 AM</span>
              </div>
              <button 
                onClick={() => simulateTest(setTestingSMTP, 'SMTP')} 
                disabled={testingSMTP}
                className="px-4 py-2 border border-[var(--border-color)] text-sm font-medium rounded-xl hover:bg-[var(--bg-main)] transition-colors flex items-center gap-2"
              >
                {testingSMTP ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div> Sending...</> : <><Mail size={16} /> Send Test Email</>}
              </button>
            </div>
          </div>
        );

      case 'API Keys':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-6 flex gap-3">
              <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-600/90 leading-relaxed">
                These keys are encrypted before saving to the database. Keep them secure and do not share them. Regenerating a key may cause temporary downtime while services reconnect.
              </p>
            </div>

            <div className="space-y-5">
              <InputField label="Google Gemini API Key" name="geminiApiKey" isPassword={true} value={settings.geminiApiKey} onChange={handleChange} placeholder="AIzaSy..." />
              <InputField label="OpenAI API Key" name="openaiApiKey" isPassword={true} value={settings.openaiApiKey} onChange={handleChange} placeholder="sk-..." />
              <InputField label="Cloudinary URL" name="cloudinaryUrl" isPassword={true} value={settings.cloudinaryUrl} onChange={handleChange} placeholder="cloudinary://..." />
              <InputField label="JWT Secret (Internal)" name="jwtSecret" isPassword={true} value={settings.jwtSecret} onChange={handleChange} placeholder="••••••••••••••••••••••••" />
            </div>
          </div>
        );

      case 'SEO Settings':
        return (
          <div className="space-y-6">
            <InputField label="Meta Title" name="seoTitle" value={settings.seoTitle} onChange={handleChange} placeholder="Free AI Resume Analyzer - Build Professional Resumes" />
            
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Meta Description</label>
              <textarea name="seoDescription" value={settings.seoDescription || ''} onChange={handleChange} rows="3" className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-[var(--text-main)] resize-none" placeholder="Transform your resume with AI..."></textarea>
            </div>

            <InputField label="Meta Keywords (Comma separated)" name="seoKeywords" value={settings.seoKeywords} onChange={handleChange} placeholder="resume, ai builder, ats checker" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Google Analytics ID" name="googleAnalyticsId" value={settings.googleAnalyticsId} onChange={handleChange} placeholder="G-XXXXXXXXXX" />
              <InputField label="Facebook Pixel ID" name="facebookPixelId" value={settings.facebookPixelId} onChange={handleChange} placeholder="1234567890" />
              <InputField label="Canonical URL" name="canonicalUrl" value={settings.canonicalUrl} onChange={handleChange} placeholder="https://example.com" />
              <InputField label="Sitemap URL" name="sitemapUrl" value={settings.sitemapUrl} onChange={handleChange} placeholder="https://example.com/sitemap.xml" />
            </div>
          </div>
        );

      case 'Security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b border-[var(--border-color)] pb-3 mb-4">Password Policy</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Minimum Password Length" name="minPasswordLength" type="number" value={settings.minPasswordLength || 8} onChange={handleChange} />
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Require Special Characters</label>
                <select name="requireSpecialChar" value={settings.requireSpecialChar || 'Yes'} onChange={handleChange} className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-[var(--text-main)]">
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            <h3 className="text-lg font-semibold border-b border-[var(--border-color)] pb-3 mb-4 mt-8">Authentication</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <InputField label="Session Timeout (Minutes)" name="sessionTimeout" type="number" value={settings.sessionTimeout || 120} onChange={handleChange} />
              <InputField label="Login Attempt Limit" name="loginAttemptLimit" type="number" value={settings.loginAttemptLimit || 5} onChange={handleChange} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-main)]">Enable Two-Factor Authentication (2FA)</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Force users to setup 2FA upon registration.</p>
                </div>
                <ToggleSwitch checked={settings.enable2FA} onChange={() => handleToggle('enable2FA')} />
              </div>
              <div className="flex items-center justify-between p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-main)]">Enable Google reCAPTCHA</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Protect login and registration forms from bots.</p>
                </div>
                <ToggleSwitch checked={settings.enableCaptcha} onChange={() => handleToggle('enableCaptcha')} />
              </div>
            </div>
          </div>
        );

      case 'Storage':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[var(--bg-main)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm">
                <p className="text-sm text-[var(--text-muted)] mb-1">Total Storage</p>
                <p className="text-2xl font-bold">100 GB</p>
              </div>
              <div className="bg-[var(--bg-main)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm">
                <p className="text-sm text-[var(--text-muted)] mb-1">Used Storage</p>
                <p className="text-2xl font-bold text-blue-500">42.5 GB</p>
              </div>
              <div className="bg-[var(--bg-main)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm">
                <p className="text-sm text-[var(--text-muted)] mb-1">Remaining</p>
                <p className="text-2xl font-bold text-green-500">57.5 GB</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold">Overall Usage</span>
                <span className="text-[var(--text-muted)]">42.5%</span>
              </div>
              <div className="w-full bg-[var(--bg-main)] rounded-full h-3 mb-6 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{ width: '42.5%' }}></div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-[var(--text-muted)]">Resumes (PDFs)</span>
                  </div>
                  <span className="text-sm font-medium">35 GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm text-[var(--text-muted)]">Database (JSON)</span>
                  </div>
                  <span className="text-sm font-medium">2.1 GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm text-[var(--text-muted)]">Images & Assets</span>
                  </div>
                  <span className="text-sm font-medium">5.4 GB</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Backup & Restore':
        return (
          <div className="space-y-6">
            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4">
                <HardDrive size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Manual Database Backup</h3>
              <p className="text-[var(--text-muted)] text-sm max-w-md mb-6">Create an instant JSON snapshot of all users, resumes, templates, and settings.</p>
              
              <div className="flex gap-4">
                <button className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl shadow-md transition-colors flex items-center gap-2">
                  <Download size={16} /> Create & Download Backup
                </button>
              </div>
            </div>

            <div className="border border-[var(--border-color)] rounded-2xl overflow-hidden">
              <div className="bg-[var(--bg-main)] px-5 py-3 border-b border-[var(--border-color)] font-semibold text-sm">Recent Backups</div>
              <div className="p-5 flex items-center justify-between hover:bg-[var(--bg-main)] transition-colors">
                <div>
                  <p className="font-medium text-sm">backup_2026-08-01.json</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Aug 1, 2026 • 2.1 MB • Automatic</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"><RefreshCw size={16} /></button>
                  <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="p-5 border-t border-[var(--border-color)] flex items-center justify-between hover:bg-[var(--bg-main)] transition-colors">
                <div>
                  <p className="font-medium text-sm">backup_2026-07-01.json</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Jul 1, 2026 • 1.9 MB • Manual</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"><RefreshCw size={16} /></button>
                  <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Integrations':
        return (
          <div className="space-y-4">
            {[
              { id: 'googleDrive', name: 'Google Drive', desc: 'Sync generated resumes directly to Google Drive.', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg' },
              { id: 'dropbox', name: 'Dropbox', desc: 'Backup database and assets to Dropbox securely.', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Dropbox_Icon.svg' },
              { id: 'github', name: 'GitHub', desc: 'Allow users to import portfolio data from GitHub.', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg' },
              { id: 'linkedin', name: 'LinkedIn', desc: 'Enable "Sign in with LinkedIn" functionality.', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png' }
            ].map(integration => (
              <div key={integration.id} className="flex items-center justify-between p-5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl hover:border-blue-500/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm">
                    <img src={integration.icon} alt={integration.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{integration.name}</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{integration.desc}</p>
                  </div>
                </div>
                <ToggleSwitch checked={settings[`int_${integration.id}`]} onChange={() => handleToggle(`int_${integration.id}`)} />
              </div>
            ))}
          </div>
        );

      case 'Notifications':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Email & System Alerts</h3>
            {[
              { id: 'notif_newUser', title: 'New User Registration', desc: 'Receive an alert when a new user signs up.' },
              { id: 'notif_resumeUpload', title: 'Resume Upload / Generate', desc: 'Notify when a new resume is created.' },
              { id: 'notif_contact', title: 'Contact Messages', desc: 'Alert for new support messages.' },
              { id: 'notif_errors', title: 'SMTP & AI Errors', desc: 'Critical alerts if third-party APIs fail.' },
              { id: 'notif_security', title: 'Security Alerts', desc: 'Notifications for multiple failed logins.' }
            ].map(notif => (
              <div key={notif.id} className="flex items-center justify-between p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-main)]">{notif.title}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{notif.desc}</p>
                </div>
                <ToggleSwitch checked={settings[notif.id]} onChange={() => handleToggle(notif.id)} />
              </div>
            ))}
          </div>
        );

      case 'System Information':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-[var(--border-color)] rounded-xl flex justify-between items-center bg-[var(--bg-main)]">
                <span className="text-sm text-[var(--text-muted)]">Application Version</span>
                <span className="font-mono text-sm font-semibold">v2.4.0</span>
              </div>
              <div className="p-4 border border-[var(--border-color)] rounded-xl flex justify-between items-center bg-[var(--bg-main)]">
                <span className="text-sm text-[var(--text-muted)]">Node.js Version</span>
                <span className="font-mono text-sm font-semibold">v18.17.0</span>
              </div>
              <div className="p-4 border border-[var(--border-color)] rounded-xl flex justify-between items-center bg-[var(--bg-main)]">
                <span className="text-sm text-[var(--text-muted)]">Database Version</span>
                <span className="font-mono text-sm font-semibold">Local JSON DB</span>
              </div>
              <div className="p-4 border border-[var(--border-color)] rounded-xl flex justify-between items-center bg-[var(--bg-main)]">
                <span className="text-sm text-[var(--text-muted)]">Environment</span>
                <span className="font-mono text-sm font-semibold text-green-500">Production</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold border-b border-[var(--border-color)] pb-3 mt-6 mb-4">Service Status</h3>
            <div className="space-y-3">
              {[
                { name: 'Core Server', status: 'Operational', color: 'green' },
                { name: 'Database Service', status: 'Operational', color: 'green' },
                { name: 'AI API Connection', status: 'Operational', color: 'green' },
                { name: 'SMTP Mail Server', status: 'Operational', color: 'green' },
                { name: 'Cloud Storage', status: 'Degraded Performance', color: 'amber' }
              ].map((service, i) => (
                <div key={i} className="flex justify-between items-center p-3">
                  <span className="text-sm font-medium">{service.name}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-${service.color}-500`}></div>
                    <span className={`text-xs font-semibold text-${service.color}-500`}>{service.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Activity Log':
        return (
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm">
            {[
              { action: 'Admin Login', time: '10 mins ago', ip: '192.168.1.1' },
              { action: 'SMTP Settings Updated', time: '1 hour ago', ip: '192.168.1.1' },
              { action: 'AI Provider changed to OpenAI', time: '3 hours ago', ip: '192.168.1.1' },
              { action: 'Manual Backup Created', time: 'Yesterday', ip: '192.168.1.1' },
              { action: 'Primary Color Changed', time: 'Yesterday', ip: '192.168.1.1' }
            ].map((log, i) => (
              <div key={i} className="p-5 border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-card)] transition-colors flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{log.action}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{log.time} • IP: {log.ip}</p>
                </div>
                <div className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded border border-blue-500/20 font-medium">System</div>
              </div>
            ))}
          </div>
        );

      default:
        return <div>Section not found.</div>;
    }
  };

  return (
    <div className="w-full pb-32 text-[var(--text-main)] font-sans relative min-h-screen">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Settings Module</h1>
        <p className="text-[var(--text-muted)] mt-2 font-medium">Manage your enterprise platform configurations and integrations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR NAVIGATION */}
        <div className="lg:w-64 shrink-0">
          <div className="sticky top-6 flex flex-col gap-1 bg-[var(--bg-card)] p-3 rounded-2xl border border-[var(--border-color)] shadow-sm">
            {SECTIONS.map(section => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--bg-main)] hover:text-[var(--text-main)] border border-transparent'}`}
                >
                  <Icon size={18} className={isActive ? 'text-blue-500' : ''} />
                  {section.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 lg:p-8 shadow-sm min-h-[600px]">
            <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-[var(--border-color)]">{activeSection}</h2>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* FLOATING SAVE BAR (Vercel Style) */}
      <AnimatePresence>
        {hasUnsavedChanges && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-6"
            style={{ width: '90%', maxWidth: '700px' }}
          >
            <div className="flex-1">
              <p className="font-semibold text-sm">Unsaved Changes</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">You have uncommitted changes in your settings.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleReset} className="px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">Reset</button>
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-70"
              >
                {saving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Save size={16} />}
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATIONS */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map(toast => (
            <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}

