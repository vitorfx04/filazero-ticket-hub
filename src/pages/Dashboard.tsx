import { useState } from 'react';
import { Header } from '@/components/Header';
import { StatsCards } from '@/components/StatsCards';
import { TicketCard } from '@/components/TicketCard';
import { TicketFilters } from '@/components/TicketFilters';
import { CreateTicketDialog } from '@/components/CreateTicketDialog';
import { TicketDetailDialog } from '@/components/TicketDetailDialog';
import { useTickets } from '@/contexts/TicketContext';
import { Ticket, TicketStatus } from '@/types/ticket';
import { Inbox } from 'lucide-react';

export const Dashboard = () => {
  const { tickets } = useTickets();
  const [filter, setFilter] = useState<TicketStatus | 'all'>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredTickets = tickets.filter((t) =>
    filter === 'all' ? true : t.status === filter
  );

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <StatsCards />

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <TicketFilters activeFilter={filter} onFilterChange={setFilter} />
          <CreateTicketDialog />
        </div>

        {/* Tickets Grid */}
        {filteredTickets.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onView={handleViewTicket}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Inbox className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {filter === 'all'
                ? 'Nenhum chamado ainda'
                : `Nenhum chamado ${
                    filter === 'open'
                      ? 'aberto'
                      : filter === 'paused'
                      ? 'pausado'
                      : 'finalizado'
                  }`}
            </h3>
            <p className="text-muted-foreground text-sm">
              {filter === 'all'
                ? 'Clique em "Novo Chamado" para criar o primeiro'
                : 'Altere o filtro para ver outros chamados'}
            </p>
          </div>
        )}
      </main>

      {/* Detail Dialog */}
      <TicketDetailDialog
        ticket={selectedTicket}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
};
