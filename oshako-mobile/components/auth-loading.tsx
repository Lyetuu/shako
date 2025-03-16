import React from 'react';
import { Loader2 } from 'lucide-react';

type AuthLoadingProps = {
  message?: string;
};

const AuthLoading = ({ message = 'Loading...' }: AuthLoadingProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center space-y-4 p-8 rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </div>
  );
};

export default AuthLoading;
