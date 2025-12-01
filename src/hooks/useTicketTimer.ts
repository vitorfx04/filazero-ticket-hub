import { useState, useEffect } from 'react';
import { Ticket } from '@/types/ticket';

export const useTicketTimer = (ticket: Ticket) => {
  const [displayTime, setDisplayTime] = useState(0);

  useEffect(() => {
    const calculateCurrentTime = () => {
      let total = ticket.elapsedTime || 0;
      if (ticket.status === 'open' && ticket.lastStartedAt) {
        const now = new Date().getTime();
        const started = new Date(ticket.lastStartedAt).getTime();
        total += Math.floor((now - started) / 1000);
      }
      return total;
    };

    setDisplayTime(calculateCurrentTime());

    if (ticket.status === 'open' && ticket.lastStartedAt) {
      const interval = setInterval(() => {
        setDisplayTime(calculateCurrentTime());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [ticket.elapsedTime, ticket.lastStartedAt, ticket.status]);

  return displayTime;
};

export const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const parseTimeString = (timeString: string): number | null => {
  const parts = timeString.split(':').map(Number);
  if (parts.length === 3 && parts.every(p => !isNaN(p) && p >= 0)) {
    const [hours, minutes, seconds] = parts;
    if (minutes < 60 && seconds < 60) {
      return hours * 3600 + minutes * 60 + seconds;
    }
  }
  return null;
};
