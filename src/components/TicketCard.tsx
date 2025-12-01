import { Ticket } from '@/types/ticket';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { useTickets } from '@/contexts/TicketContext';
import { Play, Pause, CheckCircle, Eye, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TicketCardProps {
  ticket: Ticket;
  onView: (ticket: Ticket) => void;
}

export const TicketCard = ({ ticket, onView }: TicketCardProps) => {
  const { updateTicketStatus, deleteTicket } = useTickets();

  const handlePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateTicketStatus(ticket.id, 'paused');
  };

  const handleResume = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateTicketStatus(ticket.id, 'open');
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateTicketStatus(ticket.id, 'closed');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja excluir este chamado?')) {
      deleteTicket(ticket.id);
    }
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in"
      onClick={() => onView(ticket)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate mb-2">
              {ticket.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onView(ticket);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {ticket.description || 'Sem descrição'}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(ticket.createdAt, { addSuffix: true, locale: ptBR })}
          </span>
          <div className="flex items-center gap-1">
            {ticket.status === 'open' && (
              <>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={handlePause}
                  className="h-8"
                >
                  <Pause className="h-3 w-3 mr-1" />
                  Pausar
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleClose}
                  className="h-8"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Finalizar
                </Button>
              </>
            )}
            {ticket.status === 'paused' && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleResume}
                  className="h-8"
                >
                  <Play className="h-3 w-3 mr-1" />
                  Retomar
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleClose}
                  className="h-8"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Finalizar
                </Button>
              </>
            )}
            {ticket.status === 'closed' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResume}
                className="h-8"
              >
                <Play className="h-3 w-3 mr-1" />
                Reabrir
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
