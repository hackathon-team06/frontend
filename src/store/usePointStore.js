import { create } from "zustand";
import { persist } from "zustand/middleware";

/** 시작 포인트. 백엔드 연동 시 서버에서 받아온 값으로 교체합니다. */
export const INITIAL_POINT = 2179;

/**
 * 보유 포인트.
 *
 * 미션을 완료하면 늘어나고, 제품 화면의 "포인트 사용시" 금액 계산에도 쓰입니다.
 * persist 미들웨어로 localStorage 에 저장하므로 새로고침해도 유지됩니다.
 */
const usePointStore = create(
  persist(
    (set) => ({
      // 데이터
      point: INITIAL_POINT,

      // 함수
      addPoint: (amount) =>
        set((state) => ({ point: state.point + amount })),
    }),
    {
      name: "point-storage",
    },
  ),
);

export default usePointStore;
