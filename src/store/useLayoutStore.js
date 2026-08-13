import { create } from "zustand";

//푸터 숨김을 위한 store
const useLayoutStore = create((set) => ({
  hideFooter: false,
  setHideFooter: (value) => set({ hideFooter: value }),
}));

export default useLayoutStore;
