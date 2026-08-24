
function validateTanglish(text) {
  const allowedTerms = ['resume', 'ats', 'api', 'react', 'node.js', 'python', 'sql', 'mysql', 'javascript', 'html', 'css', 'flask', 'gemini', 'pdf', 'word', 'rest', 'json', 'ui', 'ux', 'ai', 'mern'];
  let cleanText = text.toLowerCase();
  
  let technicalTermsRemoved = [];
  allowedTerms.forEach(term => {
    if (cleanText.includes(term)) {
       technicalTermsRemoved.push(term);
       cleanText = cleanText.split(term).join('');
    }
  });
  cleanText = cleanText.replace(/<[^>]*>/g, '');
  
  const latinMatch = cleanText.match(/[a-z]/g);
  const latinCount = latinMatch ? latinMatch.length : 0;
  
  const tamilMatch = text.match(/[\u0B80-\u0BFF]/g);
  const tamilCount = tamilMatch ? tamilMatch.length : 0;
  
  let isTanglish = false;
  if (cleanText.trim().length > 5) {
    if (tamilCount === 0 && latinCount > 5) isTanglish = true;
    if (latinCount > 15 && latinCount > tamilCount * 2) isTanglish = true;
  }
  
  return { isTanglish, tamilCount, latinCount, technicalTermsRemoved };
}

const tests = [
  'Vanakkam! Ungal resume-ku improvements panna',
  '?????? resume-? ??????????????',
  'React.js ??????? Node.js ??????????? resume-? ??????????????',
  'Unga resume-la React.js and Node.js use pannalam',
  'Hello! You can improve your resume with React.js and Node.js.'
];

tests.forEach((t, i) => {
  console.log('Test ' + (i+1) + ': ' + t);
  console.log(validateTanglish(t));
});

