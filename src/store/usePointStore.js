import { create } from "zustand";
import { persist } from "zustand/middleware";

export const INITIAL_POINT = 0;

const usePointStore = create(
  persist(
    (set) => ({
      point: INITIAL_POINT,

      addPoint: (amount) =>
        set((state) => ({ point: state.point + amount })),

      setPoint: (point) => set({ point }),
    }),
    {
      name: "point-storage",
    },
  ),
);

export default usePointStore;
