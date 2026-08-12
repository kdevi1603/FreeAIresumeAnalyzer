import React, { useState, useEffect } from 'react';
import { 
  Users, Shield, CheckCircle, XCircle, Search, Filter, Plus,
  Trash2, Eye, Edit2, Lock, Unlock, Download, ChevronLeft, ChevronRight, X, UserX, AlertCircle, FileText, Zap, Activity,
  Mail, Phone, MapPin, DownloadCloud, ShieldCheck, UserCheck, Briefcase, Calendar, Key, AlertTriangle, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Bulk Actions
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Modals
  const [viewModal, setViewModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(null);
  const [blockModal, setBlockModal] = useState(null);
  const [blockReason, setBlockReason] = useState('');
  
  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const decorateUserData = (rawUsers) => {
    return rawUsers.map((u, i) => {
      return {
        ...u,
        name: u.name || 'Anonymous User',
        email: u.email || 'No email provided',
        role: u.role || 'user',
        method: u.method || 'Email',
        country: u.country || 'Unknown',
        phone: u.phone || 'N/A',
        lastLogin: u.lastLogin || u.createdAt || new Date().toISOString(),
        resumeCount: u.resumeCount || 0,
        atsReports: u.atsReports || 0,
        downloads: u.downloads || 0,
        activityTimeline: u.activities || []
      };
    });
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(decorateUserData(data));
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- API Handlers ---
  const confirmDelete = async () => {
    if (!deleteConfirmModal) return;
    try {
      await fetch(`http://localhost:5000/api/admin/users/${deleteConfirmModal.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      showToast('User deleted successfully.');
      setDeleteConfirmModal(null);
      fetchUsers();
    } catch (err) {
      showToast('Failed to delete user.', 'error');
    }
  };

  const confirmBlock = async () => {
    if (!blockModal) return;
    try {
      // Normally we'd send the reason in the body, but the backend patch just toggles it currently
      await fetch(`http://localhost:5000/api/admin/users/${blockModal.id}/block`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      showToast(`User successfully ${blockModal.isBlocked ? 'unblocked' : 'blocked'}.`);
      setBlockModal(null);
      setBlockReason('');
      fetchUsers();
    } catch (err) {
      showToast('Failed to change user status.', 'error');
    }
  };

  // --- Bulk Actions ---
  const toggleSelectAll = (e) => {
    if (e.target.checked) setSelectedUsers(currentUsers.map(u => u.id));
    else setSelectedUsers([]);
  };

  const toggleSelectUser = (id) => {
    if (selectedUsers.includes(id)) setSelectedUsers(selectedUsers.filter(uid => uid !== id));
    else setSelectedUsers([...selectedUsers, id]);
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) return showToast('No users selected.', 'error');
    if (action === 'export') {
      showToast(`Exported ${selectedUsers.length} users successfully!`);
    } else if (action === 'delete') {
      showToast(`Bulk delete feature coming soon for ${selectedUsers.length} users.`);
    }
    setSelectedUsers([]);
  };

  // --- Filtering & Pagination ---
  const filteredUsers = users.filter(u => {
    const nameMatch = (u.name || '').toLowerCase().includes(search.toLowerCase());
    const emailMatch = (u.email || '').toLowerCase().includes(search.toLowerCase());
    const idMatch = search.length > 4 ? (u.id || '').toString().includes(search) : false;
    const searchMatch = nameMatch || emailMatch || idMatch;

    let statusMatch = true;
    if (statusFilter === 'Active') statusMatch = !u.isBlocked;
    if (statusFilter === 'Blocked') statusMatch = u.isBlocked;
    if (statusFilter === 'New Users') statusMatch = new Date(u.createdAt) > new Date(Date.now() - 86400000 * 7);

    let roleMatch = true;
    if (roleFilter === 'Admin') roleMatch = u.role === 'admin';
    if (roleFilter === 'Normal User') roleMatch = u.role !== 'admin';

    return searchMatch && statusMatch && roleMatch;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- Dashboard Stats ---
  const totalActive = users.filter(u => !u.isBlocked).length;
  const totalBlocked = users.filter(u => u.isBlocked).length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;
  const newUsersToday = users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 86400000)).length;

  return (
    <div className="text-[var(--text-main)] w-full relative">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-2">User Management</h1>
          <p className="text-[var(--text-muted)] font-medium">Manage all platform users, view their activity, and monitor engagement.</p>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Users size={60} className="text-blue-500" /></div>
          <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-2">Total Users</p>
          <h2 className="text-3xl font-black">{users.length}</h2>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><UserCheck size={60} className="text-emerald-500" /></div>
          <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-2">Active Users</p>
          <h2 className="text-3xl font-black">{totalActive}</h2>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><UserX size={60} className="text-rose-500" /></div>
          <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-2">Blocked Users</p>
          <h2 className="text-3xl font-black">{totalBlocked}</h2>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Shield size={60} className="text-indigo-500" /></div>
          <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-2">Admins</p>
          <h2 className="text-3xl font-black">{totalAdmins}</h2>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Activity size={60} className="text-purple-500" /></div>
          <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-2">New Today</p>
          <h2 className="text-3xl font-black">{newUsersToday}</h2>
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
                type="text" placeholder="Search by name, email..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors text-[var(--text-main)]"
              />
            </div>
            <div className="flex items-center gap-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 w-full sm:w-auto">
              <Filter size={16} className="text-[var(--text-muted)]" />
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="bg-transparent border-none text-sm font-medium focus:outline-none text-[var(--text-main)] cursor-pointer">
                <option value="All" className="bg-[var(--bg-dark)] text-[var(--text-main)]">All Roles</option>
                <option value="Admin" className="bg-[var(--bg-dark)] text-[var(--text-main)]">Admin</option>
                <option value="Normal User" className="bg-[var(--bg-dark)] text-[var(--text-main)]">Normal User</option>
              </select>
            </div>
            <div className="flex items-center gap-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 w-full sm:w-auto">
              <Activity size={16} className="text-[var(--text-muted)]" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent border-none text-sm font-medium focus:outline-none text-[var(--text-main)] cursor-pointer">
                <option value="All" className="bg-[var(--bg-dark)] text-[var(--text-main)]">All Status</option>
                <option value="Active" className="bg-[var(--bg-dark)] text-[var(--text-main)]">Active</option>
                <option value="Blocked" className="bg-[var(--bg-dark)] text-[var(--text-main)]">Blocked</option>
                <option value="New Users" className="bg-[var(--bg-dark)] text-[var(--text-main)]">New Users</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            {selectedUsers.length > 0 && (
              <div className="flex items-center gap-2 mr-4">
                <span className="text-sm font-bold text-blue-500">{selectedUsers.length} selected</span>
                <button onClick={() => handleBulkAction('delete')} className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-lg transition-colors" title="Delete Selected"><Trash2 size={16}/></button>
              </div>
            )}
            <button onClick={() => handleBulkAction('export')} className="flex items-center gap-2 bg-[var(--bg-dark)] border border-[var(--border-color)] hover:bg-[var(--bg-main)] text-[var(--text-main)] px-4 py-2.5 rounded-xl font-bold shadow-sm transition-all text-sm">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-[var(--bg-dark)]/80 text-[var(--text-muted)] uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="py-4 px-6 border-b border-[var(--border-color)] w-10">
                  <input type="checkbox" checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0} onChange={toggleSelectAll} className="w-4 h-4 rounded border-gray-300 accent-blue-500 cursor-pointer"/>
                </th>
                <th className="py-4 px-4 border-b border-[var(--border-color)]">User Profile</th>
                <th className="py-4 px-4 border-b border-[var(--border-color)]">Role & Method</th>
                <th className="py-4 px-4 border-b border-[var(--border-color)]">Usage Stats</th>
                <th className="py-4 px-4 border-b border-[var(--border-color)]">Status</th>
                <th className="py-4 px-4 border-b border-[var(--border-color)]">Joined</th>
                <th className="py-4 px-6 border-b border-[var(--border-color)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] relative">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-16 text-[var(--text-muted)] animate-pulse font-medium">Fetching users...</td></tr>
              ) : currentUsers.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-16 text-[var(--text-muted)] font-medium">No users found.</td></tr>
              ) : (
                currentUsers.map(u => (
                  <tr key={u.id} className="hover:bg-[var(--bg-dark)]/30 transition-colors group">
                    <td className="py-4 px-6">
                      <input type="checkbox" checked={selectedUsers.includes(u.id)} onChange={() => toggleSelectUser(u.id)} className="w-4 h-4 rounded border-gray-300 accent-blue-500 cursor-pointer"/>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-500 font-bold shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[var(--text-main)] text-sm">{u.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        {u.role === 'admin' 
                          ? <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-bold rounded-md flex items-center gap-1"><ShieldCheck size={10}/> ADMIN</span>
                          : <span className="px-2.5 py-0.5 bg-slate-500/10 border border-slate-500/20 text-[var(--text-muted)] text-[10px] font-bold rounded-md flex items-center gap-1"><Users size={10}/> USER</span>
                        }
                        <span className="text-xs font-medium text-[var(--text-muted)] flex items-center gap-1">
                          {u.method === 'Google' ? <Globe size={12}/> : <Mail size={12}/>} {u.method}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="font-medium text-[var(--text-main)] flex items-center gap-1.5"><FileText size={12} className="text-blue-500"/> {u.resumeCount} Resumes</span>
                        <span className="text-[var(--text-muted)] flex items-center gap-1.5"><Zap size={12} className="text-emerald-500"/> {u.atsReports} ATS Reports</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {u.isBlocked 
                        ? <span className="flex items-center gap-1.5 w-max px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold rounded-lg"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>Blocked</span>
                        : <span className="flex items-center gap-1.5 w-max px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold rounded-lg"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Active</span>
                      }
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-[var(--text-muted)]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setViewModal(u)} className="p-2 bg-[var(--bg-dark)] border border-[var(--border-color)] hover:bg-blue-500/10 hover:border-blue-500/30 text-[var(--text-muted)] hover:text-blue-500 rounded-lg transition-all" title="View Details"><Eye size={16} /></button>
                        <button onClick={() => setEditModal(u)} className="p-2 bg-[var(--bg-dark)] border border-[var(--border-color)] hover:bg-indigo-500/10 hover:border-indigo-500/30 text-[var(--text-muted)] hover:text-indigo-500 rounded-lg transition-all" title="Edit User"><Edit2 size={16} /></button>
                        <button onClick={() => setBlockModal(u)} className={`p-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-lg transition-all ${u.isBlocked ? 'hover:bg-emerald-500/10 hover:border-emerald-500/30 text-[var(--text-muted)] hover:text-emerald-500' : 'hover:bg-amber-500/10 hover:border-amber-500/30 text-[var(--text-muted)] hover:text-amber-500'}`} title={u.isBlocked ? 'Unblock User' : 'Block User'}>
                          {u.isBlocked ? <Unlock size={16} /> : <Lock size={16} />}
                        </button>
                        <button onClick={() => setDeleteConfirmModal(u)} className="p-2 bg-[var(--bg-dark)] border border-[var(--border-color)] hover:bg-rose-500/10 hover:border-rose-500/30 text-[var(--text-muted)] hover:text-rose-500 rounded-lg transition-all" title="Delete User"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredUsers.length > 0 && (
          <div className="p-4 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--bg-dark)]/50 rounded-b-2xl">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[var(--text-muted)]">
                Showing <span className="text-[var(--text-main)] font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-[var(--text-main)] font-bold">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="text-[var(--text-main)] font-bold">{filteredUsers.length}</span>
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
      
      {/* View Modal */}
      <AnimatePresence>
        {viewModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md z-[9999]">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[var(--bg-dark)] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-5 border-b border-[var(--border-color)] bg-[var(--bg-card)] shrink-0">
                <h2 className="text-xl font-bold flex items-center gap-2"><UserCheck className="text-blue-500" /> User Profile</h2>
                <button onClick={() => setViewModal(null)} className="p-2 bg-[var(--bg-dark)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-xl transition-colors"><X size={20} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left Column */}
                  <div className="w-full md:w-1/3 flex flex-col gap-6">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-black text-white shadow-lg mb-4 border-4 border-[var(--bg-dark)]">
                        {viewModal.name.charAt(0).toUpperCase()}
                      </div>
                      <h3 className="text-xl font-bold">{viewModal.name}</h3>
                      <p className="text-sm text-[var(--text-muted)] mb-4">{viewModal.email}</p>
                      
                      {viewModal.isBlocked 
                        ? <span className="px-3 py-1 bg-rose-500/10 text-rose-500 rounded-lg text-sm font-bold border border-rose-500/20 mb-4">Blocked Account</span>
                        : <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-sm font-bold border border-emerald-500/20 mb-4">Active Account</span>
                      }
                      
                      <div className="w-full text-left space-y-3 mt-2 pt-4 border-t border-[var(--border-color)]">
                        <div className="flex items-center justify-between text-sm"><span className="text-[var(--text-muted)] flex items-center gap-2"><Phone size={14}/> Phone</span> <span className="font-semibold">{viewModal.phone}</span></div>
                        <div className="flex items-center justify-between text-sm"><span className="text-[var(--text-muted)] flex items-center gap-2"><MapPin size={14}/> Country</span> <span className="font-semibold">{viewModal.country}</span></div>
                        <div className="flex items-center justify-between text-sm"><span className="text-[var(--text-muted)] flex items-center gap-2"><Calendar size={14}/> Joined</span> <span className="font-semibold">{new Date(viewModal.createdAt).toLocaleDateString()}</span></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column */}
                  <div className="w-full md:w-2/3 flex flex-col gap-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-xl">
                        <p className="text-[var(--text-muted)] text-xs font-bold uppercase mb-1">Total Resumes</p>
                        <h4 className="text-2xl font-black text-blue-500">{viewModal.resumeCount}</h4>
                      </div>
                      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-xl">
                        <p className="text-[var(--text-muted)] text-xs font-bold uppercase mb-1">ATS Reports</p>
                        <h4 className="text-2xl font-black text-emerald-500">{viewModal.atsReports}</h4>
                      </div>
                      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-xl">
                        <p className="text-[var(--text-muted)] text-xs font-bold uppercase mb-1">Downloads</p>
                        <h4 className="text-2xl font-black text-purple-500">{viewModal.downloads}</h4>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
                      <h4 className="font-bold mb-4 flex items-center gap-2"><Activity size={18} className="text-indigo-500"/> Activity Timeline</h4>
                      <div className="space-y-4 pl-2 border-l-2 border-[var(--border-color)] ml-2">
                        {viewModal.activityTimeline.map((log, idx) => (
                          <div key={idx} className="relative pl-6">
                            <div className="absolute -left-[21px] top-1 w-6 h-6 rounded-full bg-[var(--bg-dark)] border-2 border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)]">{log.icon}</div>
                            <p className="text-sm font-bold text-[var(--text-main)]">{log.action}</p>
                            <p className="text-xs font-medium text-[var(--text-muted)]">{log.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md z-[9999]">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[var(--bg-dark)] w-full max-w-lg rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-5 border-b border-[var(--border-color)] bg-[var(--bg-card)] shrink-0">
                <h2 className="text-xl font-bold flex items-center gap-2"><Edit2 className="text-blue-500" /> Edit User</h2>
                <button onClick={() => setEditModal(null)} className="p-2 bg-[var(--bg-dark)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-xl transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Full Name</label>
                  <input type="text" defaultValue={editModal.name} className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Email Address</label>
                  <input type="email" defaultValue={editModal.email} className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Assigned Role</label>
                  <select defaultValue={editModal.role} className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 focus:border-blue-500 focus:outline-none appearance-none">
                    <option value="user" className="bg-[var(--bg-dark)]">User</option>
                    <option value="admin" className="bg-[var(--bg-dark)]">Admin</option>
                  </select>
                </div>
              </div>
              <div className="p-5 border-t border-[var(--border-color)] bg-[var(--bg-card)] flex justify-end gap-3 shrink-0">
                <button onClick={() => setEditModal(null)} className="px-5 py-2 rounded-xl font-bold text-[var(--text-muted)] hover:bg-[var(--bg-dark)] transition-colors">Cancel</button>
                <button onClick={() => {setEditModal(null); showToast('User details saved!');}} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-all">Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Block Confirm Modal */}
      <AnimatePresence>
        {blockModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md z-[9999]">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[var(--bg-dark)] w-full max-w-md rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col text-center">
              <div className="p-8 pt-10">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 ${blockModal.isBlocked ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                  {blockModal.isBlocked ? <Unlock size={32} /> : <Lock size={32} />}
                </div>
                <h2 className="text-2xl font-black mb-2">{blockModal.isBlocked ? 'Unblock User?' : 'Block User?'}</h2>
                <p className="text-[var(--text-muted)] mb-6 text-sm">
                  {blockModal.isBlocked ? `Are you sure you want to unblock ${blockModal.name}? They will regain access to the platform.` : `Are you sure you want to block ${blockModal.name}? They will lose access immediately.`}
                </p>
                
                {!blockModal.isBlocked && (
                  <div className="text-left mb-6">
                    <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Reason for blocking (Required)</label>
                    <textarea value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="E.g., Violation of Terms of Service..." className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-3 focus:border-amber-500 focus:outline-none min-h-[100px] resize-none"></textarea>
                  </div>
                )}
              </div>
              <div className="p-5 border-t border-[var(--border-color)] bg-[var(--bg-card)] flex justify-center gap-4">
                <button onClick={() => {setBlockModal(null); setBlockReason('');}} className="px-6 py-2.5 rounded-xl font-bold text-[var(--text-muted)] hover:bg-[var(--bg-dark)] transition-colors">Cancel</button>
                <button disabled={!blockModal.isBlocked && !blockReason.trim()} onClick={confirmBlock} className={`px-8 py-2.5 text-white rounded-xl font-bold shadow-md transition-all disabled:opacity-50 ${blockModal.isBlocked ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-500 hover:bg-amber-600'}`}>
                  {blockModal.isBlocked ? 'Yes, Unblock' : 'Block User'}
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
                <h2 className="text-2xl font-black mb-2">Delete Account?</h2>
                <p className="text-[var(--text-muted)] text-sm mb-4">
                  This action is <strong>irreversible</strong>. Are you absolutely sure you want to permanently delete the account for <strong className="text-[var(--text-main)]">{deleteConfirmModal.name}</strong>?
                </p>
                <p className="text-rose-500 text-xs font-bold bg-rose-500/10 py-2 rounded-lg border border-rose-500/20">All associated resumes and ATS reports will be lost.</p>
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
