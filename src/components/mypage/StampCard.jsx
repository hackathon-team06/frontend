import stampHouse from "../../assets/images/stamp_house.png";

/** 마이페이지 스탬프(코스) 카드. 누르면 월별 기록으로 이동합니다. */
export default function StampCard({ stamp, onClick }) {
  const done = stamp.status === "done";

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative h-[120px] w-[112px] cursor-pointer rounded-[15px] border border-[#78baa9] bg-white"
    >
      <span className="logo-font absolute left-0 top-[6px] w-full text-center text-[14px] text-[#0f0f0f]">
        {stamp.dateLabel}
      </span>

      {/* 원본 이미지는 집 주변 여백이 넓어, 디자인처럼 집 부분만 잘라서 확대합니다. */}
      <span className="absolute left-[26.5px] top-[30.5px] block size-[57px] overflow-hidden">
        <img
          src={stampHouse}
          alt=""
          className="absolute max-w-none"
          style={{
            width: "227.49%",
            height: "237.5%",
            left: "-63.64%",
            top: "-62.5%",
          }}
        />
      </span>

      <span
        className={`absolute left-0 top-[87px] w-full text-center text-[16px] ${
          // Rammetto One 은 한글 글리프가 없어 영문·숫자 라벨에만 씁니다.
          done
            ? "logo-font text-[#77c7af]"
            : "font-semibold text-[#78baa9]"
        }`}
      >
        {stamp.courseLabel}
      </span>
    </button>
  );
}
