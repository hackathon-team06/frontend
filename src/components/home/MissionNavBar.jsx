import TabBtn from "./TabBtn";

function MissionNavBar({ activeTab, setActiveTab }) {
  return (
    <div className="flex justify-between mt-6.75 px-5">
      <TabBtn
        text="아침미션"
        isSelected={activeTab === "morning"}
        onClick={() => setActiveTab("morning")}
      />
      <TabBtn
        text="저녁미션"
        isSelected={activeTab === "evening"}
        onClick={() => setActiveTab("evening")}
      />
    </div>
  );
}

export default MissionNavBar;
