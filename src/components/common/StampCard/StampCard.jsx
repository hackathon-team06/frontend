import stampIcon from "../../../assets/icons/stamp_icon.svg";

export default function StampCard({ date, day, onClick }) {
  return (
    <div>
      <button
        onClick={onClick}
        className="cursor-pointer flex flex-col items-center w-[112px] h-[120px] outline-2 outline-offset-[-2px] outline-[#65DBBE] rounded-2xl bg-white"
      >
        <p className="text-stone-950 text-base font-normal logo-font mt-[7px]">
          {date}
        </p>
        <img src={stampIcon} />
        <p className="text-[#77C7AF] text-base font-normal logo-font">{day}</p>
      </button>
    </div>
  );
}
