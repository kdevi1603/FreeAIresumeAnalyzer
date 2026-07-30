import express from 'express';
import {
  uploadResume,
  getUserResumes,
  getResumeById,
  deleteResume,
  matchJob,
  generateCoverLetterEndpoint,
  generateInterviewQuestionsEndpoint,
  fixSectionEndpoint,
  agentChatEndpoint
} from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Protected routes
router.use(protect);

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getUserResumes);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);

// Bonus AI features & Studio actions
router.post('/match-job', matchJob);
router.post('/cover-letter', generateCoverLetterEndpoint);
router.post('/interview-questions', generateInterviewQuestionsEndpoint);
router.post('/:id/fix', fixSectionEndpoint);
router.post('/:id/chat', agentChatEndpoint);

export default router;
