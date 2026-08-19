import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Resume } from './models/Schemas.js';
import { analyzeResume } from './services/aiService.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const resumes = await Resume.find().sort({createdAt: -1}).limit(1);
    const resume = resumes[0];
    console.log('Reanalyzing:', resume.fileName);
    const data = await analyzeResume(resume.rawText);
    
    await Resume.updateOne(
      { _id: resume._id }, 
      { 
        $set: { 
          ...data, 
          fixedSkills: null, 
          fixedProjects: null, 
          fixedSummary: null,
          fixedEducation: null,
          customHtml: '' 
        } 
      }
    );
    console.log('Done!');
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
});
