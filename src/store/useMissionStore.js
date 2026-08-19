import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  guessIconFromContent,
  iconFromCategory,
} from "../utils/missionIcon";

// 탭 이름 -> 미션 목록 키
const getMissionKey = (missionType) =>
  missionType === "morning" ? "morningMissions" : "eveningMissions";

// 미션 하나당 주는 포인트. 서버가 포인트를 내려주지 않아 프론트에서 정합니다
const POINT_PER_MISSION = 1;

// 오늘 미션 조회 API 응답을 화면에서 사용하는 미션 형태로 변환.
//
// 서버는 아이콘을 주지 않습니다.
// 아침은 고정 아침 미션의 category 로, 저녁은 문장에서 짐작해 정합니다.
const convertTodayMission = (mission, categoryByContent = {}) => {
  if (!mission) return [];

  return mission.steps.map((step, index) => ({
    id: mission.stepIds[index],
    icon: categoryByContent[step]
      ? iconFromCategory(categoryByContent[step], step)
      : guessIconFromContent(step),
    title: step,
    subtitle: "",
    point: POINT_PER_MISSION,
    completed: false,
    removed: false,
  }));
};

// 제거한 자리에 추천 미션 채우기. 포인트는 원래 미션 값 그대로 승계
const replaceRemovedMissions = (missions, recommendedMissions) => {
  let recommendedIndex = 0;

  return missions.map((mission) => {
    if (!mission.removed) {
      return mission;
    }

    const recommended = recommendedMissions[recommendedIndex];

    recommendedIndex += 1;

    if (!recommended) {
      return { ...mission, removed: false };
    }

    return {
      id: recommended.id,
      icon: recommended.icon,
      title: recommended.title,
      subtitle: "",
      point: mission.point,
      completed: false,
      removed: false,
    };
  });
};

const useMissionStore = create(
  persist(
    (set) => ({
      morningMissions: [],
      eveningMissions: [],

      // 오늘 미션 조회 API 응답 반영.
      // categoryByContent 는 고정 아침 미션에서 뽑은 "문장 -> 카테고리" 로,
      // 아침 미션 아이콘을 정하는 데 씁니다.
      setTodayMissions: (data, categoryByContent = {}) =>
        set({
          morningMissions: convertTodayMission(
            data.morningMission,
            categoryByContent,
          ),
          eveningMissions: convertTodayMission(data.eveningMission),
        }),

      // 저녁 미션만 반영. setTodayMissions 는 아침까지 덮어씀
      setEveningMission: (mission) =>
        set({
          eveningMissions: convertTodayMission(mission),
        }),

      eveningSetDate: null,

      showMissionSelection: false,
      pendingMissionType: "morning",

      pendingMissions: [],
      pendingRecommendedMissions: [],

      awardedDate: null,
      awardedMissionKeys: [],
      bonusAwarded: false,

      setMissionsByType: (missionType, missions) =>
        set({
          [getMissionKey(missionType)]: missions,
        }),

      addAwardedMissionKey: (missionKey, today) =>
        set((state) => {
          const isToday = state.awardedDate === today;

          return {
            awardedDate: today,
            awardedMissionKeys: isToday
              ? [...state.awardedMissionKeys, missionKey]
              : [missionKey],
            bonusAwarded: isToday ? state.bonusAwarded : false,
          };
        }),

      markBonusAwarded: (today) =>
        set({
          awardedDate: today,
          bonusAwarded: true,
        }),

      markEveningMissionsSet: (dateKey) =>
        set({
          eveningSetDate: dateKey,
        }),

      applyMissionEdit: (missionType, missions, recommendedMissions) =>
        set({
          [getMissionKey(missionType)]: replaceRemovedMissions(
            missions,
            recommendedMissions,
          ),
        }),

      setPendingMissionSelection: (
        missionType,
        missions,
        recommendedMissions,
      ) =>
        set({
          showMissionSelection: true,
          pendingMissionType: missionType,
          pendingMissions: missions,
          pendingRecommendedMissions: recommendedMissions,
        }),

      clearPendingMissionSelection: () =>
        set({
          showMissionSelection: false,
          pendingMissionType: "morning",
          pendingMissions: [],
          pendingRecommendedMissions: [],
        }),
    }),
    {
      name: "mission-storage",

      partialize: (state) => ({
        awardedDate: state.awardedDate,
        awardedMissionKeys: state.awardedMissionKeys,
        bonusAwarded: state.bonusAwarded,
      }),
    },
  ),
);

export default useMissionStore;