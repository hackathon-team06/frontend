import { create } from "zustand";
import { persist } from "zustand/middleware";

const useOnboardingStore = create(
  persist(
    (set) => ({
      // 데이터
      gender: "",
      age: 23,
      morningTime: "06:00",
      eveningTime: "18:00",
      skinType: "",
      purpose: "",
      routine: 7,
      customRoutines: [],

      addCustomRoutine: (routine) =>
        set((state) => ({
          customRoutines: [...state.customRoutines, routine],
        })),

      // 함수
      setGender: (gender) => set({ gender }),
      setAge: (age) => set({ age }),
      setMorningTime: (morningTime) => set({ morningTime }),
      setEveningTime: (eveningTime) => set({ eveningTime }),
      setSkinType: (skinType) => set({ skinType }),
      setPurpose: (purpose) => set({ purpose }),
      setRoutine: (routine) => set({ routine }),
    }),
    {
      name: "onboarding-storage",
    },
  ),
);

export default useOnboardingStore;
