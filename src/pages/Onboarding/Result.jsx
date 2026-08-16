import useOnboardingStore from "../../store/useOnboardingStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMorningRoutineRecommendations,
  saveMorningRoutine,
} from "../../api/mission";

import loadingCharacter from "../../assets/images/loading_character.svg";

const skinTypePath = {
  건성: "dry",
  지성: "oily",
  수부지: "dehydrated",
  중성: "normal",
  복합성: "combination",
};

const getMissionCategory = (content) => {
  if (!content) return "POPULAR";

  if (
    content.includes("수분") ||
    content.includes("보습") ||
    content.includes("물 한 컵") ||
    content.includes("물 한 잔")
  ) {
    return "MOISTURE";
  }

  if (
    content.includes("선크림") ||
    content.includes("자외선") ||
    content.includes("선스틱")
  ) {
    return "SUN_PROTECTION";
  }

  if (
    content.includes("세안") ||
    content.includes("클렌징") ||
    content.includes("씻기")
  ) {
    return "CLEANSING";
  }

  if (
    content.includes("식사") ||
    content.includes("과일") ||
    content.includes("채소") ||
    content.includes("영양") ||
    content.includes("음식")
  ) {
    return "DIET_NUTRITION";
  }

  if (
    content.includes("진정") ||
    content.includes("장벽") ||
    content.includes("시카") ||
    content.includes("판테놀")
  ) {
    return "SOOTHING_BARRIER";
  }

  if (
    content.includes("수면") ||
    content.includes("잠") ||
    content.includes("휴식") ||
    content.includes("취침")
  ) {
    return "SLEEP_REST";
  }

  if (
    content.includes("위생") ||
    content.includes("손 씻") ||
    content.includes("양치") ||
    content.includes("환기")
  ) {
    return "HYGIENE";
  }

  if (
    content.includes("운동") ||
    content.includes("스트레칭") ||
    content.includes("혈액순환") ||
    content.includes("걷기")
  ) {
    return "EXERCISE_STRETCHING";
  }

  return "POPULAR";
};

function ResultOption({ text, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-[340px] h-[66px] rounded-xl border flex items-center px-[18px] text-left text-[15px] font-medium cursor-pointer transition-colors
        ${
          selected
            ? "bg-[#E8FADE] border-[#D7F2C7] text-[#65DBBE]"
            : "bg-white border-zinc-100 text-neutral-400 hover:bg-[#F3FDEB] hover:border-[#D7F2C7] hover:text-[#65DBBE]"
        }`}
    >
      {text}
    </button>
  );
}

export default function Result() {
  const skinType = useOnboardingStore((state) => state.skinType);
  const navigate = useNavigate();

  const [selectedRoutines, setSelectedRoutines] = useState([]);
  const [recommendedRoutines, setRecommendedRoutines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const path = skinTypePath[skinType];

    if (path) {
      navigate(`/onboarding/${path}`, {
        replace: true,
      });
    }
  }, [skinType, navigate]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getMorningRoutineRecommendations([]);

        const recommendations = (data.recommendations ?? []).map(
          (content) => ({
            content,
            category: getMissionCategory(content),
            source: "AI",
          }),
        );

        setRecommendedRoutines(recommendations);
      } catch (error) {
        console.error(
          "아침 고정 미션 추천 조회 실패:",
          error.response?.data ?? error,
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleRoutineClick = (index) => {
    setSelectedRoutines((prev) => {
      if (prev.includes(index)) {
        return prev.filter((item) => item !== index);
      }

      if (prev.length >= 3) {
        return prev;
      }

      return [...prev, index];
    });
  };

  const getSelectedRoutineItems = () =>
    selectedRoutines.map((index) => recommendedRoutines[index]);

  const handleGoRoutineSetting = () => {
    navigate("/onboarding/routine-setting", {
      state: {
        selectedRoutines: getSelectedRoutineItems(),
      },
    });
  };

  const handleStart = async () => {
    if (selectedRoutines.length !== 3) return;

    const items = getSelectedRoutineItems();

    try {
      await saveMorningRoutine(items);

      navigate("/onboarding/complete");
    } catch (error) {
      console.error(
        "아침 고정 미션 확정 실패:",
        error.response?.data ?? error,
      );
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-white">
      <div className="absolute top-[50px] left-1/2 h-[760px] w-[560px] -translate-x-1/2 rounded-full bg-[#D9FFF6] blur-[55px] opacity-80" />

      <header className="relative z-10 mt-[150px] flex flex-col items-center text-center">
        <p className="text-cyan-900 text-[28px] font-bold leading-[51.2px] tracking-wide">
          발견 완료!
        </p>

        <p className="text-cyan-900 text-[24px] font-bold leading-10 tracking-wide">
          마음에 드시는 루틴을 골라주세요
        </p>

        <p className="mt-[2px] text-neutral-400 text-xs font-medium leading-5 tracking-tight">
          매일 아침과 저녁에 함께 해볼까요!?
        </p>
      </header>

      <main className="relative z-10 mt-[34px] flex flex-col gap-[14px]">
        {isLoading ? (
          <p className="text-neutral-400 text-sm font-medium">
            추천 루틴을 불러오는 중이에요
          </p>
        ) : (
          recommendedRoutines.map((routine, index) => (
            <ResultOption
              key={`${routine.content}-${index}`}
              text={routine.content}
              selected={selectedRoutines.includes(index)}
              onClick={() => handleRoutineClick(index)}
            />
          ))
        )}
      </main>

      <footer className="relative z-10 mt-[30px] flex flex-col items-center gap-[5px] text-center">
        <p className="text-neutral-400 text-xs font-medium leading-5 tracking-tight">
          혹시 맘에 들지 않으신다면,
          <br />
          직접 추가해볼 수도 있어요!
        </p>

        <button
          onClick={handleGoRoutineSetting}
          className="cursor-pointer text-slate-500 text-xs font-medium underline leading-5 tracking-tight"
        >
          루틴 설정하러 가기
        </button>

        {selectedRoutines.length === 3 && (
          <button
            onClick={handleStart}
            className="mt-[7px] cursor-pointer text-[#3B6D8D] text-xl font-bold leading-8 tracking-wide"
          >
            시작하기
          </button>
        )}
      </footer>

      <img
        src={loadingCharacter}
        alt="로딩 캐릭터"
      />
    </div>
  );
}