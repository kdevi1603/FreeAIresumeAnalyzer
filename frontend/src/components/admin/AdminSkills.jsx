import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, CheckCircle, XCircle, Filter, Eye, X, Activity } from 'lucide-react';

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [certs, setCerts] = useState([]);
  const [langs, setLangs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('skills'); // 'skills', 'certifications', 'languages'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [formData, setFormData] = useState({ id: null, name: '', category: 'Technical Skill', isEnabled: true });

  const getHeaders = () => ({ 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resSkills, resCerts, resLangs] = await Promise.all([
        fetch('http://localhost:5000/api/admin/skills', { headers: getHeaders() }).then(res => res.json()),
        fetch('http://localhost:5000/api/admin/certifications', { headers: getHeaders() }).then(res => res.json()),
        fetch('http://localhost:5000/api/admin/languages', { headers: getHeaders() }).then(res => res.json())
      ]);
      setSkills(Array.isArray(resSkills) ? resSkills : []);
      setCerts(Array.isArray(resCerts) ? resCerts : []);
      setLangs(Array.isArray(resLangs) ? resLangs : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getEndpoint = () => {
    if (activeTab === 'skills') return 'http://localhost:5000/api/admin/skills';
    if (activeTab === 'certifications') return 'http://localhost:5000/api/admin/certifications';
    return 'http://localhost:5000/api/admin/languages';
  };

  const getActiveData = () => {
    if (activeTab === 'skills') return skills;
    if (activeTab === 'certifications') return certs;
    return langs;
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return alert('Name is required');

    const activeData = getActiveData();
    if (modalMode === 'add') {
      const exists = activeData.some(item => item.name.toLowerCase() === formData.name.trim().toLowerCase());
      if (exists) return alert(`This ${activeTab.slice(0, -1)} already exists!`);
    }

    const endpoint = getEndpoint();
    const url = modalMode === 'edit' ? `${endpoint}/${formData.id}` : endpoint;
    const method = modalMode === 'edit' ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert('Error saving data');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const response = await fetch(`${getEndpoint()}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (response.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (item) => {
    try {
      const response = await fetch(`${getEndpoint()}/${item.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ ...item, isEnabled: !item.isEnabled })
      });
      if (response.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (mode, item = null) => {
    setModalMode(mode);
    if (item) {
      setFormData({ id: item.id, name: item.name, category: item.category || 'N/A', isEnabled: item.isEnabled !== false });
    } else {
      setFormData({ id: null, name: '', category: activeTab === 'skills' ? 'Technical Skill' : 'Standard', isEnabled: true });
    }
    setIsModalOpen(true);
  };

  const activeData = getActiveData().filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getRecentlyAddedCount = () => {
    const now = new Date();
    const isRecent = (dateStr) => (now - new Date(dateStr)) < 24 * 60 * 60 * 1000;
    return skills.filter(s => isRecent(s.createdAt)).length + 
           certs.filter(c => isRecent(c.createdAt)).length + 
           langs.filter(l => isRecent(l.createdAt)).length;
  };

  return (
    <div style={{ color: 'var(--text-main)', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Skills & Qualifications Master</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage the unified database of skills, certifications, and languages.</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Skills</span>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>{skills.length}</span>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Certifications</span>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10B981' }}>{certs.length}</span>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Languages</span>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8B5CF6' }}>{langs.length}</span>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Recently Added (24h)</span>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F59E0B' }}>{getRecentlyAddedCount()}</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-main)', padding: '4px', borderRadius: '8px' }}>
          {['skills', 'certifications', 'languages'].map(tab => (
            <button 
              key={tab}
              onClick={() => { setActiveTab(tab); setFilterCategory('All'); }}
              style={{ 
                padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textTransform: 'capitalize',
                background: activeTab === tab ? 'var(--accent-cyan)' : 'transparent',
                color: activeTab === tab ? '#fff' : 'var(--text-muted)',
                fontWeight: activeTab === tab ? '600' : 'normal'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, display: 'flex', gap: '12px', minWidth: '300px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
            />
          </div>
          
          {activeTab === 'skills' && (
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
            >
              <option value="All">All Categories</option>
              <option value="Technical Skill">Technical Skills</option>
              <option value="Soft Skill">Soft Skills</option>
              <option value="Programming Language">Programming Languages</option>
              <option value="Cloud Technology">Cloud Technologies</option>
              <option value="Database">Database</option>
              <option value="Framework/Library">Framework / Library</option>
            </select>
          )}
        </div>

        <button onClick={() => openModal('add')} className="btn btn-primary" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add New
        </button>
      </div>

      {/* Data Table */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
                <th style={{ padding: '16px' }}>Name</th>
                <th style={{ padding: '16px' }}>Category</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px' }}>Created At</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeData.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px', fontWeight: '500' }}>{item.name}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'var(--bg-main)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {item.category || 'Standard'}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    {item.isEnabled !== false ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '0.9rem' }}>
                        <CheckCircle size={16} /> Active
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#EF4444', fontSize: '0.9rem' }}>
                        <XCircle size={16} /> Disabled
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button onClick={() => openModal('view', item)} className="btn btn-secondary" style={{ padding: '6px', title: 'View' }}>
                        <Eye size={16} />
                      </button>
                      <button onClick={() => openModal('edit', item)} className="btn btn-secondary" style={{ padding: '6px', title: 'Edit' }}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => toggleStatus(item)} className="btn btn-secondary" style={{ padding: '6px', title: item.isEnabled !== false ? 'Disable' : 'Enable' }}>
                        <Activity size={16} color={item.isEnabled !== false ? '#F59E0B' : '#10B981'} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="btn btn-secondary" style={{ padding: '6px', color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {activeData.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No {activeTab} found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit / View Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg-card)', width: '90%', maxWidth: '500px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.2rem', margin: 0, textTransform: 'capitalize' }}>
                {modalMode} {activeTab.slice(0, -1)}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={modalMode === 'view'}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                />
              </div>

              {activeTab === 'skills' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    disabled={modalMode === 'view'}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                  >
                    <option value="Technical Skill">Technical Skill</option>
                    <option value="Soft Skill">Soft Skill</option>
                    <option value="Programming Language">Programming Language</option>
                    <option value="Cloud Technology">Cloud Technology</option>
                    <option value="Database">Database</option>
                    <option value="Framework/Library">Framework / Library</option>
                  </select>
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Status</label>
                <select 
                  value={formData.isEnabled}
                  onChange={(e) => setFormData({ ...formData, isEnabled: e.target.value === 'true' })}
                  disabled={modalMode === 'view'}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                >
                  <option value="true">Active (Enabled)</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                {modalMode === 'view' ? 'Close' : 'Cancel'}
              </button>
              {modalMode !== 'view' && (
                <button onClick={handleSave} className="btn btn-primary">
                  Save {activeTab.slice(0, -1)}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
