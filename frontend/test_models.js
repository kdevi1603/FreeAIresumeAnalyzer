import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf8');
const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : null;

if (!apiKey) {
  console.log('No API key found');
  process.exit(1);
}

async function checkModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error fetching models:", err);
  }
}

checkModels();
