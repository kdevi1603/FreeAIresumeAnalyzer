import { agentChatStream } from './services/aiService.js';
import dotenv from 'dotenv';
dotenv.config();

class MockResponse {
  constructor() {
    this.headersSent = false;
    this.sseEventsSent = 0;
    this.finalText = '';
  }
  setHeader(key, value) {}
  flushHeaders() {}
  write(data) {
    this.sseEventsSent++;
    try {
       const parsed = JSON.parse(data.replace('data: ', '').trim());
       if (parsed.text) this.finalText += parsed.text;
    } catch(e) {}
  }
  end() {}
}

async function runTest(message, chatHistory) {
  console.log(`\n======================================================`);
  console.log(`TESTING INPUT: "${message}"`);
  console.log(`======================================================`);
  const res = new MockResponse();
  const textToUse = "Sample resume text with software engineering skills, python, java, react.";
  const jobDescription = "";
  const requestId = 'req_' + Math.random().toString(36).substr(2, 9);
  
  await agentChatStream(textToUse, jobDescription, message, chatHistory, res, requestId);
}

async function runAll() {
  const history1 = [
    { sender: 'bot', text: 'Hello, I\'m your AI Resume Assistant. How can I help you?' }
  ];
  await runTest("hi", history1);
  
  await new Promise(r => setTimeout(r, 2000));
  
  const history2 = [
    { sender: 'bot', text: 'Hello, I\'m your AI Resume Assistant. How can I help you?' },
    { sender: 'user', text: 'hi' },
    { sender: 'bot', text: 'Hello! How can I help you?' }
  ];
  await runTest("How can I improve my resume?", history2);
}

runAll();
