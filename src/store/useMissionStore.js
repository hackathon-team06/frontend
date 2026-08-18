import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  morningMissionData,
  eveningMissionData,
} from "../constants/home/missionData";

// 탭 이름 -> 미션 목록 키
const getMissionKey = (missionType) =>
  missionType === "morning" ? "morningMissions" : "eveningMissions";

// 오늘 미션 조회 API 응답을 화면에서 사용하는 미션 형태로 변환
const convertTodayMission = (mission, fallbackData) => {
  if (!mission) return [];

  return mission.steps.map((step, index) => ({
    id: mission.stepIds[index],
    icon: fallbackData[index]?.icon,
    title: step,
    subtitle: "",
    point: fallbackData[index]?.point ?? 1,
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

      // 오늘 미션 조회 API 응답 반영
      setTodayMissions: (data) =>
        set({
          morningMissions: convertTodayMission(
            data.morningMission,
            morningMissionData,
          ),
          eveningMissions: convertTodayMission(
            data.eveningMission,
            eveningMissionData,
          ),
        }),

      // 저녁 미션만 반영. setTodayMissions 는 아침까지 덮어씀
      setEveningMission: (mission) =>
        set({
          eveningMissions: convertTodayMission(mission, eveningMissionData),
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