import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WeatherTipSection from "../../components/home/WeatherTipSection";
import WeekCalenderSection from "../../components/home/WeekCalendarSection";
import MissionNavBar from "../../components/home/MissionNavBar";
import MissionSection from "../../components/home/MissionSection";
import MissionSelection from "../../components/home/MissionSelection";
import IngredientRankSection from "../../components/home/IngredientRankSection";
import StampProgressBtn from "../../components/home/StampProgressBtn";
import SetUpCharacterSection from "../../components/home/SetUpCharacterSection";
import SkinConditionSection from "../../components/home/SkinConditionSection";
import BigBtn from "../../components/home/BigBtn";

import useLayoutStore from "../../store/useLayoutStore";
import useMissionStore from "../../store/useMissionStore";

import { weatherData } from "../../constants/home/weatherData";
import { weekData } from "../../constants/home/weekData";
import {
  morningMissionData,
  eveningMissionData,
} from "../../constants/home/missionData";

function Home() {
  const navigate = useNavigate();
  const today = "2026-07-30";

  const [activeTab, setActiveTab] = useState("morning");
  const [morningMissions, setMorningMissions] = useState(morningMissionData);
  const [eveningMissions, setEveningMissions] = useState(eveningMissionData);
  const [isEveningMissionSet, setIsEveninMissionSet] = useState(false);
  const [selected, setSelected] = useState([]);

  const setHideFooter = useLayoutStore((state) => state.setHideFooter);

  const showMissionSelection = useMissionStore(
    (state) => state.showMissionSelection,
  );

  const recommendedMissions = useMissionStore(
    (state) => state.pendingRecommendedMissions,
  );

  const clearPendingMissionSelection = useMissionStore(
    (state) => state.clearPendingMissionSelection,
  );

  const isSetUpMode = activeTab === "evening" && !isEveningMissionSet;

  const handleMissionCheckBtn = (id, setState) => {
    setState((prev) =>
      prev.map((mission) =>
        mission.id === id
          ? { ...mission, completed: !mission.completed }
          : mission,
      ),
    );
  };

  const handleSetMissions = () => {
    setIsEveninMissionSet(true);
  };

  const handleReselectCategory = () => {
    clearPendingMissionSelection();
    navigate(-1);
  };

  useEffect(() => {
    setHideFooter(isSetUpMode);

    return () => {
      setHideFooter(false);
    };
  }, [isSetUpMode, setHideFooter]);

  return (
    <div>
      <div className="relative">
        <WeatherTipSection weather={weatherData} />
        <WeekCalenderSection weekData={weekData} today={today} />

        {showMissionSelection && (
          <MissionSelection
            missions={recommendedMissions}
            onReselect={handleReselectCategory}
          />
        )}
      </div>

      <MissionNavBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "morning" ? (
        <>
          <MissionSection
            missionData={morningMissions}
            onClick={(id) =>
              handleMissionCheckBtn(id, setMorningMissions)
            }
          />
          <IngredientRankSection />
          <StampProgressBtn />
        </>
      ) : isEveningMissionSet ? (
        <>
          <MissionSection
            missionData={eveningMissions}
            onClick={(id) =>
              handleMissionCheckBtn(id, setEveningMissions)
            }
          />
          <IngredientRankSection />
          <StampProgressBtn />
        </>
      ) : (
        <>
          <SetUpCharacterSection />

          <SkinConditionSection
            selected={selected}
            setSelected={setSelected}
          />

          <BigBtn text="맞춤 미션 받기" onClick={handleSetMissions} />
        </>
      )}
    </div>
  );
}

export default Home;