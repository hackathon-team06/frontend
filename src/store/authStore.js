import { create } from "zustand";

const useAuthStore = create((set) => ({
    isLoggedIn: false,
    userId: null,
    login: (userId) => set({ isLoggedIn: true, userId }),
}));

export default useAuthStore;
