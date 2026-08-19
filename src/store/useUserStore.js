import { create } from "zustand";

import { getMe } from "../api/user";
import useAuthStore from "./useAuthStore";

const useUserStore = create((set, get) => ({
  user: null,
  status: "idle", // "idle" | "loading" | "error"

  setUser: (user) => set({ user, status: "idle" }),

  clear: () => set({ user: null, status: "idle" }),

  fetchUser: async () => {
    if (get().status === "loading") return get().user;

    set({ status: "loading" });

    try {
      const user = await getMe();

      set({ user, status: "idle" });

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
