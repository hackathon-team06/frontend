import MissionItem from "./MissionItem";
import plusIcon from "../../assets/icons/plus_icon.svg";

function MissionSection({
  missionData,
  onClick,
  isEdit = false,
  isLocked = false,
  addCount = 0,
  onAddClick,
}) {
  return (
    <div className="flex flex-col">
      <div
        className={`mx-4 w-90 rounded-lg bg-white shadow-[0px_0.5px_4px_0px_rgba(0,0,0,0.10)] no-scrollbar ${
          isEdit ? "min-h-64 pb-6" : "min-h-64 pb-4"
        }`}
      >
        <div className="w-full pl-6 pt-6 text-sm font-semibold">
          <p className="pb-2">
            간단한{" "}
            <span className="text-sm font-bold leading-6 text-emerald-300">
              미션 3가지
            </span>
            를 완료해보세요!
          </p>

          {isEdit && isLocked && (
            <p className="pb-1 text-xs font-medium text-neutral-400">
              포인트를 받은 미션은 수정할 수 없어요
            </p>
          )}

          <div className="flex flex-col">
            {missionData.map((mission) => (
              <MissionItem
                key={mission.id}
                mission={mission}
                onClick={onClick}
                isEdit={isEdit}
                isLocked={isLocked}
              />
            ))}
          </div>

          {isEdit && !isLocked && (
            <button
              type="button"
              onClick={onAddClick}
              className="mt-[28px] flex cursor-pointer items-center gap-4 pl-2"
            >
              <img src={plusIcon} alt="" />

              <span className="text-base font-semibold text-zinc-600">
                {addCount === 0
                  ? "추천 미션 추가하기"
                  : `추천 미션 ${addCount}개 추가하기`}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MissionSection;