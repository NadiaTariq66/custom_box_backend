// src/middleware/upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dg8ppzwi2', 
    api_key: '287438734551835',
  api_secret: 'E7xpn_IQ5w3qlHMP6qaGgDGPVvM'   
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith("image/");
    return {
      folder: 'uploads',
      resource_type: isImage ? 'image' : 'raw',
      format: file.mimetype.split('/')[1], // e.g. 'pdf', 'jpeg'
      public_id: file.originalname.split('.')[0] // optional: name without extension
    };
  }
});

const upload = multer({ storage: storage });

module.exports = upload;