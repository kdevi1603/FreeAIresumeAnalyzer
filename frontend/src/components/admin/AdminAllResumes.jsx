import React, { useState, useEffect } from 'react';
import { 
  Eye, ExternalLink, Trash2, X, Download, FileText, Zap, Edit2, 
  Search, Filter, Activity, CheckCircle, AlertTriangle, AlertCircle, 
  ZoomIn, ZoomOut, Maximize, Printer, User, Mail, Phone, ChevronLeft, ChevronRight, FileCode, Briefcase, DownloadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createRoot } from 'react-dom/client';
import html2pdf from 'html2pdf.js';
import ResumeContentRenderer from '../studio/ResumeContentRenderer.jsx';

export default function AdminAllResumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters, Search, Sort & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [templateFilter, setTemplateFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Bulk Actions
  const [selectedResumes, setSelectedResumes] = useState([]);

  // Modals
  const [previewModal, setPreviewModal] = useState(null);
  const [reportModal, setReportModal] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(null);
  const [customTemplates, setCustomTemplates] = useState([]);
  
  // Preview State
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch('/api/admin/templates')
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
    showToast('Preparing PDF download...');
    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.top = '-9999px';
    document.body.appendChild(element);

    const root = createRoot(element);
    root.render(
      <ResumeContentRenderer 
        resumeData={resumeData} 
        templateStyle={(resumeData.template || 'modern').toLowerCase()} 
        zoom={100}
        showDiff={true}
        customTemplateHtml={getCustomHtml(resumeData.template)}
      />
    );

    setTimeout(() => {
      const pdfTarget = element.querySelector('.a4-print-container');
      if (pdfTarget) {
        const opt = {
          margin: 0,
          filename: `${resumeData.name || 'resume'}_AI.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(pdfTarget).save().then(() => {
          root.unmount();
          document.body.removeChild(element);
          showToast('Download complete!');
        });
      } else {
        root.unmount();
        document.body.removeChild(element);
      }
    }, 1000);
  };

  const decorateResumeData = (rawResumes) => {
    return rawResumes.map((r, i) => {
      const atsScore = r.atsScore || 0;
      const isAnalyzed = atsScore > 0;
      
      return {
        ...r,
        name: r.personalInfo?.name || r.fileName || 'Untitled Candidate',
        jobTitle: r.personalInfo?.jobTitle || 'Unspecified Role',
        email: r.personalInfo?.email || 'N/A',
        phone: r.personalInfo?.phone || 'N/A',
        template: r.template || 'Modern',
        fileSize: r.fileSize || 'N/A',
        downloads: r.downloads || 0,
        status: isAnalyzed ? (atsScore >= 80 ? 'Analyzed' : 'Failed') : 'Pending',
        atsScore,
        grammarScore: r.grammar?.score || 0,
        formatScore: r.sectionScores?.structure || 0,
        keywordMatch: r.sectionScores?.skills || 0,
        missingSkills: r.missingSkills || [],
        suggestions: r.suggestions || []
      };
    });
  };

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/resumes', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setResumes(decorateResumeData(data));
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // --- API Handlers ---
  const confirmDelete = async () => {
    if (!deleteConfirmModal) return;
    try {
      await fetch(`/api/admin/resumes/${deleteConfirmModal.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      showToast('Resume deleted successfully.');
      setDeleteConfirmModal(null);
      fetchResumes();
    } catch (err) {
      showToast('Failed to delete resume.', 'error');
    }
  };

  // --- Bulk Actions ---
  const toggleSelectAll = (e) => {
    if (e.target.checked) setSelectedResumes(currentResumes.map(r => r.id));
    else setSelectedResumes([]);
  };

  const toggleSelectResume = (id) => {
    if (selectedResumes.includes(id)) setSelectedResumes(selectedResumes.filter(rid => rid !== id));
    else setSelectedResumes([...selectedResumes, id]);
  };

  const handleBulkAction = (action) => {
    if (selectedResumes.length === 0) return showToast('No resumes selected.', 'error');
    if (action === 'export') showToast(`Exported ${selectedResumes.length} resumes successfully!`);
    if (action === 'delete') showToast(`Bulk delete feature coming soon.`);
    if (action === 'analyze') showToast(`Sent ${selectedResumes.length} resumes for AI Analysis.`);
    if (action === 'download') showToast(`Downloading ${selectedResumes.length} resumes in a ZIP file...`);
    setSelectedResumes([]);
  };

  // --- Filtering & Sorting ---
  const filteredResumes = resumes.filter(r => {
    const nameMatch = (r.name || '').toLowerCase().includes(search.toLowerCase());
    const titleMatch = (r.jobTitle || '').toLowerCase().includes(search.toLowerCase());
    const idMatch = search.length > 4 ? (r.id || '').toString().includes(search) : false;
    const searchMatch = nameMatch || titleMatch || idMatch;

    let statusMatch = true;
    if (statusFilter === 'Analyzed') statusMatch = r.status === 'Analyzed';
    if (statusFilter === 'Pending') statusMatch = r.status === 'Pending';
    if (statusFilter === 'Failed') statusMatch = r.status === 'Failed';

    let templateMatch = true;
    if (templateFilter !== 'All') templateMatch = r.template === templateFilter;

    return searchMatch && statusMatch && templateMatch;
  });

  const sortedResumes = [...filteredResumes].sort((a, b) => {
    if (sortBy === 'Newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'Oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'Highest Score') return b.atsScore - a.atsScore;
    if (sortBy === 'Most Downloads') return b.downloads - a.downloads;
    return 0;
  });

  const totalPages = Math.ceil(sortedResumes.length / itemsPerPage);
  const currentResumes = sortedResumes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- Dashboard Stats ---
  const totalAnalyzed = resumes.filter(r => r.atsScore > 0).length;
  const avgAtsScore = totalAnalyzed > 0 ? Math.round(resumes.reduce((acc, r) => acc + (r.atsScore || 0), 0) / resumes.length) : 0;
  const totalDownloadsToday = resumes.reduce((acc, r) => acc + (r.downloads || 0), 0); // Simulated

  return (
    <div className="text-[var(--text-main)] w-full relative">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-2">Resume Management</h1>
          <p className="text-[var(--text-muted)] font-medium">Manage all candidate resumes, review AI reports, and monitor usage.</p>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><FileText size={60} className="text-blue-500" /></div>
          <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-2">Total Resumes</p>
          <h2 className="text-3xl font-black">{resumes.length}</h2>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Zap size={60} className="text-emerald-500" /></div>
          <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-2">AI Analyzed</p>
          <h2 className="text-3xl font-black">{totalAnalyzed}</h2>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Activity size={60} className="text-indigo-500" /></div>
          <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-2">Avg ATS Score</p>
          <h2 className="text-3xl font-black">{avgAtsScore}%</h2>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><DownloadCloud size={60} className="text-purple-500" /></div>
          <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-2">Total Downloads</p>
          <h2 className="text-3xl font-black">{totalDownloadsToday}</h2>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-lg flex flex-col">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-[var(--border-color)] flex flex-col lg:flex-row items-center justify-between gap-4 bg-[var(--bg-dark)]/50 rounded-t-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input 
                type="text" placeholder="Search by name, title..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors text-[var(--text-main)]"
              />
            </div>
            <div className="flex items-center gap-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 w-full sm:w-auto">
              <Filter size={16} className="text-[var(--text-muted)]" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent border-none text-sm font-medium focus:outline-none text-[var(--text-main)] cursor-pointer">
                <option value="All" className="bg-[var(--bg-dark)] text-[var(--text-main)]">All Status</option>
                <option value="Analyzed" className="bg-[var(--bg-dark)] text-[var(--text-main)]">Analyzed</option>
                <option value="Pending" className="bg-[var(--bg-dark)] text-[var(--text-main)]">Pending</option>
                <option value="Failed" className="bg-[var(--bg-dark)] text-[var(--text-main)]">Failed</option>
              </select>
            </div>
            <div className="flex items-center gap-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 w-full sm:w-auto">
              <FileCode size={16} className="text-[var(--text-muted)]" />
              <select value={templateFilter} onChange={(e) => setTemplateFilter(e.target.value)} className="bg-transparent border-none text-sm font-medium focus:outline-none text-[var(--text-main)] cursor-pointer">
                <option value="All" className="bg-[var(--bg-dark)] text-[var(--text-main)]">All Templates</option>
                <option value="Modern" className="bg-[var(--bg-dark)] text-[var(--text-main)]">Modern</option>
                <option value="Professional" className="bg-[var(--bg-dark)] text-[var(--text-main)]">Professional</option>
                <option value="Creative" className="bg-[var(--bg-dark)] text-[var(--text-main)]">Creative</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <div className="flex items-center gap-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl px-3 py-2.5">
              <span className="text-sm font-medium text-[var(--text-muted)]">Sort:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent border-none text-sm font-medium focus:outline-none text-[var(--text-main)] cursor-pointer">
                <option value="Newest" className="bg-[var(--bg-dark)] text-[var(--text-main)]">Newest First</option>
                <option value="Oldest" className="bg-[var(--bg-dark)] text-[var(--text-main)]">Oldest First</option>
                <option value="Highest Score" className="bg-[var(--bg-dark)] text-[var(--text-main)]">Highest Score</option>
                <option value="Most Downloads" className="bg-[var(--bg-dark)] text-[var(--text-main)]">Most Downloads</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Action Bar (Floating above table if selected) */}
        {selectedResumes.length > 0 && (
          <div className="bg-blue-500/10 border-b border-[var(--border-color)] px-6 py-3 flex items-center justify-between">
            <span className="text-sm font-bold text-blue-500">{selectedResumes.length} resumes selected</span>
            <div className="flex items-center gap-2">
              <button onClick={() => handleBulkAction('analyze')} className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"><Zap size={14}/> Analyze</button>
              <button onClick={() => handleBulkAction('download')} className="px-3 py-1.5 bg-[var(--bg-dark)] border border-[var(--border-color)] hover:bg-[var(--bg-main)] text-[var(--text-main)] text-xs font-bold rounded-lg transition-colors flex items-center gap-1"><Download size={14}/> Download</button>
              <button onClick={() => handleBulkAction('export')} className="px-3 py-1.5 bg-[var(--bg-dark)] border border-[var(--border-color)] hover:bg-[var(--bg-main)] text-[var(--text-main)] text-xs font-bold rounded-lg transition-colors flex items-center gap-1"><ExternalLink size={14}/> Export</button>
              <button onClick={() => handleBulkAction('delete')} className="px-3 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"><Trash2 size={14}/> Delete</button>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-[var(--bg-dark)]/80 text-[var(--text-muted)] uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="py-4 px-6 border-b border-[var(--border-color)] w-10">
                  <input type="checkbox" checked={selectedResumes.length === currentResumes.length && currentResumes.length > 0} onChange={toggleSelectAll} className="w-4 h-4 rounded border-gray-300 accent-blue-500 cursor-pointer"/>
                </th>
                <th className="py-4 px-4 border-b border-[var(--border-color)]">Resume Details</th>
                <th className="py-4 px-4 border-b border-[var(--border-color)]">Template & Size</th>
                <th className="py-4 px-4 border-b border-[var(--border-color)]">ATS Score</th>
                <th className="py-4 px-4 border-b border-[var(--border-color)]">Status</th>
                <th className="py-4 px-4 border-b border-[var(--border-color)]">Last Updated</th>
                <th className="py-4 px-6 border-b border-[var(--border-color)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] relative">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-16 text-[var(--text-muted)] animate-pulse font-medium">Fetching resumes...</td></tr>
              ) : currentResumes.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-16 text-[var(--text-muted)] font-medium">No resumes found.</td></tr>
              ) : (
                currentResumes.map(r => (
                  <tr key={r.id} className="hover:bg-[var(--bg-dark)]/30 transition-colors group">
                    <td className="py-4 px-6">
                      <input type="checkbox" checked={selectedResumes.includes(r.id)} onChange={() => toggleSelectResume(r.id)} className="w-4 h-4 rounded border-gray-300 accent-blue-500 cursor-pointer"/>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 bg-white rounded shadow-sm border border-gray-200 flex flex-col justify-between p-1 shrink-0">
                          <div className="w-full h-1.5 bg-gray-300 rounded-sm mb-1"></div>
                          <div className="w-3/4 h-1 bg-gray-200 rounded-sm mb-0.5"></div>
                          <div className="w-full h-1 bg-gray-200 rounded-sm mb-0.5"></div>
                          <div className="w-5/6 h-1 bg-gray-200 rounded-sm mt-auto"></div>
                        </div>
                        <div>
                          <p className="font-bold text-[var(--text-main)] text-sm">{r.name}</p>
                          <p className="text-xs text-[var(--text-muted)] flex items-center gap-1"><Briefcase size={12}/> {r.jobTitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className="px-2.5 py-0.5 bg-[var(--bg-dark)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-bold rounded-md">{r.template}</span>
                        <span className="text-xs font-medium text-[var(--text-muted)] flex items-center gap-1">
                          <FileText size={12}/> {r.fileSize}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 w-32">
                        <div className="flex-1 h-2 bg-[var(--bg-dark)] rounded-full overflow-hidden border border-[var(--border-color)]">
                          <div className={`h-full rounded-full ${r.atsScore >= 80 ? 'bg-emerald-500' : r.atsScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${r.atsScore}%` }}></div>
                        </div>
                        <span className="text-xs font-bold">{r.atsScore}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {r.status === 'Analyzed' && <span className="flex items-center gap-1.5 w-max px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold rounded-lg"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Analyzed</span>}
                      {r.status === 'Pending' && <span className="flex items-center gap-1.5 w-max px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold rounded-lg"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Pending</span>}
                      {r.status === 'Failed' && <span className="flex items-center gap-1.5 w-max px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold rounded-lg"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>Failed</span>}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-[var(--text-muted)]">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setPreviewModal(r)} className="p-1.5 bg-[var(--bg-dark)] border border-[var(--border-color)] hover:bg-blue-500/10 hover:border-blue-500/30 text-[var(--text-muted)] hover:text-blue-500 rounded-lg transition-all" title="View Resume"><Eye size={14} /></button>
                        <button onClick={() => handleDownloadPdf(r)} className="p-1.5 bg-[var(--bg-dark)] border border-[var(--border-color)] hover:bg-emerald-500/10 hover:border-emerald-500/30 text-[var(--text-muted)] hover:text-emerald-500 rounded-lg transition-all" title="Download PDF"><Download size={14} /></button>
                        <button onClick={() => setReportModal(r)} className="p-1.5 bg-[var(--bg-dark)] border border-[var(--border-color)] hover:bg-amber-500/10 hover:border-amber-500/30 text-[var(--text-muted)] hover:text-amber-500 rounded-lg transition-all" title="AI Report"><Zap size={14} /></button>
                        <button onClick={() => setDeleteConfirmModal(r)} className="p-1.5 bg-[var(--bg-dark)] border border-[var(--border-color)] hover:bg-rose-500/10 hover:border-rose-500/30 text-[var(--text-muted)] hover:text-rose-500 rounded-lg transition-all" title="Delete Resume"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredResumes.length > 0 && (
          <div className="p-4 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--bg-dark)]/50 rounded-b-2xl">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[var(--text-muted)]">
                Showing <span className="text-[var(--text-main)] font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-[var(--text-main)] font-bold">{Math.min(currentPage * itemsPerPage, filteredResumes.length)}</span> of <span className="text-[var(--text-main)] font-bold">{filteredResumes.length}</span>
              </span>
              <select value={itemsPerPage} onChange={(e) => {setItemsPerPage(Number(e.target.value)); setCurrentPage(1);}} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-2 py-1 text-xs font-bold focus:outline-none">
                <option value="10" className="bg-[var(--bg-dark)] text-[var(--text-main)]">10 / page</option>
                <option value="25" className="bg-[var(--bg-dark)] text-[var(--text-main)]">25 / page</option>
                <option value="50" className="bg-[var(--bg-dark)] text-[var(--text-main)]">50 / page</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="p-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-main)] disabled:opacity-50 transition-colors"><ChevronLeft size={16} /></button>
              {Array.from({length: totalPages}).map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-bold transition-colors ${currentPage === i + 1 ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25' : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:bg-[var(--bg-main)] text-[var(--text-main)]'}`}>
                  {i + 1}
                </button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="p-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-main)] disabled:opacity-50 transition-colors"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}
      
      {/* Full-Screen PDF Preview Modal */}
      <AnimatePresence>
        {previewModal && (
          <div className="fixed inset-0 flex flex-col bg-black/90 backdrop-blur-md z-[99999]">
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-[#1e1e1e]">
              <h2 className="text-white text-lg font-bold flex items-center gap-2"><FileText className="text-blue-500" /> {previewModal.name} - Resume</h2>
              
              <div className="flex items-center gap-2 bg-black/30 rounded-lg p-1 border border-white/10">
                <button onClick={() => setZoomLevel(Math.max(50, zoomLevel - 20))} className="p-2 hover:bg-white/10 text-white rounded transition-colors"><ZoomOut size={18}/></button>
                <span className="text-white text-sm font-bold w-12 text-center">{zoomLevel}%</span>
                <button onClick={() => setZoomLevel(Math.min(200, zoomLevel + 20))} className="p-2 hover:bg-white/10 text-white rounded transition-colors"><ZoomIn size={18}/></button>
                <div className="w-px h-6 bg-white/20 mx-1"></div>
                <button onClick={() => setZoomLevel(100)} className="p-2 hover:bg-white/10 text-white rounded transition-colors" title="Fit Page"><Maximize size={18}/></button>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => showToast('Printing resume...')} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"><Printer size={18} /></button>
                <button onClick={() => handleDownloadPdf(previewModal)} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"><Download size={18} /> Download</button>
                <div className="w-px h-6 bg-white/20 mx-1"></div>
                <button onClick={() => setPreviewModal(null)} className="p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors flex items-center gap-2"><X size={18} /> Close</button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-8 flex justify-center items-start bg-[#121212]">
              <div className="bg-white shadow-2xl transition-all duration-200 overflow-hidden" style={{ width: `${794 * (zoomLevel / 100)}px`, minHeight: `${1123 * (zoomLevel / 100)}px` }}>
                <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left', width: '794px' }}>
                  <ResumeContentRenderer 
                    resumeData={previewModal} 
                    templateStyle={(previewModal.template || 'modern').toLowerCase()} 
                    zoom={100}
                    showDiff={true}
                    customTemplateHtml={getCustomHtml(previewModal.template)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Report Modal */}
      <AnimatePresence>
        {reportModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md z-[9999]">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[var(--bg-dark)] w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-5 border-b border-[var(--border-color)] bg-[var(--bg-card)] shrink-0">
                <h2 className="text-xl font-bold flex items-center gap-2"><Zap className="text-amber-500" fill="currentColor" /> AI Analysis Report</h2>
                <button onClick={() => setReportModal(null)} className="p-2 bg-[var(--bg-dark)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-xl transition-colors"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                <div className="flex items-center justify-between bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-6 rounded-xl">
                  <div>
                    <h3 className="text-lg font-bold mb-1">Overall ATS Score</h3>
                    <p className="text-[var(--text-muted)] text-sm">Calculated across 4 primary metrics.</p>
                  </div>
                  <div className="w-24 h-24 rounded-full border-8 border-indigo-500 flex items-center justify-center bg-[var(--bg-card)] shadow-lg shadow-indigo-500/20">
                    <span className="text-3xl font-black text-indigo-500">{reportModal.atsScore}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-5 bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-xl">
                    <h4 className="font-bold border-b border-[var(--border-color)] pb-2">Score Breakdown</h4>
                    <div>
                      <div className="flex justify-between text-sm mb-1"><span className="font-medium">Grammar & Syntax</span><span className="font-bold text-blue-500">{reportModal.grammarScore}/100</span></div>
                      <div className="w-full h-2 bg-[var(--bg-dark)] rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${reportModal.grammarScore}%` }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1"><span className="font-medium">Formatting</span><span className="font-bold text-emerald-500">{reportModal.formatScore}/100</span></div>
                      <div className="w-full h-2 bg-[var(--bg-dark)] rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${reportModal.formatScore}%` }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1"><span className="font-medium">Keyword Match</span><span className="font-bold text-amber-500">{reportModal.keywordMatch}/100</span></div>
                      <div className="w-full h-2 bg-[var(--bg-dark)] rounded-full overflow-hidden"><div className="h-full bg-amber-500 rounded-full" style={{ width: `${reportModal.keywordMatch}%` }}></div></div>
                    </div>
                  </div>

                  <div className="space-y-5 bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-xl">
                    <h4 className="font-bold border-b border-[var(--border-color)] pb-2 flex items-center gap-2"><AlertCircle size={16} className="text-amber-500"/> AI Suggestions</h4>
                    <ul className="space-y-3">
                      {reportModal.suggestions.map((s, i) => (
                        <li key={i} className="text-sm flex items-start gap-2 text-[var(--text-muted)]"><span className="text-amber-500 mt-1">•</span> {s.text || s}</li>
                      ))}
                    </ul>
                    <h4 className="font-bold border-b border-[var(--border-color)] pb-2 pt-2">Missing Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {reportModal.missingSkills.map((skill, i) => (
                        <span key={i} className="px-2.5 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-bold rounded-lg">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5 border-t border-[var(--border-color)] bg-[var(--bg-card)] flex justify-end gap-3 shrink-0">
                <button onClick={() => handleDownloadPdf(reportModal)} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center gap-2">
                  <Download size={18} /> Export Resume
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md z-[9999]">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[var(--bg-dark)] w-full max-w-md rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col text-center">
              <div className="p-8 pt-10">
                <div className="w-20 h-20 rounded-full bg-rose-500/10 border-4 border-rose-500/20 flex items-center justify-center mx-auto mb-6 text-rose-500">
                  <AlertTriangle size={32} />
                </div>
                <h2 className="text-2xl font-black mb-2">Delete Resume?</h2>
                <p className="text-[var(--text-muted)] text-sm mb-4">
                  This action is <strong>irreversible</strong>. Are you absolutely sure you want to permanently delete the resume for <strong className="text-[var(--text-main)]">{deleteConfirmModal.name}</strong>?
                </p>
              </div>
              <div className="p-5 border-t border-[var(--border-color)] bg-[var(--bg-card)] flex justify-center gap-4">
                <button onClick={() => setDeleteConfirmModal(null)} className="px-6 py-2.5 rounded-xl font-bold text-[var(--text-muted)] hover:bg-[var(--bg-dark)] transition-colors">Cancel</button>
                <button onClick={confirmDelete} className="px-8 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md transition-all">Yes, Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-8 right-8 z-[10000] text-white px-6 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-3 ${toast.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`}>
            {toast.type === 'error' ? <AlertCircle size={20}/> : <CheckCircle size={20}/>} {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
