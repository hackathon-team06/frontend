import api from "./axios";

// 월 별 스탬프 달력 조회
export const getStampCalendar = async (year, month) => {
  const response = await api.get("/api/stamps/calendar", {
    params: {
      year,
      month,
    },
  });

  return response.data;
};
