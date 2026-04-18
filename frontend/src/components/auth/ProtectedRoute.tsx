import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { getAccessToken } from 'services/api';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute component
 * Checks if user is authenticated (has valid token)
 * Redirects to login page if not authenticated
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const token = getAccessToken();

  // If no token, redirect to login page
  // Store the attempted location so we can redirect back after login
  if (!token) {
    return (
      <Navigate
        to="/auth/sign-in/default"
        state={{ from: location }}
        replace
      />
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}

