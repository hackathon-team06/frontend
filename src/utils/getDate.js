// 요일 유틸 함수
export const getDate = (dateString) => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[new Date(dateString).getDay()];
};

// 서버 전송용 yyyy-MM-dd
// toISOString 은 UTC 라 새벽에 하루가 밀려서 직접 만듦
export const formatApiDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// 화면 표시용 현재 날짜 + 시간
export const formatCurrentDateTime = (date = new Date()) => {
  const formattedDate = date.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const formattedTime = date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${formattedDate} ${formattedTime}`;
};