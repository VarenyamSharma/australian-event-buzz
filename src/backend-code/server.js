
// This is an example backend server file
// In a real implementation, this would be in a separate repository

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const eventRoutes = require('./routes/eventRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const { setupScraper } = require('./scrapers/eventScraper');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/subscribe', subscriptionRoutes);

// Start the scraper
setupScraper();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
