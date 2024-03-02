import { StateCreator } from 'zustand';
import { StoreTypeIntersection } from './store';
import FamilyMember from '../types/FamilyMember';

/*
  This slice handles the current user session.
*/

export interface FamilyMemberStore {
  //   acceptedTermsOfUse: boolean;
  //   setAcceptedTermsOfUse: (loggedIn: boolean) => void;
  //   loggedIn: boolean;
  //   setLoggedIn: (loggedIn: boolean) => void;
  //   getLoggedIn: () => boolean;
  //   getAcceptedTermsOfUse: () => boolean;
  //   isWindowClosed: boolean;
  //   closePopupWindow: (isWindowClosed: boolean) => void;
  familyData: FamilyMember[];
  getFamilyMembers: () => FamilyMember[];
  addFamilyMember: (familyMember: FamilyMember) => void;
  removeFamilyMember: (familyMember: string) => void;
  updateFamilyMember: (familyMember: FamilyMember) => void;
}

export const createFamilyMemberSlice: StateCreator<
  StoreTypeIntersection,
  [],
  [],
  FamilyMemberStore
> = (set, get) => ({
  //   isWindowClosed: false,
  //   closePopupWindow(isWindowClosed: boolean) {
  //     set({ isWindowClosed });
  //   },
  //   getIsWindowClosed: () => get().isWindowClosed
  familyData: [],
  addFamilyMember: (member: FamilyMember) => {
    set((state) => ({ familyData: [member, ...state.familyData] }));
  },
  removeFamilyMember: (memberId: string) => {
    set((state) => ({
      familyData: state.familyData.filter((member) => member.id !== memberId)
    }));
  },
  getFamilyMembers: () => {
    // console.log(get().familyData);
    return get().familyData;
  },
  updateFamilyMember: (member: FamilyMember) => {
    // console.log(member);

    set((state) => {
      return {
        familyData: state.familyData.map((memberData) =>
          memberData.id === member.id
            ? { ...memberData, ...member }
            : memberData
        )
      };
    });
  }
});

//   userType: 'client', // Should be null before login
//   acceptedTermsOfUse: false,
//   getAcceptedTermsOfUse: () => get().acceptedTermsOfUse,
//   setAcceptedTermsOfUse: (acceptedTermsOfUse: boolean) =>
//     set({ acceptedTermsOfUse }),
//   loggedIn: false,
//   getLoggedIn: () => get().loggedIn,
//   setLoggedIn: (loggedIn) => set({ loggedIn })
