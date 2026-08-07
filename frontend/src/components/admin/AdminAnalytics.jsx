import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  Users, UserPlus, UserCheck, FileText, Cpu, MessageSquare, Download,
  CheckCircle, Globe, Activity, ShieldCheck, Database, Server, Mail,
  Calendar, Printer, AlertTriangle, TrendingUp, Sparkles, Target, Zap
} from 'lucide-react';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

const KpiCard = ({ title, value, growth, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm hover:border-blue-500/30 transition-all group relative overflow-hidden"
  >
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-${color}-500 group-hover:scale-150 transition-transform duration-500`}></div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500`}>
        <Icon size={24} />
      </div>
      <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 bg-${growth.startsWith('+') ? 'green' : 'red'}-500/10 text-${growth.startsWith('+') ? 'green' : 'red'}-500`}>
        {growth.startsWith('+') ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
        {growth}
      </div>
    </div>
    <div className="relative z-10">
      <h3 className="text-[var(--text-muted)] text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-extrabold text-[var(--text-main)] tracking-tight">{value}</p>
    </div>
  </motion.div>
);

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('Last 30 Days');

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const simulateExport = (type) => {
    alert(`Generating ${type} report for ${dateRange}...`);
  };

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="text-[var(--text-muted)] font-medium">Loading massive analytics...</p>
      </div>
    );
  }

  // --- Mocked Deep Analytics Data ---
  const atsDistribution = [
    { name: '90-100 (Excellent)', value: 400 },
    { name: '70-89 (Good)', value: 850 },
    { name: '50-69 (Average)', value: 320 },
    { name: 'Below 50 (Poor)', value: 120 }
  ];

  const resumeCategories = [
    { name: 'Software Engineer', value: 850 },
    { name: 'Data Scientist', value: 420 },
    { name: 'Product Manager', value: 310 },
    { name: 'Designer', value: 240 },
    { name: 'Marketing', value: 180 }
  ];

  return (
    <div className="w-full pb-32 text-[var(--text-main)] font-sans relative">
      
      {/* HEADER & FILTERS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 py-4 border-b border-[var(--border-color)]">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Analytics Dashboard</h1>
          <p className="text-[var(--text-muted)] mt-1 font-medium">Enterprise data warehouse and AI metrics.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-2">
            <Calendar size={18} className="text-[var(--text-muted)]" />
            <select 
              value={dateRange} 
              onChange={e => setDateRange(e.target.value)}
              className="bg-transparent border-none text-sm font-semibold outline-none text-[var(--text-main)] cursor-pointer"
            >
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={() => simulateExport('PDF')} className="p-2 border border-[var(--border-color)] rounded-xl hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-colors text-sm font-medium flex items-center gap-2"><FileText size={16} /> PDF</button>
            <button onClick={() => simulateExport('CSV')} className="p-2 border border-[var(--border-color)] rounded-xl hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30 transition-colors text-sm font-medium flex items-center gap-2"><Download size={16} /> CSV</button>
            <button onClick={() => simulateExport('Print')} className="p-2 border border-[var(--border-color)] rounded-xl hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/30 transition-colors text-sm font-medium flex items-center gap-2"><Printer size={16} /> Print</button>
          </div>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-10">
        <KpiCard title="Total Users" value={data.stats.totalUsers.toLocaleString()} growth="+12.5%" icon={Users} color="blue" delay={0.1} />
        <KpiCard title="Active Users Today" value={data.stats.todaysUsers.toLocaleString()} growth="+5.2%" icon={UserCheck} color="green" delay={0.15} />
        <KpiCard title="Total Resumes" value={data.stats.totalResumes.toLocaleString()} growth="+18.1%" icon={FileText} color="purple" delay={0.2} />
        <KpiCard title="AI Analyses" value={data.stats.totalAiAnalyses.toLocaleString()} growth="+42.3%" icon={Cpu} color="amber" delay={0.25} />
        <KpiCard title="Total PDF Downloads" value={data.stats.downloadedResumes.toLocaleString()} growth="+22.8%" icon={Download} color="pink" delay={0.3} />
        <KpiCard title="Average ATS Score" value={data.stats.averageAtsScore} growth="+3.1%" icon={Target} color="emerald" delay={0.35} />
        <KpiCard title="API Requests" value="124.5K" growth="+112%" icon={Zap} color="blue" delay={0.4} />
        <KpiCard title="Monthly Revenue" value="$4,250" growth="+15.8%" icon={TrendingUp} color="green" delay={0.45} />
        <KpiCard title="New Users (Month)" value="842" growth="+8.4%" icon={UserPlus} color="indigo" delay={0.5} />
        <KpiCard title="AI Chat Requests" value="18.2K" growth="+56.2%" icon={MessageSquare} color="violet" delay={0.55} />
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        
        {/* User Growth */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-blue-500" /> User Growth & Retention</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.charts.userRegistrationTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '12px' }} />
                <Legend />
                <Line type="monotone" dataKey="users" name="New Users" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Usage Trend */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Sparkles size={20} className="text-purple-500" /> AI Engine Usage</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.charts.aiUsageStats}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="usage" name="API Calls" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ATS Score Distribution */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Target size={20} className="text-emerald-500" /> ATS Score Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={atsDistribution} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                  {atsDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '12px' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resume Categories */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><FileText size={20} className="text-pink-500" /> Resume Categories</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resumeCategories} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '12px' }} cursor={{ fill: 'var(--bg-main)' }} />
                <Bar dataKey="value" name="Resumes" fill="#EC4899" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* DEEP ANALYTICS GRIDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
        {/* AI Analytics */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-5 flex items-center gap-2"><Cpu size={18} className="text-purple-500" /> AI Analytics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <span className="text-sm text-[var(--text-muted)]">Gemini API Usage</span>
              <span className="font-bold">68%</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <span className="text-sm text-[var(--text-muted)]">OpenAI Usage</span>
              <span className="font-bold">32%</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <span className="text-sm text-[var(--text-muted)]">Avg Response Time</span>
              <span className="font-bold">1.2s</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <span className="text-sm text-[var(--text-muted)]">Total Tokens Used</span>
              <span className="font-bold text-blue-500">14.2M</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--text-muted)]">Est. AI Cost</span>
              <span className="font-bold text-red-500">$42.50</span>
            </div>
          </div>
        </div>

        {/* ATS Analytics */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-5 flex items-center gap-2"><Target size={18} className="text-emerald-500" /> ATS Analytics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <span className="text-sm text-[var(--text-muted)]">Highest ATS Score</span>
              <span className="font-bold text-green-500">98%</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <span className="text-sm text-[var(--text-muted)]">Lowest ATS Score</span>
              <span className="font-bold text-red-500">32%</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <span className="text-sm text-[var(--text-muted)]">Avg Grammar Score</span>
              <span className="font-bold">88%</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <span className="text-sm text-[var(--text-muted)]">Top Missing Skill</span>
              <span className="font-bold text-blue-500">React.js</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--text-muted)]">Avg Formatting Score</span>
              <span className="font-bold">92%</span>
            </div>
          </div>
        </div>

        {/* Resume Analytics */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-5 flex items-center gap-2"><FileText size={18} className="text-blue-500" /> Resume Analytics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <span className="text-sm text-[var(--text-muted)]">Most Selected Template</span>
              <span className="font-bold">Modern Professional</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <span className="text-sm text-[var(--text-muted)]">Most Popular Theme</span>
              <span className="font-bold">Midnight Blue</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <span className="text-sm text-[var(--text-muted)]">Avg Resume Length</span>
              <span className="font-bold">1.4 Pages</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <span className="text-sm text-[var(--text-muted)]">Avg File Size (PDF)</span>
              <span className="font-bold">245 KB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--text-muted)]">Total Uploads</span>
              <span className="font-bold text-blue-500">{data.stats.totalResumes}</span>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* AI Insights & System Health */}
        <div className="flex flex-col gap-8">
          
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border border-blue-500/50 rounded-2xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20"><Sparkles size={64} /></div>
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2 relative z-10"><Sparkles size={20} /> AI Auto-Insights</h3>
            <ul className="space-y-4 relative z-10">
              <li className="flex gap-3 text-sm font-medium bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                <TrendingUp size={18} className="shrink-0 text-green-300 mt-0.5" />
                Resume uploads increased by 18% this month.
              </li>
              <li className="flex gap-3 text-sm font-medium bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                <FileText size={18} className="shrink-0 text-blue-300 mt-0.5" />
                "Modern Professional" is currently the most selected template.
              </li>
              <li className="flex gap-3 text-sm font-medium bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                <AlertTriangle size={18} className="shrink-0 text-amber-300 mt-0.5" />
                "JavaScript" is the most common missing ATS skill.
              </li>
            </ul>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2"><Activity size={20} className="text-emerald-500" /> System Health</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-sm font-medium"><Server size={16} className="text-[var(--text-muted)]" /> Backend Status</span>
                <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs font-bold border border-green-500/20">Operational</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-sm font-medium"><Database size={16} className="text-[var(--text-muted)]" /> Database</span>
                <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs font-bold border border-green-500/20">Operational</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-sm font-medium"><Cpu size={16} className="text-[var(--text-muted)]" /> Gemini API</span>
                <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs font-bold border border-green-500/20">Active</span>
              </div>
              
              <div className="pt-3 border-t border-[var(--border-color)]">
                <div className="flex justify-between text-xs mb-1 font-medium"><span className="text-[var(--text-muted)]">CPU Usage</span><span>{data.performance.cpu}%</span></div>
                <div className="w-full bg-[var(--border-color)] rounded-full h-1.5 mb-3"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${data.performance.cpu}%` }}></div></div>
                
                <div className="flex justify-between text-xs mb-1 font-medium"><span className="text-[var(--text-muted)]">Memory Usage</span><span>{data.performance.memory}%</span></div>
                <div className="w-full bg-[var(--border-color)] rounded-full h-1.5"><div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${data.performance.memory}%` }}></div></div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
