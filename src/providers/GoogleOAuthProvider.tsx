'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { createContext, useContext } from 'react';

interface GoogleAuthProviderProps {
  children: React.ReactNode;
}

// Context to track if Google OAuth is available
export const GoogleOAuthContext = createContext<boolean>(false);
export const useGoogleOAuthAvailable = () => useContext(GoogleOAuthContext);

export default function GoogleAuthProvider({ children }: GoogleAuthProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.warn('Google Client ID is not configured. Google OAuth will be disabled.');
    return (
      <GoogleOAuthContext.Provider value={false}>
        {children}
      </GoogleOAuthContext.Provider>
    );
  }

  return (
    <GoogleOAuthContext.Provider value={true}>
      <GoogleOAuthProvider clientId={clientId}>
        {children}
      </GoogleOAuthProvider>
    </GoogleOAuthContext.Provider>
  );
}