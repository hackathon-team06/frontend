export default function PurposeCard({ title, img, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer w-[145px] h-[91px] bg-white rounded-[20px] outline-1 outline-offset-[-1px] inline-flex flex-col justify-center items-center gap-2.5
        ${selected ? "outline-[#95DCDA] shadow-[0px_-2px_20px_0px_rgba(149,220,218,0.20)]" : "outline-neutral-100" }
        `}
    >
      <p className="text-neutral-400 text-xs font-medium leading-5">{title}</p>
      <img src={img} />
    </div>
  );
}
