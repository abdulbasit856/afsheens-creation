const express = require('express');
const { body } = require('express-validator');
const {
  getCommentsByRecipe,
  addComment,
  deleteComment,
  getAllComments,
} = require('../controllers/commentController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/recipe/:recipeId', getCommentsByRecipe);

// Comment validation
const commentValidation = [
  body('recipeId').notEmpty().withMessage('Recipe ID is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('content').notEmpty().withMessage('Comment content is required'),
  body('email').optional().isEmail().withMessage('Please enter a valid email'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
];

router.post('/', commentValidation, addComment);

// Admin routes - Only delete (no approve needed)
router.get('/all', protect, admin, getAllComments);
router.delete('/:id', protect, admin, deleteComment);

module.exports = router;