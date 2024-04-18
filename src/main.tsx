import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { AuthProvider } from 'react-oidc-context';

import './index.css';
import router from './router';
import MUITheme from './MUITheme';
import NotificationCenter from './components/NotificationCenter/NotificationCenter';
import './i18n/config.js';
import { oidcMetadataNonProd } from './lib/nycid-metadata.js';
import { OpenAPI } from '@myfile/api-client';
import { User } from 'oidc-client-ts';

OpenAPI.interceptors.request.use((request) => {
  const getUser = () => {
    const storageKeys = Object.keys(sessionStorage);
    const oidcKey = storageKeys.find((k) => k.startsWith('oidc.user'));
    const oidcData = sessionStorage.getItem(oidcKey || 'empty');
    if (!oidcKey || !oidcData) {
      return null;
    } else {
      return User.fromStorageString(oidcData);
    }
  };
  const user = getUser();
  if (!request.headers) {
    request.headers = {} as HeadersInit;
  }
  if (user && !user.expired) {
    request.headers = {
      ...request.headers,
      Authorization: `Bearer ${user.id_token}`
    };
  }
  return request;
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider
      authority="https://nonprd-login.nyc.gov/oidc/op/v1.0/3_DkZigi2v_eW7z-cZt8PAw-cYWQYg2d8VqABUFRZUhhzxNAdwR5brLl_h8Hqbo7Bm/authorize"
      client_id="A3YsJ_AmkZMzdXwTrwRA7taq"
      redirect_uri="https://myfile-dev.cityofnewyork.us"
      scope="openid profile email address phone uid gov.nyc.accounts-nonprd"
      metadata={oidcMetadataNonProd}
      onSigninCallback={() => {
        console.log('navigate to the authenticated dashboard here');
      }}
    >
      <ThemeProvider theme={MUITheme}>
        <NotificationCenter />

        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
