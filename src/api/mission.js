import api from "./axios";

// 주간 미션 완료 현황 조회
export const getWeeklyMissionStatus = async (date) => {
  const response = await api.get("/api/missions/week", { params: { date } });

  return response.data;
};

// 아침 생활 루틴 선택지 조회
export const getMorningRoutineOptions = async () => {
  const response = await api.get("/api/missions/morning-routine/options");
  return response.data;
};

// 아침 생활 루틴 설문 저장
export const saveMorningRoutineSurvey = async (items) => {
  const response = await api.post("/api/missions/morning-routine/survey", {
    items,
  });

  return response.data;
};

// 아침 고정 미션 AI 추천
export const getMorningRoutineRecommendations = async (categories = []) => {
  const response = await api.post(
    "/api/missions/morning-routine/recommendations",
    {
      categories,
    },
  );

  return response.data;
};

// 현재 고정 아침 미션 조회
export const getMorningRoutine = async () => {
  const response = await api.get("/api/missions/morning-routine");
  return response.data;
};

// 아침 고정 미션 선택 및 확정
export const saveMorningRoutine = async (items) => {
  const response = await api.post("/api/missions/morning-routine", {
    items,
  });

  return response.data;
};

// 미션 공통 옵션 조회
export const getMissionOptions = async () => {
  const response = await api.get("/api/missions/options");
  return response.data;
};

// 오늘 미션 조회
export const getTodayMissions = async () => {
  const response = await api.get("/api/missions/today");
  return response.data;
};

// 오늘 아침 미션 생성 또는 조회
export const createMorningMission = async () => {
  const response = await api.post("/api/missions/morning");
  return response.data;
};
