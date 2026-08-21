import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, ChevronLeft, ChevronDown, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminHeader({ title, subtitle, isLightMode, setIsLightMode, onBackToLanding, onLogout, role, name }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayRole = role === 'super_admin' ? 'Super Admin' : 'Admin';
  const displayInitials = (name || displayRole).substring(0, 2).toUpperCase();
  const displayName = name || displayRole;

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border-color)] shadow-sm backdrop-blur-md relative z-50">
      <div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">{title}</h1>
        <p className="text-sm text-[var(--text-muted)]">{subtitle}</p>
      </div>
      
      <div className="flex items-center gap-6 w-full md:w-auto">
        <button 
          onClick={() => setIsLightMode(!isLightMode)}
          className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-blue-500 transition-colors"
          title={isLightMode ? 'Dark Mode' : 'Light Mode'}
        >
          {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        
        <button 
          onClick={onBackToLanding}
          className="flex items-center gap-2 p-2 px-4 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-blue-500 transition-colors text-sm font-medium"
        >
          <ChevronLeft size={16} />
          <span className="hidden md:inline">Back to Site</span>
        </button>

        <div className="relative border-l border-[var(--border-color)] pl-4" ref={dropdownRef}>
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
              {displayInitials}
            </div>
            <span className="text-sm font-medium hidden sm:block">{displayName}</span>
            <ChevronDown size={16} className={`text-[var(--text-muted)] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xl overflow-hidden py-1 z-50"
              >
                <div className="px-4 py-3 border-b border-[var(--border-color)]">
                  <p className="text-sm text-[var(--text-main)] font-semibold">{displayName}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{displayRole}</p>
                </div>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
