import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY;

async function testAll() {
  const urlBase = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  const body = JSON.stringify({ contents: [{ parts: [{ text: 'hi' }] }] });

  console.log("=== TEST 1: ?key= ===");
  try {
    const r1 = await fetch(`${urlBase}?key=${key}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    console.log(r1.status, await r1.text());
  } catch(e) { console.error(e.message); }

  console.log("\n=== TEST 2: x-goog-api-key header ===");
  try {
    const r2 = await fetch(urlBase, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key }, body });
    console.log(r2.status, await r2.text());
  } catch(e) { console.error(e.message); }

  console.log("\n=== TEST 3: Authorization: Bearer ===");
  try {
    const r3 = await fetch(urlBase, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` }, body });
    console.log(r3.status, await r3.text());
  } catch(e) { console.error(e.message); }
}

await testAll();
