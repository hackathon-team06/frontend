import checkWhite from "../../assets/icons/check_white.svg";

/**
 * 찜하기 알림.
 *
 * 찜했을 때는 찜 목록으로 가는 "이동하기" 버튼이 함께 뜨고,
 * 취소했을 때는 문구만 뜹니다. 표시 시간(3초)은 사용하는 쪽에서 관리합니다.
 */
export default function WishToast({ liked, onMove }) {
  return (
    <div
      className={`flex h-[56px] items-center rounded-[50px] bg-ink-100 pl-[20px] ${
        liked ? "w-[352px] pr-[22px]" : "w-[220px]"
      }`}
    >
      <span className="flex size-[24px] shrink-0 items-center justify-center rounded-[15px] bg-mint-600">
        <img src={checkWhite} alt="" className="size-[16px]" />
      </span>

      <p className="ml-[23px] whitespace-nowrap text-[16px] font-semibold text-ink-900">
        {liked ? "보시는 상품을 찜했어요" : "찜하기를 취소했어요"}
      </p>

      {liked && (
        <button
          type="button"
          onClick={onMove}
          className="ml-auto h-[30px] w-[84px] shrink-0 cursor-pointer rounded-[16px] bg-mint-500 text-[16px] font-semibold text-ink-50"
        >
          이동하기
        </button>
      )}
    </div>
  );
}
