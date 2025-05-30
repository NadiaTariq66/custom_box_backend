const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db/connection');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const blogRoutes = require('./routes/blogRoutes');
const styleRoutes = require('./routes/styleRoutes');
const genRoutes=require('./routes/genRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');




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
app.use('/api/testimonials', testimonialRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Custom Backend API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 