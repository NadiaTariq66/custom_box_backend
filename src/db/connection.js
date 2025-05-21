const mongoose = require('mongoose');
const config = require('./config.json');
const env = process.env.NODE_ENV || 'development';

const connectDB = async () => {
  try {
    const dbConfig = config[env].mongodb;
    const mongoURI = process.env.MONGODB_URI || dbConfig.uri;
    await mongoose.connect(mongoURI, dbConfig.options);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB; 