const Recipe = require('../models/Recipe');
const { validationResult } = require('express-validator');
const { deleteImage } = require('../config/imagekit');

const getRecipes = async (req, res) => {
  try {
    const {
      search,
      category,
      tag,
      difficulty,
      page = 1,
      limit = 12,
      sort = '-createdAt',
    } = req.query;

    const query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
      query.category = category;
    }
    if (tag) {
      query.tags = tag;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [recipes, total] = await Promise.all([
      Recipe.find(query)
        .skip(skip)
        .limit(limitNum)
        .sort(sort)
        .populate('createdBy', 'name'),
      Recipe.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      recipes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching recipes',
    });
  }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
    }

    // Increment views - only once per request
    recipe.views += 1;
    await recipe.save();

    res.status(200).json({
      success: true,
      recipe,
    });
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching recipe',
    });
  }
};

const createRecipe = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const recipeData = {
      ...req.body,
      createdBy: req.user.id,
    };

    if (typeof recipeData.ingredients === 'string') {
      recipeData.ingredients = JSON.parse(recipeData.ingredients);
    }
    if (typeof recipeData.instructions === 'string') {
      recipeData.instructions = JSON.parse(recipeData.instructions);
    }
    if (typeof recipeData.tags === 'string') {
      recipeData.tags = recipeData.tags.split(',').map(t => t.trim());
    }

    const recipe = await Recipe.create(recipeData);

    res.status(201).json({
      success: true,
      recipe,
    });
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating recipe',
    });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    let recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
    }

    const updateData = { ...req.body };
    if (typeof updateData.ingredients === 'string') {
      updateData.ingredients = JSON.parse(updateData.ingredients);
    }
    if (typeof updateData.instructions === 'string') {
      updateData.instructions = JSON.parse(updateData.instructions);
    }
    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(t => t.trim());
    }

    recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      recipe,
    });
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating recipe',
    });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
    }

    if (recipe.imageKitFileId) {
      await deleteImage(recipe.imageKitFileId);
    }

    await recipe.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully',
    });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting recipe',
    });
  }
};

const getFeaturedRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ isFeatured: true })
      .limit(6)
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      recipes,
    });
  } catch (error) {
    console.error('Get featured recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching featured recipes',
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Recipe.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching categories',
    });
  }
};

module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getFeaturedRecipes,
  getCategories,
};