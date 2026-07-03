require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../src/models/User');
const Recipe = require('../src/models/Recipe');

const sampleRecipes = [
  {
    title: 'Chicken Biryani',
    description: 'Aromatic and flavorful Pakistani rice dish with tender chicken pieces. A complete meal that\'s perfect for special occasions.',
    ingredients: [
      { name: 'Chicken', quantity: '1', unit: 'kg' },
      { name: 'Basmati Rice', quantity: '2', unit: 'cups' },
      { name: 'Onions', quantity: '2', unit: 'large', note: 'sliced' },
      { name: 'Yogurt', quantity: '1', unit: 'cup' },
      { name: 'Biryani Masala', quantity: '2', unit: 'tbsp' },
      { name: 'Garlic Ginger Paste', quantity: '1', unit: 'tbsp' },
    ],
    instructions: [
      'Marinate chicken with yogurt, biryani masala, and garlic-ginger paste for 2 hours.',
      'Cook sliced onions until golden brown and crispy.',
      'In a large pot, layer half the rice, then the chicken mixture, then the remaining rice.',
      'Cover and cook on low heat for 30-35 minutes until rice is tender.',
      'Serve hot with raita and salad.',
    ],
    category: 'Pakistani',
    tags: ['spicy', 'traditional', 'rice', 'chicken'],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    prepTime: 30,
    cookTime: 45,
    servings: 4,
    difficulty: 'Hard',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&h=600&fit=crop',
  },
  {
    title: 'Arabic Hummus',
    description: 'Creamy and delicious Middle Eastern chickpea dip. Perfect with pita bread or vegetables.',
    ingredients: [
      { name: 'Chickpeas', quantity: '2', unit: 'cups', note: 'canned, drained' },
      { name: 'Tahini', quantity: '1/4', unit: 'cup' },
      { name: 'Lemon Juice', quantity: '2', unit: 'tbsp' },
      { name: 'Garlic', quantity: '2', unit: 'cloves' },
      { name: 'Olive Oil', quantity: '1/4', unit: 'cup' },
    ],
    instructions: [
      'Drain and rinse chickpeas thoroughly.',
      'In a food processor, combine chickpeas, tahini, lemon juice, and garlic.',
      'Blend until smooth, adding water as needed.',
      'Transfer to a serving bowl and drizzle with olive oil.',
      'Serve with warm pita bread.',
    ],
    category: 'Arabic',
    tags: ['vegetarian', 'healthy', 'dip', 'vegan'],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    prepTime: 10,
    cookTime: 0,
    servings: 6,
    difficulty: 'Easy',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=800&h=600&fit=crop',
  },
  {
    title: 'Chicken Tikka Masala',
    description: 'A popular Indian dish with tender chicken in a rich, creamy, and flavorful tomato-based sauce.',
    ingredients: [
      { name: 'Chicken Breast', quantity: '500', unit: 'g', note: 'cubed' },
      { name: 'Yogurt', quantity: '1', unit: 'cup' },
      { name: 'Tomato Puree', quantity: '2', unit: 'cups' },
      { name: 'Heavy Cream', quantity: '1/2', unit: 'cup' },
      { name: 'Onion', quantity: '1', unit: 'large', note: 'finely chopped' },
      { name: 'Garlic', quantity: '4', unit: 'cloves', note: 'minced' },
    ],
    instructions: [
      'Marinate chicken in yogurt, half the garam masala, and turmeric for 2 hours.',
      'In a large pan, sauté onions until golden. Add garlic and ginger.',
      'Add tomato puree and cook for 5 minutes until oil separates.',
      'Add remaining spices and cook for 2 minutes.',
      'Add marinated chicken and cook until browned.',
      'Pour in cream and simmer for 15 minutes until chicken is cooked through.',
    ],
    category: 'Indian',
    tags: ['chicken', 'curry', 'creamy', 'spicy'],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    prepTime: 20,
    cookTime: 35,
    servings: 4,
    difficulty: 'Medium',
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop',
  },
  {
    title: 'Gulab Jamun',
    description: 'Classic Indian dessert - soft, spongy milk balls soaked in rose-flavored sugar syrup.',
    ingredients: [
      { name: 'Milk Powder', quantity: '1', unit: 'cup' },
      { name: 'All-Purpose Flour', quantity: '1/4', unit: 'cup' },
      { name: 'Baking Soda', quantity: '1/4', unit: 'tsp' },
      { name: 'Milk', quantity: '1/2', unit: 'cup' },
      { name: 'Sugar', quantity: '2', unit: 'cups' },
      { name: 'Water', quantity: '2', unit: 'cups' },
    ],
    instructions: [
      'Mix milk powder, flour, and baking soda. Add milk to form a soft dough.',
      'Rest the dough for 10 minutes, then divide into small balls.',
      'In a deep pan, heat oil for frying on medium-low heat.',
      'Fry the balls until golden brown, turning gently.',
      'Make syrup by boiling sugar and water.',
      'Soak fried balls in warm syrup for 2-3 hours.',
    ],
    category: 'Dessert',
    tags: ['sweet', 'traditional', 'dessert', 'indian'],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    prepTime: 25,
    cookTime: 20,
    servings: 8,
    difficulty: 'Medium',
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1589118949242-8a2c0a0b4f5a?w=800&h=600&fit=crop',
  },
  {
    title: 'Falafel',
    description: 'Crispy, golden-brown chickpea patties. A Middle Eastern street food favorite.',
    ingredients: [
      { name: 'Dried Chickpeas', quantity: '2', unit: 'cups', note: 'soaked overnight' },
      { name: 'Onion', quantity: '1', unit: 'large', note: 'roughly chopped' },
      { name: 'Parsley', quantity: '1/2', unit: 'cup', note: 'fresh' },
      { name: 'Garlic', quantity: '4', unit: 'cloves' },
      { name: 'Cumin', quantity: '2', unit: 'tsp' },
    ],
    instructions: [
      'Drain soaked chickpeas thoroughly and pat dry.',
      'In a food processor, pulse chickpeas, onion, herbs, and garlic.',
      'Add spices, baking powder, salt, and pepper. Pulse to combine.',
      'Chill mixture for 1 hour to firm up.',
      'Shape into small patties or balls.',
      'Deep fry in hot oil until golden and crispy.',
    ],
    category: 'Arabic',
    tags: ['vegetarian', 'vegan', 'street food'],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    prepTime: 20,
    cookTime: 15,
    servings: 6,
    difficulty: 'Medium',
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1593005510484-3e54da3b3b2f?w=800&h=600&fit=crop',
  },
  {
    title: 'Mango Lassi',
    description: 'A refreshing and creamy yogurt-based drink with sweet mangoes. Perfect for hot summer days.',
    ingredients: [
      { name: 'Mango', quantity: '2', unit: 'large', note: 'ripe, peeled' },
      { name: 'Yogurt', quantity: '2', unit: 'cups', note: 'plain, thick' },
      { name: 'Milk', quantity: '1/2', unit: 'cup' },
      { name: 'Sugar', quantity: '2', unit: 'tbsp' },
      { name: 'Cardamom Powder', quantity: '1/4', unit: 'tsp' },
    ],
    instructions: [
      'Combine all ingredients in a blender.',
      'Blend until smooth and creamy.',
      'Pour into glasses and serve immediately.',
      'Garnish with a sprinkle of cardamom powder.',
    ],
    category: 'Beverage',
    tags: ['drink', 'smoothie', 'mango', 'summer'],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    prepTime: 5,
    cookTime: 0,
    servings: 4,
    difficulty: 'Easy',
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1627696877906-7b5f4e3b6f4a?w=800&h=600&fit=crop',
  }
];

const seedRecipes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    let admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      console.log('⚠️ No admin found. Creating admin...');
      
      // Create admin
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('Admin@123456', salt);
      
      admin = await User.create({
        name: 'Admin',
        email: 'admin@afsheencreations.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('✅ Admin created:', admin.email);
      console.log('📝 Password: Admin@123456');
    }

    // Clear existing recipes
    const deletedCount = await Recipe.deleteMany({});
    console.log(`🗑️ Deleted ${deletedCount.deletedCount} existing recipes`);

    // Add sample recipes with admin as creator
    const recipesWithCreator = sampleRecipes.map(recipe => ({
      ...recipe,
      createdBy: admin._id,
    }));

    const inserted = await Recipe.insertMany(recipesWithCreator);
    console.log(`✅ ${inserted.length} recipes seeded successfully!`);
    
    console.log('\n📊 Sample Recipes Added:');
    inserted.forEach((recipe, index) => {
      console.log(`  ${index + 1}. ${recipe.title} (${recipe.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding recipes:', error);
    process.exit(1);
  }
};

seedRecipes();
