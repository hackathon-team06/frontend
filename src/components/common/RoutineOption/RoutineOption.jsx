export default function RoutineOption({
  day,
  selected,
  recommended = false,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-[310px] h-[54px] px-5 py-4 
        bg-white rounded-xl outline-2 outline-offset-[-2px] 
        flex items-center justify-between cursor-pointer
        ${
          selected
            ? "shadow-[0px_-2px_20px_0px_rgba(149,220,218,0.20)] outline-[#95DCDA]"
            : "outline-[#F0F0F0]"
        }
      `}
    >
      {/* 일수 */}
      <p
        className={`${
          selected
            ? "text-lg text-[#57C1BE] font-semibold"
            : "text-base text-[#8F8F8F] font-medium"
        }`}
      >
        {day}일
      </p>

      {/* 7일 추천 표시 */}
      {recommended ? (
        <div className="w-[39px] h-[25px] bg-[#E1F3F4] rounded-[999px] flex items-center justify-center">
          <p className="text-[#57C1BE] text-xs font-semibold leading-5">추천</p>
        </div>
      ) : (
        /* 선택 동그라미 */
        <div
          className={`w-[18px] h-[18px] rounded-full border-[2px] flex items-center justify-center ${
            selected ? "border-[#95DCDA]" : "border-zinc-200"
          }`}
        >
          {selected && (
            <div className="w-[8px] h-[8px] rounded-full bg-[#95DCDA]" />
          )}
        </div>
      )}
    </button>
  );
}
