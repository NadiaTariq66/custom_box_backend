// src/controllers/gencontroller.js
const Product = require('../models/Product');
const Category = require('../models/Category');
const Style = require('../models/Style');
const Admin = require('../models/Admin');
const Blog = require('../models/Blog');
const Newsletter = require('../models/Newsletter');
const nodemailer = require('nodemailer');

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

exports.genericSearch = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ message: 'search query param is required' });
    }

    // 1. Search by product name
    const products = await Product.find({ productName: { $regex: search, $options: 'i' } })
      .populate('categories');

    if (products.length > 0) {
      // If products found, return products with their categories populated
      return res.json({ products });
    }

    // 2. If no products found, search by category name
    const categories = await Category.find({ categoryName: { $regex: search, $options: 'i' } })
      .populate('productId');
      

    if (categories.length > 0) {
      // If categories found, return categories (each with productId field)
      return res.json({ categories });
    }

    // If nothing found
    return res.json({ products: [], categories: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    // Save email to DB (ignore if already exists)
    let newsletter = await Newsletter.findOne({ email });
    if (!newsletter) {
      newsletter = new Newsletter({ email });
      await newsletter.save();
    }

    // Send confirmation email
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // apni env file me rakhein
        pass: process.env.EMAIL_PASS
      }
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Newsletter Subscription',
      text: 'Thank you for subscribing to our newsletter! You will now receive updates from us.'
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Email sending failed', error: error.toString() });
      } else {
        res.status(201).json({ message: 'Subscribed successfully! Confirmation email sent.' });
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNewsletterSubscribers = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const total = await Newsletter.countDocuments();
    const subscribers = await Newsletter.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ _id: -1 });

    res.json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      subscribers
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};