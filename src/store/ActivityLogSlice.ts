import { StateCreator } from 'zustand';
import { StoreTypeIntersection } from './store';
import * as api from '@namyfile/api-client';
// import ActivityType from '../types/ActivityType';

export interface ActivityLogStore {
  loadingActivityLog: boolean;
  activityData: api.PlatformActivityLogs[] | undefined;
  fetchUserActivities: (options: api.GetUserActivityData) => void;
  getUserActivities: () => api.PlatformActivityLogs[] | undefined;
  isActivityLogDataReady: () => boolean;
  getActivityLogTypes: () => Promise<api.GetActivityLogTypesResponse>;
}

export const createActivityLogSlice: StateCreator<StoreTypeIntersection, [], [], ActivityLogStore> = (set, get) => ({
  loadingActivityLog: false,
  activityData: [],
  fetchUserActivities: async (options: api.GetUserActivityData) => {
    try {
      set({ loadingActivityLog: true });
      const activities: api.GetUserActivityResponse = await api.getUserActivity(options);

      // const activities = await import('../assets/mock-data/mock-activity-list.json');

      // await new Promise((resolve) => setTimeout(resolve, 2000));
      set(() => ({
        activityData: activities.items,
        // activityData: activities.default,
        loadingActivityLog: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  getUserActivities: () => get().activityData,
  isActivityLogDataReady: () => get().loadingActivityLog,
  getActivityLogTypes: async () => await api.getActivityLogTypes()
});
