export default function LoginButton({ title, onClick }) {
  return (
    <div className="flex justify-center">
      <button
        onClick={onClick}
        className="w-[352px] h-[56px] bg-white rounded-3xl shadow-[0px_3px_1px_0px_rgba(88,206,174,0.25)] 
        outline-2 outline-offset-[-2px] outline-emerald-300 text-emerald-300 text-lg font-semibold cursor-pointer"
      >
        {title}
      </button>
    </div>
  );
}
