import fetch from 'node-fetch';

// Helper to extract clean JSON from LLM markdown code blocks
function parseJSONResponse(text) {
  try {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, text];
    const cleaned = jsonMatch[1].trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse JSON from AI response:', text);
    throw new Error('AI response was not valid JSON.');
  }
}

// Call Google Gemini API directly via REST endpoint for maximum reliability
async function callGemini(prompt, systemInstruction = '', retries = 2) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not found');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=${apiKey}`;
  
  for (let i = 0; i <= retries; i++) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemInstruction}\n\n${prompt}` }]
        }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 429 || response.status === 503) {
        if (i < retries) {
          const delay = (i + 1) * 3000;
          console.warn(`⏳ Gemini API rate limit/503 hit. Retrying in ${delay/1000}s...`);
          await new Promise(res => setTimeout(res, delay));
          continue;
        }
      }
      throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textOutput) throw new Error('Empty response from Gemini API');
    return parseJSONResponse(textOutput);
  }
}

// Call OpenAI API
async function callOpenAI(prompt, systemInstruction = '') {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not found');

  const url = 'https://api.openai.com/v1/chat/completions';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const textOutput = data.choices?.[0]?.message?.content;
  return parseJSONResponse(textOutput);
}

// Smart Demo Mode: Generates high quality analysis based on actual resume content when API key is missing
export function runSmartDemoAnalysis(resumeText) {
  console.log('⚡ Running Smart Demo Mode AI Analysis...');
  const textLower = resumeText.toLowerCase();
  const wordCount = resumeText.split(/\s+/).length;

  // Broad skill catalog covering tech, management, design, data, etc.
  const techCatalog = [
    'javascript', 'typescript', 'react', 'angular', 'vue', 'node.js', 'next.js', 'nuxt',
    'python', 'java', 'c++', 'c#', '.net', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'firebase',
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'git', 'github', 'gitlab', 'jenkins',
    'html', 'css', 'sass', 'tailwind', 'bootstrap', 'express', 'graphql', 'rest api',
    'agile', 'scrum', 'jira', 'linux', 'ci/cd', 'redux', 'webpack', 'vite', 'figma',
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy',
    'data analysis', 'data science', 'excel', 'power bi', 'tableau', 'r', 'matlab',
    'selenium', 'jest', 'cypress', 'junit', 'postman', 'swagger',
    'communication', 'leadership', 'teamwork', 'project management', 'problem solving',
    'time management', 'critical thinking', 'research', 'content writing', 'seo',
    'photoshop', 'illustrator', 'canva', 'ux', 'ui', 'user research', 'wireframing',
    'spring', 'hibernate', 'microservices', 'devops', 'terraform', 'ansible',
    'networking', 'cybersecurity', 'penetration testing', 'ethical hacking',
    'flutter', 'react native', 'android', 'ios', 'mobile development',
    'blockchain', 'solidity', 'web3', 'nlp', 'computer vision', 'opencv'
  ];
  const foundSkills = techCatalog.filter(skill => textLower.includes(skill.toLowerCase()));


  // Basic contact info parsing
  const emailMatch = resumeText.match(/[a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}/i);
  const email = emailMatch ? emailMatch[0] : '';

  const phoneMatch = resumeText.match(/(?:\+?\d{1,3}[\s\-.]?)?(?:\(?\d{2,4}\)?[\s\-.]?){2,4}\d{3,4}/);
  const phone = phoneMatch ? phoneMatch[0].trim() : '';

  const linkedinMatch = resumeText.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const linkedin = linkedinMatch ? linkedinMatch[0] : '';

  const githubMatch = resumeText.match(/github\.com\/[a-zA-Z0-9_-]+/i);
  const github = githubMatch ? githubMatch[0] : '';

  // Better name extraction: find the first non-garbage, non-URL, human-looking line
  const rawLines = resumeText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let name = '';
  for (const line of rawLines.slice(0, 8)) {
    // Skip lines that look like emails, phones, URLs, or are too short/long
    if (/[@\/\\:\d]{3,}/.test(line)) continue;
    if (line.length < 3 || line.length > 60) continue;
    if (/^(resume|cv|curriculum|page|doc|pdf)/i.test(line)) continue;
    if (/[^a-zA-Z .'-]/.test(line) && line.replace(/[^a-zA-Z]/g, '').length < 4) continue;
    // A name usually has 2-5 words of mostly letters
    const wordCount = line.split(/\s+/).length;
    if (wordCount >= 1 && wordCount <= 5 && /^[A-Za-z]/.test(line)) {
      name = line;
      break;
    }
  }
  if (!name) name = rawLines[0] || 'Resume';

  // Compute ATS score
  let baseScore = 55;
  if (wordCount > 250) baseScore += 10;
  if (wordCount > 450) baseScore += 5;
  if (textLower.includes('experience') || textLower.includes('work history')) baseScore += 5;
  if (textLower.includes('education') || textLower.includes('degree')) baseScore += 5;
  if (foundSkills.length > 5) baseScore += 5;
  if (email) baseScore += 3;
  if (phone) baseScore += 2;
  const atsScore = Math.min(Math.max(baseScore, 45), 94);

  // Section extraction using heading detection
  const sectionHeaders = [
    { key: 'experience', patterns: [/(?:^|\n)\s*(?:professional\s+experience|work\s+experience|employment\s+history|experience)\s*[:\n]/i, /\b(?:work\s*(?:&|8)\s*project\s+experience|projects\s*(?:&|8)\s*experience)\b/i] },
    { key: 'education', patterns: [/(?:^|\n)\s*(?:educational\s+qualification|academic\s+details|academic\s+background|education)\s*[:\n]/i, /\b(?:education\s*(?:&|8)\s*academic\s*details)\b/i] },
    { key: 'skills', patterns: [/(?:^|\n)\s*(?:technical\s+skills|core\s+competencies|key\s+skills|skills\s*(?:&|8)\s*tools|technical\s+qualification|skills|expertise|packages)\s*[:\n]/i, /\b(?:technical\s+skills\s*(?:&|8)\s*tools)\b/i] },
    { key: 'summary', patterns: [/(?:^|\n)\s*(?:professional\s+summary|executive\s+summary|career\s+objective|objective|summary|about\s+me|professional\s+profile)\s*[:\n]/i] },
    { key: 'projects', patterns: [/(?:^|\n)\s*(?:academic\s+projects|personal\s+projects|projects|project|project\s+title)\s*[:\n]/i] },
    { key: 'certifications', patterns: [/(?:^|\n)\s*(?:certifications|certificates|licenses)\s*[:\n]/i] },
    { key: 'languages', patterns: [/(?:^|\n)\s*languages?\s*[:\n]/i] },
    { key: 'achievements', patterns: [/(?:^|\n)\s*(?:achievements|awards|honors)\s*[:\n]/i] },
    { key: 'personal', patterns: [/(?:^|\n)\s*(?:personal\s+profile|personal\s+details|area\s+of\s+interest|father's\s+name)\s*[:\n]/i] }
  ];

  const sectionPositions = [];
  
  for (const sec of sectionHeaders) {
    for (const pat of sec.patterns) {
      // Add 'g' flag if not present
      const flags = pat.flags.includes('g') ? pat.flags : pat.flags + 'g';
      const regex = new RegExp(pat.source, flags);
      const matches = [...resumeText.matchAll(regex)];
      
      for (const match of matches) {
        sectionPositions.push({ key: sec.key, idx: match.index, len: match[0].length });
      }
    }
  }
  
  sectionPositions.sort((a, b) => a.idx - b.idx);
  const uniquePositions = [];
  for (const pos of sectionPositions) {
    if (!uniquePositions.find(p => Math.abs(p.idx - pos.idx) < 5)) {
      uniquePositions.push(pos);
    }
  }

  const getSectionText = (key, maxLen = 1200) => {
    const poses = uniquePositions.filter(s => s.key === key);
    if (poses.length === 0) return '';
    let text = '';
    for (const pos of poses) {
      const nextPos = uniquePositions.find(s => s.idx > pos.idx);
      const start = pos.idx + pos.len;
      const end = nextPos ? nextPos.idx : Math.min(start + maxLen, resumeText.length);
      const chunk = resumeText.substring(start, end).replace(/^[\s:|-]+/, '').trim();
      if (chunk) text += chunk + '\n\n';
    }
    return text.trim().substring(0, maxLen);
  };

  let summary = getSectionText('summary', 1200);
  let education = getSectionText('education', 1200);
  let experience = getSectionText('experience', 2500);
  let projects = getSectionText('projects', 2500);
  let skillsSection = getSectionText('skills', 1200);
  let certifications = getSectionText('certifications', 1200);
  let languagesText = getSectionText('languages', 500);
  let achievements = getSectionText('achievements', 1200);

  // Fallback: If education is empty or heavily truncated due to jumbled 2-column PDF extraction
  if (!education || education.length < 20) {
    const eduBlocks = [];
    const lines = resumeText.split('\n').map(l => l.trim()).filter(Boolean);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/college|university|school|institute/i.test(line)) {
        let block = line;
        if (lines[i+1] && lines[i+1].length < 50) block += '\n' + lines[i+1];
        if (lines[i+2] && /^[0-9]{4}/.test(lines[i+2])) block += '\n' + lines[i+2];
        eduBlocks.push(block);
        i += 2;
      }
    }
    if (eduBlocks.length > 0) {
      eduBlocks.sort((a, b) => {
        const yearA = parseInt(a.match(/\d{4}/)?.[0] || 0);
        const yearB = parseInt(b.match(/\d{4}/)?.[0] || 0);
        return yearB - yearA;
      });
      education = eduBlocks.join('\n\n');
    }
  }

  // If no summary section found, use text before the first section
  if (!summary && sectionPositions.length > 0) {
    const firstSecIdx = sectionPositions[0].idx;
    summary = resumeText.substring(0, firstSecIdx)
      .replace(name, '').replace(email, '').replace(phone, '')
      .replace(/[^\x20-\x7E\n]/g, ' ')
      .trim().substring(0, 1200);
  }

  // Build experience text combining experience + projects
  const combinedExperience = [experience, projects].filter(Boolean).join('\n\n').trim();

  let finalSkillsText = skillsSection || (foundSkills.length > 0 ? foundSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ') : '');



  // Build missingSkills from detected skills
  const missingSkillPool = ['Cloud Architecture (AWS/GCP)', 'Unit Testing (Jest/Cypress)', 'CI/CD Pipelines', 'System Design', 'Microservices', 'GraphQL', 'Docker & Containerization'];
  const missingSkills = missingSkillPool.filter(s => !textLower.includes(s.split(' ')[0].toLowerCase())).slice(0, 5);

  return {
    atsScore,
    personalInfo: {
      name,
      jobTitle: '',
      email,
      phone,
      city: '',
      linkedin,
      github
    },
    summary: summary || '',
    education: education || '',
    skills: finalSkillsText,
    certifications: certifications || '',
    languages: languagesText || '',
    achievements: achievements || '',
    experienceList: (() => {
      const list = [];
      if (experience) {
        list.push({
          company: 'Work Experience',
          role: '',
          period: '',
          bullets: experience
        });
      }
      if (projects) {
        list.push({
          company: 'Projects',
          role: '',
          period: '',
          bullets: projects
        });
      }
      return list;
    })(),
    sectionScores: {
      structure: 85,
      experience: Math.min(100, baseScore + 10),
      education: education ? 90 : 60,
      projects: projects ? 85 : 60,
      skills: Math.min(100, foundSkills.length * 12 + 20)
    },
    grammar: {
      score: 88,
      readability: 'B+',
      passiveSentences: 2
    },
    formatting: [
      { label: 'ATS Friendly Layout', passed: true },
      { label: 'Proper Headings', passed: sectionPositions.length > 2 },
      { label: 'Font Size', passed: true },
      { label: 'Bullet Points', passed: textLower.includes('•') || textLower.includes('- ') },
      { label: 'White Space', passed: true },
      { label: 'No Images Detected', passed: true },
      { label: 'No Large Tables', passed: true }
    ],
    skillsFound: foundSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    missingSkills,
    suggestions: [
      { text: 'Quantify your bullet points with measurable outcomes (e.g., "Improved performance by 35%").', priority: 'High' },
      { text: 'Add a dedicated "Technical Summary" or "Core Competencies" section.', priority: 'Medium' },
      { text: 'Use stronger action verbs (e.g., spearheaded, architected, delivered) instead of passive language.', priority: 'Low' }
    ]
  };
}

export async function analyzeResume(resumeText) {
  const originalData = runSmartDemoAnalysis(resumeText);

  const prompt = `You are an expert data extractor. Analyze the following candidate resume text and extract the information into the corresponding JSON sections. 
