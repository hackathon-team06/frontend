import api from "./axios";

/** 내 정보 조회. 진단으로 저장한 값과 누적 포인트가 함께 옵니다. */
export async function getMe() {
  const res = await api.get("/api/users/me");

  return res.data;
}

/**
 * 닉네임 수정. 2~20자여야 합니다.
 *
 * 갱신된 내 정보(UserResponse)를 그대로 돌려줍니다.
 */
export async function updateNickname(nickname) {
  const res = await api.patch("/api/users/nickname", { nickname });

  return res.data;
}
