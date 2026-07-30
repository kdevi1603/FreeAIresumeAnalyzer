import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Github, Linkedin, Twitter, ArrowRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer style={{
      position: 'relative',
      marginTop: '80px',
      background: 'var(--bg-card)',
      borderTop: '1px solid var(--border-color)',
      overflow: 'hidden'
    }}>
      {/* Subtle Gradient Line at the top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'var(--gradient-main)',
        opacity: 0.5
      }} />

      <motion.div 
        className="container" 
        style={{ padding: '36px 20px 18px' }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <div className="footer-grid">
          {/* Section 1: Brand & Description */}
          <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '8px', background: 'rgba(0, 242, 254, 0.1)', borderRadius: '10px' }}>
                <Sparkles size={24} color="var(--accent-cyan)" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AI Resume Analyzer
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              Build ATS-Friendly Resumes with AI. Analyze your resume, improve your ATS score, and download professional reports for free.
            </p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              {[
                { Icon: Github, href: '#' },
                { Icon: Linkedin, href: '#' },
                { Icon: Twitter, href: '#' }
              ].map((social, idx) => (
                <motion.a 
                  key={idx}
                  href={social.href}
                  whileHover={{ y: -3, color: 'var(--accent-cyan)' }}
                  style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}
                >
                  <social.Icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Section 2: Quick Links */}
          <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: '0 0 4px 0', fontWeight: 700 }}>Quick Links</h4>
            {[
              'Home',
              'Templates',
              'Resume Analysis',
              'Resume Builder',
              'Resume History',
              'Pricing',
              'Contact'
            ].map((link, idx) => (
              <motion.a 
                key={idx} 
                href="#" 
                whileHover={{ x: 5, color: 'var(--accent-cyan)' }}
                style={{ color: 'var(--text-muted)', fontSize: '0.95rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowRight size={14} style={{ opacity: 0.5 }} /> {link}
              </motion.a>
            ))}
          </motion.div>

          {/* Section 3: Features */}
          <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: '0 0 4px 0', fontWeight: 700 }}>Features</h4>
            {[
              'ATS Analysis',
              'AI Chat Assistant',
              'Resume Builder',
              'Cover Letter Generator',
              'Interview Questions',
              'Job Description Match',
              'Live Resume Preview',
              'PDF Download'
            ].map((feature, idx) => (
              <motion.a 
                key={idx} 
                href="#" 
                whileHover={{ x: 5, color: 'var(--accent-cyan)' }}
                style={{ color: 'var(--text-muted)', fontSize: '0.95rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowRight size={14} style={{ opacity: 0.5 }} /> {feature}
              </motion.a>
            ))}
          </motion.div>

          {/* Section 4: Resources & Contact */}
          <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: '0 0 4px 0', fontWeight: 700 }}>Resources & Contact</h4>
            {[
              'FAQ',
              'Privacy Policy',
              'Terms of Service',
              'Help Center',
              'Email Support'
            ].map((resource, idx) => (
              <motion.a 
                key={idx} 
                href="#" 
                whileHover={{ x: 5, color: 'var(--accent-cyan)' }}
                style={{ color: 'var(--text-muted)', fontSize: '0.95rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowRight size={14} style={{ opacity: 0.5 }} /> {resource}
              </motion.a>
            ))}
            <a href="mailto:support@airesume.com" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', textDecoration: 'none', fontSize: '0.95rem', marginTop: '8px', fontWeight: 600 }}>
              <Mail size={16} /> support@airesume.com
            </a>
          </motion.div>
        </div>

        {/* Divider & Copyright */}
        <motion.div variants={itemVariants} style={{
          marginTop: '32px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            © {currentYear} AI Resume Analyzer. All Rights Reserved.
          </p>
          <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '0.8rem', fontStyle: 'italic' }}>
            Built with React, Tailwind CSS, Python Flask, and Google Gemini AI.
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
}
