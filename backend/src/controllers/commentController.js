const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');
const { validationResult } = require('express-validator');

// @desc    Get comments for a recipe
// @route   GET /api/comments/recipe/:recipeId
// @access  Public
const getCommentsByRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get ALL comments (no approval needed anymore)
    const [comments, total] = await Promise.all([
      Comment.find({ recipeId })
        .skip(skip)
        .limit(limitNum)
        .sort('-createdAt'),
      Comment.countDocuments({ recipeId }),
    ]);

    const ratingResult = await Comment.aggregate([
      { $match: { recipeId: recipe._id, rating: { $ne: null } } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      comments,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
      rating: ratingResult.length > 0 ? {
        average: Math.round(ratingResult[0].avgRating * 10) / 10,
        count: ratingResult[0].count,
      } : null,
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching comments',
    });
  }
};

// @desc    Add comment to recipe - AUTO APPROVED
// @route   POST /api/comments
// @access  Public
const addComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { recipeId, name, email, content, rating } = req.body;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
    }

    // AUTO-APPROVED - isApproved set to true
    const comment = await Comment.create({
      recipeId,
      name,
      email: email || '',
      content,
      rating: rating || null,
      isApproved: true, // Auto-approved!
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully!',
      comment,
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding comment',
    });
  }
};

// @desc    Delete comment (Admin only - full control)
// @route   DELETE /api/comments/:id
// @access  Private (Admin)
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting comment',
    });
  }
};

// @desc    Get all comments (Admin)
// @route   GET /api/comments/all
// @access  Private (Admin)
const getAllComments = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [comments, total] = await Promise.all([
      Comment.find({})
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 })
        .populate('recipeId', 'title'),
      Comment.countDocuments({}),
    ]);

    res.status(200).json({
      success: true,
      comments,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get all comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching comments',
    });
  }
};

module.exports = {
  getCommentsByRecipe,
  addComment,
  deleteComment,
  getAllComments,
};