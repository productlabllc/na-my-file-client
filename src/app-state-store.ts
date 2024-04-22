import { create } from 'zustand';
import { } from './api-service';
import dayjs, { Dayjs } from 'dayjs';
import { getCurrentMonthDateRange, getImpersonationContextFromLocalStorage, getSearchFilterFromLocalStorage } from './lib/utils';
import { ImpersonationContextDataType, LOCAL_STORAGE_KEYS, PartnerGroupNumberHierarchyType } from './lib/types-and-interfaces';
const { currentDayOfCurrentMonthUTC, firstDayOfCurrentMonthUTC, firstDayOfPreviousMonthUTC } =
  getCurrentMonthDateRange();
const localStorageImpersonationContext = getImpersonationContextFromLocalStorage();
const localStorageSearchFilter = getSearchFilterFromLocalStorage();

console.log({
  currentDayOfCurrentMonthUTC,
  firstDayOfCurrentMonthUTC,
});

export type AppStateType = {
  anyData: {
    data: any;
    setData: (data: any) => void;
  };
  partnerDetail: {
    hasReferralAccounts?: boolean;
    setHasReferralAccounts: (hasReferralAccounts: boolean) => void;
    groupNumberHierarchy?: PartnerGroupNumberHierarchyType;
    setGroupNumberHierarchy: (groupNumberHierarchy: PartnerGroupNumberHierarchyType) => void;
  };
  appUser: {
    email: string;
    setEmail: (email: string) => void;
    userSessionData?: Record<string, any>;
    setUserSessionData: (atts: Record<string, any>) => any;
    platformUserProfile: any;
    setPlatformUserProfile: (profile: any) => any;
  };
  impersonationContext: ImpersonationContextDataType & {
    setImpersonationContext: (partnerId: string, partnerRole: string) => void;
    clearImpersonationContext: () => void;
  };
  snackbar: {
    open?: boolean;
    message?: string;
    setOpen?: (open: boolean) => any;
    setMessage?: (message: string) => any;
  };
  affiliates: {
    claimsList?: Array<any>;
  };
  globals: {
    globalGroupNumberFilter?: Array<string>;
    setGlobalGroupNumberFilter: (groupNumbers: Array<string>) => void;
    clearGlobalGroupNumberFilter: () => void;
    globalDateFrom: Dayjs;
    setGlobalDateFrom: (globalDateFrom: Dayjs) => void;
    globalDateTo: Dayjs;
    setGlobalDateTo: (globalDateTo: Dayjs) => void;
    showDataLoader: boolean;
    setShowDataLoader: (show: boolean) => void;
    globalMessage: string;
    setGlobalMessage: (message: string) => void;
  };
  reset: () => void;
};

