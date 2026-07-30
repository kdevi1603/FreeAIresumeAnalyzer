import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
let genAI = null;

if (API_KEY && API_KEY !== 'your_api_key_here') {
  genAI = new GoogleGenerativeAI(API_KEY);
}

export const aiService = {
  chatWithResumeAgent: async (message, resumeContext, chatHistory) => {
    if (!genAI) {
      return await mockSimulateChat(message, resumeContext);
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
      
      const systemPrompt = `You are an expert AI Resume Assistant.
Your goal is to help the user improve their resume to bypass ATS and land a job.
CRITICAL INSTRUCTIONS:
1. If the user just says "hi", "hello", etc., ONLY respond with a short greeting like "Hello! How can I help you?". DO NOT analyze the resume unless they ask.
2. Be concise. Avoid huge walls of text.
3. If the user asks you to fix or rewrite a section, you MUST output the new rewritten text wrapped inside a <fix section="[section_name]">...</fix> tag, where [section_name] is one of: 'projects', 'skills', 'summary', or 'rawText'. 
Example: "Here is your rewritten project:\n<fix section="projects">New rewritten bullet point</fix>"

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
      console.error("Gemini API Error:", error);
      return {
        reply: `API Error: ${error.message || error.toString()}`,
        options: []
      };
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
      console.error("Gemini API Error:", error);
      return {
        reply: `API Error: ${error.message || error.toString()}`,
        options: []
      };
    }
  }
};

const mockSimulateChat = async (message, resumeContext) => {
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

  if (lowerMsg.includes('rewrite') || lowerMsg.includes('bullet')) {
    return {
      reply: `Awesome! Let's take your "Bank Transaction" project. Instead of just stating what you did, we can make it pop:\n\n*"Engineered an enterprise-grade banking transaction system, optimizing SQL queries to reduce processing latency by 20%."*\n\nIf you type **"Fix with AI"** or just say **"fix"**, I can automatically update that for you in the editor!`
    };
  }
  
  if (lowerMsg.includes('look at keywords') || lowerMsg.includes('which keyword') || lowerMsg.includes('what to add')) {
    const missing = resumeContext?.missingSkills?.length > 0 ? resumeContext.missingSkills.join(', ') : 'React, Node.js, AWS';
    return {
      reply: `Right now, the top things missing that recruiters want for this role are: **${missing}**.\n\nAdding these into a 'Technical Skills' section or weaving them naturally into your project descriptions will instantly jump your ATS score. Want me to help you rewrite a section to include them?`
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
        content: `Dear Hiring Manager,

I am writing to express my strong interest in the role at your company. With a proven track record of delivering high-quality results and a passion for innovation, I am confident in my ability to contribute effectively to your team's success. 

In my previous role, I successfully drove key initiatives that resulted in a 30% improvement in overall efficiency. This experience has equipped me with the skills necessary to hit the ground running. I am particularly drawn to your organization because of its commitment to excellence.

I would welcome the opportunity to discuss how my background and skills will be beneficial to your team. Please find my resume attached for your review.

Thank you for your time and consideration.

Sincerely,
[Your Name]`
      }
    };
  }

  return {
    reply: `I can help you make your cover letter more compelling, improve the opening paragraph, or add specific achievements. Let me know what you'd like to do! Or just ask me to rewrite it.`
  };
};
