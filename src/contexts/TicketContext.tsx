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
  updateElapsedTime: (id: string, elapsedTime: number) => void;
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
          lastStartedAt: t.lastStartedAt ? new Date(t.lastStartedAt) : null,
          elapsedTime: t.elapsedTime || 0,
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
      elapsedTime: 0,
      lastStartedAt: new Date(),
    };
    saveTickets([newTicket, ...tickets]);
  };

  const updateTicketStatus = (id: string, status: TicketStatus) => {
    saveTickets(
      tickets.map((t) => {
        if (t.id !== id) return t;
        
        let newElapsedTime = t.elapsedTime;
        let newLastStartedAt = t.lastStartedAt;
        
        // If currently open and has a start time, accumulate the elapsed time
        if (t.status === 'open' && t.lastStartedAt) {
          const now = new Date().getTime();
          const started = new Date(t.lastStartedAt).getTime();
          newElapsedTime += Math.floor((now - started) / 1000);
        }
        
        // If transitioning to open, start the timer
        if (status === 'open') {
          newLastStartedAt = new Date();
        } else {
          newLastStartedAt = null;
        }
        
        return {
          ...t,
          status,
          elapsedTime: newElapsedTime,
          lastStartedAt: newLastStartedAt,
          updatedAt: new Date(),
        };
      })
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

  const updateElapsedTime = (id: string, elapsedTime: number) => {
    saveTickets(
      tickets.map((t) =>
        t.id === id ? { ...t, elapsedTime, updatedAt: new Date() } : t
      )
    );
  };

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
        updateElapsedTime,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};
