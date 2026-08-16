import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import OnboardingButton from "../../components/common/OnboardingButton/OnboardingButton";
import { getMorningRoutineOptions } from "../../api/mission";

export default function RoutineSetting() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedRecommendedRoutines =
    location.state?.selectedRoutines ?? [];

  const [isOpen, setIsOpen] = useState(false);

  const [routineOptions, setRoutineOptions] = useState([]);
  const [maxSelections, setMaxSelections] = useState(3);

  const [customRoutines, setCustomRoutines] = useState([]);

  const totalCount =
    selectedRecommendedRoutines.length +
    customRoutines.length;

  const remainingCount = Math.max(
    0,
    maxSelections - totalCount,
  );

  useEffect(() => {
    const fetchRoutineOptions = async () => {
      try {
        const data =
          await getMorningRoutineOptions();

        setRoutineOptions(data.items);
        setMaxSelections(data.maxSelections);
      } catch (error) {
        console.error(
          "아침 루틴 선택지 조회 실패:",
          error,
        );
      }
    };

    fetchRoutineOptions();
  }, []);

  const handleRoutineSelect = (routine) => {
    if (remainingCount === 0) return;

    const isAlreadyAdded =
      customRoutines.some(
        (item) =>
          item.code === routine.code,
      );

    if (isAlreadyAdded) return;

    setCustomRoutines((prev) => [
      ...prev,
      routine,
    ]);

    setIsOpen(false);
  };

  const handleRoutineDelete = (routine) => {
    setCustomRoutines((prev) =>
      prev.filter(
        (item) =>
          item.code !== routine.code,
      ),
    );
  };

  const handleNext = () => {
    if (totalCount !== maxSelections) return;

    const finalRoutines = [
      ...selectedRecommendedRoutines,
      ...customRoutines,
    ];

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
            : `루틴 ${maxSelections}개 선택 완료`}
        </button>

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
              const isAdded =
                customRoutines.some(
                  (item) =>
                    item.code === routine.code,
                );

              return (
                <button
                  key={routine.code}
                  disabled={isAdded}
                  onClick={() =>
                    handleRoutineSelect(
                      routine,
                    )
                  }
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
                  {routine.label}
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-[210px] mx-[26px]">
        <div className="mb-[12px] flex items-center justify-between">
          <p className="text-cyan-900 text-xs font-semibold">
            추가된 루틴
          </p>
        </div>

        <div className="flex flex-col">
          {selectedRecommendedRoutines.map(
            (item) => (
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
            ),
          )}

          {customRoutines.map((item) => (
            <div
              key={item.code}
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
              <span>{item.label}</span>

              <button
                onClick={() =>
                  handleRoutineDelete(item)
                }
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
          title={
            totalCount === maxSelections
              ? "시작하기"
              : "다음"
          }
          disabled={
            totalCount !== maxSelections
          }
          className="absolute bottom-0"
        />
      </div>
    </div>
  );
}