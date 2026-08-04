import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
let genAI = null;

if (API_KEY && API_KEY !== 'your_api_key_here') {
  genAI = new GoogleGenerativeAI(API_KEY);
}

export const aiService = {
  chatWithResumeAgent: async (message, resumeContext, chatHistory) => {
    if (!genAI) {
      return await mockSimulateChat(message, resumeContext, chatHistory);
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
      
      const systemPrompt = `You are an expert AI Resume Assistant.
Your goal is to help the user improve their resume to bypass ATS and land a job.
CRITICAL INSTRUCTIONS:
1. If the user just says "hi", "hello", etc., ONLY respond with a short greeting like "Hello! How can I help you?". DO NOT analyze the resume unless they ask.
2. Be concise. Avoid huge walls of text.
3. If the user asks you to fix, rewrite, or add a section, you MUST output the COMPLETE new text (including any additions) wrapped inside a <fix section="[section_name]">...</fix> tag, where [section_name] is one of: 'projects', 'skills', 'summary', or 'rawText'. 
4. CRITICAL: Any new content or rewritten text MUST be placed INSIDE the <fix> tag. Do not output the new content outside the tag! If they ask to add a Technical Summary, append it to the summary inside the <fix section="summary"> tag.
5. If they just provided a keyword/skill, assume they want to add it to their skills, and output the updated full skills list in a <fix section="skills">...</fix> tag.
Example: "I have added that keyword to your skills:\n<fix section="skills">Python, System Design, React</fix>"

Context of user's resume:
${JSON.stringify(resumeContext, null, 2)}`;

      // Construct history string
      const historyString = chatHistory
        .map(m => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
        .join('\n');

      const fullPrompt = `${systemPrompt}\n\n--- Chat History ---\n${historyString}\n\nUser: ${message}\nAssistant:`;
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      let text = response.text();

      // Extract <fix> tag if present
      let proposedFix = null;
      const fixMatch = text.match(/<fix\s+section="([^"]+)">([\s\S]*?)<\/fix>/i);
      if (fixMatch) {
        proposedFix = {
          section: fixMatch[1],
          content: fixMatch[2].trim()
        };
        // Remove the <fix> tag from the text displayed to the user
        text = text.replace(fixMatch[0], '').trim();
      }

      return {
        reply: text,
        proposedFix: proposedFix
      };
    } catch (error) {
      console.error("Gemini API Error, falling back to mock:", error);
      return await mockSimulateChat(message, resumeContext, chatHistory);
    }
  },
  
  chatWithCoverLetterAgent: async (message, coverLetterContext, chatHistory) => {
    if (!genAI) {
      return await mockSimulateCoverLetterChat(message, coverLetterContext);
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
      
      const systemPrompt = `You are an expert AI Resume Assistant.
Your goal is to help the user improve their cover letter to stand out to employers.
CRITICAL INSTRUCTIONS:
1. If the user just says "hi", "hello", etc., ONLY respond with a short greeting. DO NOT analyze the document unless they ask.
2. Be concise. Avoid huge walls of text. Use markdown formatting like **bold** for emphasis.
3. If the user asks you to fix or rewrite the cover letter, or part of it, output the entire rewritten cover letter wrapped inside a <fix section="cover_letter">...</fix> tag.
4. IMPORTANT: When using the <fix> tag, you MUST include the ENTIRE cover letter from top to bottom, including the header (Name, Address, Date, etc.) and footer (Sincerely, [Name]). NEVER omit the header, contact info, or sign-off.
5. Try to keep formatting plain text or HTML.

Context of user's cover letter:
${coverLetterContext}`;

      const historyString = chatHistory
        .map(m => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
        .join('\n');

      const fullPrompt = `${systemPrompt}\n\n--- Chat History ---\n${historyString}\n\nUser: ${message}\nAssistant:`;
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      let text = response.text();

      let proposedFix = null;
      const fixMatch = text.match(/<fix\s+section="([^"]+)">([\s\S]*?)<\/fix>/i);
      if (fixMatch) {
        proposedFix = {
          section: fixMatch[1],
          content: fixMatch[2].trim()
        };
        text = text.replace(fixMatch[0], '').trim();
      }

      return {
        reply: text,
        proposedFix: proposedFix
      };
    } catch (error) {
      console.error("Gemini API Error, falling back to mock:", error);
      return await mockSimulateCoverLetterChat(message, coverLetterContext);
    }
  }
};

