import { create } from "zustand";
import { persist } from "zustand/middleware";

const useOnboardingStore = create(
    persist(
        (set) => ({
            answers: {},
            hasCompletedOnboarding: false,
            completeOnboarding: (answers) => set({ answers, hasCompletedOnboarding: true }),
        }),
        { name: "staycare-onboarding" }
    )
);

export default useOnboardingStore;
