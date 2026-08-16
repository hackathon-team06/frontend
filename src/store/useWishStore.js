import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * 찜한 상품 상태.
 *
 * 상품 id 만 저장하고, 상품 정보는 src/mocks/products.js 에서 id 로 찾아 씁니다.
 * 백엔드 연동 시 이 스토어 내부만 API 호출로 바꾸면 화면 코드는 그대로 쓸 수 있습니다.
 *
 * persist 미들웨어로 localStorage 에 저장하므로 새로고침해도 유지됩니다.
 */
const useWishStore = create(
  persist(
    (set) => ({
      // 데이터
      likedIds: [],

      // 함수
      toggleLike: (id) =>
        set((state) => ({
          likedIds: state.likedIds.includes(id)
            ? state.likedIds.filter((likedId) => likedId !== id)
            : [...state.likedIds, id],
        })),

      clearAll: () => set({ likedIds: [] }),
    }),
    {
      name: "wish-storage",
    },
  ),
);

export default useWishStore;