const mockSimulateChat = async (message, resumeContext, chatHistory = []) => {
  await new Promise(r => setTimeout(r, 1200)); // Simulate human typing delay
  const lowerMsg = message.toLowerCase();
  
  if (['hi', 'hello', 'hey', 'greetings', 'helloi'].some(g => lowerMsg.includes(g))) {
    return {
      reply: `Hello, how can I help you?`
    };
  }
  
  if (lowerMsg.includes('score') || lowerMsg.includes('ats') || lowerMsg.includes('analyze')) {
    return {
      reply: `So I ran your resume through our ATS scanner, and honestly, you're sitting at about ${resumeContext?.atsScore || 41}/100. Don't worry though! The main thing holding you back right now is just a lack of specific keywords and some missing metrics in your experience section. \n\nIf we fix those, you'll easily jump past the filters. Want me to show you exactly what to add?`
    };
  }
  
  if (lowerMsg.includes('skill') || lowerMsg.includes('keyword') || lowerMsg.includes('what to add') || lowerMsg.includes('which keywords')) {
    const missing = resumeContext?.missingSkills?.length > 0 ? resumeContext.missingSkills.join(', ') : 'React, Node.js, AWS';
    return {
      reply: `For the types of roles you're targeting, recruiters are absolutely looking for: **${missing}**.\n\nSince they aren't explicitly mentioned, an ATS system might accidentally filter you out. If you have experience with any of these, we definitely need to weave them into your bullet points! Have you worked with any of them?`
    };
  }
  
  if (lowerMsg.includes('what did you notice') || lowerMsg.includes('yes, let')) {
    return {
      reply: `Well, looking at your experience, you've got some great foundational projects! But ATS systems are very picky—they want to see specific tools and measurable results. \n\nFor example, we could inject some of your missing keywords or completely rewrite a bullet point to sound much stronger. What sounds better to you?`
    };
  }

  if (lowerMsg.includes('summary') || lowerMsg.includes('objective')) {
    return {
      reply: `Your executive summary is the first thing an ATS algorithm scans! I recommend keeping it under 4 lines and explicitly mentioning your target role, years of experience, and your #1 proudest achievement.\n\nHere is a draft I created for you:\n*"Innovative Full Stack Developer with 5+ years building cloud-native web applications.\nProven track record of scaling user architectures and mentoring junior developers.\nConsistently increased sprint velocity by 25% through clean code practices."*\n\nI have generated the button below so you can automatically update it!`,
      proposedFix: {
        section: 'summary',
        content: "Innovative Full Stack Developer with 5+ years building cloud-native web applications. Proven track record of scaling user architectures and mentoring junior developers. Consistently increased sprint velocity by 25% through clean code practices."
      }
    };
  }

  if (lowerMsg.includes('rewrite') || lowerMsg.includes('bullet')) {
    return {
      reply: `Awesome! Let's take your "Bank Transaction" project. Instead of just stating what you did, we can make it pop:\n\n*"Engineered an enterprise-grade banking transaction system, optimizing SQL queries to reduce processing latency by 20%."*\n\nIf you type **"Fix with AI"** or just say **"fix it"**, I can automatically update that for you in the editor!`
    };
  }
  
  if (lowerMsg.includes('look at keywords') || lowerMsg.includes('which keyword') || lowerMsg.includes('what to add')) {
    const missing = resumeContext?.missingSkills?.length > 0 ? resumeContext.missingSkills.join(', ') : 'React, Node.js, AWS';
    return {
      reply: `Right now, the top things missing that recruiters want for this role are: **${missing}**.\n\nAdding these into a 'Technical Skills' section or weaving them naturally into your project descriptions will instantly jump your ATS score. Want me to help you rewrite a section to include them?`
    };
  }

  if (lowerMsg === 'fix' || lowerMsg.includes('fix with ai') || lowerMsg.includes('apply') || lowerMsg.includes('fix it') || lowerMsg.includes('fix this')) {
    
    // If the user clicked a formatting suggestion
    if (lowerMsg.includes('format') || lowerMsg.includes('space') || lowerMsg.includes('heading') || lowerMsg.includes('font')) {
      return {
        reply: `I can help you with that! Click the button below to apply the fix to your resume.`,
        proposedFix: {
          section: 'formatting',
          content: `/* Formatting Update Applied by AI */\n.a4-print-container h1, .a4-print-container h2, .a4-print-container h3 { line-height: 1.3 !important; letter-spacing: 0.5px !important; }\n.a4-print-container { font-size: 14.5px !important; }\n.a4-print-container ul { padding-left: 24px !important; }\n.a4-print-container li { margin-bottom: 6px !important; }`
        }
      };
    }

    // If the user clicked a project/experience suggestion
    if (lowerMsg.includes('verb') || lowerMsg.includes('quantify') || lowerMsg.includes('bullet') || lowerMsg.includes('experience')) {
      return {
        reply: `I can help you with that! Click the button below to apply the fix to your resume.`,
        proposedFix: {
          section: 'project',
          content: `New Company (Software Engineer) — Student Management System\n• Optimized system performance using HTML, CSS, JavaScript, improving API response time by 35%\n• Spearheaded development of a scalable backend architecture\n• Reduced database query latency by 20% through efficient indexing`
        }
      };
    }

    // Default mock response for summary
    const lastAssistantMessage = chatHistory.slice().reverse().find(m => m.sender === 'assistant' || m.sender === 'bot')?.text || '';
    
    if (lastAssistantMessage.includes('Innovative Full Stack Developer') || lowerMsg.includes('summary')) {
      return {
        reply: `✨ Done! I've automatically updated your Executive Summary. Look at your live document preview on the right!`,
        proposedFix: {
          section: 'summary',
          content: `Innovative Full Stack Developer with 5+ years building cloud-native web applications. Proven track record of scaling user architectures and mentoring junior developers to increase sprint velocity by 25%.`
        },
        autoApply: true
      };
    }

    let rewrittenExperience = `Bank Transaction (Project) — Engineered an enterprise-grade banking transaction system, optimizing SQL queries to reduce processing latency by 20%.`;
    if (resumeContext?.experience) {
      // Keep the rest of the experience, just prepend the rewritten part for demo purposes
      rewrittenExperience = `${rewrittenExperience}\n\n${resumeContext.experience}`;
    } else if (resumeContext?.experienceList && resumeContext.experienceList.length > 0) {
      const exp = resumeContext.experienceList[0];
      const rest = exp.bullets ? exp.bullets : '';
      rewrittenExperience = `${rewrittenExperience}\n\n${rest}`;
    }

    return {
      reply: `✨ Done! I've automatically applied the new optimized bullet point to your 'Work & Project Experience' section. Look at your live document preview on the right!`,
      proposedFix: {
        section: 'projects',
        content: rewrittenExperience
      },
      autoApply: true
    };
  }

  if (lowerMsg.includes('how are you')) {
    return {
      reply: `I'm doing great, thanks for asking! 😊 I've just been reviewing resumes all day. It's super rewarding when we finally get a resume looking perfect. Ready to work on yours?`
    };
  }

  // Fallback for conversational flow
  return {
    reply: `I completely agree! It's super important to get these details right. I'd love to help you rewrite a few bullet points to make them sound more impactful, or we could look at adding some missing keywords. What sounds better to you right now?`
  };
};

