import { create } from "zustand";

const useGoogleCalendarStore = create((set) => ({
  justConnected: false,

  connect: () => set({ justConnected: true }),
  clearJustConnected: () => set({ justConnected: false }),
}));

export default useGoogleCalendarStore;
