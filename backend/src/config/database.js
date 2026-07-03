const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    await createIndexes();
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    const Recipe = mongoose.model('Recipe');
    await Recipe.collection.createIndex({ title: 'text', 'ingredients.name': 'text' });
    await Recipe.collection.createIndex({ category: 1 });
    await Recipe.collection.createIndex({ createdAt: -1 });
    
    const User = mongoose.model('User');
    await User.collection.createIndex({ email: 1 }, { unique: true });
    
    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('⚠️ Index creation warning:', error.message);
  }
};

module.exports = connectDB;