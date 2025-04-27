const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require("dotenv").config();

cloudinary.config({
    api_key : process.env.api_key,
    api_secret : process.env.api_secret,
    cloud_name : process.env.cloud_name
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wonder_lust_dev',
      allowedformat: ['png', "jpeg", "jpg"], 
    },
  });

module.exports = {
    cloudinary,
    storage
}