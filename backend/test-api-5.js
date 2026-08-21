import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

async function testSDK2() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: 'Say hello!',
    });
    console.log("Success SDK2!");
    console.log(response.text);
  } catch (e) {
    console.error("SDK2 Error:");
    console.error(e.message);
  }
}

await testSDK2();
