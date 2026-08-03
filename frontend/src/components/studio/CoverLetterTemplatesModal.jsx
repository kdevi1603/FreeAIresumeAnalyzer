import React, { useState } from 'react';
import { X, Sparkles, Plus } from 'lucide-react';

const COVER_LETTER_TEMPLATES = [
  {
    id: 'professional',
    name: 'Professional Template',
    description: 'A structured, professional cover letter template with skill highlights',
    content: `Dear [INSERT COMPANY NAME],

With the utmost eagerness, I want to express my interest & passion for the <ROLE NAME> position.

As a prospective employee, I immediately can bring the following qualities to the team:

<SKILL 1>: <1 sentence intro about your career>. (Expand on 1 project example that exemplifies that listed skill). <2 sentences about context> <2 sentences about your actions> <2 sentences about impact>.

<SKILL 2>: <1 sentence intro about your career>. (Expand on 1 project example that exemplifies that listed skill). <2 sentences about context> <2 sentences about your actions> <2 sentences about impact>.

While my resume provides a quick summary of my experiences, I hope to have the opportunity to share how I can bring value to your company's needs.

Sincerely,
[YOUR NAME]`
  },
  {
    id: 'classic',
    name: 'Classic Template',
    description: 'Traditional cover letter format with formal structure',
    content: `Dear [Hiring Manager's Name],

I am writing to express my strong interest in the [Position Title] position at [Company Name]. With my background in [Your Field/Major] and my hands-on experience in [Key Skill/Area], I am confident in my ability to contribute effectively to your team.

In my previous role at [Previous Company], I successfully [describe a major achievement or responsibility]. This experience has equipped me with a deep understanding of [relevant industry or skill], and I am eager to bring this expertise to [Company Name].

What particularly draws me to [Company Name] is [mention something specific about the company]. I admire your commitment to [Company Value or Goal], and I am excited about the possibility of collaborating with such a forward-thinking organization.

Thank you for considering my application. I have attached my resume for your review and welcome the opportunity to discuss how my qualifications align with your needs.

Best regards,
[YOUR NAME]`
  },
  {
    id: 'modern',
    name: 'Modern Template',
    description: 'Clean, contemporary design focused on impact',
    content: `Hi [Hiring Manager Name/Team],

I'm reaching out to apply for the [Position Title] role at [Company Name]. As an experienced [Your Profession] who has spent the last [X] years specializing in [Your Specialty], I was thrilled to see this opening.

My approach has always been centered on [Your Core Philosophy or Key Value]. For example, during my time at [Previous Company], I spearheaded [Project/Initiative] which resulted in [Quantifiable Impact]. I believe this hands-on, results-driven mindset aligns perfectly with the goals of your current team.

I am particularly impressed by [Company Name]'s recent work on [Recent Company Project or News]. I would love the opportunity to bring my background in [Skill 1] and [Skill 2] to help drive similar successes for your upcoming initiatives.

I would welcome the chance to discuss how my background, skills, and certifications can benefit [Company Name]. Thank you for your time and consideration.

Best,
[YOUR NAME]`
  }
];

export default function CoverLetterTemplatesModal({ isOpen, onClose, onApplyTemplate }) {
  const [selectedId, setSelectedId] = useState(COVER_LETTER_TEMPLATES[0].id);

  if (!isOpen) return null;

  const selectedTemplate = COVER_LETTER_TEMPLATES.find(t => t.id === selectedId);

  return (
    <div
      style={{ zIndex: 99999 }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans"
    >
      <div 
        className="bg-white shadow-2xl flex flex-col overflow-hidden"
        style={{ width: '95%', maxWidth: '1200px', height: '90vh', borderRadius: '16px', background: '#FAFAFA' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white shrink-0">
          <div>
            <h2 className="text-[1.5rem] font-bold m-0" style={{ color: '#4F46E5' }}>Choose Your Template</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
              {COVER_LETTER_TEMPLATES.length} templates available
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Sidebar - Template List */}
          <div className="w-[400px] border-r border-gray-200 bg-[#FAFAFA] flex flex-col shrink-0">
            <div className="p-6">
              <button className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <Plus size={18} />
                Create New Template
              </button>
            </div>
            
            <div className="px-6 pb-2">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">BUILT-IN TEMPLATES</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4 custom-scrollbar">
              {COVER_LETTER_TEMPLATES.map((template) => {
                const isActive = selectedId === template.id;
                return (
                  <div
                    key={template.id}
                    onClick={() => setSelectedId(template.id)}
                    className={`p-5 rounded-xl cursor-pointer transition-all border-2 ${
                      isActive 
                        ? 'border-[#4F46E5] bg-white shadow-md' 
                        : 'border-transparent bg-white shadow-sm hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900 m-0">{template.name}</h4>
                      <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-md">Built-in</span>
                    </div>
                    <p className="text-sm text-gray-500 m-0 mb-4 line-clamp-2">{template.description}</p>
                    
                    <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded border border-gray-100 font-mono overflow-hidden h-[60px] relative">
                      {template.content}
                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Area - Template Preview */}
          <div className="flex-1 bg-white p-8 flex flex-col h-full overflow-hidden">
            <div className="bg-[#F8FAFC] rounded-2xl p-8 flex flex-col h-full border border-gray-100 shadow-sm">
              
              <div className="flex justify-between items-start mb-6 shrink-0">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 m-0 mb-2">{selectedTemplate.name}</h2>
                  <p className="text-gray-600 m-0">{selectedTemplate.description}</p>
                </div>
                <span className="text-sm font-medium px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full">Built-in Template</span>
              </div>
              
              <div className="mb-8 shrink-0">
                <button 
                  onClick={() => onApplyTemplate(selectedTemplate)}
                  className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 transition-colors shadow-md shadow-indigo-200"
                >
                  Apply Template with AI <Sparkles size={16} className="text-yellow-300" />
                </button>
              </div>

              <div className="flex flex-col flex-1 overflow-hidden">
                <h4 className="text-sm font-bold text-gray-700 mb-3 shrink-0">Template Content</h4>
                <div className="relative flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-inner">
                  <textarea 
                    readOnly
                    value={selectedTemplate.content}
                    className="w-full h-full p-6 text-sm text-gray-700 font-mono leading-relaxed resize-none focus:outline-none custom-scrollbar"
                  />
                  <div className="absolute bottom-2 right-4 text-xs text-gray-400">
                    {selectedTemplate.content.length} characters
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
