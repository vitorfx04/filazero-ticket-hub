import { useTickets } from '@/contexts/TicketContext';
import { Card, CardContent } from '@/components/ui/card';
import { Circle, Pause, CheckCircle, Ticket } from 'lucide-react';

export const StatsCards = () => {
  const { tickets } = useTickets();

  const stats = [
    {
      label: 'Total',
      value: tickets.length,
      icon: Ticket,
      className: 'bg-primary/10 text-primary',
    },
    {
      label: 'Abertos',
      value: tickets.filter((t) => t.status === 'open').length,
      icon: Circle,
      className: 'bg-status-open-bg text-status-open',
    },
    {
      label: 'Pausados',
      value: tickets.filter((t) => t.status === 'paused').length,
      icon: Pause,
      className: 'bg-status-paused-bg text-status-paused',
    },
    {
      label: 'Finalizados',
      value: tickets.filter((t) => t.status === 'closed').length,
      icon: CheckCircle,
      className: 'bg-status-closed-bg text-status-closed',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${stat.className}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
