function MissionCheckBtn({ completed, onClick }) {
  return (
    <div>
      <button
        onClick={onClick}
        className={`w-17 h-9  text-sm font-semibold rounded-md cursor-pointer ${
          completed
            ? "bg-[#65DBBE] text-white"
            : " outline-2 outline-[#EBEBEB] bg-[#FFFFFF] text-black"
        }`}
      >
        {completed ? "완료" : "체크하기"}
      </button>
    </div>
  );
}

export default MissionCheckBtn;
