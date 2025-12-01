import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Ticket } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
            <Ticket className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold gradient-text">FilaZero</span>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user && (
            <>
              <span className="text-sm text-muted-foreground hidden sm:block">
                Olá, <span className="font-medium text-foreground">{user.name}</span>
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
