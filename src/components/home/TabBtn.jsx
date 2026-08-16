function TabBtn({ text, isSelected, onClick }) {
  return (
    <div className="flex flex-col gap-0.75">
      <button
        onClick={onClick}
        className={`text-center w-full text-base  font-medium cursor-pointer ${isSelected ? "text-zinc-900" : "text-neutral-400"}`}
      >
        {text}
      </button>
      <div
        className={`w-44 h-1 rounded-xs ${isSelected ? "bg-emerald-300" : "bg-white"}`}
      />
    </div>
  );
}

export default TabBtn;