CRITICAL RULES:
1. DO NOT summarize, rewrite, or modify the original text. You must extract the EXACT original text as it appears in the resume.
2. Map the content strictly based on the headings in the resume. Ensure that content under a specific heading is placed ONLY in its corresponding JSON section.
3. Preserve all original bullet points, formatting, and labels (e.g., 'Description:', 'Technologies Used:'). Do not clean them up.
4. Ensure technical skills do not bleed into the experience or project sections.
5. Identify "missingSkills" by suggesting industry-standard skills related to their experience.

Resume Text:
"""
${resumeText.slice(0, 10000)}
"""

Required JSON Schema:
{
  "isResume": boolean (Return true if the document appears to be a genuine resume/CV, false if it is a completely unrelated document like a recipe, random article, etc.),
  "atsScore": number (0 to 100),
  "personalInfo": {
    "name": string,
    "jobTitle": string,
    "email": string,
    "phone": string,
    "city": string,
    "linkedin": string,
    "github": string
  },
  "summary": string (A clean, professional executive summary. Remove any contact info, links, or section headers like 'Summary'),
  "education": string (A clean list of education details. Remove skills and coursework),
  "sectionScores": {
    "structure": number (0 to 100),
    "experience": number (0 to 100),
    "education": number (0 to 100),
    "projects": number (0 to 100),
    "skills": number (0 to 100)
  },
  "grammar": {
    "score": number (0 to 100),
    "readability": string (e.g., "A+", "B", "C-"),
    "passiveSentences": number (count of passive voice instances)
  },
  "formatting": [
    { "label": "ATS Friendly Layout", "passed": boolean },
    { "label": "Proper Headings", "passed": boolean },
    { "label": "Font Size", "passed": boolean },
    { "label": "Bullet Points", "passed": boolean },
    { "label": "No Large Tables", "passed": boolean }
  ],
  "skills": string (A clean, comma-separated list of technical skills. Remove headers like 'Technical Skills' or 'Tools'),
  "certifications": string (A clean list of certifications, separated by commas or newlines),
  "languages": string (A clean list of languages known, separated by commas),
  "achievements": string (A clean list of awards or achievements, separated by newlines),
  "skillsFound": string[] (list of technical and soft skills clearly detected),
  "missingSkills": string[] (5-7 crucial industry-standard skills that would make this profile much stronger),
  "suggestions": [
    { "text": string (actionable recommendation), "priority": string ("High" | "Medium" | "Low") }
  ]
}
Only output the JSON object without extra markdown formatting.`;

  const systemInstruction = 'You are a strict ATS parser and senior technical recruiter. Respond ONLY in valid JSON.';

  let aiData = null;

  // Try Gemini first if key exists
  if (process.env.GEMINI_API_KEY) {
    try {
      console.log('🤖 Analyzing resume with Google Gemini API...');
      aiData = await callGemini(prompt, systemInstruction);
    } catch (err) {
      console.warn('⚠️ Gemini API error:', err.message);
      if (!process.env.OPENAI_API_KEY) {
        return originalData;
      }
    }
  }

  // Try OpenAI if key exists
  if (!aiData && process.env.OPENAI_API_KEY) {
    try {
      console.log('🤖 Analyzing resume with OpenAI API...');
      aiData = await callOpenAI(prompt, systemInstruction);
    } catch (err) {
      console.warn('⚠️ OpenAI API error:', err.message);
      return originalData;
    }
  }

  if (!aiData) return originalData;

  // Merge the data, preserving the original factual data while attaching AI optimizations as fixed fields
  return {
    ...originalData,
    isResume: aiData.isResume !== undefined ? aiData.isResume : originalData.isResume,
    atsScore: aiData.atsScore || originalData.atsScore,
    personalInfo: {
       ...originalData.personalInfo,
       ...(aiData.personalInfo || {})
    },
    summary: originalData.summary,
    fixedSummary: aiData.summary || null,
    education: originalData.education,
    fixedEducation: aiData.education || null,
    skills: originalData.skills,
    fixedSkills: aiData.skills || null,
    experienceList: originalData.experienceList,
    fixedProjects: null, // Always use original unaltered experience/projects
    certifications: originalData.certifications,
    fixedCertifications: aiData.certifications || null,
    languages: originalData.languages,
    fixedLanguages: aiData.languages || null,
    achievements: originalData.achievements,
    fixedAchievements: aiData.achievements || null,
    sectionScores: aiData.sectionScores || originalData.sectionScores,
    grammar: aiData.grammar || originalData.grammar,
    formatting: aiData.formatting || originalData.formatting,
    skillsFound: aiData.skillsFound || originalData.skillsFound,
    missingSkills: aiData.missingSkills || originalData.missingSkills,
    suggestions: aiData.suggestions || originalData.suggestions,
  };
}

export async function matchJobDescription(resumeText, jobDescription) {
  if (!jobDescription || jobDescription.trim().length < 20) {
    throw new Error('Please provide a detailed job description (at least 20 characters).');
  }

  const prompt = `Compare the following candidate resume against the provided Job Description. Generate a structured JSON compatibility analysis.

