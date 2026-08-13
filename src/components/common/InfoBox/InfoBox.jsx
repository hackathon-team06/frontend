import sun from "../../../assets/images/sun.svg";
import moon from "../../../assets/images/moon.svg";

const info = [
  {
    id: "morning",
    img: sun,
    comment: "기상과 동시에 하루가 시작돼요!",
    tip: "아침에 일찍 일어나면 성공 확률이 높아져요.",
  },
  {
    id: "evening",
    img: moon,
    comment: "하루가 끝나는 시간도 중요해요!",
    tip: "귀가 시간에 맞춰 저녁 루틴을 추천해드려요.",
  },
  {
    id: "change",
    img: moon,
    comment: "AI에게 추천받기",
    tip: "지금까지 답변을 분석해요."
  }
];

export default function InfoBox({ type }) {
  const selectedInfo = info.find((item) => item.id === type);

  if (!selectedInfo) {
    return null;
  }

  return (
    <section className="flex justify-center mt-[78px]">
      <div className="flex items-center gap-3 w-[330px] h-[65px] bg-[#F9FAFB] rounded-xl">
        <img
          src={selectedInfo.img}
          alt=""
          className="w-[40px] h-[40px] ml-3"
        />
        <div className="flex flex-col">
          <p className="text-zinc-600 text-sm font-semibold leading-6">
            {selectedInfo.comment}
          </p>
          <p className="text-[#8B95A1] text-xs font-medium leading-5">
            {selectedInfo.tip}
          </p>
        </div>
      </div>
    </section>
  );
}
