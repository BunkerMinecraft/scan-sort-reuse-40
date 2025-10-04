import { Link, useLocation } from 'react-router-dom';
import { LeafIcon, HomeIcon, LayoutDashboardIcon, ScanIcon, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <LeafIcon className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">EcoScan</h1>
          </Link>
          
          <nav className="flex items-center gap-2">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/">
                <HomeIcon className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
            
            <Button
              variant={isActive('/dashboard') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/dashboard">
                <LayoutDashboardIcon className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            
            <Button
              variant={isActive('/analysis') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/analysis">
                <ScanIcon className="w-4 h-4 mr-2" />
                Analyze
              </Link>
            </Button>
            
            <Button
              variant={isActive('/profile') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/profile">
                <UserIcon className="w-4 h-4 mr-2" />
                Profile
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};
