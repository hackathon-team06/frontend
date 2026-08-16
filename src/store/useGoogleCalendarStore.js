import { create } from "zustand";
import { persist } from "zustand/middleware";

import useAuthStore from "./useAuthStore";

/**
 * 구글 캘린더 연동 상태.
 *
 * isConnected 는 localStorage 에 저장합니다. 연동은 서버에 남는 것이라
 * 새로고침했다고 "연동하기"로 되돌아가면 이미 연동한 사용자가 또 연동하게 됩니다.
 *
 * justConnected 는 저장하지 않습니다. 연동 완료 오버레이를 한 번만 띄우기 위한
 * 일회용 신호라, 저장하면 홈에 들어올 때마다 오버레이가 뜹니다.
 */
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

// 토큰이 사라지면(로그아웃 · 401) 연동 상태도 비웁니다.
// 계정이 바뀌었는데 이전 사용자의 연동 상태가 남으면 안 됩니다.
useAuthStore.subscribe((state, prevState) => {
  if (prevState.accessToken && !state.accessToken) {
    useGoogleCalendarStore.getState().clear();
  }
});

export default useGoogleCalendarStore;
