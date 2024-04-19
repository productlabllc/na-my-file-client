import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router-dom';

/* Route Content Imports */
// Error Page & Layouts
import ErrorPage from './error-page';
import MainLayout from './layouts/MainLayout';
import AnonymousLayout from './layouts/AnonymousLayout';
import SplitPaneImageLeft from './components/shared/SplitPaneImageLeft';

// Auth
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ConfirmRegistration from './pages/auth/ConfirmRegistration';
// import ClaimDetail from './scenes/account/ClaimDetail';
// import TeamMembers from './scenes/account/TeamMembers';
// import PrimaryReferredAccounts from './scenes/account/PrimaryReferredAccounts';
// import DdnPartnerAccounts from './scenes/ddn/PartnerAccounts';
// import CommissionBreakdown from './scenes/account/CommissionClaimBreakdown';
// import DdnPortalMessages from './scenes/ddn/PortalMessages';
import ChangePasswordAfterLogin from './pages/auth/ChangePasswordAfterLogin';
// import InvitedMembers from './scenes/account/InvitedMembers';

export const routeMapType = {
  claims: 'claim-detail',
  commissions: 'commissions',
  'admin/team-members': 'admin/team-members',
  'admin/primary-referred-accounts': 'admin/primary-referred-accounts',
  'ddn/partner-accounts': 'ddn/partner-accounts'
};

const ContentImplementationNeeded = <div>Content Implementation Needed</div>;

const router = createBrowserRouter([
  {
    path: '/',
    element: <AnonymousLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/login',
        element: (
          <SplitPaneImageLeft>
            <Login />
          </SplitPaneImageLeft>
        )
      },
      {
        path: '/signup',
        element: (
          <SplitPaneImageLeft>
            <Signup />
          </SplitPaneImageLeft>
        )
      },
      {
        path: '/confirm-registration',
        element: (
          <SplitPaneImageLeft>
            <ConfirmRegistration />
          </SplitPaneImageLeft>
        )
      },
      {
        path: '/forgot-password',
        element: (
          <SplitPaneImageLeft>
            <ForgotPassword />
          </SplitPaneImageLeft>
        )
      },
      {
        path: '/change-password',
        element: (
          <SplitPaneImageLeft>
            <ChangePasswordAfterLogin />
          </SplitPaneImageLeft>
        )
      }
    ]
  }
  // ,{
  //   path: '/account',
  //   element: <MainLayout />,
  //   errorElement: <ErrorPage />,
  //   children: [
  //     {
  //       path: routeMapType.claims,
  //       element: <ClaimDetail />
  //     },
  //     {
  //       path: routeMapType.commissions,
  //       element: <CommissionBreakdown />
  //     },
  //     {
  //       path: routeMapType['admin/team-members'],
  //       element: <TeamMembers />
  //     },
  //     {
  //       path: routeMapType['admin/primary-referred-accounts'],
  //       element: <PrimaryReferredAccounts />
  //     }
  //   ]
  // },
  // {
  //   path: '/ddn',
  //   element: <MainLayout />,
  //   errorElement: <ErrorPage />,
  //   children: [
  //     {
  //       path: 'partner-accounts',
  //       element: <DdnPartnerAccounts />
  //     },
  //     {
  //       path: 'portal-messages',
  //       element: <DdnPortalMessages />
  //     },
  //     {
  //       path: 'invited-members',
  //       element: <InvitedMembers />
  //     }
  //   ]
  // }
]);

export default router;
