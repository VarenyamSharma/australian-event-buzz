
// Example routes for events API

const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Get all events
router.get('/', async (req, res) => {
  try {
    // Get query parameters for filtering
    const { limit = 50, sort = 'date', order = 'asc' } = req.query;
    
    // Create sort object
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;
    
    // Get events from database
    const events = await Event.find()
      .sort(sortObj)
      .limit(parseInt(limit));
      
    return res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    return res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
