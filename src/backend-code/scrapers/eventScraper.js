
// Example web scraper for Sydney events
// This is just a simplified example, a real implementation would be more complex

const axios = require('axios');
const cheerio = require('cheerio');
const Event = require('../models/Event');

// Example scraper for a fictional event website
const scrapeEventsFromSite = async (url, sourceName) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const events = [];

    // Example selector pattern - would need to be customized for each website
    $('.event-card').each((index, element) => {
      const title = $(element).find('.event-title').text().trim();
      const description = $(element).find('.event-description').text().trim();
      const dateStr = $(element).find('.event-date').text().trim();
      const time = $(element).find('.event-time').text().trim();
      const venue = $(element).find('.event-venue').text().trim();
      const imageUrl = $(element).find('.event-image').attr('src');
      const ticketUrl = $(element).find('.event-link').attr('href');
      const price = $(element).find('.event-price').text().trim();
      const sourceId = $(element).attr('data-id');

      // Create event object
      events.push({
        title,
        description,
        date: new Date(dateStr),
        time,
        venue,
        imageUrl,
        ticketUrl,
        price,
        source: sourceName,
        sourceId,
      });
    });

    return events;
  } catch (error) {
    console.error(`Error scraping from ${sourceName}:`, error);
    return [];
  }
};

// Save events to database
const saveEvents = async (events) => {
  try {
    for (const event of events) {
      await Event.findOneAndUpdate(
        { sourceId: event.sourceId, source: event.source },
        event,
        { upsert: true, new: true }
      );
    }
    console.log(`Saved ${events.length} events to database`);
  } catch (error) {
    console.error('Error saving events to database:', error);
  }
};

// Main scraper function
const scrapeAllSources = async () => {
  console.log('Starting event scraper...');

  // Example source websites - replace with real Sydney event websites
  const sources = [
    { url: 'https://www.example-sydney-events.com/events', name: 'SydneyEvents' },
    { url: 'https://www.sydney-concerts.com/upcoming', name: 'SydneyConcerts' },
    // Add more sources as needed
  ];

  // Scrape each source
  for (const source of sources) {
    console.log(`Scraping from ${source.name}...`);
    const events = await scrapeEventsFromSite(source.url, source.name);
    if (events.length > 0) {
      await saveEvents(events);
    }
  }

  console.log('Event scraping complete');
};

// Setup scraper interval
const setupScraper = () => {
  // Run immediately on startup
  scrapeAllSources();

  // Then run on a schedule (default: every 24 hours)
  const interval = parseInt(process.env.SCRAPE_INTERVAL) || 86400000; // 24 hours in ms
  setInterval(scrapeAllSources, interval);
  
  console.log(`Event scraper scheduled to run every ${interval / (1000 * 60 * 60)} hours`);
};

module.exports = {
  setupScraper,
};
