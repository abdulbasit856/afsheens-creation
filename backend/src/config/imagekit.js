const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const getImageKitAuth = () => {
  return imagekit.getAuthenticationParameters();
};

const uploadImage = async (file, fileName, folder = '/recipes') => {
  try {
    // Remove transformations - they're causing the error
    const result = await imagekit.upload({
      file: file,
      fileName: `${Date.now()}-${fileName}`,
      folder: folder,
      useUniqueFileName: true,
      // Removed transformation field that was causing errors
    });
    
    console.log('✅ Image uploaded successfully:', result.url);
    return result;
  } catch (error) {
    console.error('❌ ImageKit upload error:', error.message);
    throw new Error('Failed to upload image: ' + error.message);
  }
};

const deleteImage = async (fileId) => {
  try {
    await imagekit.deleteFile(fileId);
    console.log('✅ Image deleted successfully:', fileId);
    return true;
  } catch (error) {
    console.error('❌ ImageKit delete error:', error.message);
    return false;
  }
};

module.exports = {
  imagekit,
  getImageKitAuth,
  uploadImage,
  deleteImage,
};