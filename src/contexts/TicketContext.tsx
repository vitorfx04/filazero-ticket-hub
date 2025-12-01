import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ticket, TicketStatus } from '@/types/ticket';
import { useAuth } from './AuthContext';

interface TicketContextType {
  tickets: Ticket[];
  addTicket: (title: string, description: string, priority: Ticket['priority']) => void;
  updateTicketStatus: (id: string, status: TicketStatus) => void;
  addNote: (id: string, note: string) => void;
  updateDescription: (id: string, description: string) => void;
  deleteTicket: (id: string) => void;
  getTicketById: (id: string) => Ticket | undefined;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem('filazero_tickets');
      if (stored) {
        const parsed = JSON.parse(stored);
        setTickets(parsed.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
        })));
      }
    } else {
      setTickets([]);
    }
  }, [user]);

  const saveTickets = (newTickets: Ticket[]) => {
    setTickets(newTickets);
    localStorage.setItem('filazero_tickets', JSON.stringify(newTickets));
  };

  const addTicket = (title: string, description: string, priority: Ticket['priority']) => {
    if (!user) return;
    const newTicket: Ticket = {
      id: crypto.randomUUID(),
      title,
      description,
      status: 'open',
      priority,
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: [],
      userId: user.id,
    };
    saveTickets([newTicket, ...tickets]);
  };

  const updateTicketStatus = (id: string, status: TicketStatus) => {
    saveTickets(
      tickets.map((t) =>
        t.id === id ? { ...t, status, updatedAt: new Date() } : t
      )
    );
  };

  const addNote = (id: string, note: string) => {
    saveTickets(
      tickets.map((t) =>
        t.id === id
          ? { ...t, notes: [...t.notes, note], updatedAt: new Date() }
          : t
      )
    );
  };

  const updateDescription = (id: string, description: string) => {
    saveTickets(
      tickets.map((t) =>
        t.id === id ? { ...t, description, updatedAt: new Date() } : t
      )
    );
  };

  const deleteTicket = (id: string) => {
    saveTickets(tickets.filter((t) => t.id !== id));
  };

  const getTicketById = (id: string) => tickets.find((t) => t.id === id);

  return (
    <TicketContext.Provider
      value={{
        tickets,
        addTicket,
        updateTicketStatus,
        addNote,
        updateDescription,
        deleteTicket,
        getTicketById,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};
