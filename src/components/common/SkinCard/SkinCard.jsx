export default function SkinCard({ img, type, explain, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer w-[145px] h-[173px] bg-white rounded-[20px]
        outline-1 outline-offset-[-1px]
        inline-flex flex-col justify-center items-center gap-2.5
        ${selected ? "outline-[#95DCDA]" : "outline-neutral-100"}`}
    >
      <img src={img} />
      <button className="w-18 h-[29px] rounded-[20px] inline-flex justify-center items-center gap-2.5 bg-[#E1F3F4] text-[#57C1BE] text-lg font-semibold leading-7">
        {type}
      </button>
      <p className="text-neutral-400 text-xs font-medium leading-5 text-center">
        {explain}
      </p>
    </div>
  );
}
