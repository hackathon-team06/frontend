import { useEffect, useState } from "react";

import { getStampCalendar } from "../../api/stamp";
import StampCalendar from "../../components/mypage/StampCalendar";
import StampSummary from "../../components/mypage/StampSummary";

import arrowBack from "../../assets/icons/arrow_back.svg";

const STATUS_MAP = {
  FULL_SUCCESS: "all",
  PARTIAL_SUCCESS: "partial",
  NOT_DONE: "none",
};

const normalizeCalendar = (data) => {
  const firstWeekday = new Date(
    data.year,
    data.month - 1,
    1,
  ).getDay();

  return {
    year: data.year,
    month: data.month,
    firstWeekday,

    days: data.days.map((day) => ({
      day: Number(day.date.slice(-2)),
      date: day.date,
      status: STATUS_MAP[day.status] ?? "none",
      point: day.point,
    })),

    totalStampCount: data.summary.totalStampCount,
    dailyPoint: data.summary.dailyPoint,
    completionPoint: data.summary.completionPoint,
    totalEarnedPoint: data.summary.totalEarnedPoint,
  };
};

export default function StampRecord() {
  const today = new Date();

  const [shownDate, setShownDate] = useState(
    () =>
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      ),
  );

  const [calendar, setCalendar] = useState(null);
  const [loading, setLoading] = useState(true);

  const year = shownDate.getFullYear();
  const month = shownDate.getMonth() + 1;

  useEffect(() => {
    const fetchStampCalendar = async () => {
      try {
        setLoading(true);

        const data = await getStampCalendar(
          year,
          month,
        );

        console.log(
          "월별 스탬프 달력 조회:",
          data,
        );

        setCalendar(normalizeCalendar(data));
      } catch (error) {
        console.error(
          "월별 스탬프 달력 조회 실패:",
          error,
        );

        setCalendar(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStampCalendar();
  }, [year, month]);

  const moveMonth = (offset) => {
    setShownDate(
      (prev) =>
        new Date(
          prev.getFullYear(),
          prev.getMonth() + offset,
          1,
        ),
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-white">
        <p className="text-[14px] text-ink-500">
          스탬프 기록을 불러오는 중...
        </p>
      </div>
    );
  }

  if (!calendar) {
    return (
      <div className="flex min-h-full items-center justify-center bg-white">
        <p className="text-[14px] text-ink-500">
          스탬프 기록을 불러올 수 없어요
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-white pb-[24px]">
      <div className="flex items-center justify-center gap-[62px] pt-[10px]">
        <MonthArrow
          direction="prev"
          onClick={() => moveMonth(-1)}
        />

        <span className="text-[24px] font-semibold text-ink-900">
          {month}월
        </span>

        <MonthArrow
          direction="next"
          onClick={() => moveMonth(1)}
        />
      </div>

      <div className="mt-[65px]">
        <StampCalendar calendar={calendar} />
      </div>

      <p className="mt-[32px] pr-[19px] text-right text-[14px] font-medium text-ink-900">
        총 {calendar.totalStampCount}개 수집 완료
      </p>

      <div className="mt-[35px] px-[19px]">
        <StampSummary calendar={calendar} />
      </div>
    </div>
  );
}

function MonthArrow({ direction, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        direction === "prev"
          ? "이전 달"
          : "다음 달"
      }
      className="flex h-[28px] w-[14px] cursor-pointer items-center justify-center"
    >
      <img
        src={arrowBack}
        alt=""
        className={
          direction === "next"
            ? "rotate-180"
            : ""
        }
        style={{
          width: 8.3,
          height: 15.1,
        }}
      />
    </button>
  );
}