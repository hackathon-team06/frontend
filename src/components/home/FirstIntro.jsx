// 아무 기능이 없으므로 하드 코딩으로 구현

export default function FirstIntro({ onClick }) {
  return (
    <>
      <div className="mt-11 pl-7.5">
        <div className="mb-9.25">
          <p className="text-sm text-emerald-300 font-semibold mb-2">
            나를 챙겨주는 존재
          </p>
          <p className="text-cyan-900 text-4xl font-semibold mb-1">
            간단한 정보들로
          </p>
          <p className="text-cyan-900 text-2xl font-bold">정하는 캘린더 일정</p>
        </div>
        <div className="mb-3.5">
          <p className="text-emerald-300 text-xs font-medium pb-1">
            2026.08.04 - 08.05
          </p>
          <p className="text-zinc-900 text-base font-semibold">
            <span className="text-[#57C1BE] text-base font-semibold">
              연인과의 여행
            </span>
            이 잡혀있네요!
          </p>
        </div>
        <div>
          <p className="text-zinc-900 text-xs font-bold pb-2.75">
            누구랑 약속이 있으신가요?
          </p>
          <div className="flex gap-1.5">
            <div className="flex justify-center items-center outline outline-neutral-400 rounded-[4.80px] px-2 h-5 text-xs font-mediume">
              연인
            </div>
            <div className="flex justify-center items-center outline outline-neutral-400 rounded-[4.80px] px-2 h-5 text-xs font-mediume">
              직장동료
            </div>
            <div className="flex justify-center items-center bg-emerald-300 text-xs text-neutral-50 px-2 h-5 font-medium rounded-[4.80px]">
              친구
            </div>
          </div>
          <div className="flex gap-1.5 pt-1.5">
            <div className="flex justify-center items-center outline outline-neutral-400 rounded-[4.80px] px-2 h-5 text-xs font-mediume">
              가족/친척
            </div>
            <div className="flex justify-center items-center outline outline-neutral-400 rounded-[4.80px] px-2 h-5 text-xs font-mediume">
              지인/모임
            </div>
          </div>
        </div>
        <div className="pb-4 pt-5">
          <p className="text-zinc-900 text-xs font-bold pb-2.75">
            어떤 일정이 있으신가요?
          </p>
          <div className="flex gap-1.5">
            <div className="flex justify-center items-center outline outline-neutral-400 rounded-[4.80px] px-2 h-5 text-xs font-mediume">
              데이트
            </div>
            <div className="flex justify-center items-center outline outline-neutral-400 rounded-[4.80px] px-2 h-5 text-xs font-mediume">
              미팅/면접
            </div>
            <div className="flex justify-center items-center outline outline-neutral-400 rounded-[4.80px] px-2 h-5 text-xs font-mediume">
              자기관리
            </div>
          </div>
          <div className="flex gap-1.5 pt-1.5">
            <div className="flex justify-center items-center outline outline-neutral-400 rounded-[4.80px] px-2 h-5 text-xs font-mediume">
              술자리모임
            </div>
            <div className="flex justify-center items-center outline outline-neutral-400 rounded-[4.80px] px-2 h-5 text-xs font-mediume">
              여행
            </div>
            <div className="flex justify-center items-center bg-emerald-300 text-xs text-neutral-50 px-2 h-5 font-medium rounded-[4.80px]">
              결혼식
            </div>
          </div>
          <div className="flex gap-1.5 pt-1.5">
            <div className="flex justify-center items-center outline outline-neutral-400 rounded-[4.80px] px-2 h-5 text-xs font-mediume">
              이벤트
            </div>
            <div className="flex justify-center items-center outline outline-neutral-400 rounded-[4.80px] px-2 h-5 text-xs font-mediume">
              친목/수다
            </div>
            <div className="flex justify-center items-center outline outline-neutral-400 rounded-[4.80px] px-2 h-5 text-xs font-mediume">
              행사
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-5.5 justify-center mt-40">
        <div className="size-2 rounded-xl bg-emerald-300" />
        <div className="size-2 rounded-xl bg-green-200" />
        <div className="size-2 rounded-xl bg-green-200" />
      </div>
      <div className="pl-66.5 mt-17.25">
        <button
          onClick={onClick}
          className="cursor-pointer text-cyan-900 text-xl font-semibold"
        >
          다음으로
        </button>
      </div>
    </>
  );
}
