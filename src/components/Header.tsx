import { Link, useLocation } from 'react-router-dom';
import { LeafIcon, HomeIcon, LayoutDashboardIcon, ScanIcon, UserIcon, LogOutIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}

export const Header = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('first_name, last_name, profile_picture')
          .eq('id', user.id)
          .single();
        
        if (data) setProfile(data);
      };
      fetchProfile();
    }
  }, [user]);
  
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <LeafIcon className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">EcoScan</h1>
          </Link>
          
          <nav className="flex items-center gap-2">
            {user ? (
              <>
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
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={profile?.profile_picture || undefined} 
                          alt={`${profile?.first_name} ${profile?.last_name}`}
                        />
                        <AvatarFallback className="bg-primary/20">
                          {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-background" align="end" forceMount>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                      <LogOutIcon className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
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
                  variant="default"
                  size="sm"
                  asChild
                >
                  <Link to="/auth">
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
