
// Event scraper for Sydney events
const axios = require('axios');
const cheerio = require('cheerio');
const Event = require('../models/Event');

// Generic scraper for websites using cheerio
const scrapeEventsFromSite = async (url, sourceName) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const events = [];

    // Different selector patterns based on source
    if (sourceName === 'SydneyEvents' || sourceName === 'SydneyConcerts') {
      // Example selector pattern for fictional websites - would need to be customized
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
    } else if (sourceName === 'Sydney.com') {
      // Sydney.com specific selector pattern
      $('.event-tile').each((index, element) => {
        try {
          const title = $(element).find('.event-name').text().trim();
          const description = $(element).find('.event-description, .event-excerpt').text().trim() || 
                             "Check website for event details";
          
          // Handle date extraction
          let dateStr = $(element).find('.event-date').text().trim();
          if (!dateStr) {
            // Alternative date selectors
            dateStr = $(element).find('.date-display').text().trim() || 
                      $(element).find('[itemprop="startDate"]').attr('content') || 
                      new Date().toISOString().split('T')[0]; // Default to today if no date found
          }
          
          // Handle time extraction
          const time = $(element).find('.event-time').text().trim() || 
                       $(element).find('.time-display').text().trim() || 
                       "Check website for time details";
          
          // Venue information
          const venue = $(element).find('.event-venue, .event-location').text().trim() || 
                        "Sydney, Australia";
          
          // Image URL with fallback
          let imageUrl = $(element).find('.event-image img, .tile-image img').attr('src') || 
                         $(element).find('img').attr('src');
          
          // Ensure image URL is absolute
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = new URL(imageUrl, 'https://www.sydney.com').href;
          }
          
          // Ticket URL with fallback to event detail page
          let ticketUrl = $(element).find('.event-link a, .buy-tickets').attr('href') || 
                         $(element).find('a').attr('href');
          
          // Ensure ticket URL is absolute
          if (ticketUrl && !ticketUrl.startsWith('http')) {
            ticketUrl = new URL(ticketUrl, 'https://www.sydney.com').href;
          }
          
          // Price information with fallback
          const price = $(element).find('.event-price, .ticket-price').text().trim() || 
                        "See website for pricing";
          
          // Generate a unique sourceId using the URL or any available ID
          const sourceId = $(element).attr('data-id') || 
                           $(element).attr('id') || 
                           ticketUrl.split('/').pop() || 
                           `sydney-${index}-${Date.now()}`;
          
          // Only add event if we have at least a title and link
          if (title && ticketUrl) {
            events.push({
              title,
              description,
              date: new Date(dateStr),
              time,
              venue,
              imageUrl: imageUrl || 'https://www.sydney.com/sites/sydney/files/styles/hero_item/public/2022-08/opera-house-vivid.jpg',
              ticketUrl,
              price,
              source: sourceName,
              sourceId,
            });
          }
        } catch (itemError) {
          console.error(`Error parsing event ${index} from ${sourceName}:`, itemError);
        }
      });
      
      // If we didn't find any events with the first selector, try alternative selectors
      if (events.length === 0) {
        console.log('No events found with primary selector, trying alternatives...');
        
        // Try different container selectors
        $('.event-listing, .events-container .row, .events-list').each((index, container) => {
          $(container).find('.event-item, .col-md-4, .card').each((idx, element) => {
            try {
              const title = $(element).find('h2, h3, .card-title').text().trim();
              const description = $(element).find('p, .card-text, .description').text().trim() || 
                                 "Check website for event details";
              
              // Get any link we can find
              const linkElement = $(element).find('a').first();
              const ticketUrl = linkElement.attr('href');
              
              // Ensure ticket URL is absolute
              let fullTicketUrl = ticketUrl;
              if (ticketUrl && !ticketUrl.startsWith('http')) {
                fullTicketUrl = new URL(ticketUrl, 'https://www.sydney.com').href;
              }
              
              // Only add if we have the minimum required data
              if (title && fullTicketUrl) {
                events.push({
                  title,
                  description,
                  date: new Date(), // Default to today
                  time: "See website for details",
                  venue: "Sydney, Australia",
                  imageUrl: 'https://www.sydney.com/sites/sydney/files/styles/hero_item/public/2022-08/opera-house-vivid.jpg',
                  ticketUrl: fullTicketUrl,
                  price: "See website for pricing",
                  source: sourceName,
                  sourceId: `sydney-alt-${index}-${idx}`,
                });
              }
            } catch (itemError) {
              console.error(`Error parsing alternative event ${index}-${idx} from ${sourceName}:`, itemError);
            }
          });
        });
      }
    }

    console.log(`Found ${events.length} events from ${sourceName}`);
    return events;
  } catch (error) {
    console.error(`Error scraping from ${sourceName}:`, error);
    return [];
  }
};

