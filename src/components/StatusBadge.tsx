import { Badge } from '@/components/ui/badge';
import { TicketStatus } from '@/types/ticket';
import { Circle, Pause, CheckCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: TicketStatus;
}

const statusConfig = {
  open: {
    label: 'Aberto',
    icon: Circle,
    variant: 'open' as const,
  },
  paused: {
    label: 'Pausado',
    icon: Pause,
    variant: 'paused' as const,
  },
  closed: {
    label: 'Finalizado',
    icon: CheckCircle,
    variant: 'closed' as const,
  },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1.5">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};