export const useAppState = create<AppStateType>(set => ({
  anyData: {
    data: undefined,
    setData: (data: any) =>
      set((state: AppStateType) => ({
        anyData: {
          ...state.anyData,
          data,
        },
      })),
  },
  partnerDetail: {
    hasReferralAccounts: false,
    setHasReferralAccounts: (hasReferralAccounts: boolean) =>
      set((state: AppStateType) => ({
        partnerDetail: {
          ...state.partnerDetail,
          hasReferralAccounts,
        },
      })),
    groupNumberHierarchy: { directGroupNumbers: [], primaryGroupNumbers: [], secondaryGroupNumbers: [] },
    setGroupNumberHierarchy: (groupNumberHierarchy: PartnerGroupNumberHierarchyType) =>
      set((state: AppStateType) => ({
        partnerDetail: {
          ...state.partnerDetail,
          groupNumberHierarchy,
        },
      })),
  },
  appUser: {
    email: '',
    setEmail: (email: string) =>
      set((state: AppStateType) => ({
        appUser: {
          ...state.appUser,
          email,
        },
      })),
    userSessionData: undefined,
    setUserSessionData: (atts: Record<string, any>) =>
      set((state: AppStateType) => ({
        appUser: {
          ...state.appUser,
          userSessionData: {
            ...state.appUser.userSessionData,
            ...atts,
          },
        },
      })),
    platformUserProfile: {
      PartnerUserRoles: [{ PartnerAccount: { CommonName: '' } }],
    },
    setPlatformUserProfile: (profile: any) =>
      set((state: AppStateType) => ({
        appUser: {
          ...state.appUser,
          platformUserProfile: {
            ...state.appUser.platformUserProfile,
            ...profile,
          },
        },
      })),
  },
  impersonationContext: {
    partnerId: localStorageImpersonationContext ? localStorageImpersonationContext.partnerId : undefined,
    partnerRole: localStorageImpersonationContext ? localStorageImpersonationContext.partnerRole : undefined,
    setImpersonationContext: (partnerId: string, partnerRole: string) =>
      set((state: AppStateType) => {
        const context = {
          impersonationContext: {
            ...state.impersonationContext,
            partnerId,
            partnerRole,
          },
        };
        localStorage.setItem(LOCAL_STORAGE_KEYS.IMPERSONATION_CONTEXT, JSON.stringify(context.impersonationContext));
        return context;
      }),
    clearImpersonationContext: () =>
      set((state: AppStateType) => {
        const context = {
          impersonationContext: {
            ...state.impersonationContext,
            partnerId: undefined,
            partnerRole: undefined,
          },
        };
        localStorage.removeItem(LOCAL_STORAGE_KEYS.IMPERSONATION_CONTEXT);
        return context;
      }),
  },
  snackbar: {
    open: false,
    message: '',
    setOpen: (open: boolean) =>
      set((state: AppStateType) => ({
        snackbar: {
          ...state.snackbar,
          open,
        },
      })),
    setMessage: (message: string) =>
      set((state: AppStateType) => ({
        snackbar: {
          ...state.snackbar,
          message,
        },
      })),
  },
  affiliates: {
    claimsList: [],
  },
  globals: {
    globalGroupNumberFilter: localStorageSearchFilter ? localStorageSearchFilter.groupNumberFilter : [],
    setGlobalGroupNumberFilter: (groupNumbers: Array<string>) =>
      set((state: AppStateType) => {
        const searchFilter = {
          globals: {
            ...state.globals,
            globalGroupNumberFilter: groupNumbers,
          },
        };
        localStorage.setItem(LOCAL_STORAGE_KEYS.SEARCH_FILTER, JSON.stringify(searchFilter.globals.globalGroupNumberFilter));
        return searchFilter;
      }),
    clearGlobalGroupNumberFilter: () =>
      set((state: AppStateType) => {
        const searchFilter = {
          globals: {
            ...state.globals,
            globalGroupNumberFilter: [],
          },
        };
        localStorage.removeItem(LOCAL_STORAGE_KEYS.SEARCH_FILTER);
        return searchFilter;
      }),
    globalDateFrom: dayjs(firstDayOfPreviousMonthUTC), //.subtract((new Date(firstDayOfCurrentMonthUTC)).getTimezoneOffset(), 'minutes'),
    setGlobalDateFrom: (globalDateFrom: Dayjs) =>
      set((state: AppStateType) => ({
        globals: {
          ...state.globals,
          globalDateFrom,
        },
      })),
    globalDateTo: dayjs(currentDayOfCurrentMonthUTC).subtract(1, 'day'), //.subtract((new Date(currentDayOfCurrentMonthUTC)).getTimezoneOffset(), 'minutes'),
    setGlobalDateTo: (globalDateTo: Dayjs) =>
      set((state: AppStateType) => ({
        globals: {
          ...state.globals,
          globalDateTo,
        },
      })),
    showDataLoader: false,
    setShowDataLoader: (showDataLoader: boolean) =>
      set((state: AppStateType) => ({
        globals: {
          ...state.globals,
          showDataLoader,
        },
      })),
    globalMessage: '',
    setGlobalMessage: (globalMessage: string) =>
      set((state: AppStateType) => ({
        globals: {
          ...state.globals,
          globalMessage,
        },
      })),
  },
  reset: () => {
    set((state: AppStateType) => ({
      affiliates: {
        claimsList: [],
      },
      appUser: {
        ...state.appUser,
        email: '',
        platformUserProfile: {},
        userSessionData: undefined,
      },
    }));
  },
}));
