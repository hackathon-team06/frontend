export default function MissionSelection({ missions = [], onReselect }) {
  return (
    <div className="absolute inset-x-0 top-[120px] h-[641px] overflow-hidden">
      <div className="absolute left-1/2 top-0 h-[641px] w-[641px] -translate-x-1/2 rounded-full bg-[#DBF8F1] blur-[50px]" />

      <div className="relative z-10 px-4">
        <header className="flex flex-col items-center">
          <p className="mt-[89px] text-cyan-900 text-3xl font-bold leading-[51.20px] tracking-wide">
            미션 선정!
          </p>
          <p className="mt-[4px] text-neutral-400 text-xs font-medium leading-5 tracking-tight">
            매일 아침과 저녁에 함께해볼까요?
          </p>
        </header>

        <div className="mt-8 flex flex-col items-center gap-3">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className="flex h-[60px] w-[340px] items-center justify-start gap-2 rounded-xl bg-white px-3.5 py-3 outline-2 outline-offset-[-2px] outline-zinc-100"
            >
              <span className="shrink-0 text-base font-medium leading-6 text-neutral-400">
                {mission.icon}
              </span>

              <p className="text-base font-medium leading-6 text-neutral-400">
                {mission.title}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onReselect}
          className="mx-auto mt-4 block cursor-pointer text-base font-semibold leading-6 tracking-tight text-emerald-300 underline"
        >
          카테고리 다시 선정하기
        </button>
      </div>
    </div>
  );
}