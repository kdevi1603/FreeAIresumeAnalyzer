import express from 'express';
import { protect, isAdmin } from '../middleware/auth.js';
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
  getSkills,
  addSkill,
  deleteSkill,
  getSettings,
  updateSettings,
  getSupportMessages,
  deleteSupportMessage
} from '../controllers/adminController.js';

const router = express.Router();

// Apply auth & admin middlewares to all routes in this file
router.use(protect, isAdmin);

// Dashboard
router.get('/stats', getDashboardStats);

// Users
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/block', toggleBlockUser);

// Resumes
router.get('/resumes', getResumes);
router.delete('/resumes/:id', deleteResume);

// Templates
router.get('/templates', getTemplates);
router.post('/templates', addTemplate);
router.put('/templates/:id', updateTemplate);
router.delete('/templates/:id', deleteTemplate);

// Skills
router.get('/skills', getSkills);
router.post('/skills', addSkill);
router.delete('/skills/:id', deleteSkill);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Support Messages
router.get('/messages', getSupportMessages);
router.delete('/messages/:id', deleteSupportMessage);

export default router;
