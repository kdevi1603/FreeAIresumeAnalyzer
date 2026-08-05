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
        messages: []
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
    return parsed;
  } catch (error) {
    return { users: [], resumes: [], messages: [] };
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
        ...messageData
      };
      data.messages.push(newMessage);
      await writeDB(data);
      return newMessage;
    },
    async find(query = {}) {
      const data = await readDB();
      return data.messages.filter(m => matchQuery(m, query)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }
};
