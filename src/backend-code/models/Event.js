
// Example MongoDB schema for events

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  ticketUrl: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  sourceId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to prevent duplicate events
eventSchema.index({ sourceId: 1, source: 1 }, { unique: true });

module.exports = mongoose.model('Event', eventSchema);
