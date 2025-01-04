import { StateCreator } from 'zustand';
import { StoreTypeIntersection } from './store';
import * as api from '@myfile/api-client';

/*
  This slice handles the current user session.
*/

export interface FamilyMemberStore {
  loading: boolean;
  familyData: api.FamilyMember[];
  isAddFamilyFormOpened: boolean;
  isUpdateFamilyFormOpened: boolean;
  isDeleteDialogOpen: boolean;

  fetchFamilyMembers: () => Promise<api.FamilyMember[]>;
  getFamilyMembers: () => api.FamilyMember[];
  createFamilyMember: (familyMember: api.CreateFamilyMemberRequest) => void;
  addFamilyMember: (familyMember: api.FamilyMember) => void;
  removeFamilyMember: (familyMember: string) => void;
  updateFamilyMember: (familyMember: api.UpdateFamilyMemberRequest) => void;
  setIsAddFamilyFormOpened: (isOpened: boolean) => void;
  getIsAddFamilyFormOpened: () => boolean;
  setIsUpdateFamilyFormOpened: (isOpened: boolean) => void;
  getIsUpdateFamilyFormOpened: () => boolean;
  setIsDeleteDialogOpen: (isDeleted: boolean) => void;
}

export const createFamilyMemberSlice: StateCreator<StoreTypeIntersection, [], [], FamilyMemberStore> = (set, get) => ({
  loading: false,
  isDeleteDialogOpen: false,
  familyData: [],
  isAddFamilyFormOpened: false,
  isUpdateFamilyFormOpened: false,
  setIsDeleteDialogOpen: (isDeleted) => set({ isDeleteDialogOpen: isDeleted }),
  setIsUpdateFamilyFormOpened: (isOpened: boolean) =>
    set({
      isUpdateFamilyFormOpened: isOpened
    }),
  getIsUpdateFamilyFormOpened: () => get().isUpdateFamilyFormOpened,
  getIsAddFamilyFormOpened: () => get().isAddFamilyFormOpened,
  setIsAddFamilyFormOpened: (isOpened: boolean) => set({ isAddFamilyFormOpened: isOpened }),
  createFamilyMember: async (member) => {
    try {
      set({ loading: true, error: null });
      const familyMember = await api.createUserFamilyMember({
        requestBody: member
      });
      set((state) => ({
        familyData: [familyMember, ...state.familyData],
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  addFamilyMember: async (member) => {
    set((state) => ({ familyData: [member, ...state.familyData] }));
  },
  removeFamilyMember: async (memberId: string) => {
    try {
      set({ loading: true, error: null });
      await api.deleteFamilyMember({
        requestBody: [memberId]
      });
      set((state) => ({
        familyData: state.familyData.filter((member) => member.id !== memberId),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  fetchFamilyMembers: async () => {
    try {
      set({ loading: true, error: null });
      const familyMembers = await api.getFamilyMembers();
      set(() => ({
        familyData: [...familyMembers],
        loading: false
      }));
      return familyMembers;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
    return [];
  },
  getFamilyMembers: () => {
    return get().familyData;
  },
  updateFamilyMember: async (member: api.UpdateFamilyMemberRequest) => {
    try {
      set({ loading: true, error: null });
      const familyMember = await api.updateUserFamilyMember({
        requestBody: member
      });
      set((state) => ({
        familyData: state.familyData.map((member) =>
          member.id === familyMember.id ? { ...member, ...familyMember } : member
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  }
});
