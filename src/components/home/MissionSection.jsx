import MissionItem from "./MissionItem";
import plusIcon from "../../assets/icons/plus_icon.svg";

function MissionSection({missionData, onClick, isEdit = false, addCount = 0, onAddClick}) {
  return (
    <div className="flex flex-col">
      <div
        className={`mx-4 w-90 bg-white shadow-[0px_0.5px_4px_0px_rgba(0,0,0,0.10)] rounded-lg no-scrollbar ${
          isEdit ? "min-h-64 pb-6" : "h-64"
        }`}
      >
        <div className="text-sm font-semibold w-full pl-6 pt-6">
          <p className="pb-2">
            간단한{" "}
            <span className="text-emerald-300 text-sm font-bold leading-6">
              미션 3가지
            </span>
            를 완료해보세요!
          </p>

          {missionData.map((mission) => (
            <MissionItem
              key={mission.id}
              mission={mission}
              onClick={onClick}
              isEdit={isEdit}
            />
          ))}

          {isEdit && (
            <button
              onClick={onAddClick}
              className="flex items-center gap-4 mt-[28px] cursor-pointer pl-2"
            >
              <img src={plusIcon} />

              <span className="text-zinc-600 text-base font-semibold">
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