const express = require('express');
const router = express.Router();
const { getPrivateFile } = require('../utils/supabase');
const cookieParser = require('cookie-parser');

/**
 * GET /file
 * Serves a private file from Supabase Storage

 */

router.get('/:path', async (req, res) => {
  try {
    const bucket = process.env.SUPABASE_BUCKET_NAME;
    const path = req.query.path;

    if (!bucket || !path) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: bucket and path'
      });
    }

    const fileBuffer = await getPrivateFile(bucket, path);

    // Set appropriate headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${path.split('/').pop()}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', fileBuffer.length);

    res.send(fileBuffer);
  } catch (error) {
    console.error('File serve error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /image
 * Serves a private image from Supabase Storage

 */
router.get('/image/:path', async (req, res) => {
  try {
    const bucket = process.env.SUPABASE_BUCKET_NAME;
    const path = req.params.path;

    if (!bucket || !path) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: bucket and path'
      });
    }

    const fileBuffer = await getPrivateFile(bucket, path);

    // Determine MIME type based on file extension
    const extension = path.toLowerCase().split('.').pop();
    const mimeTypes = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      ico: 'image/x-icon'
    };

    const contentType = mimeTypes[extension] || 'image/jpeg';

    // Set appropriate headers for image display
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', fileBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=3600');

    res.send(fileBuffer);
  } catch (error) {
    console.error('Image serve error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /cv/:path
 * Serves a private CV/PDF from Supabase Storage (requires authentication)
 */
router.get('/cv/:path', async (req, res) => {
  try {
    const bucket = process.env.SUPABASE_BUCKET_NAME;
    const path = req.params.path;

    if (!bucket || !path) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }

    const fileBuffer = await getPrivateFile(bucket, path);

    const extension = path.toLowerCase().split('.').pop();
    const contentType = extension === 'pdf' ? 'application/pdf' : `image/${extension}`;

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${path.split('/').pop()}"`);
    res.setHeader('Content-Length', fileBuffer.length);

    res.send(fileBuffer);
  } catch (error) {
    console.error('CV serve error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
