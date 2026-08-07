export default function StampDay({ day, status, point }) {
  return (
    <div className="flex flex-col gap-[3px]">
      <div
        className={`flex items-center justify-center w-[34px] h-[34px] rounded-[10px] text-xl font-medium
            ${status === "success" ? "bg-[#65DBBE] text-white" : status === "partial" ? "bg-[#9AFFC1] text-white" : "text-[#777777] outline-1 outline-offset-[-1px] outline-[#777777]"}
        `}
      >
        {day}
      </div>
      {point && (
        <p className="logo-font text-black text-sm font-normal">+{point}p</p>
      )}
    </div>
  );
}
