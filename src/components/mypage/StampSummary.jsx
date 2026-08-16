const LEGEND = [
  { color: "bg-mint-500", prefix: "전부 ", suffix: "성공" },
  { color: "bg-mint-400", prefix: "일부 ", suffix: "성공" },
  { color: "bg-[#dbe7e8]", label: "미참여" },
];

/** 스탬프 기록 하단의 포인트 요약과 범례. */
export default function StampSummary({ calendar }) {
  const { dailyPoint, completePoint, totalPoint } = calendar;

  return (
    <section className="relative h-[114px] w-[352px] rounded-[10px] border border-mint-500 bg-ink-50 shadow-[0px_2px_2px_0px_rgba(149,179,151,0.25)]">
      <p className="absolute left-[9.5px] top-[15.5px] text-[14px] font-medium text-ink-900">
        일일 포인트
      </p>
      <p className="absolute left-[112.5px] top-[15.5px] text-[14px] font-semibold text-mint-500">
        +{dailyPoint}
      </p>

      <p className="absolute left-[9.5px] top-[39.5px] text-[14px] font-medium text-ink-900">
        완료 포인트
      </p>
      <p className="absolute left-[112.5px] top-[39.5px] text-[14px] font-semibold text-mint-500">
        {/* 코스가 진행 중이면 아직 정해지지 않았습니다. */}
        {completePoint === null ? "미정" : `+${completePoint}`}
      </p>

      <div className="absolute left-[9.5px] top-[70.5px] h-px w-[148px] bg-ink-300" />

      <p className="absolute left-[9.5px] top-[83.5px] text-[14px] font-semibold text-ink-900">
        총 얻은 포인트
      </p>
      <p className="absolute left-[121.5px] top-[81.5px] text-[14px] font-semibold text-ink-900">
        <span className="text-mint-500">{totalPoint}</span>P
      </p>

      {/* 항목 높이 14px + 간격 10px → 디자인의 24px 간격과 맞습니다. */}
      <ul className="absolute left-[266.5px] top-[40.5px] flex flex-col gap-[10px]">
        {LEGEND.map(({ color, prefix, suffix, label }) => (
          <li
            key={label ?? prefix}
            className="flex h-[14px] items-center gap-[8px]"
          >
            <span className={`size-[12px] shrink-0 rounded-full ${color}`} />
            {label ? (
              <span className="text-[12px] font-medium leading-[14px] text-ink-500">
                {label}
              </span>
            ) : (
              <span className="whitespace-nowrap text-[12px] font-medium leading-[14px] text-ink-900">
                {prefix}
                <span className="text-mint-500">{suffix}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
