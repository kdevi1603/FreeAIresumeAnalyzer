import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Ensure directories and initial DB file exist
export async function initDB() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    
    try {
      await fs.access(DB_FILE);
    } catch {
      const initialData = {
        users: [],
        resumes: [],
        messages: [],
        settings: {},
        templates: [],
        skills: [],
        certifications: [],
        languages: []
      };
      await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
      console.log('📦 Initialized local JSON database storage.');
    }
    console.log('✅ Database service & storage directories ready.');
  } catch (error) {
    console.error('❌ Failed to initialize DB:', error);
  }
}

async function readDB() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    const parsed = JSON.parse(data);
    if (!parsed.messages) parsed.messages = [];
    if (!parsed.settings) parsed.settings = {};
    if (!parsed.templates) parsed.templates = [];
    if (!parsed.skills) parsed.skills = [];
    if (!parsed.certifications) parsed.certifications = [];
    if (!parsed.languages) parsed.languages = [];
    return parsed;
  } catch (error) {
    return { users: [], resumes: [], messages: [], settings: {}, templates: [], skills: [], certifications: [], languages: [] };
  }
}

async function writeDB(data) {
  fsSync.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Helper for matching queries like { email: '...' } or { userId: '...' }
function matchQuery(item, query) {
  for (const [key, val] of Object.entries(query)) {
    if (item[key] !== val) return false;
  }
  return true;
}

export const db = {
  users: {
    async findOne(query) {
      const data = await readDB();
      return data.users.find(u => matchQuery(u, query)) || null;
    },
    async findById(id) {
      const data = await readDB();
      return data.users.find(u => u.id === id) || null;
    },
    async create(userData) {
      const data = await readDB();
      const newUser = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        ...userData
      };
      data.users.push(newUser);
      await writeDB(data);
      return newUser;
    },
    async find(query = {}) {
      const data = await readDB();
      return data.users.filter(u => matchQuery(u, query)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    async update(id, updatedData) {
      const data = await readDB();
      const index = data.users.findIndex(u => u.id === id);
      if (index !== -1) {
        data.users[index] = { ...data.users[index], ...updatedData };
        await writeDB(data);
        return data.users[index];
      }
      return null;
    },
    async deleteOne(query) {
      const data = await readDB();
      const initialLen = data.users.length;
      data.users = data.users.filter(u => !matchQuery(u, query));
      if (data.users.length !== initialLen) {
        await writeDB(data);
        return { deletedCount: initialLen - data.users.length };
      }
      return { deletedCount: 0 };
    }
  },
  resumes: {
    async find(query = {}) {
      const data = await readDB();
      const results = data.resumes.filter(r => matchQuery(r, query));
      // Sort newest first
      return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    async findById(id) {
      const data = await readDB();
      return data.resumes.find(r => r.id === id) || null;
    },
    async create(resumeData) {
      const data = await readDB();
      const newResume = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        ...resumeData
      };
      data.resumes.push(newResume);
      await writeDB(data);
      return newResume;
    },
    async deleteOne(query) {
      const data = await readDB();
      const initialLen = data.resumes.length;
      data.resumes = data.resumes.filter(r => !matchQuery(r, query));
      if (data.resumes.length !== initialLen) {
        await writeDB(data);
        return { deletedCount: initialLen - data.resumes.length };
      }
      return { deletedCount: 0 };
    },
    async update(id, updatedData) {
      const data = await readDB();
      const index = data.resumes.findIndex(r => r.id === id);
      if (index !== -1) {
        data.resumes[index] = { ...data.resumes[index], ...updatedData };
        await writeDB(data);
        return data.resumes[index];
      }
      return null;
    }
  },
  messages: {
    async create(messageData) {
      const data = await readDB();
      const newMessage = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        status: 'Unread', // default status
        priority: 'Medium', // default priority
        isStarred: false,
        ...messageData
      };
      data.messages.push(newMessage);
      await writeDB(data);
      return newMessage;
    },
    async find(query = {}) {
      const data = await readDB();
      return data.messages.filter(m => matchQuery(m, query)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    async findById(id) {
      const data = await readDB();
      return data.messages.find(m => m.id === id) || null;
    },
    async update(id, updatedData) {
      const data = await readDB();
      const index = data.messages.findIndex(m => m.id === id);
      if (index !== -1) {
        data.messages[index] = { ...data.messages[index], ...updatedData };
        await writeDB(data);
        return data.messages[index];
      }
      return null;
    },
    async deleteOne(query) {
      const data = await readDB();
      const initialLen = data.messages.length;
      data.messages = data.messages.filter(m => !matchQuery(m, query));
      if (data.messages.length !== initialLen) {
        await writeDB(data);
        return { deletedCount: initialLen - data.messages.length };
      }
      return { deletedCount: 0 };
    }
  },
  settings: {
    async get() {
      const data = await readDB();
      return data.settings || {};
    },
    async update(updatedData) {
      const data = await readDB();
      data.settings = { ...data.settings, ...updatedData };
      await writeDB(data);
      return data.settings;
    }
  },
  templates: {
    async find(query = {}) {
      const data = await readDB();
      return data.templates.filter(t => matchQuery(t, query)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    async create(templateData) {
      const data = await readDB();
      const newTemplate = { id: uuidv4(), createdAt: new Date().toISOString(), ...templateData };
      data.templates.push(newTemplate);
      await writeDB(data);
      return newTemplate;
    },
    async update(id, updatedData) {
      const data = await readDB();
      const index = data.templates.findIndex(t => t.id === id);
      if (index !== -1) {
        data.templates[index] = { ...data.templates[index], ...updatedData };
        await writeDB(data);
        return data.templates[index];
      }
      return null;
    },
    async unsetAllDefaults() {
      const data = await readDB();
      data.templates = data.templates.map(t => ({ ...t, isDefault: false }));
      await writeDB(data);
      return true;
    },
    async deleteOne(query) {
      const data = await readDB();
      const initialLen = data.templates.length;
      data.templates = data.templates.filter(t => !matchQuery(t, query));
      if (data.templates.length !== initialLen) {
        await writeDB(data);
        return { deletedCount: initialLen - data.templates.length };
      }
      return { deletedCount: 0 };
    }
  },
  skills: {
    async find(query = {}) {
      const data = await readDB();
      return data.skills.filter(s => matchQuery(s, query)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    async create(skillData) {
      const data = await readDB();
      const newSkill = { id: uuidv4(), createdAt: new Date().toISOString(), ...skillData };
      data.skills.push(newSkill);
      await writeDB(data);
      return newSkill;
    },
    async update(id, updatedData) {
      const data = await readDB();
      const index = data.skills.findIndex(s => s.id === id);
      if (index !== -1) {
        data.skills[index] = { ...data.skills[index], ...updatedData };
        await writeDB(data);
        return data.skills[index];
      }
      return null;
    },
    async deleteOne(query) {
      const data = await readDB();
      const initialLen = data.skills.length;
      data.skills = data.skills.filter(s => !matchQuery(s, query));
      if (data.skills.length !== initialLen) {
        await writeDB(data);
        return { deletedCount: initialLen - data.skills.length };
      }
      return { deletedCount: 0 };
    }
  },
  certifications: {
    async find(query = {}) {
      const data = await readDB();
      return data.certifications.filter(c => matchQuery(c, query)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    async create(certData) {
      const data = await readDB();
      const newCert = { id: uuidv4(), createdAt: new Date().toISOString(), ...certData };
      data.certifications.push(newCert);
      await writeDB(data);
      return newCert;
    },
    async update(id, updatedData) {
      const data = await readDB();
      const index = data.certifications.findIndex(c => c.id === id);
      if (index !== -1) {
        data.certifications[index] = { ...data.certifications[index], ...updatedData };
        await writeDB(data);
        return data.certifications[index];
      }
      return null;
    },
    async deleteOne(query) {
      const data = await readDB();
      const initialLen = data.certifications.length;
      data.certifications = data.certifications.filter(c => !matchQuery(c, query));
      if (data.certifications.length !== initialLen) {
        await writeDB(data);
        return { deletedCount: initialLen - data.certifications.length };
      }
      return { deletedCount: 0 };
    }
  },
  languages: {
    async find(query = {}) {
      const data = await readDB();
      return data.languages.filter(l => matchQuery(l, query)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    async create(langData) {
      const data = await readDB();
      const newLang = { id: uuidv4(), createdAt: new Date().toISOString(), ...langData };
      data.languages.push(newLang);
      await writeDB(data);
      return newLang;
    },
    async update(id, updatedData) {
      const data = await readDB();
      const index = data.languages.findIndex(l => l.id === id);
      if (index !== -1) {
        data.languages[index] = { ...data.languages[index], ...updatedData };
        await writeDB(data);
        return data.languages[index];
      }
      return null;
    },
    async deleteOne(query) {
      const data = await readDB();
      const initialLen = data.languages.length;
      data.languages = data.languages.filter(l => !matchQuery(l, query));
      if (data.languages.length !== initialLen) {
        await writeDB(data);
        return { deletedCount: initialLen - data.languages.length };
      }
      return { deletedCount: 0 };
    }
  }
};
