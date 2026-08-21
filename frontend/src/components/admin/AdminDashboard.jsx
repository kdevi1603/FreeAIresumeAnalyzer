import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, FileText, Activity, Layout, MessageSquare, Shield, 
  Search, Bell, ChevronDown, CheckCircle, AlertTriangle, 
  Clock, Download, Upload, Server, Database, HardDrive, Cpu, Settings, Moon, Sun, ChevronLeft
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, 
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function AdminDashboard({ setActiveTab, isLightMode, setIsLightMode, onBackToLanding }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = () => {
    setAppliedSearch(searchQuery.toLowerCase().trim());
  };

  const matchSearch = (text) => {
    if (!appliedSearch) return true;
    return text.toLowerCase().includes(appliedSearch);
  };
  
  const anyMatch = (...texts) => {
    if (!appliedSearch) return true;
    return texts.some(text => text.toLowerCase().includes(appliedSearch));
  };

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
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
    };

    fetchData();
    // Poll every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (data.message || !data.stats) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center">
        <AlertTriangle size={48} className="text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Could not load dashboard data</h2>
        <p className="text-[var(--text-muted)]">{data.message || 'Please ensure you are logged in as an admin.'}</p>
      </div>
    );
  }

  const { stats, charts, recentActivity, recentUsers, recentResumes, systemHealth, performance, notifications } = data;

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const showLeftColumn = anyMatch('System Health', 'Server Status', 'Database Status', 'API Status', 'AI API Status', 'Performance', 'CPU Usage', 'Memory Usage', 'Disk Usage', 'Avg Response Time');
  const showRightColumn = anyMatch('Recent Activity') || recentActivity.some(activity => !appliedSearch || activity.action.toLowerCase().includes(appliedSearch) || activity.user.toLowerCase().includes(appliedSearch));

  return (
    <div className="text-[var(--text-main)] w-full">
      {/* Search & Notifications Row */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8 relative z-40">
        <div className="flex-1 w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-sm flex items-center p-1.5 h-16">
          <Search className="ml-4 text-gray-400" size={22} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="flex-1 bg-transparent border-none py-2 px-4 focus:outline-none text-[var(--text-main)] text-sm"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setAppliedSearch(e.target.value.toLowerCase().trim());
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-600 text-white h-full px-6 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors text-sm">
            Search <span>→</span>
          </button>
        </div>
        
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-sm relative cursor-pointer flex items-center justify-center h-16 w-16 shrink-0" onClick={() => setShowNotifications(!showNotifications)}>
          <Bell size={24} className="text-[var(--text-muted)] hover:text-blue-500 transition-colors" />
          <span className="absolute top-4 right-4 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
            {notifications.length}
          </span>
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="p-3 border-b border-[var(--border-color)] font-semibold text-sm">Notifications</div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 border-b border-[var(--border-color)] text-xs hover:bg-[var(--bg-main)]">
                    {n.text}
                  </div>
                ))}
                {notifications.length === 0 && <div className="p-4 text-center text-xs text-[var(--text-muted)]">No notifications</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show"
        className="flex flex-col gap-8"
      >
        {/* Statistics Cards */}
        {anyMatch('Total Users', 'Total Resumes', 'AI Usage', 'ATS Reports', 'Resume Templates', 'Contact Messages') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchSearch('Total Users') && <StatCard title="Total Users" value={stats.totalUsers} sub={`+${stats.todaysUsers} today`} icon={Users} color="from-blue-500 to-blue-600" />}
            {matchSearch('Total Resumes') && <StatCard title="Total Resumes" value={stats.totalResumes} sub={`${stats.aiGeneratedResumes} AI generated`} icon={FileText} color="from-purple-500 to-purple-600" />}
            {matchSearch('AI Usage') && <StatCard title="AI Usage" value={stats.totalAiAnalyses} sub={`${stats.todaysAnalyses} analyses today`} icon={Activity} color="from-cyan-500 to-cyan-600" />}
            {matchSearch('ATS Reports') && <StatCard title="ATS Reports" value={stats.totalAtsReports} sub={`Avg Score: ${stats.averageAtsScore}`} icon={Shield} color="from-emerald-500 to-emerald-600" />}
            {matchSearch('Resume Templates') && <StatCard title="Resume Templates" value={stats.totalTemplates} sub={`${stats.activeTemplates} active templates`} icon={Layout} color="from-orange-500 to-orange-600" />}
            {matchSearch('Contact Messages') && <StatCard title="Contact Messages" value={stats.totalUnreadMessages} sub={`${stats.repliedMessages} replied`} icon={MessageSquare} color="from-pink-500 to-pink-600" />}
          </div>
        )}

        {/* Charts Section */}
        {anyMatch('User Registration Trend', 'AI Usage Statistics', 'Resume Upload Statistics', 'Resume Template Usage') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1 */}
            {matchSearch('User Registration Trend') && (
            <ChartCard title="User Registration Trend">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={charts.userRegistrationTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
            )}

            {/* Chart 2 */}
            {matchSearch('AI Usage Statistics') && (
            <ChartCard title="AI Usage Statistics">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={charts.aiUsageStats}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="usage" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorUsage)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
            )}

            {/* Chart 3 */}
            {matchSearch('Resume Upload Statistics') && (
            <ChartCard title="Resume Upload Statistics">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={charts.resumeUploadStats} barSize={30}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'var(--bg-main)'}} contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                  <Bar dataKey="uploads" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            )}

            {/* Chart 4 */}
            {matchSearch('Resume Template Usage') && (
            <ChartCard title="Resume Template Usage">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={charts.templateUsage} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {charts.templateUsage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {charts.templateUsage.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    {entry.name}
                  </div>
                ))}
              </div>
            </ChartCard>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions & Health Column */}
          {showLeftColumn && (
          <div className={`flex flex-col gap-6 ${showRightColumn ? 'lg:col-span-1' : 'lg:col-span-3'}`}>

            {/* System Health */}
            {anyMatch('System Health', 'Server Status', 'Database Status', 'API Status', 'AI API Status') && (
            <motion.div variants={itemVariants} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm p-5">
              <h3 className="text-lg font-semibold mb-4">System Health</h3>
              <div className="flex flex-col gap-4">
                {(matchSearch('System Health') || matchSearch('Server Status')) && <HealthItem label="Server Status" status={systemHealth.server} icon={Server} isGood={true} />}
                {(matchSearch('System Health') || matchSearch('Database Status')) && <HealthItem label="Database Status" status={systemHealth.database} icon={Database} isGood={true} />}
                {(matchSearch('System Health') || matchSearch('API Status')) && <HealthItem label="API Status" status={systemHealth.api} icon={Activity} isGood={true} />}
                {(matchSearch('System Health') || matchSearch('AI API Status')) && <HealthItem label="AI API Status" status={systemHealth.aiApi} icon={Cpu} isGood={true} />}
              </div>
            </motion.div>
            )}

            {/* Performance */}
            {anyMatch('Performance', 'CPU Usage', 'Memory Usage', 'Disk Usage', 'Avg Response Time') && (
            <motion.div variants={itemVariants} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm p-5">
              <h3 className="text-lg font-semibold mb-4">Performance</h3>
              <div className="flex flex-col gap-4">
                {(matchSearch('Performance') || matchSearch('CPU Usage')) && <ProgressBar label="CPU Usage" value={performance.cpu} color="bg-blue-500" />}
                {(matchSearch('Performance') || matchSearch('Memory Usage')) && <ProgressBar label="Memory Usage" value={performance.memory} color="bg-purple-500" />}
                {(matchSearch('Performance') || matchSearch('Disk Usage')) && <ProgressBar label="Disk Usage" value={performance.disk} color="bg-green-500" />}
                {(matchSearch('Performance') || matchSearch('Avg Response Time')) && (
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-[var(--text-muted)]">Avg Response Time</span>
                    <span className="text-sm font-semibold">{performance.responseTime}ms</span>
                  </div>
                )}
              </div>
            </motion.div>
            )}
          </div>
          )}

          {/* Tables & Activity Column */}
          {showRightColumn && (
          <div className={`flex flex-col gap-6 ${showLeftColumn ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            {/* Recent Activity */}
            <motion.div variants={itemVariants} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm p-5 overflow-hidden">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="flex flex-col gap-4">
                {recentActivity
                  .filter(activity => 
                    !appliedSearch || 
                    matchSearch('Recent Activity') ||
                    activity.action.toLowerCase().includes(appliedSearch) || 
                    activity.user.toLowerCase().includes(appliedSearch)
                  )
                  .map((activity, index) => (
                  <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-[var(--bg-main)] rounded-xl transition-colors">
                    <div className={`mt-1 h-2 w-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' : activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-[var(--text-muted)]">by {activity.user}</p>
                    </div>
                    <span className="text-xs text-[var(--text-muted)] flex items-center gap-1"><Clock size={12}/> {activity.time}</span>
                  </div>
                ))}
                {recentActivity.filter(activity => !appliedSearch || matchSearch('Recent Activity') || activity.action.toLowerCase().includes(appliedSearch) || activity.user.toLowerCase().includes(appliedSearch)).length === 0 && (
                  <div className="p-4 text-center text-sm text-[var(--text-muted)]">
                    No recent activity found matching "{appliedSearch}"
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// Sub-components
function StatCard({ title, value, sub, icon: Icon, color }) {
  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      className="bg-[var(--bg-card)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-bl-full group-hover:scale-110 transition-transform duration-300`}></div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-sm text-[var(--text-muted)] mb-1 font-medium">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white shadow-sm`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-xs text-[var(--text-muted)] relative z-10">{sub}</p>
    </motion.div>
  );
}

function ChartCard({ title, children }) {
  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      className="bg-[var(--bg-card)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-6">{title}</h3>
      {children}
    </motion.div>
  );
}

function ActionButton({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-blue-500 hover:text-blue-500 transition-colors">
      <Icon size={20} />
      <span className="text-xs font-medium text-center">{label}</span>
    </button>
  );
}

function HealthItem({ label, status, icon: Icon, isGood }) {
  const bgColor = isGood ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
  const textColor = isGood ? 'var(--accent-green)' : 'var(--accent-danger)';

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: bgColor, color: textColor }}>
          <Icon size={16} />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: bgColor, color: textColor }}>
        {status}
      </span>
    </div>
  );
}

function ProgressBar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-[var(--text-muted)]">{label}</span>
        <span className="text-xs font-medium">{value}%</span>
      </div>
      <div className="w-full bg-[var(--bg-main)] rounded-full h-2 overflow-hidden border border-[var(--border-color)]">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}
