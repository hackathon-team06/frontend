import pointBadge from "../../assets/icons/point_badge.svg";

/** 포인트 배지 (민트 원형 + s). 제품 목록·찜한 상품 화면에서 함께 씁니다. */
export default function PointBadge() {
  return (
    <span className="relative inline-block size-[14px]">
      <img src={pointBadge} alt="" className="absolute inset-0 size-[14px]" />
      <span className="absolute inset-0 text-center text-[12px] font-medium leading-[14px] text-mint-300">
        s
      </span>
    </span>
  );
}
