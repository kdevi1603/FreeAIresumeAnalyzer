const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb+srv://thulasidevi9843_db_user:Thulasi%40123@cluster0.jwxsrkn.mongodb.net/freeairesume?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('elsha123', salt);
    await mongoose.connection.db.collection('users').updateOne({email: 'elsha@gmail.com'}, {$set: {password: hash}});
    console.log('Password reset successfully to: elsha123');
    process.exit(0);
  })
  .catch(console.error);
