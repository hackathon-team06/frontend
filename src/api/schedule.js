import api from "./axios";

// 일정 등록
export const createSchedule = async (schedule) => {
  const response = await api.post("/api/schedules", schedule);
  return response.data;
};

// 일정 수정
export const updateSchedule = async (scheduleId, schedule) => {
  const response = await api.patch(`/api/schedules/${scheduleId}`, schedule);
  return response.data;
};

// 날짜 별 일정 조회
export const getSchedulesByDate = async (userId, date) => {
  const response = await api.get("/api/schedules/date", {
    params: {
      userId,
      date,
    },
  });

  return response.data;
};

// 일정 삭제
export const deleteSchedule = async (scheduleId) => {
  const response = await api.delete(`/api/schedules/${scheduleId}`);
  return response.data;
};
