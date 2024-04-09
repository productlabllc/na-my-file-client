import { StateCreator } from 'zustand';
import { StoreTypeIntersection } from './store';
import User from '../types/User';
/*
  This slice handles the current user session.
*/

export interface UserSlice {
  user: User;
  getUser: () => User;
  updateUser: (updatedUser: User) => void;
  acceptedTermsOfUse: boolean;
  setAcceptedTermsOfUse: (loggedIn: boolean) => void;
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  getLoggedIn: () => boolean;
  getAcceptedTermsOfUse: () => boolean;
}

export const createUserSlice: StateCreator<
  StoreTypeIntersection,
  [],
  [],
  UserSlice
> = (set, get) => ({
  user: {
    firstName: 'Jane',
    lastName: 'Doe',
    dateOfBirth: '11/12/1990',
    language: 'en'
  },
  updateUser: (updatedUser: User) =>
    set((state) => ({ user: { ...state.user, ...updatedUser } })),
  getUser: () => get().user,
  userType: 'client', // Should be null before login
  acceptedTermsOfUse: false,
  getAcceptedTermsOfUse: () => get().acceptedTermsOfUse,
  setAcceptedTermsOfUse: (acceptedTermsOfUse: boolean) =>
    set({ acceptedTermsOfUse }),
  loggedIn: false,
  getLoggedIn: () => get().loggedIn,
  setLoggedIn: (loggedIn) => set({ loggedIn })
});
