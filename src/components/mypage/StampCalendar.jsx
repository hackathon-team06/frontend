const WEEKDAYS = [
  "일",
  "월",
  "화",
  "수",
  "목",
  "금",
  "토",
];

const DAY_STYLE = {
  all: "bg-mint-500 text-ink-50",
  partial: "bg-mint-400 text-ink-50",
  none: "bg-[#dbe7e8] text-ink-500",
  outside: "text-ink-300",
};

export default function StampCalendar({
  calendar,
}) {
  const { days, firstWeekday } = calendar;

  return (
    <div className="px-[22px]">
      <div className="grid grid-cols-7 gap-x-[18px]">
        {WEEKDAYS.map((weekday) => (
          <span
            key={weekday}
            className="w-[34px] text-center text-[14px] font-medium text-ink-900"
          >
            {weekday}
          </span>
        ))}
      </div>

      <div className="mt-[19px] grid grid-cols-7 gap-x-[18px] gap-y-[30px]">
        {Array.from(
          { length: firstWeekday },
          (_, index) => (
            <span
              key={`empty-${index}`}
              className="size-[34px]"
            />
          ),
        )}

        {days.map(({ day, status }) => (
          <span
            key={day}
            className={`flex size-[34px] items-center justify-center rounded-[10px] text-[18px] font-medium ${DAY_STYLE[status]}`}
          >
            {day}
          </span>
        ))}
      </div>
    </div>
  );
}