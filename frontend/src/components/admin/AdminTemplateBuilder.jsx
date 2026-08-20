import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, LayoutTemplate, Palette, Settings, Type, Move, Eye } from 'lucide-react';
import ResumeContentRenderer from '../studio/ResumeContentRenderer';

export default function AdminTemplateBuilder({ initialData, onSave, onCancel, dummyResume }) {
  const defaultBuilderConfig = {
    layout: 'single-column',
    fontFamily: 'Inter',
    primaryColor: '#2563EB',
    secondaryColor: '#F3F4F6',
    textColor: '#1F2937',
    fontSize: '14px',
    sectionSpacing: '24px',
    headingStyle: 'uppercase',
    showProfilePhoto: true,
    sectionOrder: [
      'contact', 'summary', 'experience', 'projects', 'education', 
      'skills', 'certifications', 'achievements', 'languages'
    ]
  };

  const [formData, setFormData] = useState({
    ...(initialData || {
      name: 'New Custom Template',
      category: 'Professional',
      description: '',
      atsScore: 90,
      theme: 'Blue',
      status: 'Active'
    }),
    builderConfig: initialData?.builderConfig || defaultBuilderConfig
  });

  const [activeTab, setActiveTab] = useState('design');

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateConfig = (field, value) => {
    setFormData(prev => ({
      ...prev,
      builderConfig: {
        ...prev.builderConfig,
        [field]: value
      }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const moveSection = (index, direction) => {
    const newOrder = [...formData.builderConfig.sectionOrder];
    if (direction === 'up' && index > 0) {
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
    }
    updateConfig('sectionOrder', newOrder);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[var(--bg-dark)] w-full max-w-7xl h-[95vh] rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)] bg-[var(--bg-card)]">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <LayoutTemplate className="text-blue-500" /> 
            Template Builder
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={onCancel} className="px-4 py-2 font-bold text-sm bg-[var(--bg-dark)] border border-[var(--border-color)] hover:bg-[var(--bg-card)] rounded-xl transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="px-6 py-2 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2">
              <Save size={16} /> Save Template
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Panel - Controls */}
          <div className="w-1/3 min-w-[350px] border-r border-[var(--border-color)] bg-[var(--bg-dark)] overflow-y-auto flex flex-col">
            
            <div className="flex border-b border-[var(--border-color)] bg-[var(--bg-card)]">
              <button onClick={() => setActiveTab('general')} className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'general' ? 'border-blue-500 text-blue-500' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>General</button>
              <button onClick={() => setActiveTab('design')} className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'design' ? 'border-blue-500 text-blue-500' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Design</button>
              <button onClick={() => setActiveTab('sections')} className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'sections' ? 'border-blue-500 text-blue-500' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Sections</button>
            </div>

            <div className="p-6 space-y-6">
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Template Name</label>
                    <input type="text" value={formData.name} onChange={(e) => updateField('name', e.target.value)}
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Category</label>
                    <select value={formData.category} onChange={(e) => updateField('category', e.target.value)}
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-main)]">
                      {['Professional', 'Student', 'Developer', 'Executive', 'Creative', 'Academic', 'Business'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Description</label>
                    <textarea value={formData.description} onChange={(e) => updateField('description', e.target.value)} rows="3"
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-main)] resize-none"></textarea>
                  </div>
                </div>
              )}

              {activeTab === 'design' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Layout Pattern</label>
                    <select value={formData.builderConfig.layout} onChange={(e) => updateConfig('layout', e.target.value)}
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-main)]">
                      <option value="single-column">Single Column (Traditional)</option>
                      <option value="two-column">Two Column (Modern/Sidebar)</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Primary Color</label>
                      <input type="color" value={formData.builderConfig.primaryColor} onChange={(e) => updateConfig('primaryColor', e.target.value)}
                        className="w-full h-10 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-1 cursor-pointer outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Secondary Color</label>
                      <input type="color" value={formData.builderConfig.secondaryColor} onChange={(e) => updateConfig('secondaryColor', e.target.value)}
                        className="w-full h-10 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-1 cursor-pointer outline-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Text Color</label>
                    <input type="color" value={formData.builderConfig.textColor} onChange={(e) => updateConfig('textColor', e.target.value)}
                      className="w-full h-10 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-1 cursor-pointer outline-none" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Font Family</label>
                    <select value={formData.builderConfig.fontFamily} onChange={(e) => updateConfig('fontFamily', e.target.value)}
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-main)]">
                      {['Inter', 'Roboto', 'Times New Roman', 'Courier New', 'Merriweather'].map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Base Font Size</label>
                    <select value={formData.builderConfig.fontSize} onChange={(e) => updateConfig('fontSize', e.target.value)}
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-main)]">
                      {['12px', '13px', '14px', '15px', '16px'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Section Spacing</label>
                    <select value={formData.builderConfig.sectionSpacing} onChange={(e) => updateConfig('sectionSpacing', e.target.value)}
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-main)]">
                      <option value="16px">Compact</option>
                      <option value="24px">Normal</option>
                      <option value="32px">Spacious</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-4">
                    <input type="checkbox" id="showPhoto" checked={formData.builderConfig.showProfilePhoto} 
                           onChange={(e) => updateConfig('showProfilePhoto', e.target.checked)} className="w-5 h-5 rounded cursor-pointer" />
                    <label htmlFor="showPhoto" className="text-sm font-bold text-[var(--text-main)] cursor-pointer">Show Profile Photo</label>
                  </div>
                </div>
              )}

              {activeTab === 'sections' && (
                <div className="space-y-3">
                  <p className="text-sm text-[var(--text-muted)] mb-4">Rearrange how sections appear on the resume.</p>
                  {formData.builderConfig.sectionOrder.map((section, idx) => (
                    <div key={section} className="flex items-center justify-between bg-[var(--bg-card)] p-3 rounded-lg border border-[var(--border-color)] shadow-sm">
                      <span className="font-medium text-[var(--text-main)] capitalize flex items-center gap-2">
                        <Move size={14} className="text-gray-400" />
                        {section}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => moveSection(idx, 'up')} disabled={idx === 0} className="p-1 hover:bg-[var(--bg-dark)] rounded disabled:opacity-30">↑</button>
                        <button onClick={() => moveSection(idx, 'down')} disabled={idx === formData.builderConfig.sectionOrder.length - 1} className="p-1 hover:bg-[var(--bg-dark)] rounded disabled:opacity-30">↓</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="w-2/3 bg-gray-100 dark:bg-gray-900 overflow-y-auto p-8 flex justify-center items-start">
             <div style={{ transform: 'scale(0.8)', transformOrigin: 'top center' }} className="w-[794px] shadow-2xl bg-white transition-all duration-300">
               <ResumeContentRenderer 
                 resumeData={dummyResume}
                 templateStyle={formData.id || 'custom_builder'}
                 customBuilderConfig={formData.builderConfig}
                 zoom={100}
               />
             </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
