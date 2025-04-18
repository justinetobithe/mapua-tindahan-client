import { StateCreator } from 'zustand';
import { UserStateDefinition, UserStateActions } from '@/types/User';
import Counter from '@/types/Counter';
import { AppStateActions, AppStateDefinition } from './App';

export interface CombinedState {
  app: AppStateDefinition & AppStateActions;
  user: UserStateDefinition & UserStateActions;
  counter: Counter;
}

export type StateSlice<T> = StateCreator<
  CombinedState,
  [['zustand/immer', never]],
  [['zustand/persist', Partial<T>]],
  T
>;
