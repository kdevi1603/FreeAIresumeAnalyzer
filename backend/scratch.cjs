const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://developer:FreeResumeMaker2025@cluster0.jwxsrkn.mongodb.net/FreeAIresumeAnalyzer?retryWrites=true&w=majority')
  .then(() => mongoose.connection.db.collection('resumes').findOne({}, {sort: {createdAt: -1}}))
  .then(r => { 
    console.log("=== RAW TEXT ===");
    console.log(r.rawText); 
    process.exit(0); 
  })
  .catch(e => console.error(e));
