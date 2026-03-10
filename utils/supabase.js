const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Upload a file to Supabase Storage
 * @param {string} bucket - The bucket name
 * @param {string} path - The file path in the bucket
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} contentType - MIME type of the file
 * @returns {Promise<Object>} Upload result with file path and URL
 */
async function uploadFile(bucket, path, fileBuffer, contentType) {
  try {
    const { data, error } = await supabaseAdmin
      .storage
      .from(bucket)
      .upload(path, fileBuffer, {
        contentType,
        upsert: false
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: publicData } = supabaseAdmin
      .storage
      .from(bucket)
      .getPublicUrl(path);

    return {
      success: true,
      path: data.path,
      url: publicData.publicUrl
    };
  } catch (error) {
    throw new Error(`File upload error: ${error.message}`);
  }
}

/**
 * Delete a file from Supabase Storage
 * @param {string} bucket - The bucket name
 * @param {string} path - The file path in the bucket
 * @returns {Promise<Object>} Deletion result
 */
async function deleteFile(bucket, path) {
  try {
    const { data, error } = await supabaseAdmin
      .storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw new Error(`Deletion failed: ${error.message}`);
    }

    return {
      success: true,
      message: `File deleted: ${path}`
    };
  } catch (error) {
    throw new Error(`File deletion error: ${error.message}`);
  }
}

/**
 * Get a private file from Supabase Storage using service role
 * @param {string} bucket - The bucket name
 * @param {string} path - The file path in the bucket
 * @returns {Promise<Buffer>} File buffer
 */
async function getPrivateFile(bucket, path) {
  try {
    const { data, error } = await supabaseAdmin
      .storage
      .from(bucket)
      .download(path);

    if (error) {
      throw new Error(`Download failed: ${error.message}`);
    }

    // Convert Blob to Buffer
    const buffer = await data.arrayBuffer();
    return Buffer.from(buffer);
  } catch (error) {
    throw new Error(`File download error: ${error.message}`);
  }
}

module.exports = {
  uploadFile,
  deleteFile,
  getPrivateFile
};
