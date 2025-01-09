import * as React from 'react';
// import { User, useAuth } from 'oidc-react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Link, Outlet, Location, useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, useTheme } from '@mui/material/styles';
// import { WSClientTest } from '../WSClientTest';
import ddnLogo from '../assets/my-file-logo.svg';
import { Account, AccountContext } from '../pages/auth/Account';
import { ColorModeContext, colorTokens } from '../theme';

const AnonymousLayout = () => {
  // console.log('AnonymousLayout is being rendered');

  // const theme = useTheme();
  // const colors = colorTokens('light');
  // const colorMode = React.useContext(ColorModeContext);
  // const navigate = useNavigate();
  // React.useEffect(() => {
  //   colorMode.setColorMode('light');
  //   if (location.pathname === '/') {
  //     navigate('/login');
  //   }
  // }, []);

  return (
    <>
      <Outlet />
    </>
  );
};

export default AnonymousLayout;
