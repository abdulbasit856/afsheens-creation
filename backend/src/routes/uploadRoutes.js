const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { uploadImage } = require('../config/imagekit');
const multer = require('multer');
const path = require('path');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WEBP)'), false);
    }
  },
});

// Upload endpoint
router.post('/upload', protect, admin, upload.single('image'), async (req, res) => {
  try {
    console.log('📤 Upload request received');
    
    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    console.log('📁 File received:', {
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
    });

    // Get file buffer and original name
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;

    // Upload to ImageKit
    const result = await uploadImage(fileBuffer, fileName);
    
    console.log('✅ Upload successful:', result.url);

    res.status(200).json({
      success: true,
      url: result.url,
      fileId: result.fileId,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    console.error('❌ Upload error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image',
    });
  }
});

module.exports = router;