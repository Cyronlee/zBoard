import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Layout } from '@/components/GridLayout';

export interface PageConfig {
  rows: number;
  cols: number;
  rowGap: number;
  columnGap: number;
  padding: number;
  layouts: Layout[];
}
export interface PageConfigState {
  version: number;
  setVersion: (version: number) => void;
  pageConfig: PageConfig;
  setPageConfig: (config: Partial<PageConfig>) => void;
}

export const usePageConfigStore = create<PageConfigState>()(
  persist(
    (set, get) => ({
      version: 0,
      pageConfig: {
        rows: 12,
        cols: 12,
        rowGap: 8,
        columnGap: 8,
        padding: 8,
        layouts: [],
      },
      setVersion: (version) => {
        set({ version });
      },
      setPageConfig: (config: Partial<PageConfig>) => {
        set({
          pageConfig: {
            ...get().pageConfig,
            ...config,
          },
        });
      },
    }),
    {
      name: 'pageConfig',
      skipHydration: true,
    }
  )
);
