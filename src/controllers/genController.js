// src/controllers/gencontroller.js
exports.uploadFiles = (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const fileInfos = req.files.map(file => ({
      url: file.path, // Cloudinary URL
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    }));
    res.json({ files: fileInfos });
  };