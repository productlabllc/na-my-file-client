import { StateCreator } from 'zustand';
import { StoreTypeIntersection } from './store';
import * as api from '@myfile/api-client';

/*
  This slice handles the current user session.
*/

export interface UserSlice {
  user: api.UserBase;
  loading: boolean;
  error: string | null;
  useFetchUserData: () => Promise<void>;
  getUserData: () => api.UserBase;
  resetUserData: () => api.UserBase | object;
  getTOSAccepted: () => boolean | undefined;
  getUserLang: () => string;
  setUserLang: (languageIsoCode: string) => void;
  createProfile: (user: api.CreateUserRequest, id_token: string | undefined) => Promise<void>;
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  getLoggedIn: () => boolean;
  updateUser: (user: api.UpdateUserRequest) => Promise<void>;
  showToastMessageLogout: boolean;
  setShowToastMessageLogout: (isShown: boolean) => void;
  showToastMessageClient: boolean;
  setShowToastMessageClient: (isShown: boolean) => void;
  toastMessageActionTypeClient: string;
  setToastMessageActionTypeClient: (action: string) => void;
}

export const createUserSlice: StateCreator<StoreTypeIntersection, [], [], UserSlice> = (set, get) => ({
  user: {
    FirstName: '',
    LastName: '',
    DOB: '',
    LanguageIsoCode: '',
    Email: '',
    TOSAccepted: false
  },
  loading: false,
  showToastMessageLogout: false,
  showToastMessageClient: false,
  toastMessageActionTypeClient: '',
  setToastMessageActionTypeClient: (action: string) => {
    set({ toastMessageActionTypeClient: action });
  },
  error: null,
  setShowToastMessageLogout: (isShown) => {
    set({ showToastMessageLogout: isShown });
  },
  setShowToastMessageClient: (isShown) => {
    set({ showToastMessageClient: isShown });
  },
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
  createProfile: async (data: api.CreateUserRequest) => {
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
  updateUser: async (data: api.UpdateUserRequest) => {
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
        LanguageIsoCode: 'en-us',
        Email: '',
        TOSAccepted: false
      },
      loading: false,
      error: null
    }));
    return get().user;
  },
  getUserLang: () => get().user.LanguageIsoCode || 'en-us',
  setUserLang: (languageIsoCode: string) =>
    set({
      user: { FirstName: '', LastName: '', DOB: '', LanguageIsoCode: languageIsoCode, Email: '', TOSAccepted: false }
    }),
  userType: 'client', // Should be null before login
  loggedIn: false,
  getLoggedIn: () => get().loggedIn,
  setLoggedIn: (loggedIn) => set({ loggedIn })
});
