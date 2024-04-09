import { StateCreator } from 'zustand';
import { StoreTypeIntersection } from './store';
import FamilyMember from '../types/FamilyMember';

/*
  This slice handles the current user session.
*/

export interface FamilyMemberStore {
  familyData: FamilyMember[];
  isAddFamilyFormOpened: boolean;
  isUpdateFamilyFormOpened: boolean;

  getFamilyMembers: () => FamilyMember[];
  addFamilyMember: (familyMember: FamilyMember) => void;
  removeFamilyMember: (familyMember: string) => void;
  updateFamilyMember: (familyMember: FamilyMember) => void;
  setIsAddFamilyFormOpened: (isOpened: boolean) => void;
  getIsAddFamilyFormOpened: () => boolean;
  setIsUpdateFamilyFormOpened: (isOpened: boolean) => void;
  getIsUpdateFamilyFormOpened: () => boolean;
}

export const createFamilyMemberSlice: StateCreator<
  StoreTypeIntersection,
  [],
  [],
  FamilyMemberStore
> = (set, get) => ({
  familyData: [],
  isAddFamilyFormOpened: false,
  isUpdateFamilyFormOpened: false,
  setIsUpdateFamilyFormOpened: (isOpened: boolean) =>
    set({
      isUpdateFamilyFormOpened: isOpened
    }),
  getIsUpdateFamilyFormOpened: () => get().isUpdateFamilyFormOpened,
  getIsAddFamilyFormOpened: () => get().isAddFamilyFormOpened,
  setIsAddFamilyFormOpened: (isOpened: boolean) =>
    set({ isAddFamilyFormOpened: isOpened }),
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
