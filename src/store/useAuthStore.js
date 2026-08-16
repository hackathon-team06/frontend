import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * 로그인 토큰.
 *
 * axios 인터셉터가 여기서 토큰을 꺼내 모든 요청에 붙입니다.
 * persist 미들웨어로 localStorage 에 저장하므로 새로고침해도 로그인이 유지됩니다.
 */
const useAuthStore = create(
  persist(
    (set) => ({
      // 데이터
      accessToken: null,
      refreshToken: null,
      userId: null,

      // 함수
      login: ({ accessToken, refreshToken, userId }) =>
        set({ accessToken, refreshToken, userId }),

      logout: () => set({ accessToken: null, refreshToken: null, userId: null }),
    }),
    {
      name: "auth-storage",
    },
  ),
);

export default useAuthStore;
