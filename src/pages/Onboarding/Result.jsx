import useOnboardingStore from "../../store/useOnboardingStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import loadingCharacter from "../../assets/images/loading_character.svg";

const resultData = {
  건성: {
    routines: [
      "💧 세안 후 3분 안에 보습제 바르기",
      "🌙 미지근한 물로 부드럽게 세안하기",
      "🌙 자기 전 보습 크림 한 번 더 바르기",
    ],
  },

  지성: {
    routines: [
      "🧼 약산성 클렌저로 T존 위주 세안하기",
      "💧 유분 없는 산뜻한 수분 젤 바르기",
      "✨ 주 1~2회 꼼꼼하게 모공 딥클렌징하기",
    ],
  },

  수부지: {
    routines: [
      "🧴 토너 레이어링으로 속수분 채우기",
      "🫧 아침엔 약산성 클렌저로 유분만 정리하기",
      "💧 유분 적은 수분 크림으로 수분막 형성하기",
    ],
  },

  중성: {
    routines: [
      "🏆 우수한 밸런스 유지하는 수분 로션 바르기",
      "✨ 사계절 매일 선크림 잊지 않고 바르기",
      "💧 저녁 세안 후 항상 세럼으로 피부 영양 채우기",
    ],
  },

  복합성: {
    routines: [
      "🍀 번들거리는 T존 위주로 부드럽게 세안하기",
      "💧 건조한 U존에 수분 크림 한 번 더 덧바르기",
      "⚖️ 유수분 밸런스 제품으로 잘 정리하기",
    ],
  },
};

const skinTypePath = {
  건성: "dry",
  지성: "oily",
  수부지: "dehydrated",
  중성: "normal",
  복합성: "combination",
};

function ResultOption({ text, selected, onClick }) {
  return (
    <button
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

  const result = resultData[skinType];

  // 피부 타입에 맞게 URL 변경
  useEffect(() => {
    const path = skinTypePath[skinType];

    if (path) {
      navigate(`/onboarding/${path}`, { replace: true });
    }
  }, [skinType, navigate]);

  // 루틴 3개 선택 시 완료 페이지로 이동
  useEffect(() => {
    if (selectedRoutines.length === 3) {
      const timer = setTimeout(() => {
        navigate("/onboarding/complete");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [selectedRoutines, navigate]);

  // 루틴 선택
  const handleRoutineClick = (index) => {
    setSelectedRoutines((prev) => {
      // 이미 선택한 옵션이면 선택 해제
      if (prev.includes(index)) {
        return prev.filter((item) => item !== index);
      }

      // 최대 3개
      if (prev.length >= 3) {
        return prev;
      }

      // 선택 추가
      return [...prev, index];
    });
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

      {/* 루틴 선택 */}
      <main className="relative z-10 mt-[34px] flex flex-col gap-[14px]">
        {result?.routines.map((routine, index) => (
          <ResultOption
            key={index}
            text={routine}
            selected={selectedRoutines.includes(index)}
            onClick={() => handleRoutineClick(index)}
          />
        ))}
      </main>

      <footer className="relative z-10 mt-[30px] flex flex-col items-center gap-[5px] text-center">
        <p className="text-neutral-400 text-xs font-medium leading-5 tracking-tight">
          혹시 맘에 들지 않으신다면,
          <br />
          직접 추가해볼 수도 있어요!
        </p>
        <button
          onClick={() => navigate("/onboarding/routine-setting")}
          className="cursor-pointer text-slate-500 text-xs font-medium underline leading-5 tracking-tight"
        >
          루틴 설정하러 가기
        </button>
      </footer>

      <img src={loadingCharacter} alt="" />
    </div>
  );
}
