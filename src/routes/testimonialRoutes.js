const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');

// Get all testimonials
router.get('/getAllTestimonial', testimonialController.getAllTestimonials);

// Add a new testimonial
router.post('/addTestimonial', testimonialController.addTestimonial);

// Update a testimonial
router.put('/updateTestimonial', testimonialController.updateTestimonial);

// Delete a testimonial
router.delete('/deleteTestimonial', testimonialController.deleteTestimonial);

module.exports = router; 