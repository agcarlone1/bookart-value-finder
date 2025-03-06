
import React from 'react';
import { 
  SignedIn, 
  SignedOut, 
  UserButton, 
  useUser,
  useClerk 
} from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserProfileButton: React.FC = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  
  const handleSignOut = () => {
    signOut(() => navigate('/'));
  };
  
  return (
    <>
      <SignedIn>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
              <UserButton />
              {user?.username || user?.firstName || 'Account'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate('/wishlist')}>
              My Wishlist
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
              <LogOut size={16} className="mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedIn>
      
      <SignedOut>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/signin')}
          >
            <User size={18} className="mr-1" />
            <span>Sign In</span>
          </Button>
        </div>
      </SignedOut>
    </>
  );
};

export default UserProfileButton;
