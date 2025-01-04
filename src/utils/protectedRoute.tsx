import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { useBoundStore } from '../store/store';

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectPath = '/' }) => {
  const auth = useAuth();
  const { getUserData } = useBoundStore();

  const user = getUserData();

  if (!auth.isAuthenticated && !user.TOSAccepted) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
