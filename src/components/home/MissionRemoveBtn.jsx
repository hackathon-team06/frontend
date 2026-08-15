function MissionRemoveBtn({ removed, disabled = false, onClick }) {
  return (
    <div>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-17 h-9 text-sm font-semibold rounded-md outline-2 outline-[#EBEBEB] bg-[#FFFFFF] text-black ${
          disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {removed ? "추가하기" : "제거하기"}
      </button>
    </div>
  );
}

export default MissionRemoveBtn;
