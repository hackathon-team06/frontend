import axios from "axios";

import useAuthStore from "../store/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 모든 요청에 로그인 토큰을 붙입니다.
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// 토큰이 만료되면(401) 로그인 화면으로 되돌립니다.
// TODO(백엔드 확인): 토큰 갱신 API 가 생기면 여기서 재발급 후 재요청하도록 바꿉니다.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isUnauthorized = error.response?.status === 401;
    const isLoginRequest = error.config?.url?.includes("/api/users/login");

    if (isUnauthorized && !isLoginRequest) {
      useAuthStore.getState().logout();

      // 이미 로그인 화면이면 그대로 둡니다.
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
