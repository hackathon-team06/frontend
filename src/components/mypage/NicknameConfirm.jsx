export default function NicknameConfirm({
  nickname,
  onConfirm,
  onCancel,
  isSaving = false,
  errorMessage = "",
}) {
  return (
    <div className="fixed inset-0 z-30 flex justify-center">
      <div className="relative h-full w-[390px] bg-white/30 backdrop-blur-[2px]">
        <div className="absolute left-[35px] top-[215px] flex h-[52px] w-[320px] items-center rounded-[12px] border border-ink-300 bg-ink-50 px-[13px]">
          <p className="text-[16px] font-semibold leading-[1.6] text-ink-900">
            {nickname}
            <span className="text-[#2e4972]">으로 선택하시겠습니까?</span>
          </p>
        </div>

        {errorMessage && (
          <p className="absolute left-[35px] top-[275px] w-[320px] text-[12px] font-medium text-sale">
            {errorMessage}
          </p>
        )}

        <div className="absolute bottom-[63px] left-[39px] flex gap-[14px]">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSaving}
            className={`h-[52px] w-[130px] rounded-[15px] bg-mint-500 text-[16px] font-semibold leading-[1.6] text-ink-50 ${
              isSaving ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
          >
            {isSaving ? "저장 중..." : "네 선택할게요"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="h-[52px] w-[176px] cursor-pointer rounded-[15px] border border-[#2e4972] bg-ink-50 text-[16px] font-semibold leading-[1.6] text-[#2e4972]"
          >
            아뇨 다시 수정할래요
          </button>
        </div>
      </div>
    </div>
  );
}
