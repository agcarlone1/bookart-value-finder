
import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedLogo from '../ui-custom/AnimatedLogo';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 border-t bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AnimatedLogo className="text-xl" />
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
              Home
            </Link>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
              About
            </Link>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
              Privacy
            </Link>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
              Terms
            </Link>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} ValueFinder. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
