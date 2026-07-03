const express = require('express');
const { body } = require('express-validator');
const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getFeaturedRecipes,
  getCategories,
} = require('../controllers/recipeController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/', getRecipes);
router.get('/featured', getFeaturedRecipes);
router.get('/categories', getCategories);
router.get('/:id', getRecipeById);

const recipeValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('ingredients').custom((value) => {
    if (typeof value === 'string') {
      try { JSON.parse(value); } catch (e) { throw new Error('Invalid ingredients format'); }
    } else if (!Array.isArray(value)) {
      throw new Error('Ingredients must be an array');
    }
    return true;
  }),
  body('instructions').custom((value) => {
    if (typeof value === 'string') {
      try { JSON.parse(value); } catch (e) { throw new Error('Invalid instructions format'); }
    } else if (!Array.isArray(value)) {
      throw new Error('Instructions must be an array');
    }
    return true;
  }),
  body('category').notEmpty().withMessage('Category is required'),
  body('imageUrl').notEmpty().withMessage('Image URL is required'),
];

router.post('/', protect, admin, recipeValidation, createRecipe);
router.put('/:id', protect, admin, recipeValidation, updateRecipe);
router.delete('/:id', protect, admin, deleteRecipe);

module.exports = router;