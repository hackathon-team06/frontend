import api from "./axios";

/**
 * 구글 인증 URL 조회.
 *
 * 돌려받은 authorizationUrl 로 사용자를 보내면 구글 동의 화면이 뜹니다.
 * 동의가 끝나면 구글이 백엔드 콜백으로 보내고, 백엔드가 다시 우리 앱의
 * /home?calendar=connected (실패는 calendar=failed) 로 돌려보냅니다.
 *
 * @returns {Promise<{ authorizationUrl: string }>}
 */
export async function getConnectUrl() {
  const res = await api.get("/api/google-calendar/connect-url");

  return res.data;
}
