
import axios from 'axios';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  imageUrl: string;
  ticketUrl: string;
  price: string;
}

interface EmailSubmission {
  email: string;
  optIn: boolean;
  eventId: string;
}

// This would be replaced with your actual backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchEvents = async (): Promise<Event[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/events`);
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const sendEmail = async (data: EmailSubmission): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/subscribe`, data);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const getEventById = async (id: string): Promise<Event> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with id ${id}:`, error);
    throw error;
  }
};
