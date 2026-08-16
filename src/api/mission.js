import api from "./axios";

/**
 * 주간 미션 완료 현황.
 *
 * 넘긴 날짜가 속한 주의 월요일~일요일 7일치를 돌려줍니다.
 * completed 는 그날 아침·저녁 미션을 모두 끝냈을 때만 true 이고,
 * 하나라도 남아 있거나 아직 안 만들었으면 false 입니다. 미래 날짜도 항상 false 입니다.
 *
 * @param {string} date 기준 날짜. yyyy-MM-dd
 * @returns {Promise<{
 *   startDate: string,
 *   endDate: string,
 *   days: { date: string, completed: boolean }[],
 * }>}
 */
export const getWeeklyMissionStatus = async (date) => {
  const response = await api.get("/api/missions/week", { params: { date } });

  return response.data;
};
