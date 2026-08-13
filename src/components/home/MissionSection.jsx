import MissionItem from "./MissionItem";

function MissionSection({ missionData, onClick }) {
  return (
    <div className="flex flex-col">
      <div className="mx-4 h-64 w-90 bg-white  shadow-[0px_0.5px_4px_0px_rgba(0,0,0,0.10)] rounded-lg no-scrollbar">
        <div className="text-sm font-semibold w-full pl-6 pt-6">
          <p className="pb-2">간단한 미션 3가지를 완료해보세요</p>
          {missionData.map((mission) => (
            <MissionItem key={mission.id} mission={mission} onClick={onClick} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MissionSection;
