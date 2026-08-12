import mongoose from 'mongoose';

const baseOptions = { 
  strict: false, 
  timestamps: true,
  versionKey: false
};

// All schemas share the 'id' field to match the UUID string used in the frontend and controllers.
const idDefinition = { type: String, required: true, unique: true, index: true };

const UserSchema = new mongoose.Schema({ id: idDefinition }, baseOptions);
const ResumeSchema = new mongoose.Schema({ id: idDefinition }, baseOptions);
const MessageSchema = new mongoose.Schema({ id: idDefinition }, baseOptions);
const SettingSchema = new mongoose.Schema({ id: idDefinition }, baseOptions);
const TemplateSchema = new mongoose.Schema({ id: idDefinition }, baseOptions);
const SkillSchema = new mongoose.Schema({ id: idDefinition }, baseOptions);
const CertificationSchema = new mongoose.Schema({ id: idDefinition }, baseOptions);
const LanguageSchema = new mongoose.Schema({ id: idDefinition }, baseOptions);
const ActivitySchema = new mongoose.Schema({ id: idDefinition }, baseOptions);

export const User = mongoose.model('User', UserSchema);
export const Resume = mongoose.model('Resume', ResumeSchema);
export const Message = mongoose.model('Message', MessageSchema);
export const Setting = mongoose.model('Setting', SettingSchema);
export const Template = mongoose.model('Template', TemplateSchema);
export const Skill = mongoose.model('Skill', SkillSchema);
export const Certification = mongoose.model('Certification', CertificationSchema);
export const Language = mongoose.model('Language', LanguageSchema);
export const Activity = mongoose.model('Activity', ActivitySchema);
