import { db } from '../config/db.js';

// --- Dashboard ---
export async function getDashboardStats(req, res) {
  try {
    const users = await db.users.find();
    const resumes = await db.resumes.find();
    const templates = await db.templates.find();
    
    res.json({
      totalUsers: users.length,
      totalResumes: resumes.length,
      totalTemplates: templates.length,
      // You can add more stats like AI usage here later
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
