import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OnboardingButton from "../../components/common/OnboardingButton/OnboardingButton";

const routineOptions = [
  "🍵 기상 직후 미온수 한 잔 마시기",
  "🧖🏻‍♀️ 귀가 후 10분 이내에 세안하기",
  "🧘🏻‍♀️ 잠들기 전 스트레칭으로 혈액순환 돕기",
  "💊 피부 영양제 챙겨 먹기",
  "👜 립밤/선스틱 가방에 챙기기",
  "🪟 아침 환기 5분 시키기",
  "🧴 외출 전 수분 스킨 바르기",
];

export default function RoutineSetting() {
  const location = useLocation();
  const navigate = useNavigate();

  // Result에서 선택해서 넘어온 추천 루틴
  const selectedRecommendedRoutines = location.state?.selectedRoutines ?? [];

  const [isOpen, setIsOpen] = useState(false);

  // 이 페이지에서 추가한 루틴
  const [customRoutines, setCustomRoutines] = useState([]);

  // 현재 총 선택 개수
  const totalCount = selectedRecommendedRoutines.length + customRoutines.length;

  // 앞으로 선택할 수 있는 개수
  const remainingCount = Math.max(0, 3 - totalCount);

  // 루틴 추가
  const handleRoutineSelect = (routine) => {
    if (remainingCount === 0) return;
    if (customRoutines.includes(routine)) return;

    setCustomRoutines((prev) => [...prev, routine]);
    setIsOpen(false);
  };

  // 직접 추가한 루틴 삭제
  const handleRoutineDelete = (routine) => {
    setCustomRoutines((prev) => prev.filter((item) => item !== routine));
  };

  // 다음
  const handleNext = () => {
    if (totalCount !== 3) return;

    const finalRoutines = [...selectedRecommendedRoutines, ...customRoutines];

    navigate("/onboarding/complete", {
      state: {
        routines: finalRoutines,
      },
    });
  };

  return (
    <div className="relative min-h-[730px] pb-[90px]">
      <header className="flex flex-col mt-[116px] ml-[40px]">
        <p className="text-cyan-900 text-3xl font-bold leading-[51.20px] tracking-wide">
          딱 맞는 루틴이 없나요?
        </p>
        <p className="text-cyan-900 text-base font-semibold leading-6 tracking-tight">
          내 생활에 맞게 직접 만들어보세요
        </p>
      </header>

      {/* 루틴 추가 */}
      <section className="relative mt-[38px] mx-[20px]">
        <button
          type="button"
          disabled={remainingCount === 0}
          onClick={() => {
            if (remainingCount > 0) {
              setIsOpen((prev) => !prev);
            }
          }}
          className={`
            w-full
            h-[52px]
            px-[16px]
            bg-neutral-50
            rounded-xl
            outline-1
            outline-offset-[-1px]
            text-base
            font-medium
            leading-6
            text-start
            ${
              remainingCount > 0
                ? "outline-zinc-300 text-zinc-300 cursor-pointer"
                : "outline-zinc-200 text-zinc-200 cursor-default"
            }
          `}
        >
          {remainingCount > 0
            ? `루틴을 추가해보세요 (${remainingCount}개 선택 가능)`
            : "루틴 3개 선택 완료"}
        </button>

        {/* 루틴 옵션 */}
        {isOpen && remainingCount > 0 && (
          <div
            className="
              absolute
              top-[62px]
              left-0
              z-20
              w-full
              bg-white
              rounded-xl
              border
              border-zinc-200
              shadow-lg
              overflow-hidden
            "
          >
            {routineOptions.map((routine) => {
              const isAdded = customRoutines.includes(routine);

              return (
                <button
                  key={routine}
                  disabled={isAdded}
                  onClick={() => handleRoutineSelect(routine)}
                  className={`
                    w-full
                    min-h-[52px]
                    px-[16px]
                    flex
                    items-center
                    text-left
                    text-sm
                    font-medium
                    border-b
                    border-zinc-100
                    last:border-b-0
                    ${
                      isAdded
                        ? "text-zinc-300 bg-zinc-50 cursor-default"
                        : "text-slate-500 bg-white hover:bg-[#F2FFFB] cursor-pointer"
                    }
                  `}
                >
                  {routine}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* 추가된 루틴 */}
      <section className="mt-[210px] mx-[26px]">
        <div className="mb-[12px] flex items-center justify-between">
          <p className="text-cyan-900 text-xs font-semibold">추가된 루틴</p>
        </div>

        <div className="flex flex-col">
          {/* Result에서 선택한 루틴 */}
          {selectedRecommendedRoutines.map((item) => (
            <div
              key={item}
              className="
                w-full
                min-h-[60px]
                px-[16px]
                flex
                items-center
                border-b
                border-[#F0F0F0]
                text-[#65DBBE]
                text-sm
                font-medium
              "
            >
              {item}
            </div>
          ))}

          {/* 직접 추가한 루틴 */}
          {customRoutines.map((item) => (
            <div
              key={item}
              className="
                w-full
                h-[60px]
                px-[16px]
                flex
                items-center
                justify-between
                border-b
                border-zinc-100
                text-[#45CDB1]
                text-sm
                font-medium
              "
            >
              <span>{item}</span>

              <button
                onClick={() => handleRoutineDelete(item)}
                className="text-neutral-300 text-xs font-medium cursor-pointer"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      </section>

      <div onClick={handleNext}>
        <OnboardingButton
          title={totalCount === 3 ? "시작하기" : "다음"}
          disabled={totalCount !== 3}
          className="absolute bottom-0"
        />
      </div>
    </div>
  );
}
