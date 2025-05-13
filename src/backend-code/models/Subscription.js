
// Example MongoDB schema for email subscriptions

const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  optIn: {
    type: Boolean,
    default: false,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
