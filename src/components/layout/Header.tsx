
import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedLogo from '../ui-custom/AnimatedLogo';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-light-sm">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <AnimatedLogo />
        </Link>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <User size={18} className="mr-1" />
            <span>Sign In</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
