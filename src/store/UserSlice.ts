import { StateCreator } from 'zustand';
import { StoreTypeIntersection } from './store';
import {
  Service as api,
  CreateUserRequest,
  UpdateUserRequest
} from '@myfile/api-client';
import User from '../types/UserType';

/*
  This slice handles the current user session.
*/

export interface UserSlice {
  user: User;
  loading: boolean;
  error: string | null;
  useFetchUserData: (id_token: string | undefined) => Promise<void>;
  getUserData: () => User;
  resetUserData: () => User | object;
  getTOSAccepted: () => boolean;
  createProfile: (
    user: CreateUserRequest,
    id_token: string | undefined
  ) => Promise<void>;
  acceptedTermsOfUse: boolean;
  setAcceptedTermsOfUse: (loggedIn: boolean) => void;
  getAcceptedTermsOfUse: () => boolean;
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  getLoggedIn: () => boolean;
  updateUser: (
    user: UpdateUserRequest,
    id_token: string | undefined
  ) => Promise<void>;
}

export const createUserSlice: StateCreator<
  StoreTypeIntersection,
  [],
  [],
  UserSlice
> = (set, get) => ({
  user: {
    FirstName: '',
    LastName: '',
    DOB: '',
    LanguageIsoCode: 'en-us',
    Email: '',
    TOSAccepted: false
  },
  loading: false,
  error: null,
  useFetchUserData: async () => {
    try {
      set({ loading: true, error: null });
      const user = await api.getUser();
      set((state) => ({
        user: { ...state.user, ...user },
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  createProfile: async (data: CreateUserRequest) => {
    try {
      set({ loading: true, error: null });

      const newUser = await api.createUser({
        requestBody: data
      });
      set((state) => ({
        user: { ...state.user, ...newUser },
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  getUserData: () => {
    return get().user;
  },
  getTOSAccepted: () => {
    return get().user.TOSAccepted;
  },
  updateUser: async (data: UpdateUserRequest) => {
    set({ loading: true, error: null });
    const updatedUser = await api.updateUser({
      requestBody: data
    });
    set((state) => ({
      user: { ...state.user, ...updatedUser },
      loading: false
    }));
  },
  resetUserData: () => {
    set(() => ({
      user: {
        FirstName: '',
        LastName: '',
        DOB: '',
        LanguageIsoCode: 'en',
        Email: '',
        TOSAccepted: false
      },
      loading: false,
      error: null
    }));
    return get().user;
  },
  userType: 'client', // Should be null before login
  acceptedTermsOfUse: false,
  getAcceptedTermsOfUse: () => get().user.TOSAccepted,
  setAcceptedTermsOfUse: (acceptedTermsOfUse: boolean) =>
    set({ acceptedTermsOfUse }),
  loggedIn: false,
  getLoggedIn: () => get().loggedIn,
  setLoggedIn: (loggedIn) => set({ loggedIn })
});
