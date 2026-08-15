/**
 * 닉네임 확인 화면.
 *
 * 입력한 닉네임으로 정할지 한 번 더 묻습니다.
 * 뒤 화면이 비치도록 흐린 흰색을 덮습니다.
 */
export default function NicknameConfirm({ nickname, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-30 flex justify-center">
      <div className="relative h-full w-[390px] bg-white/30 backdrop-blur-[2px]">
        {/* 뒤에 있는 입력창과 같은 높이에 겹쳐 놓습니다.
            NicknameEdit 기준: 제목 여백 100 + 제목 블록 76.8 + 간격 38 = 214.8px */}
        <div className="absolute left-[35px] top-[215px] flex h-[52px] w-[320px] items-center rounded-[12px] border border-ink-300 bg-ink-50 px-[13px]">
          <p className="text-[16px] font-semibold leading-[1.6] text-ink-900">
            {nickname}
            <span className="text-[#2e4972]">으로 선택하시겠습니까?</span>
          </p>
        </div>

        <div className="absolute bottom-[63px] left-[39px] flex gap-[14px]">
          <button
            type="button"
            onClick={onConfirm}
            className="h-[52px] w-[130px] cursor-pointer rounded-[15px] bg-mint-500 text-[16px] font-semibold leading-[1.6] text-ink-50"
          >
            네 선택할게요
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="h-[52px] w-[176px] cursor-pointer rounded-[15px] border border-[#2e4972] bg-ink-50 text-[16px] font-semibold leading-[1.6] text-[#2e4972]"
          >
            아뇨 다시 수정할래요
          </button>
        </div>
      </div>
    </div>
  );
}
