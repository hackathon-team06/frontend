import { create } from "zustand";

import { getMe } from "../api/user";
import useAuthStore from "./useAuthStore";
import usePointStore from "./usePointStore";

/**
 * 서버에서 받은 내 정보(UserResponse).
 *
 * persist 를 쓰지 않습니다. 서버 값이 진실이고, localStorage 에 남겨두면
 * 다른 계정으로 로그인했을 때 이전 사용자 정보가 잠깐 보입니다.
 * 새로고침하면 화면이 다시 조회합니다.
 */
const useUserStore = create((set, get) => ({
  // 데이터
  user: null,
  status: "idle", // "idle" | "loading" | "error"

  // 함수
  setUser: (user) => set({ user, status: "idle" }),

  clear: () => set({ user: null, status: "idle" }),

  fetchUser: async () => {
    // 이미 요청 중이면 중복으로 보내지 않습니다.
    if (get().status === "loading") return get().user;

    set({ status: "loading" });

    try {
      const user = await getMe();

      set({ user, status: "idle" });

      // 포인트는 제품 화면에서도 쓰므로 전용 스토어로 옮겨둡니다.
      if (typeof user.totalPoint === "number") {
        usePointStore.getState().setPoint(user.totalPoint);
      }

      return user;
    } catch (error) {
      set({ status: "error" });

      throw error;
    }
  },
}));

// 토큰이 사라지면(로그아웃 · 401) 사용자 정보도 함께 비웁니다.
// axios 인터셉터가 useUserStore 를 직접 부르면 모듈이 서로를 import 하게 되어
// (axios → useUserStore → api/user → axios) 여기서 토큰 변화를 구독합니다.
useAuthStore.subscribe((state, prevState) => {
  if (prevState.accessToken && !state.accessToken) {
    useUserStore.getState().clear();
  }
});

export default useUserStore;
