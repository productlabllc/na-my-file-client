import { StateCreator } from 'zustand';
import { StoreTypeIntersection } from './store';

export interface Languages {
  lang: string;
  getLang: () => string;
  setLang: (lang: string) => void;
}

export const createLanguages: StateCreator<
  StoreTypeIntersection,
  [],
  [],
  Languages
> = (set, get) => ({
  lang: '',
  getLang: () => get().lang,
  setLang: (lang: string) => set({ lang })
});
