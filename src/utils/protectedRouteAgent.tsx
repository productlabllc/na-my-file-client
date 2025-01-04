import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRouteAgent: React.FC<ProtectedRouteProps> = ({ redirectPath = '/agent-dashboard' }) => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRouteAgent;
