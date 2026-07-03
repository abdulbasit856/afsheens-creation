require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ Connection error:', err);
    process.exit(1);
  });

// Define User Schema directly (to avoid model issues)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

const fixAdmin = async () => {
  try {
    // Delete existing admin
    await User.deleteMany({ role: 'admin' });
    console.log('🗑️ Removed existing admin(s)');

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('Admin@123456', salt);
    
    // Create admin
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@afsheencreations.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    });

    console.log('\n✅ Admin created successfully!');
    console.log('📧 Email: admin@afsheencreations.com');
    console.log('🔑 Password: Admin@123456');
    console.log('📋 Role:', admin.role);
    console.log('🆔 ID:', admin._id);

    // Verify password works
    const verifyUser = await User.findOne({ email: 'admin@afsheencreations.com' });
    const isMatch = await bcrypt.compare('Admin@123456', verifyUser.password);
    console.log('✅ Password verification:', isMatch ? 'PASSED ✅' : 'FAILED ❌');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixAdmin();