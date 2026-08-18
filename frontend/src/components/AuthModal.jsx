import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { X, Lock, Mail, User as UserIcon, AlertCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, error: authError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!email || !password || (!isLogin && !name)) {
      setLocalError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onClose();
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }} className="animate-fade-in">
      
      {/* Main Wide Container */}
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        height: '600px',
        position: 'relative',
        borderRadius: '24px',
        display: 'flex',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        // Background image representing AI/Professional workspace
        backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px', right: '20px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '50%',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: '8px',
            zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
        >
          <X size={20} />
        </button>

        {/* Left Side: Branding & Copy */}
        <div style={{
          flex: 1,
          padding: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: '#fff',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          background: 'linear-gradient(to right, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0.2) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
             <img src="/admin-logo.jpg" alt="Logo" style={{ width: '48px', height: '48px', borderRadius: '12px' }} />
             <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '1px', color: '#fff' }}>AI RESUME STUDIO</h3>
          </div>
          
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px', color: '#fff' }}>
            ELEVATE YOUR<br/>CAREER
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, lineHeight: 1.6, maxWidth: '400px', color: '#fff' }}>
            Where your dream job becomes a reality.<br/><br/>
            Build an ATS-friendly, professional resume in seconds using Advanced AI.
          </p>
        </div>

        {/* Right Side: Glassmorphic Form */}
        <div style={{
          width: '450px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px'
        }}>
          <div style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(16px)',
            borderRadius: '24px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)'
          }}>
            
            {(localError || authError) && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                color: '#fff',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px'
              }}>
                <AlertCircle size={18} />
                <span>{localError || authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <UserIcon size={18} style={{ position: 'absolute', left: 14, top: 12, color: '#9ca3af' }} />
                    <input
                      type="text"
                      style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: '8px', border: 'none', background: '#fff', color: '#111', fontSize: '1rem', outline: 'none' }}
                      placeholder="Alex Rivera"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: 14, top: 12, color: '#9ca3af' }} />
                  <input
                    type="email"
                    style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: '8px', border: 'none', background: '#fff', color: '#111', fontSize: '1rem', outline: 'none' }}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: 14, top: 12, color: '#9ca3af' }} />
                  <input
                    type="password"
                    style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: '8px', border: 'none', background: '#fff', color: '#111', fontSize: '1rem', outline: 'none' }}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {isLogin && (
                  <div style={{ textAlign: 'right', marginTop: '8px' }}>
                    <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#fff', fontSize: '0.85rem', textDecoration: 'underline', opacity: 0.8 }}>Forgot password?</a>
                  </div>
                )}
              </div>

              <button
                type="submit"
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', marginBottom: '24px' }}
                disabled={loading}
              >
                {loading ? 'Processing...' : (isLogin ? 'SIGN IN' : 'CREATE ACCOUNT')}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
               <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.3)' }}></div>
               <span style={{ color: '#fff', fontSize: '0.85rem' }}>or</span>
               <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.3)' }}></div>
            </div>

            <button
               onClick={() => alert('Google Sign-In is coming soon!')}
               style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px', transition: 'background 0.2s' }}
               onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
               onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
               <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
               </svg>
               Sign in with Google
            </button>

            <div style={{ textAlign: 'center' }}>
               {isLogin ? (
                 <p style={{ color: '#fff', fontSize: '0.9rem' }}>
                   Are you new? <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(false); setLocalError(''); }} style={{ textDecoration: 'underline', fontWeight: 600, color: '#fff' }}>Create an Account</a>
                 </p>
               ) : (
                 <p style={{ color: '#fff', fontSize: '0.9rem' }}>
                   Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(true); setLocalError(''); }} style={{ textDecoration: 'underline', fontWeight: 600, color: '#fff' }}>Sign in</a>
                 </p>
               )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
