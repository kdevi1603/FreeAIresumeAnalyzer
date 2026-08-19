import mongoose from 'mongoose';
import { analyzeResume } from './services/aiService.js';

mongoose.connect('mongodb+srv://thulasidevi9843_db_user:Thulasi%40123@cluster0.jwxsrkn.mongodb.net/freeairesume?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => mongoose.connection.db.collection('resumes').findOne({}, {sort: {createdAt: -1}}))
  .then(async r => { 
    // Just inject console logs into analyzeResume or mock it
    const text = r.rawText;
    const sectionHeaders = [
      { key: 'experience', patterns: [/(?:^|\n)\s*(?:projects\s*&\s*experience|professional\s+experience|work\s+experience|employment\s+history|experience)\s*[:\n]/i] },
      { key: 'education', patterns: [/(?:^|\n)\s*(?:education\s*&\s*academic\s*details|educational\s+qualification|academic\s+details|academic\s+background|education)\s*[:\n]/i] },
      { key: 'skills', patterns: [/(?:^|\n)\s*(?:technical\s+skills|core\s+competencies|key\s+skills|skills\s*&\s*tools|technical\s+qualification|skills)\s*[:\n]/i] },
      { key: 'summary', patterns: [/(?:^|\n)\s*(?:professional\s+summary|executive\s+summary|career\s+objective|objective|summary|about\s+me|profile)\s*[:\n]/i] },
      { key: 'projects', patterns: [/(?:^|\n)\s*(?:academic\s+projects|personal\s+projects|projects|project\s+title)\s*[:\n]/i] },
      { key: 'certifications', patterns: [/(?:^|\n)\s*(?:certifications|certificates|licenses)\s*[:\n]/i] },
      { key: 'languages', patterns: [/(?:^|\n)\s*languages?\s*[:\n]/i] },
      { key: 'personal', patterns: [/(?:^|\n)\s*(?:personal\s+profile|personal\s+details|area\s+of\s+interest|father's\s+name)\s*[:\n]/i] }
    ];
    const sectionPositions = [];
    for (const sec of sectionHeaders) {
      let minIdx = Infinity;
      let bestMatch = null;
      for (const pat of sec.patterns) {
        const match = text.match(pat);
        if (match && match.index < minIdx) {
          minIdx = match.index;
          bestMatch = { key: sec.key, idx: match.index, len: match[0].length };
        }
      }
      if (bestMatch) sectionPositions.push(bestMatch);
    }
    sectionPositions.sort((a, b) => a.idx - b.idx);
    console.log(sectionPositions);
    
    process.exit(0);
  })
  .catch(e => console.error(e));
