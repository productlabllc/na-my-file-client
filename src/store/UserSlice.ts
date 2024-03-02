import { StateCreator } from 'zustand';
import { StoreTypeIntersection } from './store';

/*
  This slice handles the current user session.
*/

export interface UserSlice {
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
  userType: 'client', // Should be null before login
  acceptedTermsOfUse: false,
  getAcceptedTermsOfUse: () => get().acceptedTermsOfUse,
  setAcceptedTermsOfUse: (acceptedTermsOfUse: boolean) =>
    set({ acceptedTermsOfUse }),
  loggedIn: false,
  getLoggedIn: () => get().loggedIn,
  setLoggedIn: (loggedIn) => set({ loggedIn })
});
