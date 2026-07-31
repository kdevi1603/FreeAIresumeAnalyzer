import React, { useState } from 'react';
import { 
  FileText, Briefcase, Search, Settings, CreditCard, 
  HelpCircle, Star, LogOut, PlusCircle, Edit3, Target, Copy, Trash2, ChevronLeft, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import MyJobsBoard from '../components/MyJobsBoard.jsx';
import AccountSettingsBoard from '../components/AccountSettingsBoard.jsx';
import JobSearchBoard from '../components/JobSearchBoard.jsx';
import MyCoverLettersBoard from '../components/MyCoverLettersBoard.jsx';

export default function SidebarDashboard({ onCreateNew, onEditResume, onDeleteResume, savedResumes, onBackToLanding, onCreateCoverLetter, currentAnalysis, savedCoverLetters, setSavedCoverLetters, onEditCoverLetter }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('My Resumes');
  const [isDarkMode, setIsDarkMode] = useState(() => !document.body.classList.contains('light-mode'));

  const toggleTheme = () => {
    if (isDarkMode) {
      document.body.classList.add('light-mode');
      setIsDarkMode(false);
    } else {
      document.body.classList.remove('light-mode');
      setIsDarkMode(true);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-dark)', margin: 0, padding: 0 }}>
      {/* Sidebar */}
      <div style={{ 
        width: '260px', 
        backgroundColor: 'var(--bg-card)', 
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, bottom: 0, left: 0
      }}>
        {/* Logo Area */}
        <div 
          onClick={onBackToLanding}
          style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--bg-dark)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '16px', height: '16px', border: '2px solid var(--accent-cyan)', borderRadius: '4px' }} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            AI Resume Analyzer
          </span>
          <button style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <SidebarItem 
            icon={<FileText size={18} />} 
            label="My Resumes" 
            active={activeTab === 'My Resumes'} 
            onClick={() => setActiveTab('My Resumes')}
          />
          <SidebarItem 
            icon={<Briefcase size={18} />} 
            label="My Jobs" 
            active={activeTab === 'My Jobs'}
            onClick={() => setActiveTab('My Jobs')}
          />
          <SidebarItem 
            icon={<Search size={18} />} 
            label="Jobs" 
            active={activeTab === 'Jobs'}
            onClick={() => setActiveTab('Jobs')}
          />
          <SidebarItem 
            icon={<FileText size={18} />} 
            label="My Cover Letters" 
            active={activeTab === 'My Cover Letters'}
            onClick={() => setActiveTab('My Cover Letters')}
          />
          <div style={{ margin: '16px 0', height: '1px', backgroundColor: 'var(--border-color)' }} />
          <SidebarItem 
            icon={<Settings size={18} />} 
            label="Account Settings" 
            active={activeTab === 'Account Settings'}
            onClick={() => setActiveTab('Account Settings')}
          />
          <div style={{ marginTop: 'auto', paddingBottom: '16px' }}>
          </div>
        </div>

        {/* User Profile */}
        <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--text-main)' }}>
            {user?.email?.charAt(0).toUpperCase() || 'T'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.email || 'Guest User'}
            </div>
            <button 
              onClick={() => {
                logout();
                if (onBackToLanding) onBackToLanding();
              }}
              style={{ background: 'none', border: 'none', padding: 0, color: 'var(--accent-danger)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', marginTop: '4px', fontWeight: 600 }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '260px', flex: 1, padding: '40px 60px' }}>
        {/* Top bar controls */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
          <div 
            onClick={toggleTheme}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' }}
          >
            {isDarkMode ? <Moon size={18} color="var(--text-main)" /> : <Sun size={18} color="var(--text-main)" />}
            <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-main)' }}>
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
        </div>

        {activeTab === 'My Resumes' && (
          <>
            {/* Header Box */}
            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', padding: '32px', border: '1px solid var(--border-color)', marginBottom: '32px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 12px 0' }}>Your Resumes</h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: '0 0 24px 0' }}>
            Create or import a resume, then analyze it or tailor it to any job — both tools live inside the resume editor.
          </p>
          <button
            onClick={onCreateNew}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 24px', backgroundColor: 'var(--bg-dark)', color: 'var(--accent-blue)',
              border: '1px solid var(--accent-blue)', borderRadius: '24px',
              fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.target.style.background = 'var(--accent-blue)'; e.target.style.color = '#fff'; }}
            onMouseOut={(e) => { e.target.style.background = 'var(--bg-dark)'; e.target.style.color = 'var(--accent-blue)'; }}
          >
            <PlusCircle size={18} />
            Create New
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '32px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search resumes by title, role, or company..." 
            style={{
              width: '100%', padding: '14px 14px 14px 44px',
              backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: '8px', fontSize: '0.95rem', color: 'var(--text-main)',
              outline: 'none'
            }}
          />
        </div>

        {/* Resume List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>Resumes</h2>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>({(savedResumes || []).length})</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(savedResumes || []).map(resume => (
              <div key={resume.id} style={{ 
                backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', 
                padding: '24px', display: 'flex', gap: '24px', alignItems: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                {/* Thumbnail */}
                <div style={{ 
                  width: '200px', height: '140px', backgroundColor: 'var(--bg-dark)', 
                  border: '1px solid var(--border-color)', borderRadius: '8px', 
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                  padding: '12px', overflow: 'hidden'
                }}>
                  {/* Mock paper */}
                  <div style={{ width: '80%', height: '100%', backgroundColor: 'var(--bg-card)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ width: '60%', height: '4px', backgroundColor: 'var(--border-color)', margin: '12px auto' }} />
                    <div style={{ width: '80%', height: '3px', backgroundColor: 'var(--border-color)', margin: '4px auto' }} />
                    <div style={{ width: '80%', height: '3px', backgroundColor: 'var(--border-color)', margin: '4px auto' }} />
                  </div>
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Resume Title:</span>
                    <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>{resume.personalInfo?.name || resume.fileName || resume.title || 'Untitled Resume'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Job Title:</span>
                    <span style={{ fontSize: '0.95rem', color: 'var(--text-dim)' }}>{resume.personalInfo?.jobTitle || resume.jobTitle || 'N/A'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '220px' }}>
                  <button onClick={() => onEditResume(resume.id)} style={actionBtnStyle('var(--accent-blue)')}>
                    <Edit3 size={16} /> Edit Resume
                  </button>
                  <button onClick={() => onDeleteResume(resume.id)} style={actionBtnStyle('var(--accent-danger)')}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
            {(!savedResumes || savedResumes.length === 0) && (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                You haven't created or uploaded any resumes yet. Click "Create New" above to get started!
              </div>
            )}
          </div>
        </div>

          </>
        )}

        {activeTab === 'My Jobs' && (
          <MyJobsBoard currentAnalysis={currentAnalysis} />
        )}

        {activeTab === 'Jobs' && (
          <JobSearchBoard resumes={savedResumes} currentAnalysis={currentAnalysis} />
        )}

        {activeTab === 'My Cover Letters' && (
          <MyCoverLettersBoard 
            onCreateCoverLetter={onCreateCoverLetter} 
            savedCoverLetters={savedCoverLetters}
            setSavedCoverLetters={setSavedCoverLetters}
            onEditCoverLetter={onEditCoverLetter}
          />
        )}

        {activeTab === 'Account Settings' && (
          <AccountSettingsBoard />
        )}
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  const color = active ? 'var(--accent-cyan)' : 'var(--text-muted)';
  const bg = active ? 'var(--bg-card-hover)' : 'transparent';
  return (
    <div 
      onClick={onClick}
      style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 16px',
      borderRadius: '8px',
      backgroundColor: bg,
      color: color,
      cursor: 'pointer',
      fontWeight: active ? 600 : 500,
      fontSize: '0.95rem',
      transition: 'background 0.2s',
      borderLeft: active ? '3px solid var(--accent-cyan)' : '3px solid transparent'
    }}>
      {icon}
      {label}
    </div>
  );
}

const actionBtnStyle = (color) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '10px 16px',
  backgroundColor: 'var(--bg-dark)',
  color: color,
  border: `1px solid ${color}`,
  borderRadius: '24px',
  fontSize: '0.9rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'opacity 0.2s'
});
