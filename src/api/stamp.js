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

// 마이페이지 스탬프북 카드 조회
export const getStampBooks = async () => {
  const response = await api.get("/api/stamps/books");

  return response.data;
};
