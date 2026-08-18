// 완료 취소 API 가 없어서, 완료가 되면 돌아갈 수 없음
function MissionCheckBtn({ completed, disabled = false, onClick }) {
  return (
    <div>
      <button
        onClick={onClick}
        disabled={completed || disabled}
        className={`w-17 h-9  text-sm font-semibold rounded-md cursor-pointer disabled:cursor-default ${
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
