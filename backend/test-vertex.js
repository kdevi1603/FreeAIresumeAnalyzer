import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY;

async function testVertex() {
  const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/YOUR_PROJECT_ID/locations/us-central1/publishers/google/models/gemini-1.5-flash:streamGenerateContent`;
  console.log("=== TEST Vertex AI ===");
  try {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` }, body: JSON.stringify({ contents: [{ parts: [{ text: 'hi' }] }] }) });
    console.log(r.status, await r.text());
  } catch(e) { console.error(e.message); }
}

await testVertex();
