import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { User, Mail, Shield, Save, CheckCircle2 } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    // Simulate API save
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '40px 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>
          Profile Settings
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '40px' }}>
          Manage your account details and preferences.
        </p>

        <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '40px', border: '1px solid var(--border-color)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} color="var(--accent-cyan)" />
                Full Name
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-main)' }}
                placeholder="Your full name"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={18} color="var(--accent-cyan)" />
                Email Address
              </label>
              <input 
                type="email" 
                value={email}
                disabled
                className="form-input"
                style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.4)', color: 'var(--text-muted)', cursor: 'not-allowed' }}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email addresses cannot be changed currently.</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={18} color="var(--accent-cyan)" />
                Account Status
              </label>
              <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <CheckCircle2 size={18} />
                <span style={{ fontWeight: 600 }}>Active - Pro Tier</span>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ padding: '12px 32px', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Save size={18} />
                Save Changes
              </button>
              
              {saved && (
                <span className="animate-fade-in" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={16} /> Saved successfully!
                </span>
              )}
            </div>

          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
