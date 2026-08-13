import { useState } from "react";
import useOnboardingStore from "../../store/useOnboardingStore";
import OnboardingButton from "../../components/common/OnboardingButton/OnboardingButton";

export default function RoutineSetting() {
  const [routine, setRoutine] = useState("");

  const customRoutines = useOnboardingStore((state) => state.customRoutines);
  const addCustomRoutine = useOnboardingStore(
    (state) => state.addCustomRoutine,
  );

  const addRoutine = () => {
    const trimmedRoutine = routine.trim();

    if (!trimmedRoutine) return;
    addCustomRoutine(trimmedRoutine);

    setRoutine(""); // 입력창 초기화
  };

  return (
    <div className="relative min-h-[730px]">
      <header className="flex flex-col mt-[116px] ml-[40px]">
        <p className="text-cyan-900 text-3xl font-bold leading-[51.20px] tracking-wide">
          딱 맞는 루틴이 없나요?
        </p>

        <p className="text-cyan-900 text-base font-semibold leading-6 tracking-tight">
          내 생활에 맞게 직접 만들어보세요
        </p>
      </header>

      {/* 루틴 입력 */}
      <section className="flex gap-[10px] mt-[38px] justify-center">
        <input
          value={routine}
          onChange={(e) => setRoutine(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addRoutine();
            }
          }}
          placeholder="루틴을 추가해보세요"
          className="
            w-[251px]
            h-[52px]
            px-[16px]
            bg-neutral-50
            rounded-xl
            outline-1
            outline-offset-[-1px]
            outline-zinc-300
            text-slate-500
            text-sm
            placeholder:text-zinc-300
            placeholder:text-base
            placeholder:font-medium
          "
        />

        <button
          type="button"
          onClick={addRoutine}
          className="
            w-[89px]
            h-[46px]
            bg-[#65DBBE]
            rounded-lg
            inline-flex
            justify-center
            items-center
            text-neutral-50
            text-sm
            font-semibold
            leading-6
            cursor-pointer
          "
        >
          추가하기
        </button>
      </section>

      <footer className="mt-[221px] mx-[26px]">
        <p className="text-slate-500 text-xs font-semibold leading-5 tracking-tight">
          추가된 루틴
        </p>

        <div className="flex flex-col gap-[10px] mt-[12px]">
          {customRoutines.map((item, index) => (
            <div
              key={index}
              className="
                w-full
                min-h-[52px]
                px-[16px]
                bg-neutral-50
                rounded-xl
                flex
                items-center
                text-slate-500
                text-sm
                font-medium
              "
            >
              {item}
            </div>
          ))}
        </div>
      </footer>
      <OnboardingButton title="다음" className="absolute bottom-0" />
    </div>
  );
}
