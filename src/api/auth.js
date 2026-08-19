import api from "./axios";

export async function login() {
  const res = await api.post("/api/users/login", {
    loginId: import.meta.env.VITE_TEST_LOGIN_ID,
    password: import.meta.env.VITE_TEST_PASSWORD,
  });

  // { accessToken, refreshToken, tokenType, userId }
  return res.data;
}
