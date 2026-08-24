const fs = require('fs');
const path = require('path');

const targetFile = path.resolve('c:/Users/Admin/Downloads/FreeAIresumeAnalyzer-main/FreeAIresumeAnalyzer-main/frontend/src/components/studio/ResumeContentRenderer.jsx');
let code = fs.readFileSync(targetFile, 'utf8');

// Replace {mSomething && ( <div> with {mSomething && ( <div className="resume-section-wrapper">
code = code.replace(/\{(m[A-Za-z]+|hasContact)\s*&&\s*\(\s*<div(?:(?!className="resume-section-wrapper")[^>])*(?:>|style={{)/g, (match) => {
  if (match.includes('className=')) {
    return match.replace('className="', 'className="resume-section-wrapper ');
  } else if (match.includes('style={{')) {
    return match.replace('style={{', 'className="resume-section-wrapper" style={{');
  } else {
    return match.replace('<div', '<div className="resume-section-wrapper"');
  }
});

// also for sections.map((sec, idx) => ( <div key={idx}
code = code.replace(/sections\.map\(\(sec,\s*idx\)\s*=>\s*\(\s*<div\s+key=\{idx\}(?:(?!className="resume-section-wrapper")[^>])*(?:>|style={{)/g, (match) => {
  if (match.includes('className=')) {
    return match.replace('className="', 'className="resume-section-wrapper ');
  } else if (match.includes('style={{')) {
    return match.replace('style={{', 'className="resume-section-wrapper" style={{');
  } else {
    return match.replace('<div', '<div className="resume-section-wrapper"');
  }
});

fs.writeFileSync(targetFile, code);
console.log('Successfully injected .resume-section-wrapper classes into ResumeContentRenderer.jsx');
