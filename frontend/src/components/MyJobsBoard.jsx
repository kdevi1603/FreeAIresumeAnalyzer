import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Heart, FileText, Calendar, CheckCircle2, Plus, X, MapPin } from 'lucide-react';

export default function MyJobsBoard({ currentAnalysis }) {
  const [jobs, setJobs] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({ company: '', role: '', location: '', stage: 'Saved' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All companies');
  const [sortOrder, setSortOrder] = useState('Newest first');

  // Initialize with dummy data based on user's resume
  useEffect(() => {
    const role = currentAnalysis?.personalInfo?.jobTitle || 'Software Engineer';
    const initialJobs = [
      { id: 1, company: 'TechNova', role: role, location: 'Remote', stage: 'Saved' },
      { id: 2, company: 'Global Solutions', role: `Senior ${role}`, location: 'Bangalore, India', stage: 'Applied' },
    ];
    setJobs(initialJobs);
  }, [currentAnalysis]);

  const handleAddJob = (e) => {
    e.preventDefault();
    if (!newJob.company || !newJob.role) return;
    setJobs([...jobs, { ...newJob, id: Date.now() }]);
    setIsAddModalOpen(false);
    setNewJob({ company: '', role: '', location: '', stage: 'Saved' });
  };

  const uniqueCompanies = ['All companies', ...new Set(jobs.map(job => job.company).filter(Boolean))];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = (job.company?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           job.role?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCompany = selectedCompany === 'All companies' || job.company === selectedCompany;
    return matchesSearch && matchesCompany;
  }).sort((a, b) => {
    if (sortOrder === 'Newest first') return b.id - a.id;
    return a.id - b.id;
  });

  const getJobsByStage = (stage) => filteredJobs.filter(job => job.stage === stage);

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 4px 0' }}>My Jobs</h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 }}>
            Track your applications across each stage · {jobs.length} jobs
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', backgroundColor: 'var(--accent-blue)', color: '#ffffff',
            border: 'none', borderRadius: '8px',
            fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
        >
          <Plus size={18} />
          Add Job
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '300px', maxWidth: '600px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search jobs or companies" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px 10px 44px',
              backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: '8px', fontSize: '0.95rem', color: 'var(--text-main)',
              outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Dropdowns */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select 
            value={selectedCompany} 
            onChange={e => setSelectedCompany(e.target.value)}
            style={dropdownStyle}
          >
            {uniqueCompanies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select style={dropdownStyle} defaultValue="Any date">
            <option value="Any date">Any date</option>
            <option value="Past 24 hours">Past 24 hours</option>
            <option value="Past week">Past week</option>
            <option value="Past month">Past month</option>
          </select>
          <select 
            value={sortOrder} 
            onChange={e => setSortOrder(e.target.value)}
            style={dropdownStyle}
          >
            <option value="Newest first">Newest first</option>
            <option value="Oldest first">Oldest first</option>
          </select>
        </div>
        
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {filteredJobs.length} of {jobs.length}
        </div>
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
        
        {/* Column 1: Saved */}
        <KanbanColumn 
          title="Saved" 
          jobs={getJobsByStage('Saved')} 
          icon={<Heart size={16} color="var(--text-muted)" />} 
          color="var(--text-muted)" 
          emptyText="No jobs in Saved"
          emptySub="Save roles you want to review or apply to."
          emptyIcon={<Heart size={24} color="var(--text-muted)" />}
          onAdd={() => { setNewJob({ ...newJob, stage: 'Saved' }); setIsAddModalOpen(true); }}
        />

        {/* Column 2: Applied */}
        <KanbanColumn 
          title="Applied" 
          jobs={getJobsByStage('Applied')} 
          icon={<FileText size={16} color="var(--accent-cyan)" />} 
          color="var(--accent-cyan)"
          emptyText="No jobs in Applied"
          emptySub="Move jobs here once your application is sent."
          emptyIcon={<FileText size={24} color="var(--accent-cyan)" />}
          onAdd={() => { setNewJob({ ...newJob, stage: 'Applied' }); setIsAddModalOpen(true); }}
        />

        {/* Column 3: Interviewing */}
        <KanbanColumn 
          title="Interviewing" 
          jobs={getJobsByStage('Interviewing')} 
          icon={<Calendar size={16} color="var(--accent-blue)" />} 
          color="var(--accent-blue)"
          emptyText="No jobs in Interviewing"
          emptySub="Keep active interview processes organized here."
          emptyIcon={<Calendar size={24} color="var(--accent-blue)" />}
          onAdd={() => { setNewJob({ ...newJob, stage: 'Interviewing' }); setIsAddModalOpen(true); }}
        />

        {/* Column 4: Offered */}
        <KanbanColumn 
          title="Offered" 
          jobs={getJobsByStage('Offered')} 
          icon={<CheckCircle2 size={16} color="#16a34a" />} 
          color="#16a34a"
          emptyText="No jobs in Offered"
          emptySub="Offers you receive will be collected here."
          emptyIcon={<CheckCircle2 size={24} color="#16a34a" />}
          onAdd={() => { setNewJob({ ...newJob, stage: 'Offered' }); setIsAddModalOpen(true); }}
        />

      </div>

      {/* Add Job Modal */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '32px', width: '400px', maxWidth: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Add Job</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleAddJob} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Company</label>
                <input required type="text" value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} style={inputStyle} placeholder="e.g. Google" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Role</label>
                <input required type="text" value={newJob.role} onChange={e => setNewJob({...newJob, role: e.target.value})} style={inputStyle} placeholder="e.g. Software Engineer" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Location</label>
                <input type="text" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} style={inputStyle} placeholder="e.g. Remote" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Stage</label>
                <select value={newJob.stage} onChange={e => setNewJob({...newJob, stage: e.target.value})} style={inputStyle}>
                  <option value="Saved">Saved</option>
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offered">Offered</option>
                </select>
              </div>
              
              <button type="submit" style={{ marginTop: '16px', padding: '12px', backgroundColor: 'var(--accent-blue)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                Save Job
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 14px',
  backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)',
  borderRadius: '8px', fontSize: '0.95rem', color: 'var(--text-main)',
  outline: 'none', boxSizing: 'border-box'
};

const dropdownStyle = {
  padding: '10px 16px',
  backgroundColor: 'var(--bg-card)', 
  border: '1px solid var(--border-color)',
  borderRadius: '8px', 
  color: 'var(--text-main)', 
  fontSize: '0.9rem', 
  cursor: 'pointer',
  outline: 'none',
  appearance: 'auto'
};

function KanbanColumn({ title, jobs, icon, color, emptyText, emptySub, emptyIcon, onAdd }) {
  return (
    <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', flexDirection: 'column', minHeight: '600px', borderTop: `4px solid ${color}`, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
      
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid transparent' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon}
          <span style={{ fontSize: '1rem', fontWeight: 600, color: color }}>{title}</span>
          <span style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: color, fontSize: '0.8rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>{jobs.length}</span>
        </div>
        <button onClick={onAdd} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
          <Plus size={20} />
        </button>
      </div>

      <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {jobs.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              {emptyIcon}
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: color, margin: '0 0 8px 0' }}>{emptyText}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              {emptySub}
            </p>
            <button onClick={onAdd} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', backgroundColor: 'var(--bg-card)', border: `1px solid ${color}`,
              borderRadius: '6px', color: color, fontSize: '0.85rem', fontWeight: 600,
              cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              <Plus size={16} /> Add job
            </button>
          </div>
        ) : (
          <>
            {jobs.map(job => (
              <div key={job.id} style={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 4px 0' }}>{job.role}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', margin: '0 0 12px 0' }}>{job.company}</p>
                {job.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <MapPin size={12} /> {job.location}
                  </div>
                )}
              </div>
            ))}
            
            <button onClick={onAdd} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%',
              padding: '12px', backgroundColor: 'transparent', border: `1px dashed var(--border-color)`,
              borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.2s', marginTop: '8px'
            }} onMouseOver={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
              <Plus size={16} /> Add another
            </button>
          </>
        )}
      </div>

    </div>
  );
}
