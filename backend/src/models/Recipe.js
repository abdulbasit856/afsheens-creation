const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  ingredients: [{
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
  }],
  instructions: [{
    type: String,
    required: true,
    trim: true,
  }],
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Arabic', 'Pakistani', 'Indian', 'Fast Food',
      'Dessert', 'Beverage', 'Breakfast', 'Healthy',
      'Soups', 'BBQ', 'Seafood', 'Vegetarian'
    ],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  imageKitFileId: {
    type: String,
  },
  videoUrl: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube-nocookie\.com\/embed\/)[\w-]+/.test(v);
      },
      message: 'Please enter a valid YouTube URL',
    },
  },
  prepTime: {
    type: Number,
    min: [0, 'Prep time cannot be negative'],
  },
  cookTime: {
    type: Number,
    min: [0, 'Cook time cannot be negative'],
  },
  servings: {
    type: Number,
    min: [1, 'Servings must be at least 1'],
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

recipeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

recipeSchema.virtual('totalTime').get(function() {
  return (this.prepTime || 0) + (this.cookTime || 0);
});

recipeSchema.virtual('videoId').get(function() {
  if (!this.videoUrl) return null;
  const match = this.videoUrl.match(/(?:v=|\/embed\/|\/)([\w-]{11})/);
  return match ? match[1] : null;
});

recipeSchema.set('toJSON', { virtuals: true });
recipeSchema.set('toObject', { virtuals: true });

recipeSchema.index({ title: 'text', 'ingredients.name': 'text' });
recipeSchema.index({ category: 1 });
recipeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Recipe', recipeSchema);