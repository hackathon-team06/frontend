import { create } from "zustand";

const useScheduleStore = create((set) => ({
  
  // 데이터
  schedules: [],

  // 함수
  addSchedule: (newSchedule) =>
    set((state) => {
      const alreadyExists = state.schedules.find(
        (schedule) => schedule.dayNumber === newSchedule.dayNumber,
      );

      // 일정 등록을 하는데 이미 일정이 있다면 새 일정으로 덮어쓰기
      if (alreadyExists) {
        return {
          schedules: state.schedules.map((schedule) =>
            schedule.dayNumber === newSchedule.dayNumber
              ? newSchedule
              : schedule,
          ),
        };
      }

      return {
        schedules: [...state.schedules, newSchedule],
      };
    }),
}));

export default useScheduleStore;
