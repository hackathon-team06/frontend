import OnboardingStatus from "../../../components/common/OnboardingStatus/OnboardingStatus";
import RoutineOption from "../../../components/common/RoutineOption/RoutineOption";
import OnboardingButton from "../../../components/common/OnboardingButton/OnboardingButton";
import useOnboardingStore from "../../../store/useOnboardingStore";

export default function RoutineStep({ onNext, onBack, disabled = false, errorMessage = "" }) {

  const selectedDay = useOnboardingStore((state) => state.routine);
  const setSelectedDay = useOnboardingStore((state) => state.setRoutine);

  const days = [14, 21, 28];

  return (
    <div className="relative min-h-[780px]">
      <OnboardingStatus
        step="routine"
        onBack={onBack}
        progressWidth={330}
        characterLeft={285}
      />
      <header className="flex flex-col mt-12 ml-[40px]">
        <p className="text-cyan-900 text-base font-semibold leading-6 tracking-tight">
          거의 다 왔어요!
        </p>
        <p className="text-cyan-900 text-3xl font-bold leading-[51.20px] tracking-wide">
          얼마마다 루틴 알림
          <span className="text-cyan-900 text-3xl font-semibold leading-[51.20px] tracking-wide">
            을
          </span>
          <br />
          <span className="text-cyan-900 text-2xl font-semibold leading-10 tracking-wide">
            받아볼까요?
          </span>
        </p>
      </header>
      <main className="flex flex-col gap-6 mt-[49px] items-center">
        <section className="flex flex-col items-center gap-3">
          <RoutineOption
            day={7}
            recommended
            selected={selectedDay === 7}
            onClick={() => setSelectedDay(7)}
          />
          <p className="text-slate-500 text-xs font-medium leading-4">
            처음이라면 7일 주기를 추천해요!
          </p>
        </section>
        <section className="flex flex-col gap-3 items-center">
          {days.map((day) => (
            <RoutineOption
              key={day}
              day={day}
              selected={selectedDay === day}
              onClick={() => setSelectedDay(day)}
            />
          ))}
        </section>
      </main>
      {errorMessage && (
        <p className="absolute bottom-[110px] w-full text-center text-[13px] font-medium text-sale">
          {errorMessage}
        </p>
      )}

      <OnboardingButton
        title="다음"
        onClick={onNext}
        disabled={disabled}
      />
    </div>
  );
}
