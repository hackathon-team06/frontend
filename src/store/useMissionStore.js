import { create } from "zustand";
import {
  morningMissionData,
  eveningMissionData,
} from "../constants/home/missionData";

const useMissionStore = create((set) => ({
  morningMissions: morningMissionData,
  eveningMissions: eveningMissionData,

  showMissionSelection: false,
  pendingMissionType: "morning",
  pendingRecommendedMissions: [],

  setMorningMissions: (missions) =>
    set({
      morningMissions: missions,
    }),

  setEveningMissions: (missions) =>
    set({
      eveningMissions: missions,
    }),

  setPendingMissionSelection: (missionType, missions) =>
    set({
      showMissionSelection: true,
      pendingMissionType: missionType,
      pendingRecommendedMissions: missions,
    }),

  clearPendingMissionSelection: () =>
    set({
      showMissionSelection: false,
      pendingMissionType: "morning",
      pendingRecommendedMissions: [],
    }),
}));

export default useMissionStore;