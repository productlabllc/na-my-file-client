import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AccountContext } from '../pages/auth/Account';
import { useContext } from 'react';

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRouteClient: React.FC<ProtectedRouteProps> = ({ redirectPath = '/login' }) => {
  const { getSession } = useContext(AccountContext);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        await getSession();
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [getSession]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRouteClient;
