import React, { useState } from 'react';
import { User, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AccountSettingsBoard() {
  const { user } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [createdAt, setCreatedAt] = useState(user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString());
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };
  
  return (
    <div style={{ padding: '0 20px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 8px 0' }}>Account Settings</h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: 0 }}>
          Manage your account preferences and settings
        </p>
      </div>

      {/* Profile Information Card */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
        {/* Card Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <User size={20} color="var(--text-main)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>Profile Information</h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
            Update your personal information and contact details
          </p>
        </div>

        {/* Form Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          
          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                width: '100%', padding: '12px 16px',
                backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)',
                borderRadius: '8px', fontSize: '0.95rem', color: 'var(--text-main)',
                outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Full Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              style={{
                width: '100%', padding: '12px 16px',
                backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)',
                borderRadius: '8px', fontSize: '0.95rem', color: 'var(--text-main)',
                outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Phone */}
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Phone</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              style={{
                width: '100%', padding: '12px 16px',
                backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)',
                borderRadius: '8px', fontSize: '0.95rem', color: 'var(--text-main)',
                outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Account Created */}
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Account Created</label>
            <input 
              type="text" 
              value={createdAt}
              onChange={(e) => setCreatedAt(e.target.value)}
              placeholder="Account created date"
              style={{
                width: '100%', padding: '12px 16px',
                backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)',
                borderRadius: '8px', fontSize: '0.95rem', color: 'var(--text-main)',
                outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={handleSave} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', backgroundColor: 'var(--accent-blue)', color: '#fff',
            border: 'none', borderRadius: '8px',
            fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
            transition: 'background 0.2s'
          }}>
            <Save size={18} />
            Save Profile
          </button>
          
          {isSaved && (
            <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontWeight: 600, fontSize: '0.95rem' }}>
              <CheckCircle size={18} />
              <span>Saved successfully!</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
