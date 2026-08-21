import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, RefreshCw, Download, FileText, Star, 
  MessageSquare, Inbox, CheckCircle, Mail, Trash2, Eye, 
  CornerDownRight, X, AlertTriangle, Send, ChevronLeft, ChevronRight, Check
} from 'lucide-react';

export default function AdminSupport() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [viewModal, setViewModal] = useState(null);
  const [replyModal, setReplyModal] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/messages', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load messages', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleUpdateStatus = async (id, updates) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updatedMsg = await res.json();
        setMessages(prev => prev.map(m => m.id === id ? updatedMsg : m));
        if (updates.status) showToast(`Marked as ${updates.status}`);
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setIsReplying(true);
    try {
      const res = await fetch(`/api/admin/messages/${replyModal.id}/reply`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ replyText, subject: `Re: ${replyModal.subject || 'Support Request'}` })
      });
      if (res.ok) {
        const { updatedMessage } = await res.json();
        setMessages(prev => prev.map(m => m.id === updatedMessage.id ? updatedMessage : m));
        showToast('Reply sent successfully!');
        setReplyModal(null);
        setReplyText('');
      } else {
        showToast('Failed to send reply', 'error');
      }
    } catch (err) {
      showToast('Failed to send reply', 'error');
    }
    setIsReplying(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== id));
        showToast('Message deleted');
      }
    } catch (err) {
      showToast('Failed to delete message', 'error');
    }
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} messages?`)) return;
    for (const id of selectedIds) {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
    }
    setMessages(prev => prev.filter(m => !selectedIds.includes(m.id)));
    setSelectedIds([]);
    showToast(`${selectedIds.length} messages deleted`);
  };

  const exportCSV = () => {
    if (filtered.length === 0) return showToast('No data to export', 'error');
    const headers = ['Name', 'Email', 'Subject', 'Message', 'Status', 'Date'];
    const rows = filtered.map(m => [
      `"${m.name || ''}"`,
      `"${m.email || ''}"`,
      `"${m.subject || ''}"`,
      `"${(m.message || '').replace(/"/g, '""')}"`,
      `"${m.status || 'Unread'}"`,
      `"${new Date(m.createdAt).toLocaleString()}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + "\\n" + rows.map(e => e.join(',')).join("\\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `support_tickets_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Exported Successfully!');
  };

  // Filter & Search
  const filtered = useMemo(() => {
    return messages.filter(m => {
      const matchSearch = 
        (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (m.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (m.subject || m.message || '').toLowerCase().includes(search.toLowerCase());
        
      if (!matchSearch) return false;
      
      if (statusFilter === 'Starred') return m.isStarred;
      if (statusFilter !== 'All' && (m.status || 'Unread') !== statusFilter) return false;
      
      return true;
    });
  }, [messages, search, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = {
    total: messages.length,
    unread: messages.filter(m => (m.status || 'Unread') === 'Unread').length,
    replied: messages.filter(m => m.status === 'Replied').length,
    today: messages.filter(m => new Date(m.createdAt).toDateString() === new Date().toDateString()).length
  };

  return (
    <div className="w-full pb-32 text-[var(--text-main)] font-sans relative">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 py-4 border-b border-[var(--border-color)]">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">Support & Feedback</h1>
          <p className="text-[var(--text-muted)] mt-1 font-medium">Manage user inquiries, tickets, and feedback.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchMessages} className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-dark)] px-4 py-2 rounded-xl transition-all font-medium">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Messages', value: stats.total, icon: Inbox, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Unread', value: stats.unread, icon: Mail, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { title: 'Replied', value: stats.replied, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { title: "Today's Messages", value: stats.today, icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-500/10' },
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
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-t-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-1 w-full gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              type="text" placeholder="Search name, email, or subject..." 
              value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div className="flex items-center gap-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl px-3 py-2">
            <Filter size={18} className="text-[var(--text-muted)]" />
            <select 
              value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent border-none focus:outline-none text-sm font-medium w-24 text-[var(--text-main)]">
              <option value="All">All Status</option>
              <option value="Unread">Unread</option>
              <option value="Read">Read</option>
              <option value="Replied">Replied</option>
              <option value="Starred">Starred</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {selectedIds.length > 0 && (
            <button onClick={handleDeleteSelected} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all font-medium text-sm">
              <Trash2 size={16} /> Delete ({selectedIds.length})
            </button>
          )}
          <button onClick={exportCSV} className="flex items-center gap-2 bg-[var(--bg-dark)] border border-[var(--border-color)] hover:bg-[var(--bg-card)] px-4 py-2 rounded-xl transition-all font-medium text-sm">
            <Download size={16} /> CSV
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[var(--bg-card)] border-x border-[var(--border-color)] overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--bg-dark)] text-[var(--text-muted)] uppercase text-xs">
            <tr>
              <th className="py-4 px-4 font-semibold w-12">
                <input type="checkbox" 
                  checked={selectedIds.length === paginated.length && paginated.length > 0}
                  onChange={(e) => setSelectedIds(e.target.checked ? paginated.map(m => m.id) : [])}
                  className="rounded border-[var(--border-color)] text-blue-500 focus:ring-blue-500"
                />
              </th>
              <th className="py-4 px-4 font-semibold">User</th>
              <th className="py-4 px-4 font-semibold w-1/3">Message</th>
              <th className="py-4 px-4 font-semibold">Status</th>
              <th className="py-4 px-4 font-semibold">Date</th>
              <th className="py-4 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {loading ? (
              <tr><td colSpan="6" className="text-center py-12 text-[var(--text-muted)]">Loading messages...</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-12 text-[var(--text-muted)]">No messages found.</td></tr>
            ) : (
              paginated.map((msg) => {
                const status = msg.status || 'Unread';
                return (
                  <tr key={msg.id} className={`hover:bg-[var(--bg-dark)] transition-colors ${status === 'Unread' ? 'bg-blue-500/5' : ''}`}>
                    <td className="py-4 px-4">
                      <input type="checkbox" 
                        checked={selectedIds.includes(msg.id)}
                        onChange={(e) => setSelectedIds(prev => e.target.checked ? [...prev, msg.id] : prev.filter(id => id !== msg.id))}
                        className="rounded border-[var(--border-color)] text-blue-500 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                          {msg.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold truncate text-[var(--text-main)]">{msg.name || 'Anonymous'}</p>
                          <p className="text-xs text-[var(--text-muted)] truncate">{msg.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="min-w-0 max-w-[300px]">
                        <p className="font-semibold text-[var(--text-main)] truncate">{msg.subject || 'Support Request'}</p>
                        <p className="text-[var(--text-muted)] truncate mt-0.5">{msg.message}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {status === 'Unread' && <span className="px-2.5 py-1 bg-amber-500/10 text-amber-600 rounded-lg text-xs font-bold border border-amber-500/20">Unread</span>}
                        {status === 'Read' && <span className="px-2.5 py-1 bg-gray-500/10 text-gray-400 rounded-lg text-xs font-bold border border-gray-500/20">Read</span>}
                        {status === 'Replied' && <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-xs font-bold border border-emerald-500/20">Replied</span>}
                        
                        <button onClick={() => handleUpdateStatus(msg.id, { isStarred: !msg.isStarred })} className="text-[var(--text-muted)] hover:text-yellow-500 transition-colors ml-2">
                          <Star size={16} className={msg.isStarred ? 'fill-yellow-500 text-yellow-500' : ''} />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[var(--text-muted)] font-medium">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setViewModal(msg); if(status==='Unread') handleUpdateStatus(msg.id, { status: 'Read' }); }} className="p-2 bg-[var(--bg-dark)] hover:bg-blue-500/10 text-[var(--text-muted)] hover:text-blue-500 rounded-lg transition-colors" title="View">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => setReplyModal(msg)} className="p-2 bg-[var(--bg-dark)] hover:bg-emerald-500/10 text-[var(--text-muted)] hover:text-emerald-500 rounded-lg transition-colors" title="Reply">
                          <CornerDownRight size={16} />
                        </button>
                        <button onClick={() => handleDelete(msg.id)} className="p-2 bg-[var(--bg-dark)] hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 rounded-lg transition-colors" title="Delete">
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

      {/* FOOTER / PAGINATION */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-b-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
          <select value={itemsPerPage} onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-lg px-2 py-1 outline-none text-[var(--text-main)]">
            {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n} rows</option>)}
          </select>
          <span>Showing {paginated.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-card)] disabled:opacity-50 text-[var(--text-muted)] hover:text-[var(--text-main)]">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium px-2 text-[var(--text-muted)]">Page {currentPage} of {totalPages || 1}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="p-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-card)] disabled:opacity-50 text-[var(--text-muted)] hover:text-[var(--text-main)]">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* VIEW MODAL */}
      <AnimatePresence>
        {viewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-[var(--bg-dark)] w-full max-w-2xl rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col max-h-[90vh]">
              
              <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)] bg-[var(--bg-card)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                    {viewModal.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{viewModal.name || 'Anonymous'}</h2>
                    <p className="text-[var(--text-muted)] text-sm">{viewModal.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleUpdateStatus(viewModal.id, { isStarred: !viewModal.isStarred })} className="p-2 hover:bg-[var(--bg-dark)] rounded-xl transition-colors">
                    <Star size={20} className={viewModal.isStarred ? 'fill-yellow-500 text-yellow-500' : 'text-[var(--text-muted)]'} />
                  </button>
                  <button onClick={() => setViewModal(null)} className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-dark)] rounded-xl transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Subject</h3>
                  <p className="font-semibold text-lg">{viewModal.subject || 'Support Request'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Message</h3>
                  <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] whitespace-pre-wrap leading-relaxed">
                    {viewModal.message}
                  </div>
                </div>
                
                {viewModal.replies && viewModal.replies.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">Reply History</h3>
                    <div className="space-y-4">
                      {viewModal.replies.map((reply, i) => (
                        <div key={i} className="bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/20">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-indigo-500 text-sm">Admin Team</span>
                            <span className="text-xs text-[var(--text-muted)]">{new Date(reply.date).toLocaleString()}</span>
                          </div>
                          <p className="whitespace-pre-wrap text-sm">{reply.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card)] flex justify-end gap-3">
                <button onClick={() => handleUpdateStatus(viewModal.id, { status: 'Unread' })} className="px-5 py-2.5 rounded-xl font-bold text-sm bg-[var(--bg-dark)] border border-[var(--border-color)] hover:bg-[var(--bg-card)] transition-colors">
                  Mark Unread
                </button>
                <button onClick={() => { setReplyModal(viewModal); setViewModal(null); }} className="px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                  <CornerDownRight size={16} /> Reply
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REPLY MODAL */}
      <AnimatePresence>
        {replyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-[var(--bg-dark)] w-full max-w-2xl rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden">
              
              <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)] bg-[var(--bg-card)]">
                <h2 className="text-xl font-bold flex items-center gap-2"><CornerDownRight size={20} className="text-indigo-500" /> Reply to Message</h2>
                <button onClick={() => setReplyModal(null)} className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-dark)] rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleReply}>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-muted)] mb-1">To:</label>
                    <input type="text" readOnly value={`${replyModal.name || 'Anonymous'} <${replyModal.email}>`} className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 outline-none opacity-70 text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-muted)] mb-1">Subject:</label>
                    <input type="text" readOnly value={`Re: ${replyModal.subject || 'Support Request'}`} className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 outline-none opacity-70 text-[var(--text-main)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-muted)] mb-1">Message:</label>
                    <textarea 
                      value={replyText} onChange={e => setReplyText(e.target.value)} required
                      placeholder="Type your reply here... (Will be sent via email)"
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[150px] resize-y text-[var(--text-main)]"
                    ></textarea>
                  </div>
                </div>
                
                <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card)] flex justify-end gap-3">
                  <button type="button" onClick={() => setReplyModal(null)} className="px-5 py-2.5 rounded-xl font-bold text-sm bg-[var(--bg-dark)] border border-[var(--border-color)] hover:bg-[var(--bg-card)] transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isReplying || !replyText.trim()} className="px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50">
                    {isReplying ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />} 
                    {isReplying ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl rounded-2xl p-4 flex items-center gap-3">
            {toast.type === 'error' ? <AlertTriangle className="text-red-500" size={24} /> : <CheckCircle className="text-emerald-500" size={24} />}
            <p className="font-bold">{toast.msg}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
