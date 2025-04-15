import { StateSlice } from '@/types/store';
import Counter from '@/types/Counter';

const createCounterSlice: StateSlice<Counter> = (set) => ({
  count: 0,
  increaseCounter: () =>
    set((state) => {
      state.counter.count++;
    }),
  decreaseCounter: () =>
    set((state) => {
      state.counter.count--;
    }),
});

export default createCounterSlice;
