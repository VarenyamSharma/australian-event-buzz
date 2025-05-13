
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import EventCard from "@/components/EventCard";
import EmailDialog from "@/components/EmailDialog";
import { Event } from "@/types/event";
import { fetchEvents } from "@/services/eventService";

// Mock data - This would be replaced with actual API calls
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Sydney Opera House Concert",
    description: "Experience world-class music at the iconic Sydney Opera House",
    date: "2025-06-15",
    time: "19:30",
    venue: "Sydney Opera House",
    imageUrl: "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8",
    ticketUrl: "https://www.sydneyoperahouse.com",
    price: "$85 - $120"
  },
  {
    id: "2",
    title: "Harbour Bridge Festival",
    description: "Annual festival celebrating Sydney's iconic landmark with food, music and activities",
    date: "2025-05-25",
    time: "10:00",
    venue: "The Rocks",
    imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9",
    ticketUrl: "https://www.sydneyfestivals.com.au",
    price: "$25"
  },
  {
    id: "3",
    title: "Bondi Beach Summer Concert",
    description: "Live music by the ocean at Sydney's most famous beach",
    date: "2025-07-05",
    time: "16:00",
    venue: "Bondi Pavilion",
    imageUrl: "https://images.unsplash.com/photo-1520454974749-611b7248ffdb",
    ticketUrl: "https://www.bondiconcerts.com",
    price: "$30 - $45"
  }
];

const Index = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real application, here you would fetch events from your backend API
    const getEvents = async () => {
      try {
        // Uncomment this line when backend is ready
        // const data = await fetchEvents();
        // setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        toast({
          title: "Error",
          description: "Failed to load events. Please try again later.",
          variant: "destructive"
        });
      }
    };
    
    getEvents();
  }, [toast]);
  
  const handleGetTickets = (event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };
  
  const handleEmailSubmit = async (email: string, optIn: boolean) => {
    if (!selectedEvent) return;
    
    try {
      // In a real app, we would send the email to the backend here
      // await sendEmail({ email, optIn, eventId: selectedEvent.id });
      
      toast({
        title: "Success!",
        description: "You'll be redirected to the ticket page.",
      });
      
      // Close the dialog
      setIsDialogOpen(false);
      
      // Redirect to the ticket URL
      window.open(selectedEvent.ticketUrl, "_blank");
      
    } catch (error) {
      console.error('Error processing email submission:', error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sydney Events</h1>
          <p className="text-xl md:text-2xl max-w-2xl">Discover the best events happening in Sydney, Australia. From concerts and festivals to exhibitions and sports.</p>
        </div>
      </section>
      
      {/* Events Listing */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Upcoming Events</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onGetTickets={handleGetTickets} 
            />
          ))}
        </div>
      </section>
      
      {/* Email Dialog */}
      <EmailDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        event={selectedEvent}
        onSubmit={handleEmailSubmit}
      />
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Sydney Event Buzz</h3>
              <p className="text-gray-300">Your guide to what's happening in Sydney</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Contact</h4>
              <p className="text-gray-300">info@sydneyeventbuzz.com</p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Sydney Event Buzz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
