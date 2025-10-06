import { create } from "zustand";
import type { TProfile } from "./dbProfileUtils";

type TState = TProfile[];

export const useProfilesStore = create<{
  data: TState;
  setData: (x: TState) => void;
  clear: () => void;
}>()((set) => ({
  data: [],
  setData: (data) => set(() => ({ data })),
  clear: () => set(() => ({ data: [] })),
}));
