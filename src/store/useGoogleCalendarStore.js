import { create } from "zustand";

const useGoogleCalendarStore = create((set) => ({
  isConnected: false, // 연동 상태
  justConnected: false, // 연동 완료 오버레이를 위한 상태

  connect: () => set({ isConnected: true, justConnected: true }),
  clearJustConnected: () => set({ justConnected: false }),
}));

export default useGoogleCalendarStore;
