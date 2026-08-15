import { useState } from "react";
import { useParams } from "react-router-dom";

import { getStampCalendar, getStampStartMonth } from "../../api/mypage";
import StampCalendar from "../../components/mypage/StampCalendar";
import StampSummary from "../../components/mypage/StampSummary";

import arrowBack from "../../assets/icons/arrow_back.svg";

export default function StampRecord() {
  const { stampId } = useParams();

  // 코스 시작 달을 기준으로 몇 달 이동했는지만 들고 있습니다.
  const [monthOffset, setMonthOffset] = useState(0);

  const start = getStampStartMonth(stampId);

  if (!start) {
    return (
      <div className="flex min-h-full items-center justify-center bg-white">
        <p className="text-[14px] text-ink-500">스탬프 기록을 찾을 수 없어요</p>
      </div>
    );
  }

  const shown = new Date(start.year, start.month - 1 + monthOffset, 1);
  const year = shown.getFullYear();
  const month = shown.getMonth() + 1;

  const calendar = getStampCalendar(stampId, year, month);

  return (
    <div className="flex min-h-full flex-col bg-white pb-[24px]">
      {/* 월 이동 */}
      <div className="flex items-center justify-center gap-[62px] pt-[10px]">
        <MonthArrow
          direction="prev"
          disabled={!calendar.canPrev}
          onClick={() => setMonthOffset((prev) => prev - 1)}
        />

        <span className="text-[24px] font-semibold text-ink-900">{month}월</span>

        <MonthArrow
          direction="next"
          disabled={!calendar.canNext}
          onClick={() => setMonthOffset((prev) => prev + 1)}
        />
      </div>

      <div className="mt-[65px]">
        <StampCalendar calendar={calendar} />
      </div>

      <p className="mt-[32px] pr-[19px] text-right text-[14px] font-medium text-ink-900">
        총 {calendar.totalMissions}개 중 {calendar.doneMissions}개 완료
      </p>

      <div className="mt-[35px] px-[19px]">
        <StampSummary calendar={calendar} />
      </div>
    </div>
  );
}

function MonthArrow({ direction, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "이전 달" : "다음 달"}
      className="flex h-[28px] w-[14px] cursor-pointer items-center justify-center disabled:cursor-default disabled:opacity-0"
    >
      <img
        src={arrowBack}
        alt=""
        className={direction === "next" ? "rotate-180" : ""}
        style={{ width: 8.3, height: 15.1 }}
      />
    </button>
  );
}
