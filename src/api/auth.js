import api from "./axios";

/**
 * 로그인.
 *
 * 회원가입 API 가 없어 정해진 테스트 계정으로만 로그인합니다.
 * 계정 정보는 .env 에 두고 팀원끼리 값을 공유합니다.
 */
export async function login() {
  const res = await api.post("/api/users/login", {
    loginId: import.meta.env.VITE_TEST_LOGIN_ID,
    password: import.meta.env.VITE_TEST_PASSWORD,
  });

  // { accessToken, refreshToken, tokenType, userId }
  return res.data;
}

/** 내 정보 조회 */
export async function getMe() {
  const res = await api.get("/api/users/me");

  return res.data;
}
