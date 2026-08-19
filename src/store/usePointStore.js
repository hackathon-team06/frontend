import { create } from "zustand";

import { getMyPoint } from "../api/point";

// 마지막 요청 번호. 응답 순서 꼬임 방지
let lastRequestId = 0;

const usePointStore = create((set, get) => ({
  // 데이터
  point: 0,
  status: "idle", // "idle" | "loading" | "error"

  // 함수
  fetchPoint: async () => {
    lastRequestId += 1;

    const requestId = lastRequestId;

    set({ status: "loading" });

    try {
      const data = await getMyPoint();

      // 뒤늦게 도착한 응답
      if (requestId !== lastRequestId) return get().point;

      set({ point: data.point, status: "idle" });

      return data.point;
    } catch (error) {
      console.error("포인트 조회 실패:", error);

      if (requestId === lastRequestId) {
        set({ status: "error" });
      }

      return get().point;
    }
  },
}));

export default usePointStore;
