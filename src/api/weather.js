import api from "./axios";

export const getWeatherMessage = async () => {
  const response = await api.get("/api/weather-message");

  return response.data;
};
