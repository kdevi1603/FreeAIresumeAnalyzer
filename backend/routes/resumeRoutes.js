import express from 'express';
import {
  uploadResume,
  getUserResumes,
  getResumeById,
  deleteResume,
  updateResume,
  matchJob,
  generateCoverLetterEndpoint,
  generateInterviewQuestionsEndpoint,
  fixSectionEndpoint,
  agentChatEndpoint, agentChatStreamEndpoint,
  reanalyzeResume
} from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Protected routes
router.use(protect);

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getUserResumes);
router.get('/:id', getResumeById);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);
router.post('/:id/reanalyze', reanalyzeResume);

// Bonus AI features & Studio actions
router.post('/match-job', matchJob);
router.post('/cover-letter', generateCoverLetterEndpoint);
router.post('/interview-questions', generateInterviewQuestionsEndpoint);
router.post('/:id/fix', fixSectionEndpoint);
router.post('/:id/chat', agentChatEndpoint);
router.post('/:id/chat/stream', agentChatStreamEndpoint);

export default router;

