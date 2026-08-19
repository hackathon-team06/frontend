import { create } from "zustand";
import { persist } from "zustand/middleware";

import useAuthStore from "./useAuthStore";

const useGoogleCalendarStore = create(
  persist(
    (set) => ({
      // 데이터
      isConnected: false,
      justConnected: false,

      // 함수
      connect: () => set({ isConnected: true, justConnected: true }),
      clearJustConnected: () => set({ justConnected: false }),
      clear: () => set({ isConnected: false, justConnected: false }),
    }),
    {
      name: "google-calendar-storage",
      partialize: (state) => ({ isConnected: state.isConnected }),
    },
  ),
);

useAuthStore.subscribe((state, prevState) => {
  if (prevState.accessToken && !state.accessToken) {
    useGoogleCalendarStore.getState().clear();
  }
});

export default useGoogleCalendarStore;
