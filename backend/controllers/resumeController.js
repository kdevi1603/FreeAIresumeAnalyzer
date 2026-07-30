import fs from 'fs/promises';
import path from 'path';
import { db } from '../config/db.js';
import { extractTextFromPDF } from '../services/pdfService.js';
import { analyzeResume, matchJobDescription, generateCoverLetter, generateInterviewQuestions, fixResumeSection, agentChat } from '../services/aiService.js';

export async function uploadResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a valid PDF resume file.' });
    }

    const filePath = req.file.path;
    console.log(`📄 Extracting text from uploaded PDF: ${req.file.originalname}`);

    // Extract text
    const { text: rawText, pages } = await extractTextFromPDF(filePath);
    if (!rawText || rawText.trim().length < 50) {
      await fs.unlink(filePath).catch(() => {});
      return res.status(400).json({ message: 'Could not extract sufficient text from the PDF. Please ensure it is not a scanned image.' });
    }

    console.log(`🧠 Running AI Analysis on ${rawText.length} characters...`);
    const aiAnalysis = await analyzeResume(rawText);

    // Create database record
    const resumeRecord = await db.resumes.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      rawText,
      pages,
      ...aiAnalysis
    });

    console.log(`✅ Resume analyzed successfully! ATS Score: ${resumeRecord.atsScore}`);
    return res.status(201).json(resumeRecord);
  } catch (error) {
    console.error('Resume Upload & Analysis Error:', error);
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    return res.status(500).json({ message: error.message || 'Server error processing resume.' });
  }
}

export async function getUserResumes(req, res) {
  try {
    const resumes = await db.resumes.find({ userId: req.user.id });
    // Strip rawText in list view to reduce payload size
    const list = resumes.map(({ rawText, ...rest }) => rest);
    return res.json(list);
  } catch (error) {
    console.error('Get Resumes Error:', error);
    return res.status(500).json({ message: 'Server error retrieving resumes.' });
  }
}

export async function getResumeById(req, res) {
  try {
    const { id } = req.params;
    const resume = await db.resumes.findById(id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume analysis not found.' });
    }

    if (resume.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this resume.' });
    }

    return res.json(resume);
  } catch (error) {
    console.error('Get Resume By ID Error:', error);
    return res.status(500).json({ message: 'Server error retrieving resume.' });
  }
}

export async function deleteResume(req, res) {
  try {
    const { id } = req.params;
    const resume = await db.resumes.findById(id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume analysis not found.' });
    }

    if (resume.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this resume.' });
    }

    // Unlink local file if exists
    if (resume.fileUrl) {
      const fileName = path.basename(resume.fileUrl);
      const filePath = path.join(process.cwd(), 'uploads', fileName);
      await fs.unlink(filePath).catch(() => {});
    }

    await db.resumes.deleteOne({ id });
    return res.json({ message: 'Resume deleted successfully.', id });
  } catch (error) {
    console.error('Delete Resume Error:', error);
    return res.status(500).json({ message: 'Server error deleting resume.' });
  }
}

export async function matchJob(req, res) {
  try {
    const { resumeId, jobDescription } = req.body;
    let textToMatch = req.body.resumeText;

    if (resumeId) {
      const resume = await db.resumes.findById(resumeId);
      if (!resume || resume.userId !== req.user.id) {
        return res.status(404).json({ message: 'Resume not found.' });
      }
      textToMatch = resume.rawText;
    }

    if (!textToMatch) {
      return res.status(400).json({ message: 'Please provide a valid resume ID or text.' });
    }

    const result = await matchJobDescription(textToMatch, jobDescription);
    return res.json(result);
  } catch (error) {
    console.error('Job Matching Error:', error);
    return res.status(500).json({ message: error.message || 'Server error during job matching.' });
  }
}

export async function generateCoverLetterEndpoint(req, res) {
  try {
    const { resumeId, jobTitle, companyName, jobDescription } = req.body;
    let textToUse = req.body.resumeText;

    if (resumeId) {
      const resume = await db.resumes.findById(resumeId);
      if (!resume || resume.userId !== req.user.id) {
        return res.status(404).json({ message: 'Resume not found.' });
      }
      textToUse = resume.rawText;
    }

    if (!textToUse || !jobTitle) {
      return res.status(400).json({ message: 'Please provide a valid resume and job title.' });
    }

    const result = await generateCoverLetter(textToUse, jobTitle, companyName, jobDescription);
    return res.json(result);
  } catch (error) {
    console.error('Cover Letter Generation Error:', error);
    return res.status(500).json({ message: error.message || 'Server error generating cover letter.' });
  }
}

export async function generateInterviewQuestionsEndpoint(req, res) {
  try {
    const { resumeId, jobTitle } = req.body;
    let textToUse = req.body.resumeText;

    if (resumeId) {
      const resume = await db.resumes.findById(resumeId);
      if (!resume || resume.userId !== req.user.id) {
        return res.status(404).json({ message: 'Resume not found.' });
      }
      textToUse = resume.rawText;
    }

    if (!textToUse) {
      return res.status(400).json({ message: 'Please provide a valid resume.' });
    }

    const result = await generateInterviewQuestions(textToUse, jobTitle || 'Software Engineer');
    return res.json(result);
  } catch (error) {
    console.error('Interview Question Generation Error:', error);
    return res.status(500).json({ message: error.message || 'Server error generating interview questions.' });
  }
}

export async function fixSectionEndpoint(req, res) {
  try {
    const { sectionName, itemIndex, instruction } = req.body;
    const resume = await db.resumes.findById(req.params.id);
    if (!resume || resume.userId !== req.user.id) {
      return res.status(404).json({ message: 'Resume not found.' });
    }

    const result = await fixResumeSection(resume.rawText, sectionName, itemIndex, instruction);
    
    // Increment ATS score and update analysis in DB
    const newScore = Math.min(100, (resume.atsScore || 65) + (result.scoreGain || 5));
    const updated = await db.resumes.update(resume.id, {
      atsScore: newScore,
      analysis: {
        ...resume.analysis,
        atsScore: newScore
      }
    });

    return res.json({
      ...result,
      newAtsScore: newScore,
      updatedResume: updated
    });
  } catch (error) {
    console.error('Fix Section Error:', error);
    return res.status(500).json({ message: error.message || 'Server error fixing section.' });
  }
}

export async function agentChatEndpoint(req, res) {
  try {
    const { message, chatHistory } = req.body;
    const resume = await db.resumes.findById(req.params.id);
    if (!resume || resume.userId !== req.user.id) {
      return res.status(404).json({ message: 'Resume not found.' });
    }

    const result = await agentChat(resume.rawText, message, chatHistory || []);
    return res.json(result);
  } catch (error) {
    console.error('Agent Chat Error:', error);
    return res.status(500).json({ message: error.message || 'Server error in agent chat.' });
  }
}
