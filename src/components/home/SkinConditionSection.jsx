import SkinConditionItem from "./SkinConditionItem";

const skinConditionIconMap = {
  RED_HOT: "fire",
  DRY_TIGHT: "cactus",
  AC_LONG_EXPOSURE: "wind",
  STICKY_OILY: "yawn",
  SLEEP_LACK: "zzz",
  DRINKING_DINING: "beer",
  TROUBLE_OIL: "sos",
  COLD_SENSITIVE: "snow",
  LONG_MAKEUP: "lipstick",
};

// 해당사항 없음. 다른 상태와 같이 보내면 서버가 400 을 냄
const NONE = "NONE";

function SkinConditionSection({ selected, setSelected, conditions }) {
  const onClickBtn = (code) => {
    setSelected((prev) => {
      if (prev.includes(code)) {
        return prev.filter((value) => value !== code);
      }

      // 해당사항 없음은 단독 선택만 가능
      if (code === NONE) return [NONE];

      return [...prev.filter((value) => value !== NONE), code];
    });
  };

  return (
    <div className="animate-slide-up rounded-2xl bg-white shadow-[0px_-6px_16px_-2px_rgba(0,0,0,0.10)]">
      <div className="flex items-center gap-0.75 pl-6.5 pt-7.5">
        <div className="text-lg font-bold">
          오늘 귀가 후 피부 상태는?
        </div>

        <div className="text-xs font-medium">
          (중복선택가능)
        </div>
      </div>

      <div className="pl-6.5 text-lg font-normal">
        체크 시 1:1 맞춤 미션으로 즉시 변경됩니다!
      </div>

      <div className="mt-4.5 flex flex-wrap gap-2 pl-6.5">
        {conditions.map((condition) => {
          const data = {
            ...condition,
            icon: skinConditionIconMap[condition.code],
          };

          return (
            <SkinConditionItem
              key={condition.code}
              data={data}
              isSelected={selected.includes(condition.code)}
              onClick={() => onClickBtn(condition.code)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default SkinConditionSection;