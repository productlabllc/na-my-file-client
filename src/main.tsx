import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';

// Removing OIDC config for built in auth
// import { AuthProvider } from 'react-oidc-context';

import './index.css';

import router from './router';
import MUITheme from './MUITheme';
import NotificationCenter from './components/NotificationCenter/NotificationCenter';
// import { oidcMetadataNonProd } from './lib/nycid-metadata.js'; // Removed NYC Auth
import { OpenAPI } from '@namyfile/api-client';
// import { User } from 'oidc-client-ts'; // Removed NYC Auth
import Pool from './lib/user-pool';

import './i18n/config.js';
import { Account } from './pages/auth/Account.js';

console.log(`OpenAPI: Before:`);
console.log(OpenAPI);
const { VITE_API_URL = '' } = import.meta.env;
OpenAPI.BASE = VITE_API_URL;
console.log(`OpenAPI: After:`);
console.log(OpenAPI);

// Update interceptor to use Cognito session
OpenAPI.interceptors.request.use(async (request) => {
  const user = Pool.getCurrentUser();
  if (user) {
    return new Promise((resolve, reject) => {
      user.getSession((err: any, session: any) => {
        if (err) {
          reject(err);
        }
        if (!request.headers) {
          request.headers = {} as Record<string, string>;
        }
        request.headers = {
          ...request.headers,
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        } as Record<string, string>;
        resolve(request);
      });
    });
  }
  return request;
});

// OpenAPI.interceptors.request.use((request) => {
//   const getUser = () => {
//     const storageKeys = Object.keys(sessionStorage);
//     const oidcKey = storageKeys.find((k) => k.startsWith('oidc.user'));
//     const oidcData = sessionStorage.getItem(oidcKey || 'empty');
//     if (!oidcKey || !oidcData) {
//       return null;
//     } else {
//       return User.fromStorageString(oidcData);
//     }
//   };
//   const user = getUser();
//   if (!request.headers) {
//     request.headers = {} as HeadersInit;
//   }
//   if (user) {
//     request.headers = {
//       ...request.headers,
//       Authorization: `Bearer ${user.id_token}`
//     };
//   }
//   return request;
// });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* Removed NYC Auth below */}
    {/* <AuthProvider
      authority="https://nonprd-login.nyc.gov/oidc/op/v1.0/3_DkZigi2v_eW7z-cZt8PAw-cYWQYg2d8VqABUFRZUhhzxNAdwR5brLl_h8Hqbo7Bm/authorize"
      client_id="A3YsJ_AmkZMzdXwTrwRA7taq"
      redirect_uri={`https://${location.hostname}`}
      scope="openid profile email address phone uid gov.nyc.accounts-nonprd"
      metadata={oidcMetadataNonProd}
      onSigninCallback={() => {
        console.log('navigate to the authenticated dashboard here');
      }}
    > */}
    <Account>
    <ThemeProvider theme={MUITheme}>
      {/* <NotificationCenter /> */}

      <RouterProvider router={router} />
      </ThemeProvider>
    </Account>
    {/* </AuthProvider> */}
  </React.StrictMode>
);