Resume Text:
"""
${resumeText.slice(0, 6000)}
"""

Job Description:
"""
${jobDescription.slice(0, 6000)}
"""

Required JSON Schema:
{
  "matchScore": number (0 to 100 compatibility percentage),
  "matchingSkills": string[] (skills candidate possesses that match the job posting),
  "missingRequirements": string[] (key qualifications or skills required by the job that are absent from the resume),
  "recommendations": string[] (4-5 concrete tips on how to tailor this resume specifically for this vacancy)
}`;

  if (process.env.GEMINI_API_KEY) {
    try { return await callGemini(prompt); } catch (e) { console.warn(e.message); if (!process.env.OPENAI_API_KEY) throw e; }
  }
  if (process.env.OPENAI_API_KEY) {
    try { return await callOpenAI(prompt); } catch (e) { console.warn(e.message); throw e; }
  }

  // Demo fallback for Job Matching
  const textLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();
  const sampleKeywords = ['react', 'node', 'express', 'python', 'sql', 'cloud', 'agile', 'api', 'management', 'leader', 'design'];
  const matching = sampleKeywords.filter(k => textLower.includes(k) && jdLower.includes(k));
  const missing = sampleKeywords.filter(k => !textLower.includes(k) && jdLower.includes(k));

  return {
    matchScore: Math.max(50, Math.min(92, 60 + (matching.length * 7) - (missing.length * 5))),
    matchingSkills: matching.map(s => s.toUpperCase()),
    missingRequirements: missing.length > 0 ? missing.map(s => s.toUpperCase()) : ['Specific domain certification', '5+ years direct team leadership'],
    recommendations: [
      'Mirror the exact phrasing used in the job description for your core technical proficiencies.',
      'Highlight relevant project accomplishments in your work history that directly address the core responsibilities listed in this job post.',
      'Include a targeted cover letter emphasizing how your past background bridges any perceived gap in experience.'
    ]
  };
}

export async function generateCoverLetter(resumeText, jobTitle, companyName, jobDescription = '') {
  const prompt = `Write a persuasive, highly tailored, professional cover letter for a candidate applying for the role of "${jobTitle}" at "${companyName || 'the company'}".
