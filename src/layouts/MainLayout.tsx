import * as React from 'react';
// import { User, useAuth } from 'oidc-react';
// import ReactDOM from 'react-dom/client';
import {
  // createBrowserRouter,
  // RouterProvider,
  // Link,
  Outlet,
  useNavigate
  // redirect
} from 'react-router-dom';
import {
  Account,
  AccountContext,
  getPlatformUser
} from '../pages/auth/Account';
// import Sidebar from '../pages/shared/Sidebar';
// import Dashboard from '../pages/account/Dashboard';
// import Topbar from '../scenes/shared/Topbar';
// import Loader from '../components/shared/Loader.tsx.bak';
import { useAppState } from '../app-state-store';
import { Box, useTheme } from '@mui/material';
import { ColorModeContext, colorTokens } from '../theme';
import { getActivePlatformMessage } from '../api-service';
import useMediaQuery from '@mui/material/useMediaQuery';
// import {
//   isMobileSize,
//   isNotDesktopSize
// } from '../lib/media-queries-implemented'; // Media Query Size

const MainLayout = () => {
  const [userSession, setUserSession] = React.useState<Record<string, any>>({});
  // const [globalMessage, setGlobalMessage] = React.useState<string>('');
  const { getSession, logout } = React.useContext(AccountContext);
  const navigate = useNavigate();
  const appStateGlobals = useAppState((state) => state.globals);
  const theme = useTheme();
  const colors = colorTokens('dark');
  const colorMode = React.useContext(ColorModeContext);
  const appStateUser = useAppState((state) => state.appUser);
  const { globalMessage, setGlobalMessage } = appStateGlobals;
  const isMobile = useMediaQuery(`(max-width: ${isMobileSize}px)`); // Media Query for Mobile
  const isNotDesktop = useMediaQuery(`(max-width: ${isNotDesktopSize}px)`); // Media Query for Mobile

  React.useEffect(() => {
    getSession!()
      .then((session) => {
        console.log('Session: ', session);
        setUserSession(session);
      })
      .catch((err: any) => {
        navigate('/login');
      });
    getPlatformUser()
      .then((user: any) => {
        colorMode.setColorMode(user.ThemeMode || 'dark');
      })
      .catch();
    getActivePlatformMessage()
      .then((data: any) => {
        console.log(`Global Message:
          ${JSON.stringify(data, null, 2)}`);
        if (data && data.Message) {
          setGlobalMessage(data.Message);
        } else {
          setGlobalMessage('');
        }
      })
      .catch((err: any) => {});
    const cancelIntervalHandle = setInterval(
      () => {
        getActivePlatformMessage()
          .then((data: any) => {
            console.log(`Global Message:
          ${JSON.stringify(data, null, 2)}`);
            if (data && data.Message) {
              setGlobalMessage(data.Message);
            } else {
              setGlobalMessage('');
            }
          })
          .catch((err: any) => {});
      },
      1000 * 60 * 15
    );
    return () => {
      clearInterval(cancelIntervalHandle);
    };
  }, []);

  const performLogout = async () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Account>
        <Loader isLoading={appStateGlobals.showDataLoader} />
        <Sidebar user={userSession}></Sidebar>
        <main className="content">
          {globalMessage !== '' && (
            <Box
              sx={{
                minHeight: '40px',
                backgroundColor: '#077BB0',
                textAlign: 'center',
                margin: isMobile ? '8px 8px 8px 68px' : '8px', // add margin to top and bottom for mobile
                borderRadius: isMobile ? '6px' : '4px',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                padding: '4px'
              }}
            >
              {globalMessage}
            </Box>
          )}
          <Topbar></Topbar>
          {location.pathname === '/account' ? (
            <Dashboard></Dashboard>
          ) : (
            <Outlet />
          )}
        </main>
      </Account>
    </>
  );
};

export default MainLayout;
