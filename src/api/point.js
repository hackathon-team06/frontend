import api from "./axios";

// 보유 포인트 조회
export const getMyPoint = async () => {
  const response = await api.get("/api/points/me");
  return response.data;
};
