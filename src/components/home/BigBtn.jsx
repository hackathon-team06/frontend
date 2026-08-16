//미션 받기, 포인트 얻기 버튼
function BigBtn({ text, onClick }) {
  return (
    <div className="flex justify-center items-center mt-4.5 mb-5">
      <button
        onClick={onClick}
        className="w-84 h-12 cursor-pointer bg-[#65DBBE] rounded-2xl text-white text-lg font-medium"
      >
        {text}
      </button>
    </div>
  );
}

export default BigBtn;
