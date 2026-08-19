import api from "./axios";

/* 진단 결과(온보딩에서 모은 값)를 서버에 저장. 저장된 값은 이후 GET /api/users/me 응답에 담겨 옴. */
export async function createDiagnosis(payload) {
  const res = await api.post("/api/diagnoses", payload);

  return res.data;
}
