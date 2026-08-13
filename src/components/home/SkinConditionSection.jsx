import { skinConditionData } from "../../constants/home/skinConditionData";
import SkinConditionItem from "./SkinConditionItem";

function SkinConditionSection({ selected, setSelected }) {

  const onClickBtn = (id) => {
    setSelected((prev) =>
      //상태 배열에 id 있으면 제거, 없으면 추가
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };
  return (
    <div className="animate-slide-up bg-white shadow-[0px_-6px_16px_-2px_rgba(0,0,0,0.10)] rounded-2xl">
      <div className="flex gap-0.75 items-center pl-6.5 pt-7.5">
        <div className="text-lg font-bold">오늘 귀가 후 피부 상태는?</div>
        <div className="text-xs font-medium">(중복선택가능)</div>
      </div>
      <div className="pl-6.5 text-lg font-normal">
        체크 시 1:1 맞춤 미션으로 즉시 변경됩니다!
      </div>
      <div className="flex flex-wrap gap-2 mt-4.5 pl-6.5">
        {skinConditionData.map((data) => (
          <SkinConditionItem
            key={data.id}
            data={data}
            isSelected={selected.includes(data.id)}
            onClick={() => onClickBtn(data.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default SkinConditionSection;
