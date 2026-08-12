import React, { useState, useEffect } from 'react';
import { Users, FileText, Layout, Settings, MessageSquare, BarChart, LogOut, ChevronLeft, Shield, Activity, BookOpen, Menu, X } from 'lucide-react';
import AdminDashboard from '../components/admin/AdminDashboard.jsx';
import AdminUsers from '../components/admin/AdminUsers.jsx';
import AdminAllResumes from '../components/admin/AdminAllResumes.jsx';
import AdminResumes from '../components/admin/AdminResumes.jsx';
import AdminTemplates from '../components/admin/AdminTemplates.jsx';
import AdminSkills from '../components/admin/AdminSkills.jsx';
import AdminSettings from '../components/admin/AdminSettings.jsx';
import AdminManagement from '../components/admin/AdminManagement.jsx';
import AdminSupport from '../components/admin/AdminSupport.jsx';
import AdminAnalytics from '../components/admin/AdminAnalytics.jsx';
import { ShieldCheck, Moon, Sun } from 'lucide-react';
import AdminLogin from '../components/admin/AdminLogin.jsx';

export default function AdminPanel({ onLogout, onBackToLanding }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('adminAuth') === 'true';
  });
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('adminTab') || 'dashboard';
  });

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('adminAuth', 'true');
    } else {
      localStorage.removeItem('adminAuth');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('adminTab', activeTab);
  }, [activeTab]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('theme') === 'light';
  });

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLightMode]);
  
  const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'all_resumes', label: 'Resumes', icon: FileText },
    { id: 'resumes', label: 'AI Resume History', icon: FileText },
    { id: 'templates', label: 'Templates', icon: Layout },
    { id: 'skills_master', label: 'Skills Master', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'support', label: 'Support & Feedback', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'admin_management', label: 'Admin Management', icon: ShieldCheck },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard setActiveTab={setActiveTab} isLightMode={isLightMode} setIsLightMode={setIsLightMode} onBackToLanding={onBackToLanding} />;
      case 'users': return <AdminUsers />;
      case 'all_resumes': return <AdminAllResumes />;
      case 'resumes': return <AdminResumes />;
      case 'templates': return <AdminTemplates />;
      case 'skills_master': return <AdminSkills />;
      case 'analytics': return <AdminAnalytics />;
      case 'settings': return <AdminSettings />;
      case 'admin_management': return <AdminManagement />;
      case 'support': return <AdminSupport />;
      default: return <div style={{ padding: '20px', color: 'var(--text-main)' }}>Under construction...</div>;
    }
  };
  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} onBackToLanding={onBackToLanding} />;
  }

  return (
    <>
      <style>{`
        .admin-layout {
          display: flex;
          height: 100vh;
          width: 100vw;
          background: var(--bg-main);
          overflow: hidden;
        }
        .admin-sidebar {
          width: 260px;
          background: var(--bg-card);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          padding: 24px 0;
          transition: transform 0.3s ease;
          z-index: 1000;
        }
        .admin-main {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
          display: flex;
          flex-direction: column;
        }
        .mobile-toggle {
          display: none;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          margin-bottom: 24px;
        }
        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 999;
          backdrop-filter: blur(2px);
        }
        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .admin-main {
            padding: 16px;
          }
          .mobile-toggle {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
          }
          .sidebar-overlay.open {
            display: block;
          }
        }
      `}</style>
      <div className="admin-layout">
        
        {/* Mobile Overlay */}
        <div 
          className={`sidebar-overlay ${isMobileMenuOpen ? 'open' : ''}`} 
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sidebar */}
        <div className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
          <div style={{ padding: '0 24px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src="/admin-logo.jpg" alt="Logo" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Admin Panel</span>
            </div>
            {/* Close button for mobile inside sidebar */}
            <button 
              className="mobile-toggle" 
              style={{ margin: 0, display: isMobileMenuOpen ? 'block' : 'none' }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 12px', overflowY: 'auto' }}>
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', borderRadius: '12px',
                    background: isActive ? 'rgba(0, 242, 254, 0.1)' : 'transparent',
                    color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    border: 'none', cursor: 'pointer',
                    fontWeight: isActive ? 600 : 500,
                    transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                localStorage.removeItem('adminAuth');
                onLogout();
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 16px', borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444',
                border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer',
                width: '100%', justifyContent: 'center'
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="admin-main">
          {/* Mobile Menu Toggle Button */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
              className="mobile-toggle" 
              onClick={() => setIsMobileMenuOpen(true)}
              title="Open Menu"
            >
              <Menu size={20} />
            </button>
          </div>
          
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}
