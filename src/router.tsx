import { createBrowserRouter } from 'react-router-dom';

import TermsOfUse from './pages/TermsOfUse/TermsOfUse.tsx';
import About from './pages/About/About.tsx';
import Faq from './pages/FAQ/Faq.tsx';
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
const clientAndAgentRoutes = [
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
  {
    path: '/terms-of-use',
    element: <TermsOfUse />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/faq',
    element: <Faq />
  },
  {
    path: '/nycid',
    element: <NycAuth />
  },
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
  { path: '/application/:organization/:id', element: <ApplicationChecklist /> },
  {
    path: '/application/:organization/:organizationId/:checklistTitle/:id',
    element: <ApplicationChecklistItemPage />
  },
  {
    path: '/',
    element: <LandingPage />
  }
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

// const agentRoutes = [
// {
//   // This path is contained in Dashboard but is just here for dev simplicity
//   path: '/agent',
//   element: <AgentDashboard />
// },
// {
//   path: '/collections/owner/:clientId',
//   element: <CollectionsOwnerId />
// }
// ];

const router = createBrowserRouter([
  ...clientAndAgentRoutes,
  ...clientRoutes
  // ...agentRoutes
]);

export default router;
