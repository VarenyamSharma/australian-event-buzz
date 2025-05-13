
# Backend Server for Sydney Event Buzz

This folder contains examples of backend code that would need to be implemented on a separate Node.js server.

## Setup Instructions

1. Create a new Node.js project in a separate directory
2. Install the required dependencies:
   ```
   npm install express mongoose nodemailer cors dotenv
   ```

3. Set up MongoDB connection
4. Implement the API endpoints
5. Configure environment variables
6. Set up web scraping functionality for events

## File Structure

- `server.js` - Main entry point for the Express server
- `models/` - MongoDB schema definitions
- `routes/` - API route handlers
- `controllers/` - Business logic
- `scrapers/` - Web scraping scripts
- `utils/` - Utility functions, including email service

## API Endpoints

- `GET /api/events` - Fetches all events
- `GET /api/events/:id` - Fetches a specific event by ID
- `POST /api/subscribe` - Handles email subscription and redirection

## Environment Variables

The backend will need the following environment variables:

```
MONGODB_URI=mongodb://localhost:27017/sydney-events
PORT=5000
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
SCRAPE_INTERVAL=86400000  # Scrape every 24 hours in milliseconds
```
