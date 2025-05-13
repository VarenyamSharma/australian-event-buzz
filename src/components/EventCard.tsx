
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event";

interface EventCardProps {
  event: Event;
  onGetTickets: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onGetTickets }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px" }}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>{formatDate(event.date)} • {event.time}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-700 mb-2">{event.description}</p>
        <div className="text-sm text-gray-600">
          <p><strong>Venue:</strong> {event.venue}</p>
          <p><strong>Price:</strong> {event.price}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => onGetTickets(event)}
        >
          GET TICKETS
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
// box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;