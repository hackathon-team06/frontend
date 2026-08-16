import { useEffect, useState } from "react";
import googleCalIcon from "../../assets/icons/calendar_icon.svg";

const VISIBLE_DURATION = 2000;

const FADE_DURATION = 500;

export default function SyncCompleteOverlay({ onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(false), VISIBLE_DURATION);
    // 페이드가 다 끝난 뒤에 알려야 툭 끊기지 않고 자연스럽게 사라집니다.
    const doneTimer = setTimeout(onDone, VISIBLE_DURATION + FADE_DURATION);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center
        overflow-hidden transition-opacity duration-500
        ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      {/* 중앙 초록 글로우만 */}
      <div className="absolute size-[477px] rounded-full bg-green-100 blur-[50px]" />

      {/* 내용 */}
      <div className="relative z-10 flex flex-col items-center">
        <img src={googleCalIcon} alt="" className="w-28 h-28" />
        <h2 className="mt-4 text-3xl font-bold text-cyan-900">연동 완료!</h2>
        <p className="mt-2 text-xl font-bold text-cyan-900">
          내 일정에 맞는 루틴을 시작해볼까요?
        </p>
        <p className="mt-2 text-xs font-medium text-neutral-400">
          Google 캘린더를 바탕으로 일정별 루틴을 제안해드려요.
        </p>
      </div>
    </div>
  );
}
