export default function OnboardingButton({ title, onClick }) {
  return (
    <div className="flex justify-center">
      <button
        onClick={onClick}
        className="absolute bottom-[45px] w-[350px] h-13 bg-[#65DBBE] rounded-lg inline-flex justify-center items-center gap-2.5 
    text-white text-xl font-semibold cursor-pointer"
      >
        {title}
      </button>
    </div>
  );
}
