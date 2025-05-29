const express = require('express');
const router = express.Router();
const { createQuote, customerList} = require('../controllers/quoteController');

router.post('/createQuotes', createQuote);
router.get('/customerList', customerList);

module.exports = router; 