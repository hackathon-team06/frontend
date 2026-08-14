/** 마이페이지 현재 포인트 카드. */
export default function PointCard({ point, onGoToProduct }) {
  return (
    <section className="relative h-[106px] w-[352px] rounded-[15px] border border-[#dbe7e8] bg-white shadow-[0px_-1px_10px_0px_rgba(101,219,190,0.3)]">
      <p className="absolute left-[11px] top-[15px] text-[16px] font-semibold text-black">
        현재 포인트
      </p>

      <p className="absolute left-[11px] top-[49px] text-[20px] font-medium text-black">
        <span className="text-mint-500">{point.toLocaleString()}</span>P
      </p>

      <button
        type="button"
        onClick={onGoToProduct}
        className="absolute left-[262px] top-[82px] cursor-pointer text-[12px] font-semibold text-black"
      >
        제품 보러가기
      </button>
    </section>
  );
}
