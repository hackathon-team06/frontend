import { missionIcons } from "../../constants/home/missionIcons";
import MissionCheckBtn from "./MissionCheckBtn";
import MissionRemoveBtn from "./MissionRemoveBtn";

function MissionItem({ mission, onClick, isEdit = false, isLocked = false }) {
  // 추천 미션은 아이콘이 이모지라 매핑에 없음
  const iconSrc = missionIcons[mission.icon];

  // 포인트를 받은 탭이거나 이미 완료한 미션은 제거 불가
  const isRemoveDisabled = isLocked || mission.completed;

  return (
    <div className="flex items-center py-3">
      <div
        className={`size-8 rounded-[20px] outline-1 outline-zinc-300 flex justify-center items-center mr-1 ${
          isEdit && mission.removed ? "opacity-40 grayscale" : ""
        }`}
      >
        {iconSrc ? (
          <img src={iconSrc} alt={mission.icon} className="w-4 h-4" />
        ) : (
          <span className="text-sm leading-none">{mission.icon}</span>
        )}
      </div>

      <div
        className={`flex-1 pl-1 ${
          isEdit && mission.removed ? "text-[#A8A8A8] opacity-60" : ""
        }`}
      >
        <p className="text-sm font-semibold">{mission.title}</p>

        {mission.subtitle && (
          <p className="text-xs font-semibold">{mission.subtitle}</p>
        )}
      </div>

      <div className="pr-6.5">
        {isEdit ? (
          <MissionRemoveBtn
            removed={mission.removed}
            disabled={isRemoveDisabled}
            onClick={() => onClick(mission.id)}
          />
        ) : (
          <MissionCheckBtn
            completed={mission.completed}
            onClick={() => onClick(mission.id)}
          />
        )}
      </div>
    </div>
  );
}

export default MissionItem;
