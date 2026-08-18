import { missionIcons } from "../../constants/home/missionIcons";
import MissionCheckBtn from "./MissionCheckBtn";
import MissionRemoveBtn from "./MissionRemoveBtn";

function MissionItem({
  mission,
  onClick,
  isEdit = false,
  isLocked = false,
}) {
  const iconSrc = missionIcons[mission.icon];
  const isRemoveDisabled = isLocked || mission.completed;

  return (
    <div className="flex items-start py-3">
      <div
        className={`mr-2 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[20px] outline-1 outline-zinc-300 ${
          isEdit && mission.removed ? "opacity-40 grayscale" : ""
        }`}
      >
        {iconSrc ? (
          <img
            src={iconSrc}
            alt={mission.icon}
            className="h-4 w-4"
          />
        ) : (
          <span className="text-sm leading-none">
            {mission.icon}
          </span>
        )}
      </div>

      <div
        className={`min-w-0 flex-1 pr-2 ${
          isEdit && mission.removed
            ? "text-[#A8A8A8] opacity-60"
            : ""
        }`}
      >
        <p className="break-keep text-sm font-semibold leading-5">
          {mission.title}
        </p>

        {mission.subtitle && (
          <p className="mt-0.5 break-keep text-xs font-semibold leading-4">
            {mission.subtitle}
          </p>
        )}
      </div>

      <div className="shrink-0 pr-6.5 pt-0.5">
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