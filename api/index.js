const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('../src/db/connection');
const adminRoutes = require('../src/routes/adminRoutes');
const productRoutes = require('../src/routes/productRoutes');
const categoryRoutes = require('../src/routes/categoryRoutes');
const quoteRoutes = require('../src/routes/quoteRoutes');
const blogRoutes = require('../src/routes/blogRoutes');
const styleRoutes = require('../src/routes/styleRoutes');
const genRoutes=require('../src/routes/genRoutes');




const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories',categoryRoutes);
app.use('/api/quote', quoteRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/style', styleRoutes);
app.use('/api/gen', genRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Custom Box' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app; 