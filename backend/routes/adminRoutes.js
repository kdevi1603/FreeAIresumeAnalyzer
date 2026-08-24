import express from 'express';
import { protect, isAdmin, isSuperAdmin } from '../middleware/auth.js';
import {
  getDashboardStats,
  getUsers,
  deleteUser,
  toggleBlockUser,
  getResumes,
  deleteResume,
  getTemplates,
  addTemplate,
  updateTemplate,
  deleteTemplate,
  setTemplateDefault,
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
  getLanguages,
  addLanguage,
  updateLanguage,
  deleteLanguage,
  getSettings,
  updateSettings,
  getSupportMessages,
  deleteSupportMessage,
  updateSupportMessageStatus,
  replySupportMessage
} from '../controllers/adminController.js';

const router = express.Router();

// Dashboard
router.get('/stats', protect, isAdmin, getDashboardStats);

// Apply auth & admin middlewares to all other routes in this file
router.use(protect, isAdmin);

// Users
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/block', toggleBlockUser);

// Resumes
router.get('/resumes', getResumes);
router.delete('/resumes/:id', deleteResume);

// Admin Template Management
router.get('/templates', getTemplates);
router.post('/templates', addTemplate);
router.put('/templates/:id', updateTemplate);
router.delete('/templates/:id', deleteTemplate);
router.put('/templates/:id/default', setTemplateDefault);

// Skills
router.get('/skills', getSkills);
router.post('/skills', addSkill);
router.put('/skills/:id', updateSkill);
router.delete('/skills/:id', deleteSkill);

// Certifications
router.get('/certifications', getCertifications);
router.post('/certifications', addCertification);
router.put('/certifications/:id', updateCertification);
router.delete('/certifications/:id', deleteCertification);

// Languages
router.get('/languages', getLanguages);
router.post('/languages', addLanguage);
router.put('/languages/:id', updateLanguage);
router.delete('/languages/:id', deleteLanguage);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Support Messages
router.get('/messages', isSuperAdmin, getSupportMessages);
router.delete('/messages/:id', isSuperAdmin, deleteSupportMessage);
router.put('/messages/:id/status', isSuperAdmin, updateSupportMessageStatus);
router.post('/messages/:id/reply', isSuperAdmin, replySupportMessage);

export default router;
