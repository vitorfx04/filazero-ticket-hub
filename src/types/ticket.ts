export type TicketStatus = 'open' | 'paused' | 'closed';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  notes: string[];
  userId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
