import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { 
  User, Resume, Message, Setting, Template, 
  Skill, Certification, Language, Activity 
} from '../models/Schemas.js';

export async function initDB() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/freeairesume';
    await mongoose.connect(mongoUri);
    console.log('📦 Connected to MongoDB successfully.');
  } catch (error) {
    console.error('❌ Failed to initialize DB:', error);
  }
}

export const db = {
  users: {
    async findOne(query) {
      return await User.findOne(query).lean();
    },
    async findById(id) {
      return await User.findOne({ id }).lean();
    },
    async create(userData) {
      const newUser = new User({
        id: uuidv4(),
        ...userData
      });
      await newUser.save();
      return newUser.toObject();
    },
    async find(query = {}) {
      return await User.find(query).sort({ createdAt: -1 }).lean();
    },
    async update(id, updatedData) {
      return await User.findOneAndUpdate({ id }, updatedData, { returnDocument: 'after' }).lean();
    },
    async deleteOne(query) {
      return await User.deleteOne(query);
    }
  },
  resumes: {
    async find(query = {}) {
      return await Resume.find(query).sort({ createdAt: -1 }).lean();
    },
    async findById(id) {
      return await Resume.findOne({ id }).lean();
    },
    async create(resumeData) {
      const newResume = new Resume({
        id: uuidv4(),
        ...resumeData
      });
      await newResume.save();
      return newResume.toObject();
    },
    async deleteOne(query) {
      return await Resume.deleteOne(query);
    },
    async update(id, updatedData) {
      return await Resume.findOneAndUpdate({ id }, updatedData, { returnDocument: 'after' }).lean();
    }
  },
  messages: {
    async create(messageData) {
      const newMessage = new Message({
        id: uuidv4(),
        status: 'Unread',
        priority: 'Medium',
        isStarred: false,
        ...messageData
      });
      await newMessage.save();
      return newMessage.toObject();
    },
    async find(query = {}) {
      return await Message.find(query).sort({ createdAt: -1 }).lean();
    },
    async findById(id) {
      return await Message.findOne({ id }).lean();
    },
    async update(id, updatedData) {
      return await Message.findOneAndUpdate({ id }, updatedData, { returnDocument: 'after' }).lean();
    },
    async deleteOne(query) {
      return await Message.deleteOne(query);
    }
  },
  settings: {
    async get() {
      let settingsDoc = await Setting.findOne({ id: 'global' }).lean();
      if (!settingsDoc) {
        const newSettings = new Setting({ id: 'global' });
        await newSettings.save();
        return newSettings.toObject();
      }
      return settingsDoc;
    },
    async update(updatedData) {
      return await Setting.findOneAndUpdate(
        { id: 'global' },
        { $set: updatedData },
        { returnDocument: 'after', upsert: true }
      ).lean();
    }
  },
  templates: {
    async find(query = {}) {
      return await Template.find(query).sort({ createdAt: -1 }).lean();
    },
    async create(templateData) {
      const newTemplate = new Template({
        id: uuidv4(),
        ...templateData
      });
      await newTemplate.save();
      return newTemplate.toObject();
    },
    async update(id, updatedData) {
      return await Template.findOneAndUpdate({ id }, updatedData, { returnDocument: 'after' }).lean();
    },
    async unsetAllDefaults() {
      await Template.updateMany({}, { isDefault: false });
      return true;
    },
    async deleteOne(query) {
      return await Template.deleteOne(query);
    }
  },
  skills: {
    async find(query = {}) {
      return await Skill.find(query).sort({ createdAt: -1 }).lean();
    },
    async create(skillData) {
      const newSkill = new Skill({
        id: uuidv4(),
        ...skillData
      });
      await newSkill.save();
      return newSkill.toObject();
    },
    async update(id, updatedData) {
      return await Skill.findOneAndUpdate({ id }, updatedData, { returnDocument: 'after' }).lean();
    },
    async deleteOne(query) {
      return await Skill.deleteOne(query);
    }
  },
  certifications: {
    async find(query = {}) {
      return await Certification.find(query).sort({ createdAt: -1 }).lean();
    },
    async create(certData) {
      const newCert = new Certification({
        id: uuidv4(),
        ...certData
      });
      await newCert.save();
      return newCert.toObject();
    },
    async update(id, updatedData) {
      return await Certification.findOneAndUpdate({ id }, updatedData, { returnDocument: 'after' }).lean();
    },
    async deleteOne(query) {
      return await Certification.deleteOne(query);
    }
  },
  languages: {
    async find(query = {}) {
      return await Language.find(query).sort({ createdAt: -1 }).lean();
    },
    async create(langData) {
      const newLang = new Language({
        id: uuidv4(),
        ...langData
      });
      await newLang.save();
      return newLang.toObject();
    },
    async update(id, updatedData) {
      return await Language.findOneAndUpdate({ id }, updatedData, { returnDocument: 'after' }).lean();
    },
    async deleteOne(query) {
      return await Language.deleteOne(query);
    }
  },
  activities: {
    async find(query = {}) {
      return await Activity.find(query).sort({ createdAt: -1 }).lean();
    },
    async create(activityData) {
      const newActivity = new Activity({
        id: uuidv4(),
        ...activityData
      });
      await newActivity.save();
      return newActivity.toObject();
    }
  }
};
