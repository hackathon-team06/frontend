import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  guessIconFromContent,
  iconFromCategory,
} from "../utils/missionIcon";

// 탭 이름 -> 미션 목록 키
const getMissionKey = (missionType) =>
  missionType === "morning"
    ? "morningMissions"
    : "eveningMissions";

// 미션 하나당 주는 포인트
const POINT_PER_MISSION = 1;

// 날짜별 미션 조회 API 응답을 화면에서 사용하는 형태로 변환
const convertTodayMission = (
  mission,
  categoryByContent = {},
) => {
  if (!mission) return [];

  return (mission.steps ?? []).map(
    (step) => ({
      id: step.stepId,
      icon: categoryByContent[
        step.content
      ]
        ? iconFromCategory(
            categoryByContent[
              step.content
            ],
            step.content,
          )
        : guessIconFromContent(
            step.content,
          ),
      title: step.content,
      subtitle: "",
      point: POINT_PER_MISSION,
      completed: step.completed,
      removed: false,
    }),
  );
};

const useMissionStore = create(
  persist(
    (set) => ({
      // 오늘 날짜
      missionDate: null,

      // 오늘 미션
      morningMissions: [],
      eveningMissions: [],

      // 저녁 미션 생성 날짜
      eveningSetDate: null,

      // 오늘 미션 조회 API 응답 반영
      setTodayMissions: (
        data,
        categoryByContent = {},
      ) =>
        set({
          morningMissions:
            convertTodayMission(
              data.morningMission,
              categoryByContent,
            ),

          eveningMissions:
            convertTodayMission(
              data.eveningMission,
            ),
        }),

      syncMissionDate: (today) =>
        set((state) => {
          if (
            state.missionDate === today
          ) {
            return {};
          }

          return {
            missionDate: today,
            morningMissions: [],
            eveningMissions: [],
            eveningSetDate: null,
          };
        }),

      showMissionSelection: false,
      pendingMissionType: "morning",

      pendingMissions: [],
      pendingRecommendedMissions: [],

      setMissionsByType: (
        missionType,
        missions,
      ) =>
        set({
          [getMissionKey(missionType)]:
            missions,
        }),

      markEveningMissionsSet: (
        dateKey,
      ) =>
        set({
          eveningSetDate: dateKey,
        }),

      setPendingMissionSelection: (
        missionType,
        missions,
        recommendedMissions,
      ) =>
        set({
          showMissionSelection: true,
          pendingMissionType:
            missionType,
          pendingMissions: missions,
          pendingRecommendedMissions:
            recommendedMissions,
        }),

      clearPendingMissionSelection:
        () =>
          set({
            showMissionSelection: false,
            pendingMissionType:
              "morning",
            pendingMissions: [],
            pendingRecommendedMissions:
              [],
          }),
    }),

    {
      name: "mission-storage",

      // 새로고침 후에도 유지할 값들
      partialize: (state) => ({
        missionDate:
          state.missionDate,

        eveningSetDate:
          state.eveningSetDate,
      }),
    },
  ),
);

export default useMissionStore;