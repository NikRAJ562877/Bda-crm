
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User'); // adjust path as needed

async function run() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Remove old admin if it exists
  await User.deleteMany({ username: 'admin' });

  // Create new admin — **plain text** password!
  const admin = new User({
    username: 'admin',
    password: 'admin123',  // ← Mongoose will hash this once via pre('save')
    role: 'admin',
  });

  await admin.save();
  console.log('✅ Admin user created (single hash)!');

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('❌ Seed error:', err);
  mongoose.disconnect();
});
