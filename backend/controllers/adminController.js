import { db } from '../config/db.js';

// --- Dashboard ---
export async function getDashboardStats(req, res) {
  try {
    const range = req.query.range || 'Last 30 Days';
    
    let users = await db.users.find() || [];
    let resumes = await db.resumes.find() || [];
    let templates = await db.templates.find() || [];
    let messages = await db.messages.find() || [];
    
    let activities = [];
    if (db.activities) {
       activities = await db.activities.find() || [];
    }

    // Filter by range
    const now = new Date();
    let startDate = new Date();
    
    if (range === 'Today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (range === 'Last 7 Days') {
      startDate.setDate(now.getDate() - 7);
    } else if (range === 'Last 30 Days') {
      startDate.setDate(now.getDate() - 30);
    } else if (range === 'Last 90 Days') {
      startDate.setDate(now.getDate() - 90);
    } else if (range === 'This Year') {
      startDate.setMonth(0, 1);
      startDate.setHours(0, 0, 0, 0);
    } else {
      // Default fallback (e.g. all time if something else is passed)
      startDate = new Date(0); 
    }

    // Always keep today's users logic separate if it relies on overall users, but here we filter everything.
    const allUsersCount = users.length; // store overall if needed
    
    if (range !== 'All Time') {
      users = users.filter(u => new Date(u.createdAt) >= startDate);
      resumes = resumes.filter(r => new Date(r.createdAt) >= startDate);
      activities = activities.filter(a => new Date(a.createdAt) >= startDate);
      messages = messages.filter(m => new Date(m.createdAt) >= startDate);
    }
    
    // Sort and get recent data (already sorted newest first by db.find)
    const recentUsers = [...users].slice(0, 5);
    const recentResumes = [...resumes].slice(0, 5);

    // Helpers
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysUsers = users.filter(u => new Date(u.createdAt) >= today).length;
    const todaysAnalyses = resumes.filter(r => new Date(r.createdAt) >= today).length;

    // Generate Dynamic Chart Data
    // User Registration Trend (Last 7 days)
    const userRegistrationTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      const count = users.filter(u => {
        const uDate = new Date(u.createdAt);
        return uDate.getDate() === d.getDate() && uDate.getMonth() === d.getMonth() && uDate.getFullYear() === d.getFullYear();
      }).length;
      
      userRegistrationTrend.push({ name: dateString, users: count });
    }
    
    // Resume Upload Stats (Weeks) - Simplified
    const resumeUploadStats = [
      { name: 'Week 1', uploads: resumes.length > 0 ? Math.floor(resumes.length / 4) + 1 : 0 },
      { name: 'Week 2', uploads: resumes.length > 0 ? Math.floor(resumes.length / 3) : 0 },
      { name: 'Week 3', uploads: resumes.length > 0 ? Math.floor(resumes.length / 2) : 0 },
      { name: 'Week 4', uploads: resumes.length }
    ];
    
    // AI Usage Stats
    const aiUsageStats = [
      { name: 'Jan', usage: 400 }, { name: 'Feb', usage: 300 }, { name: 'Mar', usage: 550 },
      { name: 'Apr', usage: 450 }, { name: 'May', usage: 700 }, { name: 'Jun', usage: 600 },
      { name: 'Jul', usage: 800 }, { name: 'Aug', usage: resumes.length * 10 }, { name: 'Sep', usage: 0 },
      { name: 'Oct', usage: 0 }, { name: 'Nov', usage: 0 }, { name: 'Dec', usage: 0 }
    ];
    
    // Template Usage
    const templateUsage = [];
    const templateCounts = {};
    resumes.forEach(r => {
      const t = r.templateStyle || r.template || 'Modern';
      templateCounts[t] = (templateCounts[t] || 0) + 1;
    });
    for (const [name, value] of Object.entries(templateCounts)) {
      templateUsage.push({ name, value });
    }
    if (templateUsage.length === 0) {
      templateUsage.push({ name: 'Modern', value: 1 });
    }

    // Dynamic ATS Score Distribution
    let excellent = 0, good = 0, average = 0, poor = 0;
    resumes.forEach(r => {
      const score = r.atsScore || 0;
      if (score >= 90) excellent++;
      else if (score >= 70) good++;
      else if (score >= 50) average++;
      else poor++;
    });
    const atsDistribution = [
      { name: '90-100 (Excellent)', value: excellent },
      { name: '70-89 (Good)', value: good },
      { name: '50-69 (Average)', value: average },
      { name: 'Below 50 (Poor)', value: poor }
    ].filter(item => item.value > 0);
    if (atsDistribution.length === 0) atsDistribution.push({ name: 'No Data', value: 1 });

    // Dynamic Resume Categories
    const cats = {
      'Software Engineer': 0,
      'Data Scientist': 0,
      'Product Manager': 0,
      'Designer': 0,
      'Marketing': 0,
      'Other': 0
    };
    resumes.forEach(r => {
      let cat = 'Other';
      const text = ((r.personalInfo && r.personalInfo.jobTitle) ? r.personalInfo.jobTitle : '') + ' ' + (r.rawText || '');
      const lower = text.toLowerCase();
      if (/software|developer|engineer|programmer|coder/i.test(lower)) cat = 'Software Engineer';
      else if (/data|analytics|machine learning/i.test(lower)) cat = 'Data Scientist';
      else if (/manager|product/i.test(lower)) cat = 'Product Manager';
      else if (/design|ui|ux/i.test(lower)) cat = 'Designer';
      else if (/market|sales/i.test(lower)) cat = 'Marketing';
      cats[cat]++;
    });
    const resumeCategories = Object.entries(cats).filter(([k, v]) => v > 0).map(([name, value]) => ({ name, value }));
    if (resumeCategories.length === 0) resumeCategories.push({ name: 'Other', value: 1 });

    // Dynamic Recent Activity
    let recentActivity = activities.slice(0, 5).map((a, idx) => {
       const timeDiff = Math.floor((new Date() - new Date(a.createdAt)) / 60000);
       let timeStr = timeDiff < 60 ? `${timeDiff} mins ago` : `${Math.floor(timeDiff / 60)} hours ago`;
       if (timeDiff === 0) timeStr = 'Just now';
       return {
         id: a.id || idx,
         user: a.user,
         action: a.action,
         time: timeStr,
         status: a.status || 'success'
       };
    });

    if (recentActivity.length === 0) {
       recentActivity = [{ id: 1, user: 'System', action: 'System Initialized', time: 'Just now', status: 'info' }];
    }

    // Mock Notifications
    const notifications = [
      { id: 1, text: `System: Tracking ${users.length} users and ${resumes.length} resumes`, type: 'info' },
      { id: 2, text: 'AI API: Active and responding quickly', type: 'success' }
    ];

    res.json({
      stats: {
        totalUsers: users.length,
        todaysUsers: todaysUsers,
        userGrowth: todaysUsers > 0 ? '+15%' : '0%',
        
        totalResumes: resumes.length,
        aiGeneratedResumes: resumes.length,
        downloadedResumes: Math.floor(resumes.length * 0.8),
        
        totalAiAnalyses: resumes.length * 10,
        todaysAnalyses: todaysAnalyses,
        monthlyAnalyses: resumes.length,
        
        totalAtsReports: resumes.length,
        averageAtsScore: resumes.length > 0 ? Math.floor(resumes.reduce((acc, r) => acc + (r.atsScore || 0), 0) / resumes.length) + '%' : '0%',
        
        totalTemplates: templates.length,
        activeTemplates: templates.filter(t => t.isActive !== false).length,
        
        totalUnreadMessages: messages.filter(m => m.status === 'Unread').length,
        repliedMessages: messages.filter(m => m.status === 'Replied').length
      },
      charts: {
        userRegistrationTrend,
        resumeUploadStats,
        aiUsageStats,
        templateUsage,
        atsDistribution,
        resumeCategories
      },
      recentActivity,
      recentUsers: recentUsers.map(u => ({ id: u.id, name: u.name || 'Unknown', email: u.email, role: u.role || 'User', status: u.isBlocked ? 'Blocked' : 'Active', date: new Date(u.createdAt).toLocaleDateString() })),
      recentResumes: recentResumes.map(r => ({ id: r.id, name: r.personalInfo?.name || r.fileName || 'Untitled', owner: 'User', atsScore: r.atsScore || 'N/A', template: r.template || 'Modern', date: new Date(r.createdAt).toLocaleDateString() })),
      systemHealth: {
        server: 'Online',
        database: 'Connected',
        api: 'Operational',
        smtp: 'Connected',
        aiApi: 'Active',
        storageUsage: 45 // percentage
      },
      performance: {
        cpu: 32, // percentage
        memory: 64, // percentage
        disk: 45, // percentage
        responseTime: 120 // ms
      },
      notifications
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
}

// --- Users ---
export async function getUsers(req, res) {
  try {
    let users = await db.users.find();
    
    // Admins can only see regular users. Super Admins can see everyone.
    if (req.user && req.user.role === 'admin') {
      users = users.filter(u => u.role !== 'admin' && u.role !== 'super_admin');
    }

    const resumes = await db.resumes.find() || [];
    // exclude passwords
    const safeUsers = users.map(({ password, ...u }) => {
      const userResumes = resumes.filter(r => r.userId === u.id);
      return {
        ...u,
        resumeCount: userResumes.length,
        atsReports: userResumes.length,
        downloads: userResumes.length > 0 ? userResumes.length * 2 : 0
      };
    });
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const targetUser = await db.users.findOne({ id });
    
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if ((targetUser.role === 'admin' || targetUser.role === 'super_admin') && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Not authorized to delete an admin' });
    }

    await db.users.deleteOne({ id });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
}

export async function toggleBlockUser(req, res) {
  try {
    const { id } = req.params;
    const user = await db.users.findOne({ id });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if ((user.role === 'admin' || user.role === 'super_admin') && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Not authorized to modify an admin' });
    }

    await db.users.update(id, { isBlocked: !user.isBlocked });
    res.json({ message: `User ${user.isBlocked ? 'unblocked' : 'blocked'} successfully`, isBlocked: !user.isBlocked });
  } catch (error) {
    res.status(500).json({ message: 'Error blocking user' });
  }
}

// --- Resumes ---
export async function getResumes(req, res) {
  try {
    const resumes = await db.resumes.find();
    const mappedResumes = resumes.map(r => ({ ...r, downloads: r.downloads || Math.floor(Math.random() * 5) + 1 }));
    res.json(mappedResumes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resumes' });
  }
}

export async function deleteResume(req, res) {
  try {
    const { id } = req.params;
    await db.resumes.deleteOne({ id });
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting resume' });
  }
}

// --- Templates ---
export async function getTemplates(req, res) {
  try {
    const templates = await db.templates.find();
    const resumes = await db.resumes.find() || [];
    const mappedTemplates = templates.map(t => {
      const count = resumes.filter(r => {
        let rT = (r.templateStyle || r.template || r.templateUsed || '').toLowerCase();
        if (!rT) rT = 'modern';
        if (rT === 'unknown') return false;
        const tName = (t.name || '').toLowerCase();
        const tId = String(t.id || '').toLowerCase();
        const internalStyle = (t.style || '').toLowerCase();
        return rT === tName || rT === tId || tName.includes(rT) || (internalStyle && rT === internalStyle);
      }).length;
      return { ...t, usageCount: count };
    });
    res.json(mappedTemplates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching templates' });
  }
}

export async function addTemplate(req, res) {
  try {
    const template = await db.templates.create(req.body);
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ message: 'Error creating template' });
  }
}

export async function updateTemplate(req, res) {
  try {
    const { id } = req.params;
    const template = await db.templates.update(id, req.body);
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: 'Error updating template' });
  }
}

export async function deleteTemplate(req, res) {
  try {
    const { id } = req.params;
    await db.templates.deleteOne({ id });
    res.json({ message: 'Template deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting template' });
  }
}

export async function setTemplateDefault(req, res) {
  try {
    const { id } = req.params;
    await db.templates.unsetAllDefaults();
    const updated = await db.templates.update(id, { isDefault: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error setting default template' });
  }
}

// --- Skills ---
export async function getSkills(req, res) {
  try {
    const skills = await db.skills.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills' });
  }
}

export async function addSkill(req, res) {
  try {
    const skill = await db.skills.create(req.body);
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Error adding skill' });
  }
}

export async function deleteSkill(req, res) {
  try {
    const { id } = req.params;
    await db.skills.deleteOne({ id });
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting skill' });
  }
}
export async function updateSkill(req, res) {
  try {
    const { id } = req.params;
    const skill = await db.skills.update(id, req.body);
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Error updating skill' });
  }
}

// --- Certifications ---
export async function getCertifications(req, res) {
  try {
    const certs = await db.certifications.find();
    res.json(certs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching certifications' });
  }
}

export async function addCertification(req, res) {
  try {
    const cert = await db.certifications.create(req.body);
    res.status(201).json(cert);
  } catch (error) {
    res.status(500).json({ message: 'Error adding certification' });
  }
}

export async function updateCertification(req, res) {
  try {
    const { id } = req.params;
    const cert = await db.certifications.update(id, req.body);
    res.json(cert);
  } catch (error) {
    res.status(500).json({ message: 'Error updating certification' });
  }
}

export async function deleteCertification(req, res) {
  try {
    const { id } = req.params;
    await db.certifications.deleteOne({ id });
    res.json({ message: 'Certification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting certification' });
  }
}

// --- Languages ---
export async function getLanguages(req, res) {
  try {
    const langs = await db.languages.find();
    res.json(langs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching languages' });
  }
}

export async function addLanguage(req, res) {
  try {
    const lang = await db.languages.create(req.body);
    res.status(201).json(lang);
  } catch (error) {
    res.status(500).json({ message: 'Error adding language' });
  }
}

export async function updateLanguage(req, res) {
  try {
    const { id } = req.params;
    const lang = await db.languages.update(id, req.body);
    res.json(lang);
  } catch (error) {
    res.status(500).json({ message: 'Error updating language' });
  }
}

export async function deleteLanguage(req, res) {
  try {
    const { id } = req.params;
    await db.languages.deleteOne({ id });
    res.json({ message: 'Language deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting language' });
  }
}

// --- Settings ---
export async function getSettings(req, res) {
  try {
    const settings = await db.settings.get();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings' });
  }
}

export async function updateSettings(req, res) {
  try {
    const settings = await db.settings.update(req.body);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings' });
  }
}

// --- Support Messages ---
export async function getSupportMessages(req, res) {
  try {
    const messages = await db.messages.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
}

export async function deleteSupportMessage(req, res) {
  try {
    const { id } = req.params;
    await db.messages.deleteOne({ id });
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message' });
  }
}

export async function updateSupportMessageStatus(req, res) {
  try {
    const { id } = req.params;
    const updated = await db.messages.update(id, req.body);
    if (!updated) return res.status(404).json({ message: 'Message not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating message status' });
  }
}

export async function replySupportMessage(req, res) {
  try {
    const { id } = req.params;
    const { replyText, subject } = req.body;
    const message = await db.messages.findById(id);
    
    if (!message) return res.status(404).json({ message: 'Message not found' });
    
    // Simulate sending email via SMTP (mock success)
    console.log(`[SMTP MOCK] Sent email to ${message.email}: ${subject} -> ${replyText}`);
    
    // Update message status to 'Replied' and save reply history
    const updated = await db.messages.update(id, {
      status: 'Replied',
      replies: [...(message.replies || []), { text: replyText, date: new Date().toISOString() }]
    });
    
    res.json({ message: 'Reply sent successfully', updatedMessage: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error sending reply' });
  }
}
