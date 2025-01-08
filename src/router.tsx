import { createBrowserRouter } from 'react-router-dom';

import TermsOfUse from './pages/TermsOfUse/TermsOfUse.tsx';
// import About from './pages/About/About.tsx';
// import Faq from './pages/FAQ/Faq.tsx';
import ClientDashboard from './pages/ClientDashboard/ClientDahsboard.tsx';
import LandingPage from './pages/LandingPage/LandingPage.tsx';
import NycAuth from './pages/NycAuth/NycAuth.tsx';
import CreateProfile from './pages/CreateProfile/CreateProfile.tsx';
import UploadGenerator from './pages/UploadGenerator/UploadGenerator.tsx';
import DocumentId from './pages/DocumentId/DocumentId.tsx';
import DocumentEditId from './pages/DocumentEditId/DocumentEditId.tsx';
import FamilyMembers from './pages/FamilyMembers/FamilyMembers.tsx';
import FamilyMemberEditId from './pages/FamilyMemberEditId/FamilyMemberEditId.tsx';
import Profile from './pages/Profile/Profile.tsx';
import AddFamilyMember from './pages/AddFamilyMember/AddFamilyMember.tsx';
import EditProfile from './pages/EditProfile/EditProfile.tsx';
import CreateApplication from './pages/CreateApplication/CreateApplication.tsx';
import ApplicationChecklist from './pages/ApplicationChecklist/ApplicationChecklist.tsx';
import ApplicationChecklistItemPage from './pages/ApplicationChecklistItemPage/ApplicationChecklistItemPage.tsx';
import UploadGeneratorApplication from './pages/UploadGeneratorApplication/UploadGeneratorApplication.tsx';
import AplicationSelectDocuments from './pages/ApplicationSelectDocuments/ApplicationSelectDocuments.tsx';
import ApplicationSubmitConfirmation from './pages/ApplicationSubmitConfirmation/ApplicationSubmitConfirmation.tsx';
import ApplicationDocumentId from './pages/ApplicationDocumentId/ApplicationDocumentId.tsx';
import ApplicationDocumentEditId from './pages/ApplicationDocumentEditId/ApplicationDocumentEditId.tsx';
import ActivityLog from './pages/ActivityLog/ActivityLog.tsx';
import Logout from './pages/Logout/Logout.tsx';
import Support from './pages/Support/Support.tsx';

import AgentDashboard from './pages/AgentDashboard/AgentDashboard.tsx';
import AgentUserId from './pages/AgentUserId/AgentUserId.tsx';
import AgentChecklistItem from './pages/AgentChecklistItem/AgentChecklistItem.tsx';
import AgentUploadGenerator from './pages/AgentUploadGenerator/AgentUploadGenerator.tsx';
import ProtectedRoute from './utils/protectedRoute.tsx';
import ProtectedRouteClient from './utils/protectedRoute.tsx';
import ProtectedRouteAgent from './utils/protectedRoute.tsx';
// import { Support } from '@mui/icons-material';

// Components for Built-in Auth

import Login from './pages/auth/Login.tsx';
// import Signup from './pages/auth/Signup.tsx';
import Signup from './pages/auth/Signup.tsx'
import ForgotPassword from './pages/auth/ForgotPassword.tsx';
import ConfirmRegistration from './pages/auth/ConfirmRegistration.tsx';
import ChangePasswordAfterLogin from './pages/auth/ChangePasswordAfterLogin.tsx';
// Error Page & Layouts
// import ErrorPage from './error-page.tsx';
import ErrorPage from './error-page.tsx';
// import MainLayout from './layouts/MainLayout.tsx';
import TestComponent from './pages/TestComponent.tsx';
import AnonymousLayout from './layouts/AnonymousLayout.tsx';
import SplitPaneImageLeft from './components/shared/SplitPaneImageLeft.tsx';

// import TestComponent from './pages/TestComponent.tsx';

// import { AccountContext } from './pages/auth/Account.tsx';
import { AccountContext } from './pages/auth/Account.tsx';

