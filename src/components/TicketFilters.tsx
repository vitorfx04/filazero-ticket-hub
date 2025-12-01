import { Button } from '@/components/ui/button';
import { TicketStatus } from '@/types/ticket';

interface TicketFiltersProps {
  activeFilter: TicketStatus | 'all';
  onFilterChange: (filter: TicketStatus | 'all') => void;
}

const filters = [
  { value: 'all' as const, label: 'Todos' },
  { value: 'open' as const, label: 'Abertos' },
  { value: 'paused' as const, label: 'Pausados' },
  { value: 'closed' as const, label: 'Finalizados' },
];

export const TicketFilters = ({ activeFilter, onFilterChange }: TicketFiltersProps) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={activeFilter === filter.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};
