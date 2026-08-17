import api from "./axios";

// 주간 미션 완료 현황 조회
export const getWeeklyMissionStatus = async (date) => {
  const response = await api.get("/api/missions/week", { params: { date } });

  return response.data;
};