// Process pagination for sites with multiple pages
const scrapeWithPagination = async (baseUrl, sourceName, maxPages = 3) => {
  let allEvents = [];
  
  // Handle pagination for Sydney.com
  if (sourceName === 'Sydney.com') {
    for (let page = 1; page <= maxPages; page++) {
      // Add pagination parameter
      const url = page === 1 ? baseUrl : `${baseUrl}?page=${page}`;
      console.log(`Scraping ${sourceName} page ${page}: ${url}`);
      
      const events = await scrapeEventsFromSite(url, sourceName);
      
      // If no events found, we've reached the end of pagination
      if (events.length === 0) break;
      
      allEvents = [...allEvents, ...events];
      
      // Add delay between requests to be respectful
      if (page < maxPages) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  } else {
    // For sites without pagination, just scrape once
    allEvents = await scrapeEventsFromSite(baseUrl, sourceName);
  }
  
  return allEvents;
};

// Save events to database
const saveEvents = async (events) => {
  try {
    let updatedCount = 0;
    let insertedCount = 0;
    
    for (const event of events) {
      const result = await Event.findOneAndUpdate(
        { sourceId: event.sourceId, source: event.source },
        event,
        { upsert: true, new: true }
      );
      
      if (result._id) {
        if (result.isNew === true) {
          insertedCount++;
        } else {
          updatedCount++;
        }
      }
    }
    
    console.log(`Events database updated: ${insertedCount} new events added, ${updatedCount} events updated`);
  } catch (error) {
    console.error('Error saving events to database:', error);
  }
};

// Main scraper function
const scrapeAllSources = async () => {
  console.log('Starting event scraper...');

  // Source websites - real and example
  const sources = [
    { 
      url: 'https://www.sydney.com/events', 
      name: 'Sydney.com',
      usePagination: true,
      maxPages: 3
    },
    { 
      url: 'https://www.example-sydney-events.com/events', 
      name: 'SydneyEvents',
      usePagination: false
    },
    { 
      url: 'https://www.sydney-concerts.com/upcoming', 
      name: 'SydneyConcerts',
      usePagination: false
    },
    // Add more sources as needed
  ];

  // Scrape each source
  for (const source of sources) {
    console.log(`Scraping from ${source.name}...`);
    let events;
    
    if (source.usePagination) {
      events = await scrapeWithPagination(source.url, source.name, source.maxPages || 3);
    } else {
      events = await scrapeEventsFromSite(source.url, source.name);
    }
    
    if (events.length > 0) {
      await saveEvents(events);
    }
    
    // Add delay between scraping different sources
    if (sources.indexOf(source) < sources.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 3000));
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

// For testing purposes - this allows running the scraper directly
if (require.main === module) {
  // If this script is run directly, execute the scraper immediately
  console.log('Running scraper in standalone mode...');
  scrapeAllSources().catch(console.error);
}

module.exports = {
  setupScraper,
  scrapeAllSources, // Export for testing or manual execution
};
