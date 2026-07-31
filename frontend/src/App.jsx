import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import AuthModal from './components/AuthModal.jsx';
import ContactModal from './components/ContactModal.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SidebarDashboard from './pages/SidebarDashboard.jsx';
import Footer from './components/Footer.jsx';
import TemplateModal from './components/TemplateModal.jsx';
import CoverLetterStudio from './components/studio/CoverLetterStudio.jsx';
import CreateResumeModal from './components/CreateResumeModal.jsx';
import { Sparkles, Shield, Heart, Github } from 'lucide-react';

export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [viewMode, setViewMode] = useState('landing');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isCreateResumeModalOpen, setIsCreateResumeModalOpen] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [currentCoverLetterName, setCurrentCoverLetterName] = useState('');
  const [currentCoverLetterContent, setCurrentCoverLetterContent] = useState('');
  const [currentCoverLetterId, setCurrentCoverLetterId] = useState(null);
  
  const [savedCoverLetters, setSavedCoverLetters] = useState([
    { id: '1', title: 'Software Engineer Cover Letter', target: 'Google - Frontend', date: '1 day ago', content: '' },
    { id: '2', title: 'Product Manager Cover Letter', target: 'Microsoft', date: '3 days ago', content: '' }
  ]);
  
  const [savedResumes, setSavedResumes] = useState([]);

  const handleApplyTemplate = (templateId) => {
    setIsTemplateModalOpen(false);
    setViewMode('sidebar_dashboard');
  };

  const handleTemplateSelectFromGallery = (templateId) => {
    setViewMode('studio');
  };

  if (viewMode === 'sidebar_dashboard') {
    return (
      <>
        <SidebarDashboard
          onCreateNew={() => setIsCreateResumeModalOpen(true)}
          onEditResume={(id) => {
            const res = savedResumes.find(r => r.id === id);
            if (res) {
              setCurrentAnalysis(res);
              setViewMode('studio');
            }
          }}
          onDeleteResume={(id) => {
            setSavedResumes(prev => prev.filter(r => r.id !== id));
          }}
          savedResumes={savedResumes}
          onBackToLanding={() => setViewMode('landing')}
          currentAnalysis={currentAnalysis}
          onCreateCoverLetter={(name) => {
            setCurrentCoverLetterId(Date.now().toString());
            setCurrentCoverLetterName(name);
            const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            setCurrentCoverLetterContent(`[Your Name]<br><br>[Position Title]<br><br>[Your Address]<br><br>[Your Email]<br><br>[Your Phone]<br><br>${dateStr}<br><br>[Hiring Manager Name]<br><br>[Company Name]<br><br>Dear Hiring Manager,<br><br><br><br><br><br>Sincerely,<br><b>[Your Name]</b>`);
            setViewMode('cover_letter_studio');
          }}
          savedCoverLetters={savedCoverLetters}
          setSavedCoverLetters={setSavedCoverLetters}
          onEditCoverLetter={(id) => {
            const letter = savedCoverLetters.find(l => l.id === id);
            if (letter) {
              setCurrentCoverLetterId(letter.id);
              setCurrentCoverLetterName(letter.title);
              setCurrentCoverLetterContent(letter.content);
              setViewMode('cover_letter_studio');
            }
          }}
        />
        <TemplateModal
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          onApply={handleApplyTemplate}
        />
        <CreateResumeModal 
          isOpen={isCreateResumeModalOpen}
          onClose={() => setIsCreateResumeModalOpen(false)}
          onBuild={() => {
            setIsCreateResumeModalOpen(false);
            const newRes = { id: 'scratch-' + Date.now(), isScratch: true, personalInfo: { name: 'Untitled Resume' } };
            setSavedResumes(prev => [newRes, ...prev]);
            setCurrentAnalysis(newRes);
            setViewMode('templates');
          }}
          onImportSuccess={(data) => {
            setIsCreateResumeModalOpen(false);
            const newRes = { ...data, id: data.id || 'upload-' + Date.now() };
            setSavedResumes(prev => [newRes, ...prev]);
            setCurrentAnalysis(newRes);
            setViewMode('studio');
          }}
        />
      </>
    );
  }

  if (viewMode === 'cover_letter_studio') {
    return (
      <CoverLetterStudio 
        coverLetterName={currentCoverLetterName}
        initialContent={currentCoverLetterContent}
        onBack={() => setViewMode('sidebar_dashboard')}
        onSave={(content) => {
          setSavedCoverLetters(prev => {
            const existing = prev.find(l => l.id === currentCoverLetterId);
            if (existing) {
              return prev.map(l => l.id === currentCoverLetterId ? { ...l, content, date: 'Just now' } : l);
            } else {
              return [{ id: currentCoverLetterId, title: currentCoverLetterName, target: 'General', date: 'Just now', content }, ...prev];
            }
          });
          setViewMode('sidebar_dashboard');
        }}
      />
    );
  }

  // Allow rendering StudioWorkspace globally if needed
  if (viewMode === 'studio' || viewMode === 'templates') {
    return (
      <Dashboard 
        onOpenAuth={() => setIsAuthOpen(true)} 
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
        currentAnalysis={currentAnalysis}
        setCurrentAnalysis={setCurrentAnalysis}
        setSavedResumes={setSavedResumes}
        onTemplateSelect={handleTemplateSelectFromGallery}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <Navbar
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
        />
        
        <main style={{ marginTop: '20px' }}>
          <Dashboard 
            onOpenAuth={() => setIsAuthOpen(true)} 
            viewMode={viewMode}
            setViewMode={setViewMode}
            onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
            currentAnalysis={currentAnalysis}
            setCurrentAnalysis={setCurrentAnalysis}
            setSavedResumes={setSavedResumes}
          />
        </main>
      </div>

      {/* Sleek Footer */}
      <Footer />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onApply={handleApplyTemplate}
      />
      <CreateResumeModal 
        isOpen={isCreateResumeModalOpen}
        onClose={() => setIsCreateResumeModalOpen(false)}
        onBuild={() => {
          setIsCreateResumeModalOpen(false);
          setCurrentAnalysis({ isScratch: true });
          setViewMode('templates');
        }}
        onImportSuccess={(data) => {
          setIsCreateResumeModalOpen(false);
          setCurrentAnalysis(data);
          setViewMode('studio');
        }}
      />
    </div>
  );
}
