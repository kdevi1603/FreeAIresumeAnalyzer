const text = `B.Com — Palaniyammal Arts College For Women (2021) | 88% HSC — Government Higher Secondary School (2018) | 81% SSLC — Government Higher Secondary School (2016) | 92% TECHNICAL SKILLS 8 TOOLS C, C++, Java, Oracle, SQL Server, MS Office, HTML, Tally, Python, Operating Systems, Agile Methodology, Git/GitHub WORK & PROJECT EXPERIENCE Bank Transaction Systems (Software Developer Intern) — « Engineered`;

const sectionHeaders = [
    { key: 'experience', patterns: [/(?:^|\n)\s*(?:professional\s+experience|work\s+experience|employment\s+history|experience)\s*[:\n]/i, /\b(?:work\s*(?:&|8)\s*project\s+experience|projects\s*(?:&|8)\s*experience)\b/i] },
    { key: 'education', patterns: [/(?:^|\n)\s*(?:educational\s+qualification|academic\s+details|academic\s+background|education)\s*[:\n]/i, /\b(?:education\s*(?:&|8)\s*academic\s*details)\b/i] },
    { key: 'skills', patterns: [/(?:^|\n)\s*(?:technical\s+skills|core\s+competencies|key\s+skills|skills\s*(?:&|8)\s*tools|technical\s+qualification|skills)\s*[:\n]/i, /\b(?:technical\s+skills\s*(?:&|8)\s*tools)\b/i] },
];

const sectionPositions = [];

for (const sec of sectionHeaders) {
    for (const pat of sec.patterns) {
        const regex = new RegExp(pat.source, pat.flags + (pat.flags.includes('g') ? '' : 'g'));
        const matches = [...text.matchAll(regex)];
        for (const match of matches) {
            sectionPositions.push({ key: sec.key, idx: match.index, len: match[0].length });
        }
    }
}

sectionPositions.sort((a, b) => a.idx - b.idx);
console.log(sectionPositions);

const uniquePositions = [];
for (const pos of sectionPositions) {
    if (!uniquePositions.find(p => Math.abs(p.idx - pos.idx) < 5)) {
        uniquePositions.push(pos);
    }
}

const getSectionText = (key, maxLen = 1200) => {
    const poses = uniquePositions.filter(s => s.key === key);
    if (poses.length === 0) return '';
    let secText = '';
    for (const pos of poses) {
        const nextPos = uniquePositions.find(s => s.idx > pos.idx);
        const start = pos.idx + pos.len;
        const end = nextPos ? nextPos.idx : Math.min(start + maxLen, text.length);
        const chunk = text.substring(start, end).replace(/^[\s:|-]+/, '').trim();
        if (chunk) secText += chunk + '\n\n';
    }
    return secText.trim().substring(0, maxLen);
};

console.log('--- EXPERIENCE ---');
console.log(getSectionText('experience', 600));

console.log('--- SKILLS ---');
console.log(getSectionText('skills', 400));