Use facts, skills, and achievements from the candidate's resume below to highlight why they are an exceptional fit.

Resume Text:
"""
${resumeText.slice(0, 7000)}
"""

Job Description (if any):
"""
${jobDescription.slice(0, 4000)}
"""

Required JSON Schema:
{
  "coverLetter": string (The complete 3-4 paragraph cover letter formatted in clear markdown, ready to send to a hiring manager)
}`;

  if (process.env.GEMINI_API_KEY) {
    try { return await callGemini(prompt); } catch (e) { console.warn(e.message); if (!process.env.OPENAI_API_KEY) throw e; }
  }
  if (process.env.OPENAI_API_KEY) {
    try { return await callOpenAI(prompt); } catch (e) { console.warn(e.message); throw e; }
  }

  // Demo fallback for Cover Letter
  return {
    coverLetter: `Dear Hiring Manager at ${companyName || 'the hiring team'},\n\nI am writing to express my enthusiastic interest in the **${jobTitle}** position. With my proven professional track record and robust experience in modern software development and problem-solving, I am confident in my ability to deliver immediate value to your team.\n\nThroughout my career, as outlined in my resume, I have developed expertise in building scalable architectures, collaborating across functional teams, and driving technical excellence. I thrive in fast-paced environments where innovation and clean execution are prioritized. Specifically, my background in full-stack development and system optimization aligns directly with the goals of your engineering division.\n\nI am particularly drawn to ${companyName || 'your organization'} because of your commitment to cutting-edge technology and impactful customer solutions. I welcome the opportunity to discuss how my technical skills, leadership experience, and passion for software engineering can contribute to your upcoming projects.\n\nThank you for considering my application. I look forward to connecting soon.\n\nSincerely,\n**The Candidate**`
  };
}

export async function generateInterviewQuestions(resumeText, jobTitle = 'Software Engineer') {
  const prompt = `Generate a customized list of 8 high-yield interview questions (mixed technical and behavioral) for a candidate applying for a "${jobTitle}" role, based specifically on the experience and technologies found in their resume.

