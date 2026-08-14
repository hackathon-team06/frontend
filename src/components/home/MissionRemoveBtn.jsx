function MissionRemoveBtn({ removed, onClick }) {
  return (
    <div>
      <button
        onClick={onClick}
        className="w-17 h-9 text-sm font-semibold rounded-md cursor-pointer outline-2 outline-[#EBEBEB] bg-[#FFFFFF] text-black"
      >
        {removed ? "추가하기" : "제거하기"}
      </button>
    </div>
  );
}

export default MissionRemoveBtn;