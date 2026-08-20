import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLogin({ onLogin, onBackToLanding }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Hardcoded simple authentication for demo purposes
    if (email === 'admin@admin.com' && password === 'admin') {
      setError('');
      onLogin();
    } else {
      setError('Invalid admin credentials. Hint: admin@admin.com / admin');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-main)',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '400px',
        width: '100%',
        padding: '40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background glow */}
        <div style={{
          position: 'absolute',
          top: '-50%', left: '-50%', right: '-50%', bottom: '-50%',
          background: 'radial-gradient(circle at center, rgba(0, 242, 254, 0.1) 0%, transparent 50%)',
          zIndex: 0, pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: '32px' }}>
          <img src="/admin-logo.jpg" alt="Admin Logo" className="admin-logo-img" style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover', margin: '0 auto 16px', boxShadow: '0 8px 20px rgba(0, 242, 254, 0.3)' }} />
          <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Admin Portal</h2>
          <p style={{ color: 'var(--text-muted)' }}>Secure access required</p>
        </div>

        <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="admin@admin.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '16px' }}>
            Login to Admin Panel <ArrowRight size={18} />
          </button>
          
          <button type="button" className="btn btn-secondary" style={{ width: '100%' }} onClick={onBackToLanding}>
            Back to Application
          </button>
        </form>
      </div>
    </div>
  );
}