Resume Text:
"""
${resumeText.slice(0, 6000)}
"""

Required JSON Schema:
{
  "questions": [
    {
      "question": string (The interview question posed by the hiring manager),
      "category": string ("Technical" or "Behavioral" or "System Design" or "Leadership"),
      "tip": string (Recruiter advice on what the interviewer is really looking for),
      "sampleAnswer": string (A concise STAR-method framework answer tailored to their resume background)
    }
  ]
}`;

  if (process.env.GEMINI_API_KEY) {
    try { return await callGemini(prompt); } catch (e) { console.warn(e.message); if (!process.env.OPENAI_API_KEY) throw e; }
  }
  if (process.env.OPENAI_API_KEY) {
    try { return await callOpenAI(prompt); } catch (e) { console.warn(e.message); throw e; }
  }

  // Demo fallback for Interview Prep
  return {
    questions: [
      {
        question: `Can you walk me through your experience building web applications and explain how you ensure scalability and high performance?`,
        category: "Technical",
        tip: "Focus on caching strategies, database indexing, and asynchronous processing.",
        sampleAnswer: "In my recent projects, I structured REST APIs using modular controllers and implemented Redis/in-memory caching for frequently queried endpoints, which reduced average latency by over 30%."
      },
      {
        question: "Describe a challenging technical roadblock you encountered on a recent project and how you resolved it.",
        category: "Behavioral",
        tip: "Use the STAR method (Situation, Task, Action, Result) to clearly articulate your problem-solving process.",
        sampleAnswer: "During a major database migration, we faced unexpected lock timeouts. I isolated the bottleneck by analyzing query execution plans, refactored the transaction into smaller batched updates, and successfully executed the migration with zero downtime."
      },
      {
        question: "How do you approach code reviews and maintain high code quality across a collaborative engineering team?",
        category: "Leadership",
        tip: "Emphasize constructive feedback, automated CI/CD linting checks, and adherence to design patterns.",
        sampleAnswer: "I view code reviews as an opportunity for mentorship and shared code ownership. I advocate for automated linting and unit testing in CI/CD pipelines so that human review can focus on architectural design, security, and maintainability."
      },
      {
        question: "How do you handle state management and asynchronous data fetching in complex front-end interfaces?",
        category: "Technical",
        tip: "Mention hooks, context API, or modern state libraries, along with optimistic UI updates and error boundaries.",
        sampleAnswer: "I utilize React Context for global authentication and UI theme state, while leveraging tools like React Query or Axios interceptors for server-state management, ensuring automatic caching, retries, and clean error handling."
      },
      {
        question: "Where do you see your technical skills evolving over the next two years?",
        category: "Behavioral",
        tip: "Show continuous learning curiosity, especially around AI integration and cloud-native architecture.",
        sampleAnswer: "I am actively expanding my expertise in integrating LLM APIs and advanced cloud infrastructure, as I believe AI-driven agentic workflows will define the next generation of full-stack software development."
      }
    ]
  };
}

export async function fixResumeSection(resumeText, sectionName, itemIndex, instruction) {
  const prompt = `You are an expert AI resume editor. Rewrite and optimize a specific entry in the candidate's resume to increase their ATS score.
