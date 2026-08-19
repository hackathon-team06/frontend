import stampHouse from "../../assets/images/stamp_house.png";

export default function StampCard({
  stamp,
  onClick,
}) {
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