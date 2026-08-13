//요일 유틸 함수

export const getDate = (dateString) => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[new Date(dateString).getDay()];
};