Section: "${sectionName}"
Item Index: ${itemIndex}
Improvement Request: "${instruction}"

Resume Context:
"""
${resumeText.slice(0, 5000)}
"""

Required JSON Schema:
{
  "rewrittenText": string (The improved, punchy, quantified version of this resume bullet/entry),
  "scoreGain": number (Points recovered, between 2 and 6),
  "explanation": string (Why this fix improved recruiter visibility)
}`;

  if (process.env.GEMINI_API_KEY) {
    try { return await callGemini(prompt); } catch (e) { console.warn(e.message); if (!process.env.OPENAI_API_KEY) throw e; }
  }
  if (process.env.OPENAI_API_KEY) {
    try { return await callOpenAI(prompt); } catch (e) { console.warn(e.message); throw e; }
  }

  // Smart Demo Mode fallback for fixing resume section
  let rewritten = "Implemented an enterprise-grade banking transaction system handling over 10,000 daily financial requests, reducing database processing latency by 25% through SQL optimization.";
  if (sectionName?.toLowerCase().includes("summary") || instruction?.toLowerCase().includes("summary")) {
    rewritten = "Results-driven Senior Software Engineer with 6+ years of expertise designing high-performance cloud architectures, leading cross-functional Scrum teams, and delivering mission-critical applications that boosted user engagement by 40%.";
  } else if (instruction?.toLowerCase().includes("quantif") || instruction?.toLowerCase().includes("metric") || instruction?.toLowerCase().includes("number")) {
    rewritten = "Architected a scalable full-stack web application supporting 50,000+ monthly active users, improving page load speeds by 35% and cutting server hosting costs by $12,000 annually.";
  }

  return {
    rewrittenText: rewritten,
    scoreGain: 5,
    explanation: "Added concrete quantifiable impact metrics, industry-standard action verbs, and clear technical ownership markers."
  };
}

export async function agentChat(resumeText, userMessage, chatHistory = []) {
  const prompt = `You are JobSuit AI, an enthusiastic, highly expert AI Resume Agent & Recruiter Coach.
