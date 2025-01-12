import { useContext, useCallback, useState, useEffect } from 'react';
import { AccountContext } from '../pages/auth/Account';
import Pool from '../lib/user-pool';
import { CognitoUserSession } from 'amazon-cognito-identity-js';

type UserData = {
  user: any;
  session: CognitoUserSession;
  [key: string]: any;
};

export function useAuth() {
  const account = useContext(AccountContext);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [lastCheck, setLastCheck] = useState<number>(0);
  const [userData, setUserData] = useState<UserData | null>(null);

  const CACHE_DURATION = 5 * 60 * 1000;

  const getUser = useCallback(async () => {
    try {
      const sessionData = await account.getSession();
      setUserData(sessionData as UserData);
      return sessionData;
    } catch (error) {
      console.error('Error getting user session:', error);
      setUserData(null);
      return null;
    }
  }, [account]);

  const getIsAuthenticated = useCallback(async () => {
    try {
      const session = await account.getSession();
      setIsAuthenticated(!!session);
      setLastCheck(Date.now());
      setUserData(session as UserData);
      return !!session;
    } catch {
      setIsAuthenticated(false);
      setLastCheck(Date.now());
      setUserData(null);
      return false;
    }
  }, [account]);

  useEffect(() => {
    const checkAuth = async () => {
      if (Date.now() - lastCheck > CACHE_DURATION) {
        await getIsAuthenticated();
      }
    };

    checkAuth();

    const interval = setInterval(checkAuth, CACHE_DURATION);
    return () => clearInterval(interval);
  }, [getIsAuthenticated, lastCheck]);

  const signinRedirect = useCallback(() => {
    window.location.href = '/login';
  }, []);

  const logout = useCallback(() => {
    account.logout();
    setIsAuthenticated(false);
    setUserData(null);
  }, [account]);

  const removeUser = useCallback(async () => {
    const currentUser = Pool.getCurrentUser();
    if (currentUser) {
      currentUser.signOut();
    }
    setIsAuthenticated(false);
    setUserData(null);
  }, []);

  const signoutRedirect = useCallback(async () => {
    await logout();
    window.location.href = '/';
  }, [logout]);

  return {
    isAuthenticated,
    getIsAuthenticated,
    signinRedirect,
    logout,
    removeUser,
    signoutRedirect,
    user: userData,
    getUser
  };
}
