import { missionIcons } from "../../constants/home/missionIcons";
import MissionCheckBtn from "./MissionCheckBtn";

function MissionItem({ mission, onClick }) {
  return (
    <div className="flex items-center py-3">
      <div className="size-8 rounded-[20px] outline-1 outline-zinc-300 flex justify-center items-center mr-1">
        <img
          src={missionIcons[mission.icon]}
          alt={mission.icon}
          className="w-4 h-4"
        />
      </div>
      <div className="flex-1 pl-1">
        <p className="text-sm font-semibold">{mission.title}</p>
        {mission.subtitle && (
          <p className="text-xs font-semibold">{mission.subtitle}</p>
        )}
      </div>
      <div className="pr-6.5">
        <MissionCheckBtn
          completed={mission.completed}
          onClick={() => onClick(mission.id)}
        />
      </div>
    </div>
  );
}

export default MissionItem;
