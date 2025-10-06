import { create } from "zustand";
import type { TOrganisation } from "./dbOrganisationUtils";

type TState = TOrganisation[];

export const useOrganisationsStore = create<{
  data: TState;
  setData: (x: TState) => void;
  clear: () => void;
}>()((set) => ({
  data: [],
  setData: (data) => set(() => ({ data })),
  clear: () => set(() => ({ data: [] })),
}));
