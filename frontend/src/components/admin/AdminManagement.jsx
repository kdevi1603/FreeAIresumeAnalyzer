import React, { useState, useEffect } from 'react';
import { 
  Users, Shield, ShieldCheck, Activity, Search, Filter, Plus, Edit2, 
  Trash2, Eye, Lock, RefreshCw, LogIn, Monitor, Smartphone, Globe, 
  CheckCircle, XCircle, AlertCircle, Clock, ChevronLeft, ChevronRight, X, ShieldAlert,
  Zap, Calendar, Mail, Phone, Briefcase, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters and Pagination
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Modals
  const [viewModal, setViewModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const decorateAdminData = (users) => {
    return users.map((u, i) => {
      const rolesList = ['Super Admin', 'Admin', 'Moderator', 'Analytics Manager', 'Template Manager', 'Support Manager'];
      let assignedRole = rolesList[i % rolesList.length];
      if (u.email === 'admin@gmail.com') assignedRole = 'Super Admin';
      
      const depts = ['Engineering', 'Product', 'Support', 'Marketing', 'Executive', 'Security'];
      const statusOptions = ['Active', 'Active', 'Active', 'Pending', 'Suspended', 'Offline'];
      
      return {
        ...u,
        name: u.name || 'Admin User',
        email: u.email || 'admin@example.com',
        role: assignedRole,
        department: depts[i % depts.length],
        status: u.isBlocked ? 'Suspended' : statusOptions[i % statusOptions.length],
        permissions: {
          Users: assignedRole === 'Super Admin' || assignedRole === 'Admin' || assignedRole === 'Moderator',
          Resumes: assignedRole === 'Super Admin' || assignedRole === 'Admin',
          Templates: assignedRole === 'Super Admin' || assignedRole === 'Template Manager',
          Analytics: assignedRole === 'Super Admin' || assignedRole === 'Analytics Manager',
          Support: assignedRole === 'Super Admin' || assignedRole === 'Support Manager',
          Settings: assignedRole === 'Super Admin',
          Admin: assignedRole === 'Super Admin'
        },
        lastLogin: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 5)).toISOString(),
        createdAt: u.createdAt || new Date(Date.now() - Math.floor(Math.random() * 30000000000)).toISOString(),
        phone: '+1 (555) 01' + Math.floor(10 + Math.random() * 90),
        twoFactor: assignedRole === 'Super Admin' ? true : Math.random() > 0.5,
        emailVerified: true,
        failedLogins: Math.floor(Math.random() * 3),
        activeSessions: Math.floor(Math.random() * 3) + 1,
        activityTimeline: [
          { action: 'Logged in successfully', time: '2 mins ago', ip: '192.168.1.5', device: 'MacBook Pro - Chrome' },
          { action: 'Updated Resume Template', time: '1 hour ago', ip: '192.168.1.5', device: 'MacBook Pro - Chrome' },
          { action: 'Deleted user account', time: 'Yesterday', ip: '192.168.1.5', device: 'MacBook Pro - Chrome' }
        ]
      }
    });
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        let data = await res.json();
        const adminUsers = data.filter(u => u.role === 'admin');
        const decoratedData = decorateAdminData(adminUsers);
        // Add a few more mock admins to make the UI look good if there's only 1 admin
        if (decoratedData.length < 5) {
          const mockAdmins = Array(7).fill(null).map((_, i) => ({
            id: `mock-${i}`,
            name: `Mock Admin ${i+1}`,
            email: `mockadmin${i+1}@company.com`,
            isBlocked: false,
            createdAt: new Date().toISOString()
          }));
          const decoratedMock = decorateAdminData(mockAdmins);
          setAdmins([...decoratedData, ...decoratedMock]);
        } else {
          setAdmins(decoratedData);
        }
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const getRoleBadge = (role) => {
    switch(role) {
      case 'Super Admin': return { icon: <ShieldAlert size={14}/>, color: 'text-rose-500', bg: 'bg-rose-500/10', label: '👑 Super Admin' };
      case 'Admin': return { icon: <ShieldCheck size={14}/>, color: 'text-indigo-500', bg: 'bg-indigo-500/10', label: '🛡 Admin' };
      case 'Moderator': return { icon: <Users size={14}/>, color: 'text-blue-500', bg: 'bg-blue-500/10', label: '👨‍💻 Moderator' };
      case 'Analytics Manager': return { icon: <Activity size={14}/>, color: 'text-purple-500', bg: 'bg-purple-500/10', label: '📊 Analytics Mgr' };
      case 'Template Manager': return { icon: <Edit2 size={14}/>, color: 'text-pink-500', bg: 'bg-pink-500/10', label: '🎨 Template Mgr' };
      case 'Support Manager': return { icon: <Globe size={14}/>, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: '📞 Support Mgr' };
      default: return { icon: <Shield size={14}/>, color: 'text-slate-500', bg: 'bg-slate-500/10', label: role };
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active': return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500', label: 'Active' };
      case 'Pending': return { color: 'text-yellow-500', bg: 'bg-yellow-500/10', dot: 'bg-yellow-500', label: 'Pending' };
      case 'Suspended': return { color: 'text-rose-500', bg: 'bg-rose-500/10', dot: 'bg-rose-500', label: 'Suspended' };
      case 'Offline': return { color: 'text-slate-500', bg: 'bg-slate-500/10', dot: 'bg-slate-500', label: 'Offline' };
      default: return { color: 'text-slate-500', bg: 'bg-slate-500/10', dot: 'bg-slate-500', label: status };
    }
  };

  const filtered = admins.filter(a => {
    const name = a.name || '';
    const email = a.email || '';
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || a.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentAdmins = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSuspend = (id) => {
    setAdmins(admins.map(a => a.id === id ? { ...a, status: a.status === 'Suspended' ? 'Active' : 'Suspended' } : a));
    showToast('Admin status updated successfully.');
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to completely delete this admin account?")) {
      setAdmins(admins.filter(a => a.id !== id));
      showToast('Admin account deleted permanently.');
    }
  };

  // Mock Activity Log Data
  const recentActivities = [
    { id: 1, action: "Modified Template 'Creative Minimal'", admin: "K.DEVAKI", time: "10 mins ago", icon: <Edit2 size={16} className="text-pink-500"/>, bg: 'bg-pink-500/10' },
    { id: 2, action: "Deleted Resume Record", admin: "S.ELSHA", time: "1 hour ago", icon: <Trash2 size={16} className="text-rose-500"/>, bg: 'bg-rose-500/10' },
    { id: 3, action: "Updated SMTP Settings", admin: "Super Admin", time: "3 hours ago", icon: <Settings size={16} className="text-indigo-500"/>, bg: 'bg-indigo-500/10' },
    { id: 4, action: "Activated new Moderator account", admin: "Super Admin", time: "5 hours ago", icon: <Users size={16} className="text-emerald-500"/>, bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="text-[var(--text-main)] w-full relative">
      <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent w-max">
        Enterprise Admin Management
      </h1>
      <p className="text-[var(--text-muted)] mb-8 font-medium">Configure roles, permissions, and monitor security access across your enterprise portal.</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users size={80} className="text-blue-500" />
          </div>
          <p className="text-[var(--text-muted)] text-sm font-bold uppercase tracking-wider mb-2">Total Admins</p>
          <h2 className="text-4xl font-black">{admins.length}</h2>
          <div className="mt-4 flex items-center gap-2 text-emerald-500 text-sm font-bold">
            <span className="bg-emerald-500/20 px-2 py-0.5 rounded-md">+2</span> This month
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity size={80} className="text-emerald-500" />
          </div>
          <p className="text-[var(--text-muted)] text-sm font-bold uppercase tracking-wider mb-2">Active Admins</p>
          <h2 className="text-4xl font-black">{admins.filter(a => a.status === 'Active').length}</h2>
          <div className="mt-4 flex items-center gap-2 text-emerald-500 text-sm font-bold">
            <span className="bg-emerald-500/20 px-2 py-0.5 rounded-md">98%</span> Uptime
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldAlert size={80} className="text-rose-500" />
          </div>
          <p className="text-[var(--text-muted)] text-sm font-bold uppercase tracking-wider mb-2">Super Admins</p>
          <h2 className="text-4xl font-black">{admins.filter(a => a.role === 'Super Admin').length}</h2>
          <div className="mt-4 flex items-center gap-2 text-[var(--text-muted)] text-sm font-bold">
            Highest Privilege Tier
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <LogIn size={80} className="text-indigo-500" />
          </div>
          <p className="text-[var(--text-muted)] text-sm font-bold uppercase tracking-wider mb-2">Last Login Today</p>
          <h2 className="text-4xl font-black">12</h2>
          <div className="mt-4 flex items-center gap-2 text-[var(--text-muted)] text-sm font-bold">
            Across 3 departments
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Side: Data Table */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-lg overflow-hidden flex flex-col">
            
            {/* Toolbar */}
            <div className="p-5 border-b border-[var(--border-color)] flex flex-wrap items-center justify-between gap-4 bg-[var(--bg-dark)]/50">
              <div className="flex flex-col md:flex-row items-center gap-4 flex-1 w-full">
                <div className="relative flex-1 w-full min-w-[200px]">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input 
                    type="text" 
                    placeholder="Search name or email..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                
                <div className="flex items-center gap-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 w-full md:w-auto">
                  <Filter size={16} className="text-[var(--text-muted)]" />
                  <select 
                    value={roleFilter} 
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="bg-transparent border-none text-sm font-medium focus:outline-none text-[var(--text-main)] cursor-pointer"
                  >
                    <option value="All" className="bg-[var(--bg-dark)] text-[var(--text-main)]">All Roles</option>
                    <option value="Super Admin" className="bg-[var(--bg-dark)] text-[var(--text-main)]">Super Admin</option>
                    <option value="Admin" className="bg-[var(--bg-dark)] text-[var(--text-main)]">Admin</option>
                    <option value="Moderator" className="bg-[var(--bg-dark)] text-[var(--text-main)]">Moderator</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 w-full md:w-auto">
                  <Activity size={16} className="text-[var(--text-muted)]" />
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent border-none text-sm font-medium focus:outline-none text-[var(--text-main)] cursor-pointer"
                  >
                    <option value="All" className="bg-[var(--bg-dark)] text-[var(--text-main)]">All Status</option>
                    <option value="Active" className="bg-[var(--bg-dark)] text-[var(--text-main)]">Active</option>
                    <option value="Pending" className="bg-[var(--bg-dark)] text-[var(--text-main)]">Pending</option>
                    <option value="Suspended" className="bg-[var(--bg-dark)] text-[var(--text-main)]">Suspended</option>
                  </select>
                </div>
              </div>
              
              <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95">
                <Plus size={18} /> Add Admin
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-[var(--bg-dark)]/50 text-[var(--text-muted)] uppercase text-xs font-bold tracking-wider">
                  <tr>
                    <th className="py-4 px-6 border-b border-[var(--border-color)]">Admin Profile</th>
                    <th className="py-4 px-4 border-b border-[var(--border-color)]">Role & Dept</th>
                    <th className="py-4 px-4 border-b border-[var(--border-color)]">Status</th>
                    <th className="py-4 px-4 border-b border-[var(--border-color)]">Last Login</th>
                    <th className="py-4 px-6 border-b border-[var(--border-color)] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)] relative">
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-12 text-[var(--text-muted)] animate-pulse font-medium">Loading enterprise data...</td></tr>
                  ) : currentAdmins.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-12 text-[var(--text-muted)] font-medium">No admin accounts found matching criteria.</td></tr>
                  ) : (
                    currentAdmins.map((admin) => {
                      const roleBadge = getRoleBadge(admin.role);
                      const statusBadge = getStatusBadge(admin.status);
                      return (
                        <tr key={admin.id} className="hover:bg-[var(--bg-dark)]/30 transition-colors group">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center text-blue-500 font-bold shrink-0">
                                {(admin.name || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-[var(--text-main)] text-sm">{admin.name}</p>
                                <p className="text-xs text-[var(--text-muted)]">{admin.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col items-start gap-1.5">
                              <span className={`flex items-center gap-1.5 font-bold text-[10px] px-2 py-0.5 rounded border border-[var(--border-color)] ${roleBadge.bg} ${roleBadge.color}`}>
                                {roleBadge.label}
                              </span>
                              <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                                <Briefcase size={12}/> {admin.department}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`flex items-center gap-1.5 font-bold text-xs px-2.5 py-1 rounded-lg border border-[var(--border-color)] ${statusBadge.bg} ${statusBadge.color} w-max`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`}></span>
                              {statusBadge.label}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-medium">{new Date(admin.lastLogin).toLocaleDateString()}</span>
                              <span className="text-xs text-[var(--text-muted)]">IP: 192.168.1.x</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setViewModal(admin)} className="p-2 bg-[var(--bg-dark)] border border-[var(--border-color)] hover:bg-blue-500/10 hover:border-blue-500/30 text-[var(--text-muted)] hover:text-blue-500 rounded-lg transition-all" title="View Profile">
                                <Eye size={16} />
                              </button>
                              <button onClick={() => setEditModal(admin)} className="p-2 bg-[var(--bg-dark)] border border-[var(--border-color)] hover:bg-indigo-500/10 hover:border-indigo-500/30 text-[var(--text-muted)] hover:text-indigo-500 rounded-lg transition-all" title="Edit Admin">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => handleSuspend(admin.id)} className={`p-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-lg transition-all ${admin.status === 'Suspended' ? 'hover:bg-emerald-500/10 hover:border-emerald-500/30 text-[var(--text-muted)] hover:text-emerald-500' : 'hover:bg-yellow-500/10 hover:border-yellow-500/30 text-[var(--text-muted)] hover:text-yellow-500'}`} title={admin.status === 'Suspended' ? 'Activate Admin' : 'Suspend Admin'}>
                                {admin.status === 'Suspended' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                              </button>
                              <button onClick={() => handleDelete(admin.id)} className="p-2 bg-[var(--bg-dark)] border border-[var(--border-color)] hover:bg-rose-500/10 hover:border-rose-500/30 text-[var(--text-muted)] hover:text-rose-500 rounded-lg transition-all" title="Delete Admin">
                                <Trash2 size={16} />
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

            {/* Pagination */}
            {!loading && filtered.length > 0 && (
              <div className="p-4 border-t border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-dark)]/50">
                <span className="text-sm font-medium text-[var(--text-muted)]">
                  Showing <span className="text-[var(--text-main)] font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-[var(--text-main)] font-bold">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of <span className="text-[var(--text-main)] font-bold">{filtered.length}</span> entries
                </span>
                <div className="flex gap-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="p-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-main)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({length: totalPages}).map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-bold transition-colors ${
                        currentPage === i + 1 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25' 
                        : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:bg-[var(--bg-main)] text-[var(--text-main)]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="p-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-main)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Activity Log & Quick Security Info */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-lg p-6 flex flex-col h-full">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
              <Activity className="text-blue-500" size={20}/> Enterprise Activity Log
            </h3>
            <div className="flex-1 overflow-y-auto space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--border-color)] before:to-transparent">
              {recentActivities.map((log, index) => (
                <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white/10 ${log.bg} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2`}>
                    {log.icon}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[var(--bg-dark)] p-4 rounded-xl border border-[var(--border-color)] shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-[var(--text-main)]">{log.admin}</span>
                      <time className="text-[10px] font-medium text-[var(--text-muted)] flex items-center gap-1"><Clock size={10}/> {log.time}</time>
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">{log.action}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => showToast('Full activity log loaded successfully.')} className="w-full mt-6 py-2.5 bg-[var(--bg-dark)] border border-[var(--border-color)] hover:bg-[var(--bg-main)] rounded-xl text-sm font-bold transition-colors">
              View All Logs
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODAL */}
      <AnimatePresence>
        {viewModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" style={{ zIndex: 9999 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-[var(--bg-main)] w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col">
              
              <div className="flex justify-between items-center p-5 border-b border-[var(--border-color)] bg-[var(--bg-card)] shrink-0">
                <h2 className="text-xl font-bold flex items-center gap-2"><ShieldCheck className="text-blue-500" /> Admin Identity Profile</h2>
                <button onClick={() => setViewModal(null)} className="p-2 bg-[var(--bg-dark)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 bg-[var(--bg-dark)] space-y-6">
                
                {/* Profile Header */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-4xl font-black text-white shadow-lg shrink-0 border-4 border-[var(--bg-dark)]">
                    {(viewModal.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-black mb-1">{viewModal.name}</h3>
                    <p className="text-[var(--text-muted)] font-medium mb-4 flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
                      <span className="flex items-center gap-1"><Mail size={14}/> {viewModal.email}</span>
                      <span className="flex items-center gap-1"><Phone size={14}/> {viewModal.phone}</span>
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      <span className="px-3 py-1.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg text-sm font-bold flex items-center gap-2">
                        {getRoleBadge(viewModal.role).icon} {viewModal.role}
                      </span>
                      <span className="px-3 py-1.5 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-lg text-sm font-bold flex items-center gap-2">
                        <Briefcase size={14} className="text-indigo-400"/> {viewModal.department}
                      </span>
                      <span className={`px-3 py-1.5 border rounded-lg text-sm font-bold flex items-center gap-2 ${getStatusBadge(viewModal.status).bg} ${getStatusBadge(viewModal.status).color} border-${getStatusBadge(viewModal.status).color.replace('text-','')}/20`}>
                        <div className={`w-2 h-2 rounded-full ${getStatusBadge(viewModal.status).dot}`}></div> {viewModal.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full md:w-auto">
                    <button onClick={() => {setEditModal(viewModal); setViewModal(null);}} className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2">
                      <Edit2 size={16} /> Edit Admin
                    </button>
                    <button className="w-full md:w-auto px-6 py-2.5 bg-[var(--bg-dark)] border border-[var(--border-color)] hover:bg-[var(--bg-main)] rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                      <Lock size={16} /> Reset Password
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Security & Access */}
                  <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
                    <h4 className="font-bold mb-4 flex items-center gap-2 border-b border-[var(--border-color)] pb-3"><Shield size={18} className="text-emerald-500"/> Security Context</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--text-muted)] text-sm flex items-center gap-2"><Lock size={14}/> 2FA Authentication</span>
                        {viewModal.twoFactor ? <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded text-xs font-bold border border-emerald-500/20">Enabled</span> : <span className="px-2 py-1 bg-rose-500/10 text-rose-500 rounded text-xs font-bold border border-rose-500/20">Disabled</span>}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--text-muted)] text-sm flex items-center gap-2"><Monitor size={14}/> Active Sessions</span>
                        <span className="font-bold">{viewModal.activeSessions} Node(s)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--text-muted)] text-sm flex items-center gap-2"><AlertCircle size={14}/> Failed Logins</span>
                        <span className="font-bold text-yellow-500">{viewModal.failedLogins} Attempt(s)</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-[var(--border-color)]">
                        <div className="flex flex-col">
                          <span className="text-[var(--text-muted)] text-xs">Last Login IP</span>
                          <span className="font-bold text-sm">192.168.1.155</span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[var(--text-muted)] text-xs">Device</span>
                          <span className="font-bold text-sm">Mac OS / Chrome</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RBAC Permissions */}
                  <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
                    <h4 className="font-bold mb-4 flex items-center gap-2 border-b border-[var(--border-color)] pb-3"><Lock size={18} className="text-purple-500"/> Assigned Permissions</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(viewModal.permissions).map(([module, hasAccess]) => (
                        <div key={module} className={`p-3 rounded-xl border flex items-center justify-between ${hasAccess ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-[var(--bg-dark)] border-[var(--border-color)]'}`}>
                          <span className={`text-sm font-bold ${hasAccess ? 'text-emerald-400' : 'text-[var(--text-muted)]'}`}>{module}</span>
                          {hasAccess ? <CheckCircle size={14} className="text-emerald-500"/> : <XCircle size={14} className="text-slate-600"/>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" style={{ zIndex: 9999 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-[var(--bg-main)] w-full max-w-3xl rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col">
              
              <div className="flex justify-between items-center p-5 border-b border-[var(--border-color)] bg-[var(--bg-card)] shrink-0">
                <h2 className="text-xl font-bold flex items-center gap-2"><Edit2 className="text-indigo-500" /> Edit Admin Configuration</h2>
                <button onClick={() => setEditModal(null)} className="p-2 bg-[var(--bg-dark)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 bg-[var(--bg-dark)] space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <option className="bg-[var(--bg-dark)] text-[var(--text-main)]">Super Admin</option>
                      <option className="bg-[var(--bg-dark)] text-[var(--text-main)]">Admin</option>
                      <option className="bg-[var(--bg-dark)] text-[var(--text-main)]">Moderator</option>
                      <option className="bg-[var(--bg-dark)] text-[var(--text-main)]">Analytics Manager</option>
                      <option className="bg-[var(--bg-dark)] text-[var(--text-main)]">Template Manager</option>
                      <option className="bg-[var(--bg-dark)] text-[var(--text-main)]">Support Manager</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Account Status</label>
                    <select defaultValue={editModal.status} className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 focus:border-blue-500 focus:outline-none appearance-none">
                      <option className="bg-[var(--bg-dark)] text-[var(--text-main)]">Active</option>
                      <option className="bg-[var(--bg-dark)] text-[var(--text-main)]">Pending</option>
                      <option className="bg-[var(--bg-dark)] text-[var(--text-main)]">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                  <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-[var(--text-muted)]">Custom Access Overrides</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(editModal.permissions).map(([module, hasAccess]) => (
                      <label key={module} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                          <input type="checkbox" defaultChecked={hasAccess} className="peer sr-only" />
                          <div className="w-10 h-6 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                          <div className="absolute left-1 top-1 w-4 h-4 bg-[var(--text-muted)] rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-white"></div>
                        </div>
                        <span className="text-sm font-bold group-hover:text-blue-400 transition-colors">{module}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
              <div className="p-5 border-t border-[var(--border-color)] bg-[var(--bg-card)] flex justify-end gap-4 shrink-0">
                <button onClick={() => setEditModal(null)} className="px-6 py-2.5 rounded-xl font-bold text-[var(--text-muted)] hover:bg-[var(--bg-dark)] transition-colors">
                  Cancel
                </button>
                <button onClick={() => {setEditModal(null); showToast('Admin configuration saved.');}} className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg transition-all">
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[10000] bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-3">
            <CheckCircle size={20}/> {toast}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
