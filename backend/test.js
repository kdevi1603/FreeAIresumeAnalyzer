import mongoose from 'mongoose';
import { analyzeResume } from './services/aiService.js';

mongoose.connect('mongodb+srv://thulasidevi9843_db_user:Thulasi%40123@cluster0.jwxsrkn.mongodb.net/freeairesume?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => mongoose.connection.db.collection('resumes').findOne({}, {sort: {createdAt: -1}}))
  .then(async r => { 
    const result = await analyzeResume(r.rawText); 
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch(e => console.error(e));
