import { useCallback, useEffect, useState } from "react";
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

import useGoogleCalendarStore from "../../store/useGoogleCalendarStore";
import useLayoutStore from "../../store/useLayoutStore";
import useMissionStore from "../../store/useMissionStore";
import usePointStore from "../../store/usePointStore";

import { weatherData } from "../../constants/home/weatherData";
import { weekData } from "../../constants/home/weekData";
import {
  morningMissionData,
  eveningMissionData,
} from "../../constants/home/missionData";

function Home() {
  const justConnected = useGoogleCalendarStore((s) => s.justConnected);
  const clearJustConnected = useGoogleCalendarStore(
    (state) => state.clearJustConnected,
  );
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (justConnected) {
      setShowOverlay(true);
      clearJustConnected();
      const timer = setTimeout(() => setShowOverlay(false), 2300);
      return () => clearTimeout(timer);
    }
  }, [justConnected, clearJustConnected]);

  const navigate = useNavigate();
  const today = "2026-07-30";

  const [activeTab, setActiveTab] = useState("morning");
  const [morningMissions, setMorningMissions] = useState(morningMissionData);
  const [eveningMissions, setEveningMissions] = useState(eveningMissionData);
  const [isEveningMissionSet, setIsEveninMissionSet] = useState(false);
  const [selected, setSelected] = useState([]);

  // 이미 포인트를 준 미션 세트. 체크를 풀었다 다시 눌러도 중복 적립하지 않습니다.
  const [awardedTabs, setAwardedTabs] = useState([]);
  const [earnedPoint, setEarnedPoint] = useState(null);

  const setHideFooter = useLayoutStore((state) => state.setHideFooter);
  const addPoint = usePointStore((state) => state.addPoint);

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

  const handleMissionCheckBtn = (id, missions, setState, tab) => {
    const next = missions.map((mission) =>
      mission.id === id
        ? { ...mission, completed: !mission.completed }
        : mission,
    );

    setState(next);

    // 세트를 다 채운 순간 한 번만 포인트를 적립하고 축하 화면을 띄웁니다.
    const isAllCompleted = next.every((mission) => mission.completed);

    if (isAllCompleted && !awardedTabs.includes(tab)) {
      const earned = next.reduce((sum, mission) => sum + mission.point, 0);

      addPoint(earned);
      setAwardedTabs((prev) => [...prev, tab]);
      setEarnedPoint(earned);
    }
  };

  const closeCelebration = useCallback(() => setEarnedPoint(null), []);

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
          <StampProgressBtn title="스탬프 진행도" onClick={() => navigate("/stamp")} />
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
          <StampProgressBtn title="스탬프 진행도" onClick={() => navigate("/stamp")} />
        </>
      ) : (
        <>
          <SetUpCharacterSection />

          <SkinConditionSection selected={selected} setSelected={setSelected} />

          <BigBtn text="맞춤 미션 받기" onClick={handleSetMissions} />
        </>
      )}
    </div>
  );
}

export default Home;
