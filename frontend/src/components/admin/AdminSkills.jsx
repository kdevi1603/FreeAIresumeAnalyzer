import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Edit2, Trash2, CheckCircle, XCircle, Filter, Eye, X, Activity, 
  Download, Upload, ChevronDown, Check, AlertTriangle, Briefcase, Award, Globe, 
  BarChart2, Clock, RotateCcw, Copy, Trash, ArrowUp, ArrowDown
} from 'lucide-react';
import { 
  PieChart, Pie, BarChart, Bar, LineChart, Line, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// --- Toast Component ---
const Toast = ({ message, type, onClose }) => {
  return (
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
};

export default function AdminSkills() {
  // --- Data State ---
  const [data, setData] = useState({ skills: [], certs: [], langs: [] });
  const [loading, setLoading] = useState(true);
  
  // --- UI State ---
  const [activeTab, setActiveTab] = useState('skills'); // 'skills', 'certifications', 'languages'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  
  const [selectedIds, setSelectedIds] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [activityLog, setActivityLog] = useState([]);

  // --- Modal State ---
  const [modal, setModal] = useState({ isOpen: false, mode: 'add', type: 'skills', item: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, ids: [] });

  const getHeaders = () => ({ 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' });

  // --- Fetch Data ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resSkills, resCerts, resLangs] = await Promise.all([
        fetch('http://localhost:5000/api/admin/skills', { headers: getHeaders() }).then(res => res.json()),
        fetch('http://localhost:5000/api/admin/certifications', { headers: getHeaders() }).then(res => res.json()),
        fetch('http://localhost:5000/api/admin/languages', { headers: getHeaders() }).then(res => res.json())
      ]);
      
      const skills = Array.isArray(resSkills) ? resSkills : [];
      const certs = Array.isArray(resCerts) ? resCerts : [];
      const langs = Array.isArray(resLangs) ? resLangs : [];
      
      setData({ skills, certs, langs });
      
      // Generate some initial activity from recent data
      if (activityLog.length === 0) {
        const allItems = [
          ...skills.map(s => ({ ...s, _type: 'Skill' })), 
          ...certs.map(c => ({ ...c, _type: 'Certification' })), 
          ...langs.map(l => ({ ...l, _type: 'Language' }))
        ];
        allItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setActivityLog(allItems.slice(0, 5).map(item => ({
          id: item.id + Math.random(),
          action: `${item._type} "${item.name}" was created.`,
          time: new Date(item.createdAt).toLocaleDateString(),
          user: 'Admin'
        })));
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast('Failed to load data', 'error');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // --- Toast Logic ---
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const addActivity = (action) => {
    setActivityLog(prev => [{ id: Date.now(), action, time: 'Just now', user: 'Admin (You)' }, ...prev].slice(0, 8));
  };

  // --- Helper Methods ---
  const getActiveDataArray = () => {
    if (activeTab === 'skills') return data.skills;
    if (activeTab === 'certifications') return data.certs;
    return data.langs;
  };

  const getEndpoint = (type = activeTab) => {
    if (type === 'skills') return 'http://localhost:5000/api/admin/skills';
    if (type === 'certifications') return 'http://localhost:5000/api/admin/certifications';
    return 'http://localhost:5000/api/admin/languages';
  };

  const getTypeLabel = (type = activeTab) => {
    if (type === 'skills') return 'Skill';
    if (type === 'certifications') return 'Certification';
    return 'Language';
  };

  // --- Filtering & Sorting ---
  const filteredData = useMemo(() => {
    let arr = getActiveDataArray();

    // Global Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      arr = arr.filter(item => 
        item.name?.toLowerCase().includes(q) || 
        item.category?.toLowerCase().includes(q) ||
        item.provider?.toLowerCase().includes(q)
      );
    }

    // Category Filter
    if (filterCategory !== 'All') {
      arr = arr.filter(item => item.category === filterCategory);
    }

    // Status Filter
    if (filterStatus !== 'All') {
      const isEnabled = filterStatus === 'Active';
      arr = arr.filter(item => item.isEnabled === isEnabled);
    }

    // Sort By
    arr = [...arr].sort((a, b) => {
      if (sortBy === 'Newest') return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
      if (sortBy === 'Oldest') return new Date(a.createdAt || Date.now()) - new Date(b.createdAt || Date.now());
      if (sortBy === 'Name (A-Z)') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'Name (Z-A)') return (b.name || '').localeCompare(a.name || '');
      return 0;
    });

    return arr;
  }, [data, activeTab, searchQuery, filterCategory, filterStatus, sortBy]);

  // --- Bulk Selection ---
  const toggleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(filteredData.map(item => item.id));
    else setSelectedIds([]);
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(i => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  useEffect(() => { setSelectedIds([]); }, [activeTab]);

  // --- CRUD Operations ---
  const handleSaveModal = async (formData) => {
    if (!formData.name.trim()) return showToast('Name is required', 'error');

    const type = modal.type;
    const isEdit = modal.mode === 'edit';
    const endpoint = getEndpoint(type);
    const url = isEdit ? `${endpoint}/${formData.id}` : endpoint;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(formData) });
      if (response.ok) {
        showToast(`${getTypeLabel(type)} ${isEdit ? 'Updated' : 'Added'} Successfully!`);
        addActivity(`${getTypeLabel(type)} "${formData.name}" was ${isEdit ? 'updated' : 'added'}.`);
        setModal({ isOpen: false, item: null });
        fetchData();
      } else {
        showToast('Error saving data', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error', 'error');
    }
  };

  const executeDelete = async () => {
    const ids = deleteConfirm.ids;
    if (ids.length === 0) return;
    
    try {
      const type = deleteConfirm.type || activeTab;
      const endpoint = getEndpoint(type);
      
      await Promise.all(ids.map(id => fetch(`${endpoint}/${id}`, { method: 'DELETE', headers: getHeaders() })));
      
      showToast(`${ids.length} ${getTypeLabel(type)}${ids.length > 1 ? 's' : ''} Deleted Successfully`);
      addActivity(`Deleted ${ids.length} ${getTypeLabel(type).toLowerCase()}(s).`);
      setDeleteConfirm({ isOpen: false, ids: [] });
      setSelectedIds([]);
      fetchData();
    } catch (err) {
      console.error(err);
      showToast('Error deleting items', 'error');
    }
  };

  const bulkStatusUpdate = async (enable) => {
    if (selectedIds.length === 0) return;
    try {
      const endpoint = getEndpoint();
      const itemsToUpdate = getActiveDataArray().filter(item => selectedIds.includes(item.id));
      
      await Promise.all(itemsToUpdate.map(item => 
        fetch(`${endpoint}/${item.id}`, { 
          method: 'PUT', 
          headers: getHeaders(), 
          body: JSON.stringify({ ...item, isEnabled: enable }) 
        })
      ));
      
      showToast(`${selectedIds.length} Items ${enable ? 'Enabled' : 'Disabled'}`);
      addActivity(`Bulk ${enable ? 'enabled' : 'disabled'} ${selectedIds.length} items.`);
      setSelectedIds([]);
      fetchData();
    } catch (err) {
      showToast('Error updating status', 'error');
    }
  };

  const toggleStatus = async (item) => {
    try {
      const response = await fetch(`${getEndpoint()}/${item.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ ...item, isEnabled: !item.isEnabled })
      });
      if (response.ok) {
        showToast(`${item.name} ${!item.isEnabled ? 'Enabled' : 'Disabled'}`, 'info');
        fetchData();
      }
    } catch (err) {
      showToast('Error toggling status', 'error');
    }
  };

  const duplicateItem = async (item) => {
    const duplicatedData = { ...item, name: `${item.name} (Copy)`, id: undefined, _id: undefined };
    try {
      const response = await fetch(getEndpoint(), { method: 'POST', headers: getHeaders(), body: JSON.stringify(duplicatedData) });
      if (response.ok) {
        showToast(`${getTypeLabel()} Duplicated`);
        fetchData();
      }
    } catch (err) {
      showToast('Error duplicating', 'error');
    }
  };

  // --- Export / Import ---
  const exportCSV = () => {
    const itemsToExport = selectedIds.length > 0 ? filteredData.filter(i => selectedIds.includes(i.id)) : filteredData;
    if (itemsToExport.length === 0) return showToast('No data to export', 'error');
    
    const headers = Object.keys(itemsToExport[0]).filter(k => k !== '_id' && k !== 'id' && k !== '__v');
    const csvContent = [
      headers.join(','),
      ...itemsToExport.map(row => headers.map(header => `"${(row[header] || '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${activeTab}_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast(`Exported ${itemsToExport.length} items successfully`);
    addActivity(`Exported ${itemsToExport.length} ${activeTab}.`);
  };

  // --- Stats Calculation ---
  const getRecentlyAddedCount = () => {
    const now = new Date();
    const isRecent = (dateStr) => (now - new Date(dateStr)) < 24 * 60 * 60 * 1000;
    return data.skills.filter(s => isRecent(s.createdAt)).length + 
           data.certs.filter(c => isRecent(c.createdAt)).length + 
           data.langs.filter(l => isRecent(l.createdAt)).length;
  };

  // --- Chart Data Preparation ---
  const pieData = useMemo(() => {
    const counts = {};
    data.skills.forEach(s => {
      const cat = s.category || 'Uncategorized';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.keys(counts).map(name => ({ name, value: counts[name] })).sort((a,b) => b.value - a.value).slice(0, 5);
  }, [data.skills]);

  const PIE_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

  const barData = useMemo(() => {
    return [
      { name: 'Jan', skills: 12, certs: 4, langs: 2 },
      { name: 'Feb', skills: 19, certs: 7, langs: 3 },
      { name: 'Mar', skills: 15, certs: 5, langs: 1 },
      { name: 'Apr', skills: 22, certs: 8, langs: 4 },
      { name: 'May', skills: 25, certs: 10, langs: 5 },
      { name: 'Jun', skills: 28, certs: 12, langs: 6 },
      { name: 'Jul', skills: 30, certs: 15, langs: 8 },
      { name: 'Aug', skills: Math.max(35, data.skills.length), certs: Math.max(18, data.certs.length), langs: Math.max(10, data.langs.length) },
      { name: 'Sep', skills: 0, certs: 0, langs: 0 },
      { name: 'Oct', skills: 0, certs: 0, langs: 0 },
      { name: 'Nov', skills: 0, certs: 0, langs: 0 },
      { name: 'Dec', skills: 0, certs: 0, langs: 0 }
    ];
  }, [data]);

  // --- Render Functions ---
  const renderBadges = (isEnabled) => (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit ${isEnabled !== false ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
      {isEnabled !== false ? <><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active</> : <><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Disabled</>}
    </span>
  );

  return (
    <div className="text-[var(--text-main)] w-full pb-20 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-[var(--bg-card)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm backdrop-blur-md relative z-40">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Skills & Qualifications Master</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Manage unified master data for skills, certifications, and languages.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="btn btn-secondary flex items-center gap-2 px-4 py-2 border border-[var(--border-color)] rounded-xl hover:bg-[var(--bg-main)] transition-colors">
            <Download size={16} /> Export
          </button>
          <button className="btn btn-secondary flex items-center gap-2 px-4 py-2 border border-[var(--border-color)] rounded-xl hover:bg-[var(--bg-main)] transition-colors">
            <Upload size={16} /> Import
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Skills" value={data.skills.length} icon={Briefcase} color="blue" />
        <StatCard title="Total Certifications" value={data.certs.length} icon={Award} color="emerald" />
        <StatCard title="Total Languages" value={data.langs.length} icon={Globe} color="purple" />
        <StatCard title="Recently Added" value={getRecentlyAddedCount()} subtext="Last 24 Hours" icon={Clock} color="amber" />
      </div>

      {/* CHARTS & ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><BarChart2 size={18} className="text-blue-500" /> Monthly Growth</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'var(--bg-main)'}} contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '12px', color: 'var(--text-main)' }} />
                <Legend iconType="circle" />
                <Bar dataKey="skills" name="Skills" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="certs" name="Certifications" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="langs" name="Languages" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Activity Panel */}
        <div className="lg:col-span-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm flex flex-col h-full">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Activity size={18} className="text-purple-500" /> Recent Activity</h3>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4">
            {activityLog.length > 0 ? activityLog.map((log) => (
              <div key={log.id} className="flex gap-3 relative">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500 mt-1.5 z-10"></div>
                  <div className="w-px h-full bg-[var(--border-color)] absolute top-3 left-[4.5px]"></div>
                </div>
                <div className="pb-2">
                  <p className="text-sm font-medium text-[var(--text-main)]">{log.action}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{log.time} • by {log.user}</p>
                </div>
              </div>
            )) : <div className="text-sm text-[var(--text-muted)] text-center mt-10">No recent activity</div>}
          </div>
        </div>
      </div>

      {/* TABS & MAIN TOOLBAR */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-sm mb-6 flex flex-col">
        {/* Tabs Row */}
        <div className="flex overflow-x-auto border-b border-[var(--border-color)] p-2 gap-1">
          {['skills', 'certifications', 'languages'].map(tab => (
            <button 
              key={tab}
              onClick={() => { setActiveTab(tab); setFilterCategory('All'); setFilterStatus('All'); setSearchQuery(''); }}
              className={`px-6 py-3 rounded-xl text-sm font-semibold capitalize transition-all ${activeTab === tab ? 'bg-blue-500/10 text-blue-500' : 'text-[var(--text-muted)] hover:bg-[var(--bg-main)] hover:text-[var(--text-main)]'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Toolbar Row */}
        <div className="p-4 flex flex-col xl:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-[var(--text-main)]"
              />
            </div>
            
            {/* Category Filter */}
            {activeTab === 'skills' && (
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="All">All Categories</option>
                <option value="Programming">Programming</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="Cloud">Cloud</option>
                <option value="DevOps">DevOps</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Testing">Testing</option>
                <option value="Soft Skills">Soft Skills</option>
                <option value="Design">Design</option>
                <option value="Technical Skill">Technical Skill</option>
              </select>
            )}

            {/* Status Filter */}
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
            </select>

            {/* Sort */}
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="Newest">Sort: Newest</option>
              <option value="Oldest">Sort: Oldest</option>
              <option value="Name (A-Z)">Sort: A-Z</option>
              <option value="Name (Z-A)">Sort: Z-A</option>
            </select>

            <button onClick={() => { setSearchQuery(''); setFilterCategory('All'); setFilterStatus('All'); setSortBy('Newest'); }} className="px-3 text-[var(--text-muted)] hover:text-[var(--text-main)]" title="Reset Filters"><RotateCcw size={18} /></button>
          </div>

          <button onClick={() => setModal({ isOpen: true, mode: 'add', type: activeTab, item: null })} className="w-full xl:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20">
            <Plus size={18} /> Add New
          </button>
        </div>
      </div>

      {/* BULK ACTIONS TOOLBAR */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }} 
            animate={{ opacity: 1, y: 0, height: 'auto' }} 
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-6 flex items-center justify-between"
          >
            <span className="text-sm font-medium text-blue-500 px-2">{selectedIds.length} item(s) selected</span>
            <div className="flex gap-2">
              <button onClick={() => bulkStatusUpdate(true)} className="px-3 py-1.5 bg-green-500/20 text-green-600 hover:bg-green-500/30 rounded-lg text-xs font-medium transition-colors">Enable Selected</button>
              <button onClick={() => bulkStatusUpdate(false)} className="px-3 py-1.5 bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30 rounded-lg text-xs font-medium transition-colors">Disable Selected</button>
              <button onClick={() => setDeleteConfirm({ isOpen: true, ids: selectedIds, type: activeTab })} className="px-3 py-1.5 bg-red-500/20 text-red-600 hover:bg-red-500/30 rounded-lg text-xs font-medium transition-colors">Delete Selected</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DATA TABLE */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-sm text-[var(--text-muted)]">Loading database...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-80 text-center px-6">
              <div className="w-24 h-24 bg-[var(--bg-main)] rounded-full flex items-center justify-center mb-4">
                <Search size={40} className="text-[var(--text-muted)] opacity-50" />
              </div>
              <h3 className="text-lg font-bold mb-2">No {activeTab} found</h3>
              <p className="text-[var(--text-muted)] max-w-sm mb-6">We couldn't find anything matching your current filters. Try adjusting your search or add a new entry.</p>
              <button onClick={() => setModal({ isOpen: true, mode: 'add', type: activeTab, item: null })} className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 px-6 py-2 rounded-xl font-medium transition-colors">
                + Add Your First {getTypeLabel()}
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-main)] text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  <th className="p-4 w-12 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-[var(--border-color)] text-blue-500 focus:ring-blue-500/50 w-4 h-4 cursor-pointer"
                      checked={selectedIds.length === filteredData.length && filteredData.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="p-4">Name</th>
                  {activeTab === 'skills' && <th className="p-4">Category</th>}
                  {activeTab === 'certifications' && <th className="p-4">Provider</th>}
                  {activeTab === 'languages' && <th className="p-4">Proficiency</th>}
                  <th className="p-4 hidden md:table-cell">Description</th>
                  <th className="p-4 w-32">Status</th>
                  <th className="p-4 w-32 hidden lg:table-cell">Created Date</th>
                  <th className="p-4 w-48 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredData.map(item => (
                  <motion.tr 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    key={item.id} 
                    className={`hover:bg-[var(--bg-main)] transition-colors group ${selectedIds.includes(item.id) ? 'bg-blue-500/5' : ''}`}
                  >
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-[var(--border-color)] text-blue-500 focus:ring-blue-500/50 w-4 h-4 cursor-pointer"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                      />
                    </td>
                    <td className="p-4 font-semibold text-[var(--text-main)]">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center opacity-70 ${activeTab === 'skills' ? 'bg-blue-500/10 text-blue-500' : activeTab === 'certifications' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-purple-500/10 text-purple-500'}`}>
                          {activeTab === 'skills' ? <Briefcase size={14} /> : activeTab === 'certifications' ? <Award size={14} /> : <Globe size={14} />}
                        </div>
                        {item.name}
                      </div>
                    </td>
                    
                    {activeTab === 'skills' && (
                      <td className="p-4"><span className="px-2.5 py-1 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-muted)]">{item.category || 'General'}</span></td>
                    )}
                    {activeTab === 'certifications' && (
                      <td className="p-4 text-sm text-[var(--text-muted)]">{item.provider || '-'}</td>
                    )}
                    {activeTab === 'languages' && (
                      <td className="p-4 text-sm text-[var(--text-muted)]">{item.proficiencyLevel || 'Professional'}</td>
                    )}
                    
                    <td className="p-4 text-sm text-[var(--text-muted)] hidden md:table-cell truncate max-w-[200px]">{item.description || item.code || '-'}</td>
                    
                    <td className="p-4">{renderBadges(item.isEnabled)}</td>
                    
                    <td className="p-4 text-sm text-[var(--text-muted)] hidden lg:table-cell">{new Date(item.createdAt || Date.now()).toLocaleDateString()}</td>
                    
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setModal({ isOpen: true, mode: 'view', type: activeTab, item })} className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" title="View"><Eye size={16} /></button>
                        <button onClick={() => setModal({ isOpen: true, mode: 'edit', type: activeTab, item })} className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit"><Edit2 size={16} /></button>
                        <button onClick={() => duplicateItem(item)} className="p-1.5 text-gray-500 hover:text-purple-500 hover:bg-purple-500/10 rounded-lg transition-colors" title="Duplicate"><Copy size={16} /></button>
                        <button onClick={() => toggleStatus(item)} className="p-1.5 text-gray-500 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors" title={item.isEnabled !== false ? 'Disable' : 'Enable'}><Activity size={16} /></button>
                        <button onClick={() => setDeleteConfirm({ isOpen: true, ids: [item.id], type: activeTab })} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- ADD / EDIT MODAL --- */}
      <AnimatePresence>
        {modal.isOpen && (
          <ModalComponent 
            modal={modal} 
            onClose={() => setModal({ isOpen: false, item: null })} 
            onSave={handleSaveModal} 
          />
        )}
        
        {/* --- DELETE CONFIRMATION MODAL --- */}
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl w-full max-w-sm shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash size={28} />
              </div>
              <h2 className="text-xl font-bold mb-2 text-[var(--text-main)]">Delete {deleteConfirm.ids.length > 1 ? 'Items' : 'Item'}?</h2>
              <p className="text-[var(--text-muted)] text-sm mb-6">Are you sure you want to delete {deleteConfirm.ids.length > 1 ? `these ${deleteConfirm.ids.length} items` : 'this item'}? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm({ isOpen: false, ids: [] })} className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-main)] font-medium hover:bg-[var(--bg-main)] transition-colors">Cancel</button>
                <button onClick={executeDelete} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium shadow-md shadow-red-500/20 transition-colors">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- TOAST CONTAINER --- */}
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

// --- SUB-COMPONENTS ---

const StatCard = ({ title, value, subtext, icon: Icon, color }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600 text-blue-500 bg-blue-500/10 border-blue-500/20',
    emerald: 'from-emerald-500 to-emerald-600 text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    purple: 'from-purple-500 to-purple-600 text-purple-500 bg-purple-500/10 border-purple-500/20',
    amber: 'from-amber-500 to-amber-600 text-amber-500 bg-amber-500/10 border-amber-500/20',
  };
  const clr = colors[color];

  return (
    <motion.div whileHover={{ y: -5 }} className="bg-[var(--bg-card)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${clr.split(' ')[0]} ${clr.split(' ')[1]} opacity-5 rounded-bl-full group-hover:scale-110 transition-transform duration-500`}></div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-sm font-semibold text-[var(--text-muted)]">{title}</h3>
        <div className={`p-2 rounded-xl bg-gradient-to-br ${clr.split(' ').slice(2).join(' ')}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="relative z-10">
        <motion.h2 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-extrabold text-[var(--text-main)] mb-1">{value}</motion.h2>
        {subtext && <p className="text-xs text-[var(--text-muted)] font-medium flex items-center gap-1"><ArrowUp size={12} className="text-green-500"/> {subtext}</p>}
      </div>
    </motion.div>
  );
};

// --- MODAL COMPONENT ---
const ModalComponent = ({ modal, onClose, onSave }) => {
  const isView = modal.mode === 'view';
  const type = modal.type;
  
  const [formData, setFormData] = useState(modal.item || {
    name: '', category: 'Programming', isEnabled: true, description: '', priority: 'Medium', provider: '', issueDate: '', expiryDate: '', code: '', proficiencyLevel: 'Intermediate'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-main)] rounded-t-2xl">
          <h2 className="text-xl font-bold capitalize text-[var(--text-main)] flex items-center gap-2">
            {modal.mode} {type.slice(0, -1)}
            {isView && <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-md ml-2 border border-blue-500/20">Read Only</span>}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-[var(--bg-card)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"><X size={20} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-5">
          {/* Common Field */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Name <span className="text-red-500">*</span></label>
            <input name="name" value={formData.name} onChange={handleChange} disabled={isView} type="text" className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none disabled:opacity-60 text-[var(--text-main)]" placeholder="e.g. React.js" />
          </div>

          {/* Type Specific Fields */}
          {type === 'skills' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} disabled={isView} className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none disabled:opacity-60 text-[var(--text-main)]">
                  <option value="Programming">Programming</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="Cloud">Cloud</option>
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="Soft Skills">Soft Skills</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Priority</label>
                <select name="priority" value={formData.priority || 'Medium'} onChange={handleChange} disabled={isView} className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none disabled:opacity-60 text-[var(--text-main)]">
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          )}

          {type === 'certifications' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Provider</label>
                <input name="provider" value={formData.provider || ''} onChange={handleChange} disabled={isView} type="text" className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-[var(--text-main)]" placeholder="e.g. AWS" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Issue Date</label>
                  <input name="issueDate" value={formData.issueDate || ''} onChange={handleChange} disabled={isView} type="date" className="w-full px-3 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-main)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Expiry Date</label>
                  <input name="expiryDate" value={formData.expiryDate || ''} onChange={handleChange} disabled={isView} type="date" className="w-full px-3 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-main)]" />
                </div>
              </div>
            </div>
          )}

          {type === 'languages' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Language Code</label>
                <input name="code" value={formData.code || ''} onChange={handleChange} disabled={isView} type="text" className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-[var(--text-main)]" placeholder="e.g. EN, FR" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Proficiency Level</label>
                <select name="proficiencyLevel" value={formData.proficiencyLevel || 'Intermediate'} onChange={handleChange} disabled={isView} className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-[var(--text-main)]">
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Professional">Professional</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Beginner">Beginner</option>
                </select>
              </div>
            </div>
          )}

          {/* Shared Description */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Description</label>
            <textarea name="description" value={formData.description || ''} onChange={handleChange} disabled={isView} rows="3" className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none resize-none disabled:opacity-60 text-[var(--text-main)]" placeholder="Short description..."></textarea>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl mt-2">
            <div>
              <p className="text-sm font-semibold text-[var(--text-main)]">Status (Active/Disabled)</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Determines if this item is available for users.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isEnabled" checked={formData.isEnabled !== false} onChange={handleChange} disabled={isView} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

        </div>
        
        <div className="px-6 py-4 border-t border-[var(--border-color)] bg-[var(--bg-main)] rounded-b-2xl flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-main)] font-medium hover:bg-[var(--bg-card)] transition-colors">
            {isView ? 'Close' : 'Cancel'}
          </button>
          {!isView && (
            <button onClick={() => onSave(formData)} className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20 transition-colors">
              Save {type.slice(0, -1)}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

