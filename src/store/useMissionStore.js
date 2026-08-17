import { create } from "zustand";
import { persist } from "zustand/middleware";

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

/**
 * 미션 상태.
 *
 * 포인트 지급 이력만 localStorage 에 저장합니다. 미션 목록과 완료 체크는
 * 저장하지 않습니다. 서버 미션을 연동하면 목록은 서버가 진실이 되고,
 * 완료 여부도 stepId 기준으로 다시 잡아야 하기 때문입니다.
 */
const useMissionStore = create(
  persist(
    (set) => ({
  morningMissions: morningMissionData,
  eveningMissions: eveningMissionData,

  // 저녁 미션을 받은 날짜(yyyy-MM-dd).
  //
  // 저녁 미션은 그날 피부 상태를 체크하고 받는 것이라 하루에 한 번만 받습니다.
  // 예전에는 Home 의 로컬 state 라서, 마이페이지처럼 다른 화면에 갔다 오면
  // Home 이 새로 마운트되며 초기화돼 매번 다시 받아야 했습니다.
  eveningSetDate: null,

  showMissionSelection: false,
  pendingMissionType: "morning",

  // 확정 전까지 들고 있는 수정본
  pendingMissions: [],
  pendingRecommendedMissions: [],

  // 포인트 지급 이력을 남긴 날짜(yyyy-MM-dd).
  //
  // 이력은 localStorage 에 저장해서 새로고침해도 중복 적립되지 않게 합니다.
  // 다만 미션 id 가 목데이터라 매일 똑같아서, 날짜 없이 저장하면 내일도 모레도
  // 포인트를 못 받게 됩니다. 그래서 날짜를 함께 두고 오늘 것만 유효하게 봅니다.
  //
  // TODO(백엔드 연동): 서버 미션을 쓰면 키가 stepId 라 날마다 달라지므로
  // 이 날짜 처리는 걷어내고 이력만 저장하면 됩니다.
  awardedDate: null,

  // 이미 포인트를 준 미션. "morning-1" 처럼 탭 이름을 붙여 기록합니다.
  //
  // 아침과 저녁 미션의 id 가 둘 다 1, 2, 3 이라 id 만으로는 구분되지 않습니다.
  // 체크를 풀었다 다시 눌러도 여기 남아 있어 중복 적립되지 않습니다.
  awardedMissionKeys: [],

  // 아침·저녁을 모두 끝냈을 때 주는 보너스 2점의 지급 여부
  bonusAwarded: false,

  setMissionsByType: (missionType, missions) =>
    set({
      [getMissionKey(missionType)]: missions,
    }),

  // 지급 이력을 남깁니다. 저장된 이력이 어제 것이면 버리고 오늘 것부터 다시 셉니다.
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
    set({ awardedDate: today, bonusAwarded: true }),

  // 오늘 저녁 미션을 받았다고 표시합니다. 인자는 yyyy-MM-dd 문자열입니다.
  markEveningMissionsSet: (dateKey) => set({ eveningSetDate: dateKey }),

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
