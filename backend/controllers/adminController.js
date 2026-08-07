import { db } from '../config/db.js';

// --- Dashboard ---
export async function getDashboardStats(req, res) {
  try {
    const users = await db.users.find() || [];
    const resumes = await db.resumes.find() || [];
    const templates = await db.templates.find() || [];
    
    // Sort and get recent data
    const recentUsers = [...users].reverse().slice(0, 5);
    const recentResumes = [...resumes].reverse().slice(0, 5);
    
    // Generate Mocked Chart Data
    const userRegistrationTrend = [
      { name: 'Mon', users: 12 }, { name: 'Tue', users: 19 }, { name: 'Wed', users: 15 },
      { name: 'Thu', users: 22 }, { name: 'Fri', users: 30 }, { name: 'Sat', users: 25 }, { name: 'Sun', users: 18 }
    ];
    
    const resumeUploadStats = [
      { name: 'Week 1', uploads: 45 }, { name: 'Week 2', uploads: 52 },
      { name: 'Week 3', uploads: 38 }, { name: 'Week 4', uploads: 65 }
    ];
    
    const aiUsageStats = [
      { name: 'Jan', usage: 400 }, { name: 'Feb', usage: 300 }, { name: 'Mar', usage: 550 },
      { name: 'Apr', usage: 450 }, { name: 'May', usage: 700 }, { name: 'Jun', usage: 600 },
      { name: 'Jul', usage: 800 }, { name: 'Aug', usage: 750 }, { name: 'Sep', usage: 900 },
      { name: 'Oct', usage: 850 }, { name: 'Nov', usage: 950 }, { name: 'Dec', usage: 1100 }
    ];
    
    const templateUsage = [
      { name: 'Modern', value: 45 }, { name: 'Professional', value: 30 },
      { name: 'Creative', value: 15 }, { name: 'Minimal', value: 10 }
    ];

    // Mock Recent Activity
    const recentActivity = [
      { id: 1, user: 'John Doe', action: 'New User Registered', time: '10 mins ago', status: 'success' },
      { id: 2, user: 'Jane Smith', action: 'Resume Uploaded', time: '25 mins ago', status: 'info' },
      { id: 3, user: 'Mike Johnson', action: 'AI Analysis Completed', time: '1 hour ago', status: 'success' },
      { id: 4, user: 'Sarah Wilson', action: 'Resume Downloaded', time: '2 hours ago', status: 'warning' },
      { id: 5, user: 'Tom Brown', action: 'Contact Message Received', time: '3 hours ago', status: 'info' }
    ];

    // Mock Notifications
    const notifications = [
      { id: 1, text: 'New User: Alice just registered', type: 'info' },
      { id: 2, text: 'Storage: 75% capacity reached', type: 'warning' },
      { id: 3, text: 'System: SMTP Connected Successfully', type: 'success' },
      { id: 4, text: 'AI API: Active and responding quickly', type: 'success' }
    ];

    res.json({
      stats: {
        totalUsers: users.length,
        todaysUsers: 12,
        userGrowth: '+15%',
        
        totalResumes: resumes.length,
        aiGeneratedResumes: Math.floor(resumes.length * 0.4) || 24,
        downloadedResumes: Math.floor(resumes.length * 0.8) || 89,
        
        totalAiAnalyses: 12540,
        todaysAnalyses: 142,
        monthlyAnalyses: 3200,
        
        totalAtsReports: 8900,
        averageAtsScore: '78%',
        
        totalTemplates: templates.length,
        activeTemplates: templates.length,
        
        totalUnreadMessages: 5,
        repliedMessages: 124
      },
      charts: {
        userRegistrationTrend,
        resumeUploadStats,
        aiUsageStats,
        templateUsage
      },
      recentActivity,
      recentUsers: recentUsers.map(u => ({ id: u.id, name: u.name || 'Unknown', email: u.email, role: u.role || 'User', status: u.isBlocked ? 'Blocked' : 'Active', date: '2026-08-01' })),
      recentResumes: recentResumes.map(r => ({ id: r.id, name: r.personalInfo?.name || 'Untitled', owner: 'User', atsScore: '85', template: 'Modern', date: '2026-08-05' })),
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
    const users = await db.users.find();
    // exclude passwords
    const safeUsers = users.map(({ password, ...u }) => u);
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    await db.users.deleteOne({ id });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
}

export async function toggleBlockUser(req, res) {
  try {
    const { id } = req.params;
    const user = await db.users.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const updated = await db.users.update(id, { isBlocked: !user.isBlocked });
    res.json({ message: `User ${updated.isBlocked ? 'blocked' : 'unblocked'}`, user: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error blocking user' });
  }
}

// --- Resumes ---
export async function getResumes(req, res) {
  try {
    const resumes = await db.resumes.find();
    res.json(resumes);
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
    res.json(templates);
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
