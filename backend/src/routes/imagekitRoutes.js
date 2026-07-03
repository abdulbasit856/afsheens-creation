const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { getImageKitAuth } = require('../config/imagekit');

router.get('/auth', protect, admin, (req, res) => {
  try {
    const auth = getImageKitAuth();
    res.json(auth);
  } catch (error) {
    console.error('ImageKit auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get ImageKit auth'
    });
  }
});

module.exports = router;