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

// 오늘 미션 조회 API 응답을 화면에서 사용하는 형태로 변환
const convertTodayMission = (
  mission,
  categoryByContent = {},
) => {
  if (!mission) return [];

  return mission.steps.map((step, index) => ({
    id: mission.stepIds[index],
    icon: categoryByContent[step]
      ? iconFromCategory(
          categoryByContent[step],
          step,
        )
      : guessIconFromContent(step),
    title: step,
    subtitle: "",
    point: POINT_PER_MISSION,
    completed: false,
    removed: false,
  }));
};

// 제거한 자리에 추천 미션 채우기
const replaceRemovedMissions = (
  missions,
  recommendedMissions,
) => {
  let recommendedIndex = 0;

  return missions.map((mission) => {
    if (!mission.removed) {
      return mission;
    }

    const recommended =
      recommendedMissions[recommendedIndex];

    recommendedIndex += 1;

    if (!recommended) {
      return {
        ...mission,
        removed: false,
      };
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
    (set, get) => ({
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
      ) => {
        const previousMorning =
          get().morningMissions ?? [];

        const previousEvening =
          get().eveningMissions ?? [];

        const mergeCompletedState = (
          newMissions,
          previousMissions,
        ) =>
          newMissions.map((mission) => {
            const previous =
              previousMissions.find(
                (item) =>
                  item.id === mission.id,
              );

            return {
              ...mission,
              completed:
                previous?.completed ??
                mission.completed,
            };
          });

        const newMorningMissions =
          convertTodayMission(
            data.morningMission,
            categoryByContent,
          );

        const newEveningMissions =
          convertTodayMission(
            data.eveningMission,
          );

        set({
          morningMissions:
            mergeCompletedState(
              newMorningMissions,
              previousMorning,
            ),

          eveningMissions:
            mergeCompletedState(
              newEveningMissions,
              previousEvening,
            ),
        });
      },

      // 저녁 미션 생성 직후 반영
      setEveningMission: (mission) =>
        set({
          eveningMissions:
            convertTodayMission(mission),
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

      applyMissionEdit: (
        missionType,
        missions,
        recommendedMissions,
      ) =>
        set({
          [getMissionKey(missionType)]:
            replaceRemovedMissions(
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

        morningMissions:
          state.morningMissions,

        eveningMissions:
          state.eveningMissions,

        eveningSetDate:
          state.eveningSetDate,
      }),
    },
  ),
);

export default useMissionStore;