import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import createCounterSlice from './createCounterSlice';
import createUserSlice from './createUserSlice';
import { CombinedState } from '@/types/store';
import { immer } from 'zustand/middleware/immer';
import deepMerge from 'deepmerge';
import createAppSlice from './createAppSlice';

const useStore = create<CombinedState>()(
  devtools(
    persist(
      immer((...api) => ({
        app: createAppSlice(...api),
        user: createUserSlice(...api),
        counter: createCounterSlice(...api),
      })),
      {
        name: 'mapua-tindahan-store',
        partialize: (state) => ({
          // Include the keys you want to persist in here.
          user: state.user,
        }),
        merge: (persistedState, currentState) =>
          deepMerge(currentState, persistedState as CombinedState),
      }
    )
  )
);

export default useStore;
