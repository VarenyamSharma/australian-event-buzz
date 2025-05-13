
export interface Event {
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

export interface EmailSubscription {
  email: string;
  optIn: boolean;
  eventId: string;
}
