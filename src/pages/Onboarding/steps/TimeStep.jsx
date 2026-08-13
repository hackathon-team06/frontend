import OnboardingStatus from "../../../components/common/OnboardingStatus/OnboardingStatus";
import OnboardingButton from "../../../components/common/OnboardingButton/OnboardingButton";
import TimeModal from "../../../components/common/TimeModal/TimeModal";
import InfoBox from "../../../components/common/InfoBox/InfoBox";
import useOnboardingStore from "../../../store/useOnboardingStore";

import { useState } from "react";

export default function TimeStep({ type, onNext, onBack }) {
  const isWakeup = type === "wakeup";

  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);

  const morningTime = useOnboardingStore((state) => state.morningTime);
  const eveningTime = useOnboardingStore((state) => state.eveningTime);
  const setMorningTime = useOnboardingStore((state) => state.setMorningTime);
  const setEveningTime = useOnboardingStore((state) => state.setEveningTime);

  const selectedTime = isWakeup ? morningTime : eveningTime;
  const [selectedHour, selectedMinute] = selectedTime.split(":");

  return (
    <div className="relative min-h-[766px]">
      {/* 진행도 */}
      <OnboardingStatus
        step={type}
        onBack={onBack}
        progressWidth={isWakeup ? 110 : 170}
        characterLeft={isWakeup ? 65 : 120}
      />

      {/* 질문 */}
      <header className="flex flex-col ml-[40px] mt-[48px]">
        <p className="text-cyan-900 text-base font-semibold leading-6 tracking-tight">
          {isWakeup
            ? "평균적인 기상시간을 알려주세요"
            : "평균적인 귀가 시간을 알려주세요"}
        </p>

        <p className="mt-[4px] text-cyan-900 text-2xl font-semibold leading-10 tracking-wide">
          {isWakeup
            ? "보통 몇시에 일어나세요?"
            : "보통 몇시에 집에 돌아오세요?"}
        </p>

        <p className="mt-[10px] text-neutral-400 text-xs font-medium leading-5 tracking-tight">
          {isWakeup ? (
            <>
              평소 기상 시간을 알려주시면
              <br />
              맞춤 분석에 도움이 돼요.
            </>
          ) : (
            <>
              평소 귀가 시간을 알려주시면
              <br />
              하루 루틴을 맞추는데 도움이 돼요.
            </>
          )}
        </p>
      </header>

      {/* 시간 선택 */}
      <main className="flex flex-col items-center">
        <button
          onClick={() => setIsTimeModalOpen(true)}
          className="cursor-pointer mt-[37px] text-zinc-300 text-7xl font-bold leading-[128px]"
        >
          {selectedHour}:{selectedMinute}
        </button>

        <p className="text-neutral-400 text-xs font-medium leading-5 tracking-tight">
          시간을 눌러 변경할 수 있어요
        </p>
      </main>

      <InfoBox type={isWakeup ? "morning" : "evening"} />

      <OnboardingButton title="다음" onClick={onNext} />

      {/* 시간 선택 모달 */}
      {isTimeModalOpen && (
        <TimeModal
          initialHour={selectedHour}
          initialMinute={selectedMinute}
          onClose={() => setIsTimeModalOpen(false)}
          onSelect={(hour, minute) => {
            const selectedTime = `${hour}:${minute}`;

            if (isWakeup) {
              setMorningTime(selectedTime);
            } else {
              setEveningTime(selectedTime);
            }
          }}
        />
      )}
    </div>
  );
}
