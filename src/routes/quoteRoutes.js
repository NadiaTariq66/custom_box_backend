const express = require('express');
const router = express.Router();
const { createQuote, getAllQuotes } = require('../controllers/quoteController');

router.post('/createQuotes', createQuote);
router.get('/customerList', getAllQuotes);

module.exports = router; 