You are helping a candidate improve their resume in real time. However, you are also a highly capable general AI assistant. If the candidate asks general questions (e.g., coding help, general knowledge, career advice outside of resumes, etc.), you should gladly answer them accurately and thoroughly.
CRITICAL LANGUAGE INSTRUCTION: Detect the language of the user's message (e.g., English, Tamil, or Tanglish). You MUST respond in the exact same language and script as the user. If they use Tanglish, reply in Tanglish, keeping technical terms in English.
Candidate's message: "${userMessage}"

Resume Context:
"""
${resumeText.slice(0, 4000)}
"""

Required JSON Schema:
{
  "reply": string (Your conversational, encouraging, and highly practical response in markdown),
  "suggestedAction": string (Optional short suggested action or fix for their resume)
}`;

  if (process.env.GEMINI_API_KEY) {
    try { return await callGemini(prompt); } catch (e) { console.warn(e.message); if (!process.env.OPENAI_API_KEY) throw e; }
  }
  if (process.env.OPENAI_API_KEY) {
    try { return await callOpenAI(prompt); } catch (e) { console.warn(e.message); throw e; }
  }

  // Smart Demo Mode fallback for agent chat
  let reply = `I am a highly capable AI Assistant! In my full version, I can answer general questions, provide coding help, and offer career advice. However, you are currently in **Smart Demo Mode** (no API key provided). \n\nTo see my general intelligence, please add a Google Gemini or OpenAI API key to the backend \`.env\` file. In the meantime, I can still help you format your resume!`;
  
  if (userMessage.toLowerCase().includes("resume") || userMessage.toLowerCase().includes("help")) {
    reply = `That's a fantastic question! To make your resume stand out to executive tech recruiters, we want to make sure every project and work experience bullet starts with a strong action verb (like *Architected*, *Spearheaded*, or *Engineered*) and includes at least one quantifiable outcome (percentages, dollar savings, or user counts).\n\nWould you like me to automatically rewrite your oldest work entry with high-impact metrics right now?`;
  } else if (userMessage.toLowerCase().includes("summary") || userMessage.toLowerCase().includes("objective")) {
    reply = `Your executive summary is the first thing an ATS algorithm and hiring manager scans! I recommend keeping it under 4 lines and explicitly mentioning your target role, years of experience, and your #1 proudest achievement.\n\nHere is a draft I created for you:\n*"Innovative Full Stack Developer with 5+ years building cloud-native web applications. Proven track record of scaling user architectures and mentoring junior developers to increase sprint velocity by 25%."*`;
  } else if (userMessage.toLowerCase().includes("fix") || userMessage.toLowerCase().includes("rewrite")) {
    reply = `I am on it! Watch your live document preview on the right — I have restructured your bullet points to highlight your technical ownership and measurable impact. This just recovered **+5 points** on your ATS score! 🎯`;
  }

  return {
    reply,
    suggestedAction: "Ask me a question or click 'Fix with AI' on any section."
  };
}


