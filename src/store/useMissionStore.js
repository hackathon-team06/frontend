import { create } from "zustand";
import {
  morningMissionData,
  eveningMissionData,
} from "../constants/home/missionData";

// 탭 이름 -> 미션 목록 키
const getMissionKey = (missionType) =>
  missionType === "morning" ? "morningMissions" : "eveningMissions";

// 제거한 자리에 추천 미션 채우기. 포인트는 원래 미션 값 그대로 승계
const replaceRemovedMissions = (missions, recommendedMissions) => {
  let recommendedIndex = 0;

  return missions.map((mission) => {
    if (!mission.removed) {
      return mission;
    }

    const recommended = recommendedMissions[recommendedIndex];

    recommendedIndex += 1;

    // 추천 미션이 모자라면 원래 미션 유지
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

const useMissionStore = create((set) => ({
  morningMissions: morningMissionData,
  eveningMissions: eveningMissionData,

  showMissionSelection: false,
  pendingMissionType: "morning",

  // 확정 전까지 들고 있는 수정본
  pendingMissions: [],
  pendingRecommendedMissions: [],

  // 이미 포인트를 준 미션 세트. 체크를 풀었다 다시 눌러도 중복 적립하지 않습니다.
  awardedTabs: [],

  setMissionsByType: (missionType, missions) =>
    set({
      [getMissionKey(missionType)]: missions,
    }),

  addAwardedTab: (missionType) =>
    set((state) => ({
      awardedTabs: [...state.awardedTabs, missionType],
    })),

  // 미션 수정 확정. 미션 선정 화면에서 시작하기를 눌렀을 때만 호출
  applyMissionEdit: (missionType, missions, recommendedMissions) =>
    set({
      [getMissionKey(missionType)]: replaceRemovedMissions(
        missions,
        recommendedMissions,
      ),
    }),

  setPendingMissionSelection: (missionType, missions, recommendedMissions) =>
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
}));

export default useMissionStore;
