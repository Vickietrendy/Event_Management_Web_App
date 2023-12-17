// scripts/initializeDB.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

async function initializeDB() {
  try {
    // Connect to the MongoDB database
    await mongoose.connect('mongodb://127.0.0.1:27017/myapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing users
    await User.deleteMany();

    // Create alumni managers and alumni
    // Create alumni managers
    const alumniManager1 = new User({
        username: 'manager1',
        password: await bcrypt.hash('password123', 10),
        role: 'alumni_manager',
      });
  
      const alumniManager2 = new User({
        username: 'manager2',
        password: await bcrypt.hash('password456', 10),
        role: 'alumni_manager',
      });
  
      // Create alumni
      const alumni1 = new User({
        username: 'alumni1',
        password: await bcrypt.hash('pass123', 10),
        role: 'alumni',
      });
  
      const alumni2 = new User({
        username: 'alumni2',
        password: await bcrypt.hash('pass456', 10),
        role: 'alumni',
      });
  
      const alumni3 = new User({
        username: 'alumni3',
        password: await bcrypt.hash('pass789', 10),
        role: 'alumni',
      });

    // Save users to the database
    await Promise.all([
      alumniManager1.save(),
      alumniManager2.save(),
      alumni1.save(),
      alumni2.save(),
      alumni3.save(),
    ]);

    console.log('Database initialized with users.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

module.exports = initializeDB;
