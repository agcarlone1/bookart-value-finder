
import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AnimatedLogo from '@/components/ui-custom/AnimatedLogo';

interface AuthProps {
  mode: 'signIn' | 'signUp';
}

const Auth: React.FC<AuthProps> = ({ mode }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <Button 
        variant="ghost" 
        className="absolute top-4 left-4 text-sm"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} className="mr-1" />
        Back
      </Button>
      
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <AnimatedLogo size="large" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {mode === 'signIn' ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {mode === 'signIn' 
              ? 'Sign in to save your wishlists across devices' 
              : 'Create an account to save your wishlists across devices'}
          </p>
        </div>
        
        <div className="mt-8 bg-white py-8 px-4 shadow-md rounded-lg sm:px-10">
          {mode === 'signIn' ? (
            <SignIn redirectUrl="/" routing="path" path="/signin" />
          ) : (
            <SignUp redirectUrl="/" routing="path" path="/signup" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
