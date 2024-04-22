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

const defaultPageConfigLayouts: Layout[] = [
  {
    id: 'OwnerRotation-1',
    component: 'OwnerRotation',
    w: 2,
    minW: 2,
    h: 7,
    minH: 4,
    x: 0,
    y: 0,
  },
  {
    id: 'TicketStatus-1',
    component: 'TicketStatus',
    w: 3,
    minW: 2,
    h: 7,
    minH: 2,
    x: 9,
    y: 0,
  },
  {
    id: 'BuildStatus-1',
    component: 'BuildStatus',
    w: 7,
    minW: 2,
    h: 7,
    minH: 2,
    x: 2,
    y: 0,
  },
  {
    id: 'ProjectTimeline-1',
    component: 'ProjectTimeline',
    w: 12,
    minW: 2,
    h: 5,
    minH: 2,
    x: 0,
    y: 7,
  },
];

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
        layouts: defaultPageConfigLayouts,
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
