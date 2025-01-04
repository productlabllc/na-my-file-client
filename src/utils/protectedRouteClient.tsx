import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRouteClient: React.FC<ProtectedRouteProps> = ({ redirectPath = '/client-dashboard' }) => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRouteClient;
