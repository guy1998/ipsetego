const express = require('express');
const router = express.Router();
const { getPrivateFile } = require('../utils/supabase');
const cookieParser = require('cookie-parser');
const allowedOrigins = require('../common/allowed-origins');

// Portfolio media (profile pictures, CVs, project images) is meant to be
// publicly viewable on a user's public portfolio page, so these routes are
// intentionally unauthenticated. This middleware just makes sure requests
// are coming from our own frontend(s) rather than being hotlinked/scraped
// directly. Origin/Referer are attacker-controllable and this is not a
// substitute for real authorization — it only keeps casual direct access out.
const requireFrontendOrigin = (req, res, next) => {
  const source = req.headers.origin || req.headers.referer;
  const isAllowed = !!source && allowedOrigins.some(origin => source.startsWith(origin));
  if (!isAllowed) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
};

router.use(requireFrontendOrigin);

/**
 * GET /file
 * Serves a private file from Supabase Storage

 */

router.get('/:path', async (req, res) => {
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

    // Set appropriate headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${path.split('/').pop()}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', fileBuffer.length);

    res.send(fileBuffer);
  } catch (error) {
    console.error('File serve error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to serve file'
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
      message: 'Unable to serve image'
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
      message: 'Unable to serve file'
    });
  }
});

module.exports = router;
