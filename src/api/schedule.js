import api from "./axios";

export const createSchedule = async (schedule) => {
    
  const response = await api.post("/api/schedules", schedule);
  return response.data;
};
