import { create } from "zustand";

import { getMe } from "../api/user";
import useAuthStore from "./useAuthStore";
import usePointStore from "./usePointStore";

const useUserStore = create((set, get) => ({
  // 데이터
  user: null,
  status: "idle",

  // 함수
  setUser: (user) => set({ user, status: "idle" }),

  clear: () => set({ user: null, status: "idle" }),

  fetchUser: async () => {
    // 이미 요청 중이면 중복으로 보내지 않음
    if (get().status === "loading") return get().user;

    set({ status: "loading" });

    try {
      const user = await getMe();

      set({ user, status: "idle" });

      if (typeof user.totalPoint === "number") {
        const { point, setPoint } = usePointStore.getState();

        if (user.totalPoint > point) {
          setPoint(user.totalPoint);
        }
      }

      return user;
    } catch (error) {
      set({ status: "error" });

      throw error;
    }
  },
}));

useAuthStore.subscribe((state, prevState) => {
  if (prevState.accessToken && !state.accessToken) {
    useUserStore.getState().clear();
  }
});

export default useUserStore;
