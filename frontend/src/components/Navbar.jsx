import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Sparkles, LogOut, User, FileText, ShieldAlert, Sun, Moon, Menu, X } from 'lucide-react';

export default function Navbar({ onOpenAuth, viewMode, setViewMode, onOpenContact, onOpenTemplateModal }) {
  const { user, logout, isAuthenticated } = useAuth();
  
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('theme') === 'light';
  });
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLightMode]);

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 16,
      zIndex: 100,
      margin: '16px 24px',
      padding: '12px 24px',
      borderRadius: '20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setViewMode('landing')}>
          <img src="/admin-logo.jpg" alt="Logo" style={{ width: '42px', height: '42px', borderRadius: '12px', objectFit: 'cover', boxShadow: isLightMode ? '0 4px 12px rgba(0, 0, 0, 0.1)' : '0 0 20px rgba(0, 242, 254, 0.4)', transition: 'all 0.3s ease' }} />
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI Resume Analyzer
            </span>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>PRO ATS Engine</span>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>v2.0</span>
            </div>
          </div>
        </div>

        {/* Center Navigation Links (Hidden on Tablet/Mobile) */}
        <div className="hidden-on-tablet" style={{ display: 'flex', alignItems: 'center', gap: '32px', flex: 1, justifyContent: 'center' }}>
          <button className="btn" onClick={() => setViewMode('landing')} style={{ background: 'transparent', color: viewMode === 'landing' ? 'var(--text-main)' : 'var(--text-muted)', fontSize: '0.95rem', fontWeight: viewMode === 'landing' ? 700 : 500, padding: 0 }}>Home</button>
          <button className="btn" onClick={() => setViewMode('templates')} style={{ background: 'transparent', color: viewMode === 'templates' ? 'var(--text-main)' : 'var(--text-muted)', fontSize: '0.95rem', fontWeight: viewMode === 'templates' ? 700 : 500, padding: 0 }}>Templates</button>
          <button className="btn" onClick={() => setViewMode('studio')} style={{ background: 'transparent', color: viewMode === 'studio' ? 'var(--text-main)' : 'var(--text-muted)', fontSize: '0.95rem', fontWeight: viewMode === 'studio' ? 700 : 500, padding: 0 }}>Resume Analysis</button>
          <button className="btn" onClick={() => { setViewMode('landing'); setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 100); }} style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500, padding: 0 }}>Features</button>
          <button className="btn" onClick={onOpenContact} style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500, padding: 0 }}>Contact</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setIsLightMode(!isLightMode)}
            className="btn btn-secondary hidden-on-tablet"
            style={{ padding: '8px', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <div className="hidden-on-tablet" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {isAuthenticated ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: '30px', border: '1px solid var(--border-color)' }}>
                  <User size={16} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.name}</span>
                </div>
                <button onClick={() => {
                  logout();
                  setViewMode('landing');
                }} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button onClick={onOpenAuth} className="btn btn-primary" style={{ padding: '10px 22px' }}>
                <User size={18} />
                <span>Sign In</span>
              </button>
            )}
          </div>
          
          {/* Mobile Hamburger Button */}
          <button 
            className="btn btn-secondary hidden-on-desktop" 
            style={{ padding: '8px' }} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="animate-fade-in" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button className="btn" onClick={() => { setViewMode('landing'); setIsMobileMenuOpen(false); }} style={{ justifyContent: 'flex-start', background: 'transparent', color: viewMode === 'landing' ? 'var(--accent-cyan)' : 'var(--text-main)', fontSize: '1rem', padding: '8px', fontWeight: viewMode === 'landing' ? 700 : 500 }}>Home</button>
          <button className="btn" onClick={() => { setViewMode('templates'); setIsMobileMenuOpen(false); }} style={{ justifyContent: 'flex-start', background: 'transparent', color: viewMode === 'templates' ? 'var(--accent-cyan)' : 'var(--text-muted)', fontSize: '1rem', padding: '8px', fontWeight: viewMode === 'templates' ? 700 : 500 }}>Templates</button>
          <button className="btn" onClick={() => { setViewMode('studio'); setIsMobileMenuOpen(false); }} style={{ justifyContent: 'flex-start', background: 'transparent', color: viewMode === 'studio' ? 'var(--accent-cyan)' : 'var(--text-muted)', fontSize: '1rem', padding: '8px', fontWeight: viewMode === 'studio' ? 700 : 500 }}>Resume Analysis</button>
          <button className="btn" onClick={() => { setViewMode('landing'); setIsMobileMenuOpen(false); setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 100); }} style={{ justifyContent: 'flex-start', background: 'transparent', color: 'var(--text-muted)', fontSize: '1rem', padding: '8px' }}>Features</button>
          <button className="btn" onClick={() => { onOpenContact(); setIsMobileMenuOpen(false); }} style={{ justifyContent: 'flex-start', background: 'transparent', color: 'var(--text-muted)', fontSize: '1rem', padding: '8px' }}>Contact</button>
          
          <div style={{ height: '1px', background: 'var(--border-color)', margin: '8px 0' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Theme</span>
            <button
              onClick={() => setIsLightMode(!isLightMode)}
              className="btn btn-secondary"
              style={{ padding: '8px', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
          
          {isAuthenticated ? (
            <>
              <button onClick={() => {
                logout();
                setViewMode('landing');
                setIsMobileMenuOpen(false);
              }} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                <LogOut size={16} />
                <span>Logout ({user?.name})</span>
              </button>
            </>
          ) : (
            <button onClick={onOpenAuth} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <User size={18} />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

