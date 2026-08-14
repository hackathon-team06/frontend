/**
 * 찜한 상품 전체삭제 확인 모달.
 * 되돌릴 수 없는 동작이라 확인을 한 번 받습니다.
 * 모양은 온보딩의 SkipModal 과 같은 바텀시트 형태로 맞췄습니다.
 */
export default function ClearWishModal({ onClose, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div className="relative h-full w-[390px]">
        <div className="absolute inset-0 bg-black/20" />

        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-0 left-0 z-10 flex w-[390px] flex-col items-center rounded-t-[29px] bg-white pb-[27px] pt-[40px] shadow-[0px_0px_7.3px_0px_rgba(0,0,0,0.25)] animate-[slideUp_0.3s_ease-out]"
        >
          <p className="text-center text-2xl font-semibold leading-8 text-zinc-900">
            찜한 상품을 모두 삭제할까요?
          </p>

          <p className="mt-2 text-center text-xs font-medium leading-5 text-neutral-400">
            삭제하면 되돌릴 수 없어요.
          </p>

          <div className="mt-[30px] flex gap-3">
            <button
              type="button"
              onClick={onConfirm}
              className="h-[57px] w-[166px] cursor-pointer rounded-lg bg-[#F5F5F5] text-base font-medium text-[#A8A8A8]"
            >
              네, 삭제할게요
            </button>

            <button
              type="button"
              onClick={onClose}
              className="h-[57px] w-[166px] cursor-pointer rounded-lg bg-[#65DBBE] text-base font-semibold text-white"
            >
              그대로 둘게요
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
