
// Example routes for handling email subscriptions

const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const Event = require('../models/Event');
const { sendConfirmationEmail } = require('../utils/emailService');

// Handle email subscription and ticket redirection
router.post('/', async (req, res) => {
  try {
    const { email, optIn, eventId } = req.body;
    
    // Validate email
    if (!email || !eventId) {
      return res.status(400).json({ error: 'Email and eventId are required' });
    }
    
    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Create subscription record
    const subscription = new Subscription({
      email,
      optIn,
      eventId,
    });
    
    await subscription.save();
    
    // Send confirmation email
    if (optIn) {
      await sendConfirmationEmail(email, event.title);
    }
    
    // Return ticket URL for redirection
    return res.status(200).json({ 
      success: true, 
      message: 'Subscription successful',
      ticketUrl: event.ticketUrl 
    });
    
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
