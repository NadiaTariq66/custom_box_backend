// src/routes/genroutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const genController = require('../controllers/genController');

router.post('/upload', upload.array('files', 10), genController.uploadFiles);
router.get('/genericSearch', genController.genericSearch);
router.post('/subscribe-newsletter', genController.subscribeNewsletter);

module.exports = router;