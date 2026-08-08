export default function StampDay({ day, status, point }) {
  return (
    <div className="flex flex-col gap-[3px]">
      <div
        className={`flex items-center justify-center w-[34px] h-[34px] rounded-[10px] text-xl font-medium
            ${status === "success" ? "bg-[#64DDCD] text-white" : status === "partial" ? "bg-[#A0F8E2] text-white" : status === "none" ? "bg-[#DBE7E8] text-white text-lg font-medium" : "text-[#777777] outline-1 outline-offset-[-1px] outline-[#777777]"}
        `}
      >
        {day}
      </div>
    </div>
  );
}
