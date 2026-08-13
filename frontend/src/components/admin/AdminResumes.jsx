import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, FileText, Eye, Trash2, 
  Zap, TrendingUp, Calendar, X, PlayCircle, BarChart3,
  FileSpreadsheet, FileJson, CheckCircle, User, Briefcase, Mail, Phone
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { createRoot } from 'react-dom/client';
import html2pdf from 'html2pdf.js';
import ResumeContentRenderer from '../studio/ResumeContentRenderer.jsx';

export default function AdminResumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  
  const [viewModal, setViewModal] = useState(null);
  const [previewResumeModal, setPreviewResumeModal] = useState(null);
  const [customTemplates, setCustomTemplates] = useState([]);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/templates')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCustomTemplates(data);
      })
      .catch(err => console.error(err));
  }, []);

  const getCustomHtml = (templateUsed) => {
    const tStyle = (templateUsed || 'modern').toLowerCase();
    const match = customTemplates.find(t => 
      t.name.toLowerCase().includes(tStyle) || 
      (t.theme && t.theme.toLowerCase() === tStyle) ||
      t.id === tStyle
    );
    return match ? match.customHtml : null;
  };

  const handleDownloadPdf = (resumeData) => {
    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.top = '-9999px';
    document.body.appendChild(element);

    const root = createRoot(element);
    root.render(
      <ResumeContentRenderer 
        resumeData={resumeData} 
        templateStyle={(resumeData.templateUsed || 'modern').toLowerCase()} 
        zoom={100}
        showDiff={true}
        customTemplateHtml={getCustomHtml(resumeData.templateUsed)}
      />
    );

    setTimeout(() => {
      const pdfTarget = element.querySelector('.a4-print-container');
      if (pdfTarget) {
        const opt = {
          margin: 0,
          filename: `${resumeData.personalInfo?.name || 'resume'}_AI.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(pdfTarget).save().then(() => {
          root.unmount();
          document.body.removeChild(element);
        });
      } else {
        root.unmount();
        document.body.removeChild(element);
      }
    }, 1000);
  };

  const fetchResumes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/resumes', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        let data = await res.json();
        // Map real data without simulated fields
        data = data.map(r => {
          return {
            ...r,
            grammarScore: r.grammar?.score || 0,
            formattingScore: r.sectionScores?.structure || 0,
            keywordMatch: r.sectionScores?.skills || 0,
            skillsMatch: r.sectionScores?.experience || 0,
            atsCompatibility: r.sectionScores?.projects || 0,
            atsScore: r.atsScore || 0,
            templateUsed: (r.templateUsed && r.templateUsed !== 'Unknown') ? r.templateUsed : ((r.template && r.template !== 'Unknown') ? r.template : 'modern'),
            version: r.version || 'v1.0'
          };
        });
        setResumes(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this AI analysis?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/resumes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) fetchResumes();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatus = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-emerald-500', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500' };
    if (score >= 70) return { label: 'Good', color: 'text-amber-500', bg: 'bg-amber-500/10', dot: 'bg-amber-500' };
    return { label: 'Needs Impr.', color: 'text-red-500', bg: 'bg-red-500/10', dot: 'bg-red-500' };
  };

  const filtered = useMemo(() => {
    return resumes.filter(r => {
      const q = search.toLowerCase();
      const matchesSearch = 
        (r.personalInfo?.name || '').toLowerCase().includes(q) ||
        (r.personalInfo?.jobTitle || '').toLowerCase().includes(q) ||
        (r.personalInfo?.email || '').toLowerCase().includes(q);
        
      const status = getStatus(r.atsScore).label;
      const createdDate = new Date(r.createdAt);
      const today = new Date();
      let matchesFilter = true;
      
      if (filter === 'Today') {
        matchesFilter = createdDate.toDateString() === today.toDateString();
      } else if (filter === 'Excellent') {
        matchesFilter = status === 'Excellent';
      } else if (filter === 'Good') {
        matchesFilter = status === 'Good';
      } else if (filter === 'Needs Improvement') {
        matchesFilter = status === 'Needs Impr.';
      }
      
      return matchesSearch && matchesFilter;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [resumes, search, filter]);

  // Stats
  const todayCount = resumes.filter(r => new Date(r.createdAt).toDateString() === new Date().toDateString()).length;
  const avgAts = resumes.length ? Math.round(resumes.reduce((acc, r) => acc + r.atsScore, 0) / resumes.length) : 0;
  const maxAts = resumes.length ? Math.max(...resumes.map(r => r.atsScore)) : 0;

  // Chart Data Preparation
  const atsDistribution = [
    { name: '90-100', value: resumes.filter(r => r.atsScore >= 90).length },
    { name: '70-89', value: resumes.filter(r => r.atsScore >= 70 && r.atsScore < 90).length },
    { name: '<70', value: resumes.filter(r => r.atsScore < 70).length }
  ];

  const templateCounts = resumes.reduce((acc, r) => {
    acc[r.templateUsed] = (acc[r.templateUsed] || 0) + 1;
    return acc;
  }, {});
  const templatesData = Object.keys(templateCounts).map(k => ({ name: k, count: templateCounts[k] }));

  return (
    <div className="w-full pb-32 text-[var(--text-main)] font-sans">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 py-4 border-b border-[var(--border-color)]">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">AI Resume History</h1>
          <p className="text-[var(--text-muted)] mt-1 font-medium">Enterprise dashboard for AI analyses and ATS tracking.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-dark)] px-4 py-2 rounded-xl transition-all font-medium text-emerald-500">
            <FileSpreadsheet size={16} /> CSV
          </button>
          <button className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-dark)] px-4 py-2 rounded-xl transition-all font-medium text-blue-500">
            <FileText size={16} /> PDF
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total AI Analyses', value: resumes.length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Average ATS Score', value: `${avgAts}%`, icon: BarChart3, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { title: 'Highest ATS Score', value: `${maxAts}%`, icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          { title: "Today's Analyses", value: todayCount, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-[var(--text-muted)] font-semibold mb-1">{stat.title}</p>
                <h3 className="text-3xl font-extrabold text-[var(--text-main)]">{stat.value}</h3>
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
            type="text" placeholder="Search by name, email, or job title..." 
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-[var(--text-main)]"
          />
        </div>
        <div className="flex items-center gap-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl px-3 py-2 overflow-x-auto">
          <Filter size={18} className="text-[var(--text-muted)] shrink-0" />
          <select 
            value={filter} onChange={e => setFilter(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-sm font-medium text-[var(--text-main)] min-w-[120px]">
            {['All', 'Today', 'This Week', 'This Month', 'Excellent', 'Good', 'Needs Improvement'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[var(--bg-card)] border-x border-[var(--border-color)] overflow-x-auto rounded-b-2xl shadow-sm mb-12">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[var(--bg-dark)] text-[var(--text-muted)] uppercase text-xs font-semibold tracking-wider">
            <tr>
              <th className="py-4 px-6">Candidate Details</th>
              <th className="py-4 px-4">Template & Version</th>
              <th className="py-4 px-4">ATS Score</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Date</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {loading ? (
              <tr><td colSpan="6" className="text-center py-12 text-[var(--text-muted)]">Loading analyses...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-12 text-[var(--text-muted)]">No records found.</td></tr>
            ) : (
              filtered.map((r) => {
                const status = getStatus(r.atsScore);
                return (
                  <tr key={r.id} className="hover:bg-[var(--bg-dark)] transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-[var(--border-color)] flex items-center justify-center text-indigo-400 shrink-0">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-[var(--text-main)] text-base">{r.personalInfo?.name || 'Anonymous'}</p>
                          <p className="text-xs text-[var(--text-muted)]">{r.personalInfo?.email || 'N/A'} • {r.personalInfo?.jobTitle || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-[var(--text-main)]">{r.templateUsed}</span>
                        <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-dark)] border border-[var(--border-color)] rounded px-2 py-0.5 w-max">
                          {r.version}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[100px] h-2 bg-[var(--bg-dark)] rounded-full overflow-hidden border border-[var(--border-color)]">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${r.atsScore}%` }} 
                            transition={{ duration: 1 }}
                            className={`h-full ${status.dot.replace('bg-', 'bg-')}`}
                          />
                        </div>
                        <span className={`font-bold ${status.color}`}>{r.atsScore}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`flex items-center gap-1.5 font-bold text-xs px-2.5 py-1 rounded-lg border border-[var(--border-color)] ${status.bg} ${status.color} w-max`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[var(--text-muted)]">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setPreviewResumeModal(r)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg transition-colors font-medium text-xs">
                          <Eye size={14} /> View
                        </button>
                        <button onClick={() => handleDownloadPdf(r)} className="p-1.5 bg-[var(--bg-dark)] hover:bg-purple-500/10 text-[var(--text-muted)] hover:text-purple-500 rounded-lg transition-colors" title="Download AI Resume">
                          <Download size={14} />
                        </button>
                        <button onClick={() => setViewModal(r)} className="p-1.5 bg-[var(--bg-dark)] hover:bg-emerald-500/10 text-[var(--text-muted)] hover:text-emerald-500 rounded-lg transition-colors" title="AI Report">
                          <Zap size={14} />
                        </button>
                        <button onClick={() => handleDelete(r.id)} className="p-1.5 bg-[var(--bg-dark)] hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-6">ATS Score Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={atsDistribution}>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip cursor={{ fill: 'var(--bg-dark)' }} contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {atsDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-6">Most Used Templates</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={templatesData}>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <RechartsTooltip cursor={{ fill: 'var(--bg-dark)' }} contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {templatesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'][index % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* VIEW ANALYSIS MODAL */}
      <AnimatePresence>
        {viewModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" style={{ zIndex: 9999 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-[var(--bg-card)] w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col">
              
              <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)] shrink-0">
                <h2 className="text-xl font-bold flex items-center gap-2"><Eye className="text-blue-500" /> AI Analysis: {viewModal.personalInfo?.name}</h2>
                <button onClick={() => setViewModal(null)} className="p-2 bg-[var(--bg-dark)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Left Side: Mock Resume Preview */}
                <div className="w-full lg:w-1/2 p-6 overflow-y-auto border-r border-[var(--border-color)] bg-[var(--bg-dark)] flex justify-center items-start relative">
                  <div className="w-full h-full min-h-[600px] relative rounded shadow-lg overflow-hidden flex justify-center bg-[#f8fafc] p-4">
                    <div style={{ transform: 'scale(0.6)', transformOrigin: 'top center' }} className="w-[794px]">
                      <ResumeContentRenderer 
                        resumeData={viewModal} 
                        templateStyle={(viewModal.templateUsed || 'modern').toLowerCase()} 
                        zoom={100}
                        showDiff={true}
                        customTemplateHtml={getCustomHtml(viewModal.templateUsed)}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Side: Analysis Metrics */}
                <div className="w-full lg:w-1/2 p-6 lg:p-8 overflow-y-auto bg-transparent">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-3xl font-extrabold">{viewModal.atsScore}%</h3>
                      <p className="text-[var(--text-muted)] font-medium">Overall ATS Match</p>
                    </div>
                    <button onClick={() => handleDownloadPdf(viewModal)} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg transition-all">
                      <Download size={16} /> Export Resume
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                      <h4 className="font-bold mb-4 flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500"/> Strengths</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span>Grammar & Spelling</span>
                          <span className="font-bold text-emerald-400">{viewModal.grammarScore}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[var(--bg-dark)] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${viewModal.grammarScore}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm pt-2">
                          <span>Formatting & Structure</span>
                          <span className="font-bold text-emerald-400">{viewModal.formattingScore}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[var(--bg-dark)] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${viewModal.formattingScore}%` }}></div>
                        </div>

                        <div className="flex justify-between items-center text-sm pt-2">
                          <span>Keyword Match</span>
                          <span className="font-bold text-emerald-400">{viewModal.keywordMatch}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[var(--bg-dark)] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${viewModal.keywordMatch}%` }}></div>
                        </div>

                        <div className="flex justify-between items-center text-sm pt-2">
                          <span>Skills Match</span>
                          <span className="font-bold text-emerald-400">{viewModal.skillsMatch}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[var(--bg-dark)] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${viewModal.skillsMatch}%` }}></div>
                        </div>

                        <div className="flex justify-between items-center text-sm pt-2">
                          <span>ATS Compatibility</span>
                          <span className="font-bold text-emerald-400">{viewModal.atsCompatibility}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[var(--bg-dark)] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${viewModal.atsCompatibility}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                      <h4 className="font-bold mb-4 flex items-center gap-2"><Zap size={16} className="text-yellow-500"/> AI Suggestions</h4>
                      <ul className="space-y-3 text-sm text-[var(--text-muted)]">
                        <li className="flex gap-3"><span className="text-blue-500">•</span> Add more action verbs in your experience section.</li>
                        {viewModal.suggestions && viewModal.suggestions.map((s, i) => (
                          <li key={i} className="flex gap-3"><span className="text-blue-500">•</span> {s.text || s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                          <TrendingUp size={20} />
                        </div>
                        <p className="text-[var(--text-muted)] font-semibold">Total Recommendations</p>
                      </div>
                      <h4 className="text-2xl font-black text-blue-500">{viewModal.suggestions ? viewModal.suggestions.length : 0}</h4>
                    </div>

                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                      <h4 className="font-bold mb-4">Metadata</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-[var(--text-muted)] text-xs">Created</p>
                          <p className="font-medium mt-0.5">{new Date(viewModal.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] text-xs">Resume ID</p>
                          <p className="font-medium mt-0.5 font-mono text-xs truncate" title={viewModal.id}>{viewModal.id}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Resume Preview Modal */}
      <AnimatePresence>
        {previewResumeModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" style={{ zIndex: 9999 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-[var(--bg-dark)] w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)] bg-[var(--bg-card)] shrink-0">
                <h2 className="text-xl font-bold flex items-center gap-2"><Eye className="text-blue-500" /> Resume Preview: {previewResumeModal.personalInfo?.name}</h2>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleDownloadPdf(previewResumeModal)} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium text-sm flex items-center gap-2">
                    <Download size={16} /> Download
                  </button>
                  <button onClick={() => setPreviewResumeModal(null)} className="p-2 bg-[var(--bg-dark)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-xl transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-[var(--bg-dark)]">
                <div style={{ transform: 'scale(0.8)', transformOrigin: 'top center' }} className="w-[794px]">
                  <ResumeContentRenderer 
                    resumeData={previewResumeModal} 
                    templateStyle={(previewResumeModal.templateUsed || 'modern').toLowerCase()} 
                    zoom={100}
                    showDiff={true}
                    customTemplateHtml={getCustomHtml(previewResumeModal.templateUsed)}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
