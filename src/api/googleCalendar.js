import api from "./axios";

export async function getConnectUrl() {
  const res = await api.get("/api/google-calendar/connect-url");

  return res.data;
}
