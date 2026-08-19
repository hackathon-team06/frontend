import {
  getMorningRoutine,
  getMorningRoutineRecommendations,
  saveMorningRoutine,
} from "../api/mission";

// 고정 아침 미션 최대 개수
const MAX_ROUTINE_ITEMS = 3;

// 고정 미션이 이미 3개일 때 서버가 내려주는 코드
const ROUTINE_FULL = "MISSION4005";

const isRoutineFullError = (error) =>
  error.response?.data?.code === ROUTINE_FULL;

// 아침 고정 미션 추천. 이미 3개면 저장된 미션을 대신 반환
export const getMorningRoutineRecommendationsSafely = async (
  categories = [],
) => {
  try {
    return await getMorningRoutineRecommendations(categories);
  } catch (error) {
    if (!isRoutineFullError(error)) throw error;

    const routine = await getMorningRoutine();

    return {
      recommendations: (routine.items ?? []).map((item) => item.content),
    };
  }
};

// 남은 자리만큼만 고정 아침 미션 저장. 자리가 없으면 건너뜀
export const saveMorningRoutineWithinLimit = async (items) => {
  try {
    await saveMorningRoutine(items.slice(0, MAX_ROUTINE_ITEMS));
    return await getMorningRoutine();
  } catch (error) {
    if (!isRoutineFullError(error)) throw error;

    return await getMorningRoutine();
  }
};
