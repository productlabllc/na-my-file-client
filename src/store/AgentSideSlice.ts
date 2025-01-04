import { StateCreator } from 'zustand';
import { StoreTypeIntersection } from './store';

export interface AgentSideStore {
  showToastMessageForAction: boolean;
  setShowToastMessageForAction: (showToast: boolean) => void;
  toastAction: string;
  setToastAction: (action: string) => void;
  navigateAfterGeneratedDocument: boolean;
  setNavigateAfterGeneratedDocument: (isNavigate: boolean) => void;
}

export const createAgentSideSlice: StateCreator<StoreTypeIntersection, [], [], AgentSideStore> = (set) => ({
  showToastMessageForAction: false,
  navigateAfterGeneratedDocument: false,
  toastAction: '',
  setShowToastMessageForAction: (showToast) => set({ showToastMessageForAction: showToast }),
  setToastAction: (action) => set({ toastAction: action }),
  setNavigateAfterGeneratedDocument: (isNavigate) => set({ navigateAfterGeneratedDocument: isNavigate })
});
