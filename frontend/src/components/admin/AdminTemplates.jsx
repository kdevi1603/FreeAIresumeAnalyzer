import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

export default function AdminTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
    isPremium: false
  });

  const fetchTemplates = () => {
    fetch('http://localhost:5000/api/admin/templates', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setTemplates(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const openAddModal = () => {
    setEditingTemplate(null);
    setFormData({ name: '', description: '', tags: '', isPremium: false });
    setIsModalOpen(true);
  };

  const openEditModal = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name || '',
      description: template.description || '',
      tags: template.tags ? template.tags.join(', ') : '',
      isPremium: template.isPremium || false
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    const method = editingTemplate ? 'PUT' : 'POST';
    const url = editingTemplate 
      ? `http://localhost:5000/api/admin/templates/${editingTemplate.id}`
      : `http://localhost:5000/api/admin/templates`;

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(() => {
        closeModal();
        fetchTemplates();
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    fetch(`http://localhost:5000/api/admin/templates/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(() => fetchTemplates());
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-main)',
    color: 'var(--text-main)',
    marginBottom: '16px',
    marginTop: '6px'
  };

  return (
    <div style={{ color: 'var(--text-main)', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Resume Templates</h1>
        <button onClick={openAddModal} className="btn" style={{ background: 'var(--gradient-main)', color: '#000', fontWeight: 'bold' }}>
          <Plus size={18} />
          Add Template
        </button>
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
        {loading ? <p>Loading templates...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px' }}>Name</th>
                <th style={{ padding: '12px' }}>Description</th>
                <th style={{ padding: '12px' }}>Tags</th>
                <th style={{ padding: '12px' }}>Access</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)', verticalAlign: 'top' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{t.name}</td>
                  <td style={{ padding: '12px' }}>{t.description}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {(t.tags || []).map(tag => (
                        <span key={tag} className="badge badge-cyan" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ color: t.isPremium ? '#8B5CF6' : '#10B981', fontWeight: 'bold' }}>
                      {t.isPremium ? 'Premium' : 'Free'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                    <button onClick={() => openEditModal(t)} className="btn btn-secondary" style={{ padding: '6px' }}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(t.id)} className="btn btn-secondary" style={{ padding: '6px', color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {templates.length === 0 && (
                <tr><td colSpan="5" style={{ padding: '12px', textAlign: 'center' }}>No templates found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'var(--bg-card)', padding: '32px', borderRadius: '16px',
            width: '100%', maxWidth: '500px', border: '1px solid var(--border-color)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{editingTemplate ? 'Edit Template' : 'Add New Template'}</h2>
              <button onClick={closeModal} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <label style={{ display: 'block' }}>
              Template Name
              <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} placeholder="e.g. Modern Professional" />
            </label>

            <label style={{ display: 'block' }}>
              Description
              <textarea name="description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Best for IT, Software..." />
            </label>

            <label style={{ display: 'block' }}>
              Tags (comma separated)
              <input type="text" name="tags" value={formData.tags} onChange={handleChange} style={inputStyle} placeholder="ATS Friendly, Minimal..." />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', cursor: 'pointer' }}>
              <input type="checkbox" name="isPremium" checked={formData.isPremium} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
              Premium Template
            </label>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={closeModal} className="btn btn-secondary">Cancel</button>
              <button onClick={handleSave} className="btn" style={{ background: 'var(--gradient-main)', color: '#000', fontWeight: 'bold' }}>
                <Save size={18} /> {editingTemplate ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