const mockSimulateCoverLetterChat = async (message, coverLetterContext) => {
  await new Promise(r => setTimeout(r, 1200));
  const lowerMsg = message.toLowerCase();
  
  if (['hi', 'hello', 'hey'].some(g => lowerMsg.includes(g))) {
    return { reply: `Hello, how can I help you with your cover letter?` };
  }
  
  if (lowerMsg.includes('compelling') || lowerMsg.includes('professional') || lowerMsg.includes('improve') || lowerMsg.includes('grab attention') || lowerMsg.includes('rewrite') || lowerMsg.includes('fix')) {
    return {
      reply: `I have analyzed your cover letter. I've rewritten the opening paragraph to be more impactful and added some placeholders for specific metrics. How does this look?`,
      proposedFix: {
        section: 'cover_letter',
        content: `[Your Name]\n\n[Position Title]\n\n[Your Address]\n\n[Your Email]\n\n[Your Phone]\n\nJuly 31, 2026\n\n[Hiring Manager Name]\n\n[Company Name]\n\nDear Hiring Manager,\n\nI am writing to express my strong interest in the role at your company. With a proven track record of delivering high-quality results and a passion for innovation, I am confident in my ability to contribute effectively to your team's success.\n\nIn my previous role, I successfully drove key initiatives that resulted in a 30% improvement in overall efficiency. This experience has equipped me with the skills necessary to hit the ground running. I am particularly drawn to your organization because of its commitment to excellence.\n\nI would welcome the opportunity to discuss how my background and skills will be beneficial to your team. Please find my resume attached for your review.\n\nThank you for your time and consideration.\n\nSincerely,\n<b>[Your Name]</b>`
      }
    };
  }

  return {
    reply: `I can help you make your cover letter more compelling, improve the opening paragraph, or add specific achievements. Let me know what you'd like to do! Or just ask me to rewrite it.`
  };
};
