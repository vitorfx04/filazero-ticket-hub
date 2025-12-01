import { Badge } from '@/components/ui/badge';
import { Ticket } from '@/types/ticket';

interface PriorityBadgeProps {
  priority: Ticket['priority'];
}

const priorityConfig = {
  low: {
    label: 'Baixa',
    variant: 'low' as const,
  },
  medium: {
    label: 'Média',
    variant: 'medium' as const,
  },
  high: {
    label: 'Alta',
    variant: 'high' as const,
  },
};

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const config = priorityConfig[priority];

  return <Badge variant={config.variant}>{config.label}</Badge>;
};
