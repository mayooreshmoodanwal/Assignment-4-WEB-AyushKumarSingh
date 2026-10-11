require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const provisionAdmin = async () => {
  const { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;

  if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_NAME) {
    console.error('Required env vars: MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log(`User ${ADMIN_EMAIL} promoted to admin`);
    } else {
      console.log(`Admin ${ADMIN_EMAIL} already exists`);
    }
  } else {
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
    });
    console.log(`Admin user created: ${ADMIN_EMAIL}`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

provisionAdmin().catch((err) => {
  console.error('Admin provisioning failed:', err.message);
  process.exit(1);
});
