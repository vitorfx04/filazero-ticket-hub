import { useAuth } from '@/contexts/AuthContext';
import { Login } from './Login';
import { Dashboard } from './Dashboard';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return user ? <Dashboard /> : <Login />;
};

export default Index;
