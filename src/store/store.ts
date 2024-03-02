import { create } from 'zustand';
import { UserSlice, createUserSlice } from './UserSlice';
import { Languages, createLanguages } from './Languages';
import {
  FamilyMemberStore,
  createFamilyMemberSlice
} from './FamilyMembersSlice';

// Using the recommended "slices" pattern for our store modules:
// https://github.com/pmndrs/zustand/blob/main/docs/guides/slices-pattern.md
// https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#slices-pattern

export type StoreTypeIntersection = UserSlice & Languages & FamilyMemberStore;

export const useBoundStore = create<StoreTypeIntersection>()((...a) => ({
  ...createLanguages(...a),
  ...createUserSlice(...a),
  ...createFamilyMemberSlice(...a)
}));

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
