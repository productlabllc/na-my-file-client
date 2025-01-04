import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { UserSlice, createUserSlice } from './UserSlice';
import { Languages, createLanguages } from './Languages';
import { FamilyMemberStore, createFamilyMemberSlice } from './FamilyMembersSlice';
import { ApplicationsStore, createApplicationSlice } from './ApplicationsSlice';
import { DocumentsStore, createDocumentsSlice } from './DocumentsSlice';
import { ActivityLogStore, createActivityLogSlice } from './ActivityLogSlice';
import { AgentSideStore, createAgentSideSlice } from './AgentSideSlice';

// Using the recommended "slices" pattern for our store modules:
// https://github.com/pmndrs/zustand/blob/main/docs/guides/slices-pattern.md
// https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#slices-pattern

export type StoreTypeIntersection = UserSlice &
  Languages &
  FamilyMemberStore &
  ApplicationsStore &
  DocumentsStore &
  ActivityLogStore &
  AgentSideStore;

export const useBoundStore = create<StoreTypeIntersection>()(
  immer((...a) => ({
    ...createLanguages(...a),
    ...createUserSlice(...a),
    ...createFamilyMemberSlice(...a),
    ...createApplicationSlice(...a),
    ...createDocumentsSlice(...a),
    ...createActivityLogSlice(...a),
    ...createAgentSideSlice(...a)
  }))
);

// This will be replaced by API calls, probably in a separate service file
// export const populateStore = (skipFakeDelay?: boolean) =>
//   new Promise((resolve, reject) => {
//     // Zustand store can be accessed & updated outside components using .getState(), like this:
//     const {
//       user,
//       setUser,
//       userType,
//       setUserType,
//       documents,
//       setDocuments,
//       activityList,
//       setActivityList,
//       collections,
//       setCollections
//     } = useBoundStore.getState();

//     if (user && userType && documents && activityList && collections) {
//       // Data was already loaded
//       return resolve(null);
//     }

//     setTimeout(
//       () => {
//         setUserType('client');
//         setUser(MockUser);
//         setDocuments(
//           MockDocuments.map((val) => ({
//             ...val,
//             createdAt: new Date(val.createdAt),
//             updatedAt: new Date(val.updatedAt)
//           }))
//         );
//         setActivityList(
//           MockActivityList.map((val) => ({ ...val, date: new Date(val.date) }))
//         );
//         setCollections(
//           MockCollections.map((val) => ({
//             ...val,
//             createdAt: new Date(val.createdAt)
//           }))
//         );
//         resolve(null);
//       },
//       skipFakeDelay ? 0 : 1000
//     );
//   });