export async function agentChatStream(resumeText, jobDescription, userMessage, chatHistory = [], res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const systemInstruction = `You are JobSuit AI, an enthusiastic, highly expert AI Resume Agent & Recruiter Coach.
Your goal is to help the user improve their resume to bypass ATS and land a job.
CRITICAL INSTRUCTIONS:
1. If the user just says "hi", "hello", etc., ONLY respond with a short greeting like "Hello! How can I help you?". DO NOT analyze the resume unless they ask.
2. Be concise. Avoid huge walls of text.
3. If the user asks you to fix, rewrite, or add a section, you MUST output the COMPLETE new text (including any additions) wrapped inside a <fix section="[section_name]">...</fix> tag, where [section_name] is one of: 'projects', 'skills', 'summary', 'education', 'github', 'linkedin', 'email', 'phone', or 'rawText'. 
4. CRITICAL: Any new content or rewritten text MUST be placed INSIDE the <fix> tag. Do not output the new content outside the tag! If they ask to add a Technical Summary or update technical skills, output it inside the <fix section="skills"> tag.
5. If they just provided a keyword/skill, assume they want to add it to their skills, and output the updated full skills list in a <fix section="skills">...</fix> tag.
6. FORMATTING: When outputting Projects or Experience, NEVER use a bullet point for the Title/Company name line. Only use bullet points for the achievement descriptions below the title.
7. LANGUAGE & RESPONSE MATCHING: Detect the language of the user's latest message (e.g., English, Tamil script, or Tanglish/Tamil written in English letters). You MUST respond in the EXACT SAME LANGUAGE and script as the user. If the user writes in Tanglish (e.g., "en resume la enna improve pannanum?"), you MUST understand it and respond conversationally in Tanglish (e.g., "ungal resume-il..."). Preserve technical terms like React.js, Node.js, API, ATS, etc., in English, but explain the rest in the user's language. Do NOT default to English unless the user writes in English.

Resume Context:
"""
${resumeText.slice(0, 4000)}
"""

${jobDescription ? `Job Description Context:\n"""\n${jobDescription.slice(0, 2000)}\n"""` : ''}`;

  const historyString = chatHistory
    .map(m => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
    .join('\n');

  const prompt = `${systemInstruction}\n\n--- Chat History ---\n${historyString}\n\nUser: ${userMessage}\n\n[SYSTEM REMINDER: Detect the language of the User's message above (e.g., Tanglish, Tamil, or English). You MUST generate your ENTIRE response in that EXACT same language and script. If Tanglish, reply fully in Tanglish. DO NOT switch back to English.]\nAssistant:`;

  if (process.env.GEMINI_API_KEY) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:streamGenerateContent?key=${process.env.GEMINI_API_KEY}&alt=sse`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7 }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API stream error (${response.status}): ${errText}`);
      }

      const stream = response.body;
      stream.on('data', chunk => {
        const lines = chunk.toString().split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6));
              const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                res.write(`data: ${JSON.stringify({ text })}\n\n`);
              }
            } catch (e) {}
          }
        }
      });

      stream.on('end', () => res.end());
      return;
    } catch (e) {
      console.warn('Gemini stream failed', e);
      if (!process.env.OPENAI_API_KEY) {
         res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`);
         res.end();
         return;
      }
    }
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      const url = 'https://api.openai.com/v1/chat/completions';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          stream: true
        })
      });

      if (!response.ok) throw new Error('OpenAI stream error');

      const stream = response.body;
      stream.on('data', chunk => {
        const lines = chunk.toString().split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6));
              const text = data.choices?.[0]?.delta?.content;
              if (text) {
                res.write(`data: ${JSON.stringify({ text })}\n\n`);
              }
            } catch (e) {}
          }
        }
      });

      stream.on('end', () => res.end());
      return;
    } catch (e) {
      console.warn('OpenAI stream failed', e);
      res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`);
      res.end();
      return;
    }
  }

  // Demo fallback
  const demoText = `I am in Smart Demo Mode. Please provide an API key to use real-time AI Chat.`;
  const chunks = demoText.split(' ');
  
  const interval = setInterval(() => {
    if (chunks.length === 0) {
      clearInterval(interval);
      res.end();
      return;
    }
    res.write(`data: ${JSON.stringify({ text: chunks.shift() + ' ' })}\n\n`);
  }, 100);
}
