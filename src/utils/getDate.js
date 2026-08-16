//요일 유틸 함수

export const getDate = (dateString) => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[new Date(dateString).getDay()];
};

/**
 * 서버에 넘길 yyyy-MM-dd 문자열.
 *
 * toISOString() 은 UTC 라 새벽에 쓰면 하루가 밀립니다.
 * (한국 시간 8월 16일 오전 3시 -> "2026-08-15")
 * 그래서 로컬 날짜를 직접 붙여서 만듭니다.
 */
export const formatApiDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