const clientAndAgentRoutes = [
  {
    path: '/logout',
    element: <Logout />
  },
  {
    path: '/upload-generator',
    element: <UploadGenerator />
  },
  {
    path: '/document/edit/:id',
    element: <DocumentEditId />
  },
  {
    path: '/create-profile',
    element: <CreateProfile />
  },
  {
    path: '/document/:id',
    element: <DocumentId />
  },
  // {
  //   path: '/terms-of-use',
  //   element: <TermsOfUse />
  // },
  // {
  //   path: '/about',
  //   element: <About />
  // },
  // {
  //   path: '/faq',
  //   element: <Faq />
  // },
  // {
  //   path: '/nycid',
  //   element: <NycAuth />
  // },
  {
    path: '/family-members',
    element: <FamilyMembers />
  },
  {
    path: '/create-family-member',
    element: <AddFamilyMember />
  },
  {
    path: '/family-member/edit/:id',
    element: <FamilyMemberEditId />
  },
  {
    path: '/edit-profile',
    element: <EditProfile />
  },
  {
    path: '/create-application',
    element: <CreateApplication />
  },
  {
    path: '/application/:applicationTitle/:id',
    element: <ApplicationChecklist />
  },
  {
    path: '/application/:applicationTitle/:applicationId/:checklistTitle/:id',
    element: <ApplicationChecklistItemPage />
  },
  {
    path: '/application/:applicationTitle/:applicationId/:checklistTitle/:checklistId/upload-generator',
    element: <UploadGeneratorApplication />
  },
  {
    path: '/application/:applicationTitle/:applicationId/:checklistTitle/:checklistId/:documentId/re-upload-generator',
    element: <UploadGeneratorApplication />
  },
  {
    path: '/application/:applicationTitle/:applicationId/:checklistTitle/:checklistId/select-documents',
    element: <AplicationSelectDocuments />
  },
  {
    path: '/application/:applicationTitle/:applicationId/:checklistTitle/:checklistId/submit-confirmation',
    element: <ApplicationSubmitConfirmation />
  },
  {
    path: '/application/:applicationTitle/:applicationId/:checklistTitle/:checklistId/document/:id',
    element: <ApplicationDocumentId />
  },
  {
    path: '/application/:applicationTitle/:applicationId/:checklistTitle/:checklistId/document/edit/:id',
    element: <ApplicationDocumentEditId />
  },
  {
    path: '/activity',
    element: <ActivityLog />
  }
  // {
  //   path: '/',
  //   element: <LandingPage />
  // }
];

const clientRoutes = [
  {
    // This path is contained in Dashboard but is just here for dev simplicity
    path: '/client-dashboard',
    element: <ClientDashboard />
  },
  {
    path: '/profile',
    element: <Profile />
  }
];

const agentRoutes = [
  {
    // This path is contained in Dashboard but is just here for dev simplicity
    path: '/agent-dashboard',
    element: <AgentDashboard />
  },
  {
    path: '/client/:id',
    element: <AgentUserId />
  },
  {
    path: '/client/:clientId/case/:caseId/checklist-item/:checklistItemId',
    element: <AgentChecklistItem />
  },
  {
    path: '/client/:clientId/case/:caseId/checklist-item/:checklistItemId/upload-generator',
    element: <AgentUploadGenerator />
  }
];

// Protected Client routes
const clientRoutesProtected = [
  {
    element: <ProtectedRouteClient />,
    children: [...clientRoutes]
  }
];

// Protected Agent routes
const agentRoutesProtected = [
  {
    element: <ProtectedRouteAgent />,
    children: [...agentRoutes]
  }
];

// Protected routes + public routes
const routes = [
  // {
  //   path: '/',
  //   element: <LandingPage />
  // },



  // Commenting out for testing.
  // Added for Cognito Login
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
  },

  // ENDS HERE
  {
    path: '/terms-of-use',
    element: <TermsOfUse />
  },
  {
    path: '/support',
    element: <Support />
  },
  // {
  //   path: '/faq',
  //   element: <Faq />
  // },
  {
    path: '/nycid',
    element: <NycAuth />
  },
  {
    element: <ProtectedRoute />,
    children: [...clientAndAgentRoutes, ...clientRoutesProtected, ...agentRoutesProtected]
  }
];

const router = createBrowserRouter([...routes]);

export default router;
