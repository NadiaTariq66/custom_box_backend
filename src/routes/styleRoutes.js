 const express = require('express');
const router = express.Router();
const {
  createStyle,
  getAllStyles,
  getStyleById,
  updateStyle,
  deleteStyle
} = require('../controllers/styleController');

router.post('/addStyle', createStyle);
router.get('/getAllStyles', getAllStyles);
router.get('/getStyleById', getStyleById);
router.put('/updateStyle', updateStyle);
router.delete('/deleteStyle', deleteStyle);

module.exports = router;
