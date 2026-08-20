import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit2, Trash2, X, Save, Copy, Eye, Star, Upload, Download, 
  Search, Filter, LayoutTemplate, Zap, FileText, CheckCircle, Image, Settings, Palette
} from 'lucide-react';
import ResumeContentRenderer from '../studio/ResumeContentRenderer';
import AdminTemplateBuilder from './AdminTemplateBuilder';

export default function AdminTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Modals
  const [previewModal, setPreviewModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  
  // Form State
  const initialForm = {
    name: '', category: 'Professional', description: '', atsScore: 85, 
    theme: 'Blue', status: 'Active', usageCount: 0, isDefault: false,
    primaryColor: '#3b82f6', fontFamily: 'Inter', spacing: 'Normal', layoutType: 'Standard'
  };
  const [formData, setFormData] = useState(initialForm);

  const dummyResume = {
    personalInfo: {
      name: 'Sarah Johnson',
      jobTitle: 'Senior Software Engineer',
      email: 'sarah.j@example.com',
      phone: '+1 (555) 123-4567',
      city: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/sarahj',
      github: 'github.com/sarahj',
      profilePicture: 'https://i.pravatar.cc/150?u=sarah'
    },
    summary: 'Creative and detail-oriented professional with over 5 years of experience in delivering high-impact solutions. Proven track record of leading cross-functional teams and improving operational efficiency by 30%.',
    experienceList: [
      {
        company: 'Tech Innovations Inc.',
        role: 'Senior Project Lead',
        bullets: '• Directed a team of 10 developers to launch a flagship product 2 months ahead of schedule.\n• Optimized internal processes, reducing deployment time by 40%.'
      },
      {
        company: 'Creative Solutions',
        role: 'Product Specialist',
        bullets: '• Managed client relationships and increased retention rate by 25%.\n• Designed and implemented automated reporting dashboards.'
      }
    ],
    education: 'Master of Business Administration\nStanford University - 2020\n\nBachelor of Science in Computer Science\nUniversity of California, Berkeley - 2018',
    skills: 'Project Management, Agile Methodologies, Data Analysis, Python, SQL, Cross-functional Leadership, Strategic Planning',
    atsScore: 98
  };

  const getRendererStyle = (name) => {
    const n = (name || '').toLowerCase();
    if (n.includes('elegant')) return 'elegant';
    if (n.includes('modern')) return 'modern';
    if (n.includes('minimal')) return 'minimalist';
    if (n.includes('software') || n.includes('tech')) return 'software';
    if (n.includes('fresh') || n.includes('student')) return 'fresher';
    if (n.includes('exec')) return 'executive';
    if (n.includes('corporat')) return 'corporate';
    if (n.includes('academic')) return 'academic';
    if (n.includes('creativ')) return 'creative';
    if (n.includes('business') || n.includes('onepage')) return 'onepage';
    return 'modern';
  };

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/templates', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setTemplates(await res.json());
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const openAdd = () => {
    setFormData(initialForm);
    setEditModal('add');
  };

  const openEdit = (t) => {
    setFormData({
      ...initialForm, ...t,
      category: t.category || 'Professional',
      theme: t.theme || 'Blue',
      status: t.status || 'Active',
      atsScore: t.atsScore || 85,
      usageCount: t.usageCount || 0,
      primaryColor: t.primaryColor || '#3b82f6',
      fontFamily: t.fontFamily || 'Inter',
      spacing: t.spacing || 'Normal',
      layoutType: t.layoutType || 'Standard'
    });
    setEditModal(t.id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'atsScore' ? Number(value) : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const isEditing = editModal !== 'add';
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing 
      ? `/api/admin/templates/${editModal}`
      : `/api/admin/templates`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setEditModal(null);
        fetchTemplates();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBuilderSave = async (dataToSave) => {
    const isEditing = editModal !== 'add';
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing 
      ? `/api/admin/templates/${editModal}`
      : `/api/admin/templates`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(dataToSave)
      });
      if (res.ok) {
        setEditModal(null);
        fetchTemplates();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDuplicate = async (t) => {
    const duplicateData = {
      ...t,
      name: `${t.name} (Copy)`,
      id: undefined,
      isDefault: false,
      usageCount: 0
    };
    try {
      const res = await fetch(`/api/admin/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(duplicateData)
      });
      if (res.ok) fetchTemplates();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      const res = await fetch(`/api/admin/templates/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) fetchTemplates();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const res = await fetch(`/api/admin/templates/${id}/default`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) fetchTemplates();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch = (t.name || '').toLowerCase().includes(search.toLowerCase());
      const matchesCat = categoryFilter === 'All' || (t.category || 'Professional') === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [templates, search, categoryFilter]);

  // KPIs
  const stats = {
    total: templates.length,
    active: templates.filter(t => (t.status || 'Active') === 'Active').length,
    defaultName: templates.find(t => t.isDefault)?.name || 'None',
    mostUsed: [...templates].sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))[0]?.name || 'N/A'
  };

  const topUsageId = [...templates].sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))[0]?.id;

  return (
    <div className="w-full pb-32 text-[var(--text-main)] font-sans">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 py-4 border-b border-[var(--border-color)]">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Template Engine</h1>
          <p className="text-[var(--text-muted)] mt-1 font-medium">Design, manage, and distribute professional resume templates.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input 
            type="file" 
            id="template-upload-input" 
            accept=".json" 
            style={{ display: 'none' }} 
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              try {
                const text = await file.text();
                const data = JSON.parse(text);
                const templatesToUpload = Array.isArray(data) ? data : [data];
                for (const t of templatesToUpload) {
                  delete t.id;
                  delete t._id;
                  await fetch('/api/admin/templates', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(t)
                  });
                }
                fetchTemplates();
                alert('Templates uploaded successfully!');
              } catch (err) {
                alert('Error uploading templates: ' + err.message);
              }
              e.target.value = '';
            }}
          />
          <button 
            onClick={() => document.getElementById('template-upload-input').click()}
            className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-dark)] px-4 py-2 rounded-xl transition-all font-medium"
          >
            <Upload size={16} /> Upload
          </button>

          <button onClick={openAdd} className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-105">
            <Plus size={18} /> Add Template
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Templates', value: stats.total, icon: LayoutTemplate, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Active Templates', value: stats.active, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { title: 'Default Template', value: stats.defaultName, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          { title: 'Most Popular', value: stats.mostUsed, icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start">
              <div className="w-[70%]">
                <p className="text-sm text-[var(--text-muted)] font-semibold mb-1">{stat.title}</p>
                <h3 className="text-xl font-extrabold text-[var(--text-main)] truncate" title={stat.value.toString()}>{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* TOOLBAR */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-t-2xl p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input 
            type="text" placeholder="Search templates..." 
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-[var(--text-main)]"
          />
        </div>
        <div className="flex items-center gap-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl px-3 py-2 overflow-x-auto">
          <Filter size={18} className="text-[var(--text-muted)] shrink-0" />
          <select 
            value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-sm font-medium text-[var(--text-main)] min-w-[120px]">
            {['All', 'Professional', 'Student', 'Developer', 'Executive', 'Creative', 'Academic', 'Business'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[var(--bg-card)] border-x border-[var(--border-color)] overflow-x-auto rounded-b-2xl shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--bg-dark)] text-[var(--text-muted)] uppercase text-xs">
            <tr>
              <th className="py-4 px-6 font-semibold">Template</th>
              <th className="py-4 px-4 font-semibold">Category</th>
              <th className="py-4 px-4 font-semibold">Score & Theme</th>
              <th className="py-4 px-4 font-semibold">Status</th>
              <th className="py-4 px-4 font-semibold">Usage</th>
              <th className="py-4 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {loading ? (
              <tr><td colSpan="6" className="text-center py-12 text-[var(--text-muted)]">Loading templates...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-12 text-[var(--text-muted)]">No templates found.</td></tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id} className="hover:bg-[var(--bg-dark)] transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      {/* Live Template Preview */}
                      <div className="w-16 h-20 rounded border border-[var(--border-color)] shadow-sm flex flex-col items-start justify-start overflow-hidden shrink-0 bg-white">
                        <div style={{ transform: 'scale(0.08)', transformOrigin: 'top left', width: '794px', height: '1123px', pointerEvents: 'none' }}>
                          <ResumeContentRenderer 
                            resumeData={dummyResume} 
                            templateStyle={getRendererStyle(t.name)} 
                            zoom={100}
                            customTemplateHtml={t.customHtml}
                          />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-base truncate text-[var(--text-main)]">{t.name}</p>
                          {t.isDefault && <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded text-[10px] font-bold border border-yellow-500/30">DEFAULT</span>}
                          {t.id === topUsageId && !t.isDefault && <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-[10px] font-bold border border-purple-500/30">POPULAR</span>}
                        </div>
                        <p className="text-xs text-[var(--text-muted)] truncate mt-1 max-w-[200px]">{t.description || 'No description'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-bold border border-indigo-500/20">
                      {t.category || 'Professional'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                        <CheckCircle size={14} /> ATS {t.atsScore || 85}%
                      </div>
                      <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-xs font-medium">
                        <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: t.theme === 'Blue' ? '#3b82f6' : t.theme === 'Dark' ? '#1f2937' : '#8b5cf6' }}></div>
                        {t.theme || 'Blue'} Theme
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {t.status === 'Draft' ? (
                      <span className="flex items-center gap-1.5 text-amber-500 font-medium text-sm"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Draft</span>
                    ) : t.status === 'Disabled' ? (
                      <span className="flex items-center gap-1.5 text-red-500 font-medium text-sm"><span className="w-2 h-2 rounded-full bg-red-500"></span> Disabled</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-emerald-500 font-medium text-sm"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-[var(--text-main)]">
                      {(t.usageCount || 0).toLocaleString()} <span className="text-[var(--text-muted)] font-medium text-xs">users</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setPreviewModal(t)} className="p-2 bg-[var(--bg-dark)] hover:bg-blue-500/10 text-[var(--text-muted)] hover:text-blue-500 rounded-lg transition-colors" title="Preview">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleDuplicate(t)} className="p-2 bg-[var(--bg-dark)] hover:bg-purple-500/10 text-[var(--text-muted)] hover:text-purple-500 rounded-lg transition-colors" title="Duplicate">
                        <Copy size={16} />
                      </button>
                      <button onClick={() => openEdit(t)} className="p-2 bg-[var(--bg-dark)] hover:bg-emerald-500/10 text-[var(--text-muted)] hover:text-emerald-500 rounded-lg transition-colors" title="Edit Settings">
                        <Settings size={16} />
                      </button>
                      {!t.isDefault && (
                        <button onClick={() => handleSetDefault(t.id)} className="p-2 bg-[var(--bg-dark)] hover:bg-yellow-500/10 text-[var(--text-muted)] hover:text-yellow-500 rounded-lg transition-colors" title="Set Default">
                          <Star size={16} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(t.id)} className="p-2 bg-[var(--bg-dark)] hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FULL PREVIEW MODAL */}
      <AnimatePresence>
        {previewModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} 
              className="bg-[var(--bg-dark)] w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col">
              
              <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)] bg-[var(--bg-card)]">
                <h2 className="text-xl font-bold flex items-center gap-2"><Eye className="text-blue-500" /> Previewing: {previewModal.name}</h2>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={async () => {
                      if (!previewModal._editedHtml) {
                        alert('No changes to save.');
                        return;
                      }
                      let html = previewModal._editedHtml;
                      html = html.replace(/John Doe/g, '{{name}}')
                                 .replace(/Senior Software Engineer/g, '{{jobTitle}}')
                                 .replace(/john\.doe@example\.com/g, '{{email}}')
                                 .replace(/\+1 234 567 8900/g, '{{phone}}');
                      try {
                        const token = localStorage.getItem('token');
                        await fetch(`/api/admin/templates/${previewModal.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                          body: JSON.stringify({ ...previewModal, customHtml: html })
                        });
                        alert('Template layout updated successfully! Changes will reflect on the live website.');
                      } catch (err) {
                        console.error(err);
                        alert('Failed to save layout.');
                      }
                    }} 
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium text-sm flex items-center gap-2"
                  >
                    <Save size={16} /> Save Layout
                  </button>
                  <button onClick={() => setPreviewModal(null)} className="p-2 bg-[var(--bg-dark)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-xl transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 bg-[var(--bg-dark)] overflow-y-auto p-8 flex justify-center items-start">
                {/* A4 Paper Real Preview using ResumeContentRenderer */}
                <div style={{ transform: 'scale(0.8)', transformOrigin: 'top center' }} className="w-[794px]">
                  <ResumeContentRenderer 
                    resumeData={dummyResume}
                    templateStyle={getRendererStyle(previewModal.name)}
                    accentColor={previewModal.theme === 'Blue' ? '#3b82f6' : previewModal.theme === 'Dark' ? '#1f2937' : previewModal.theme === 'Purple' ? '#8b5cf6' : previewModal.theme === 'Green' ? '#10b981' : previewModal.theme === 'Red' ? '#ef4444' : '#3b82f6'}
                    zoom={100}
                    contentEditable={true}
                    onManualEdit={(html) => {
                      setPreviewModal(prev => ({ ...prev, _editedHtml: html }));
                    }}
                    customTemplateHtml={previewModal.customHtml}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL EDITOR MODAL / TEMPLATE BUILDER */}
      <AnimatePresence>
        {editModal && (
          editModal === 'add' || formData.builderConfig ? (
            <AdminTemplateBuilder 
              initialData={formData} 
              onSave={handleBuilderSave} 
              onCancel={() => setEditModal(null)} 
              dummyResume={dummyResume} 
            />
          ) : (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-[var(--bg-dark)] w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col">
              
              <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)] bg-[var(--bg-card)]">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Palette className="text-purple-500" /> 
                  {editModal === 'add' ? 'Create New Template' : 'Template Editor Settings'}
                </h2>
                <div className="flex items-center gap-3">
                  <button onClick={() => setEditModal(null)} className="px-4 py-2 font-bold text-sm bg-[var(--bg-dark)] border border-[var(--border-color)] hover:bg-[var(--bg-card)] rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="px-6 py-2 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                    <Save size={16} /> Save Template
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[var(--bg-dark)]">
                <form className="space-y-8 max-w-3xl mx-auto">
                  
                  {/* Basic Info */}
                  <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><LayoutTemplate size={18} className="text-indigo-500"/> Core Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Template Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required
                          className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 text-[var(--text-main)]" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Category</label>
                        <select name="category" value={formData.category} onChange={handleChange}
                          className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 text-[var(--text-main)]">
                          {['Professional', 'Student', 'Developer', 'Executive', 'Creative', 'Academic', 'Business'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3"
                          className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 text-[var(--text-main)] resize-none"></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Engine Settings */}
                  <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Settings size={18} className="text-emerald-500"/> Engine & Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Target ATS Score</label>
                        <input type="number" name="atsScore" value={formData.atsScore} onChange={handleChange} min="0" max="100"
                          className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 text-[var(--text-main)]" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Color Theme</label>
                        <select name="theme" value={formData.theme} onChange={handleChange}
                          className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 text-[var(--text-main)]">
                          {['Blue', 'Dark', 'Purple', 'Green', 'Red'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Visibility Status</label>
                        <select name="status" value={formData.status} onChange={handleChange}
                          className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 text-[var(--text-main)]">
                          {['Active', 'Draft', 'Disabled'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Visual Editor section */}
                  <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Palette size={18} className="text-pink-500"/> Visual Properties</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Primary Color</label>
                        <input type="color" name="primaryColor" value={formData.primaryColor || '#3b82f6'} onChange={handleChange}
                          className="w-full h-12 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl p-1 cursor-pointer outline-none focus:ring-2 focus:ring-pink-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Font Family</label>
                        <select name="fontFamily" value={formData.fontFamily || 'Inter'} onChange={handleChange}
                          className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500 text-[var(--text-main)]">
                          {['Inter', 'Roboto', 'Times New Roman', 'Courier New', 'Merriweather'].map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Spacing / Padding</label>
                        <select name="spacing" value={formData.spacing || 'Normal'} onChange={handleChange}
                          className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500 text-[var(--text-main)]">
                          {['Compact', 'Normal', 'Spacious'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Layout Type</label>
                        <select name="layoutType" value={formData.layoutType || 'Standard'} onChange={handleChange}
                          className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500 text-[var(--text-main)]">
                          {['Standard', 'Sidebar Left', 'Sidebar Right', 'Two Column'].map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
          )
        )}
      </AnimatePresence>

    </div>
  );
}
