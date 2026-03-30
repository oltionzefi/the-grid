import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

const domain = import.meta.env.VITE_AUTH0_DOMAIN ?? '';
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID ?? '';
const audience = import.meta.env.VITE_AUTH0_AUDIENCE ?? 'https://api.thegrid.io';
const redirectUri = window.location.origin;

interface Props {
  children: React.ReactNode;
}

/**
 * AuthProvider wraps Auth0Provider with app-specific configuration.
 * Place above <RouterProvider> or top-level routes in main entry.
 */
export function AuthProvider({ children }: Props) {
  if (!domain || !clientId) {
    // In dev/test without Auth0 env vars, render children without auth wrapper
    // so the app still loads (mocked data remains available).
    return <>{children}</>;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience,
        scope: 'openid profile email',
      }}
    >
      {children}
    </Auth0Provider>
  );
}
