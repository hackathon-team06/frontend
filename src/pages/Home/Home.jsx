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
import SyncCompleteOverlay from "../../components/home/SyncCompleteOverlay";
import CelebrationOverlay from "../../components/common/CelebrationOverlay";

import useGoogleCalendarStore from "../../store/useGoogleCalendarStore";
import useLayoutStore from "../../store/useLayoutStore";
import useMissionStore from "../../store/useMissionStore";
import usePointStore from "../../store/usePointStore";


function Home() {
  const clearJustConnected = useGoogleCalendarStore(
    (state) => state.clearJustConnected,
  );

  const [showOverlay, setShowOverlay] = useState(
    () => useGoogleCalendarStore.getState().justConnected,
  );

  useEffect(() => {
    clearJustConnected();
  }, [clearJustConnected]);

  const hideSyncOverlay = useCallback(() => setShowOverlay(false), []);

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("morning");

  // 저녁 미션 설정은 홈에 들어올 때마다 다시
  const [isEveningMissionSet, setIsEveninMissionSet] = useState(false);
  const [selected, setSelected] = useState([]);
  const [earnedPoint, setEarnedPoint] = useState(null);

  const setHideFooter = useLayoutStore((state) => state.setHideFooter);
  const addPoint = usePointStore((state) => state.addPoint);

  const morningMissions = useMissionStore((state) => state.morningMissions);
  const eveningMissions = useMissionStore((state) => state.eveningMissions);
  const awardedTabs = useMissionStore((state) => state.awardedTabs);

  const setMissionsByType = useMissionStore((state) => state.setMissionsByType);

  const addAwardedTab = useMissionStore((state) => state.addAwardedTab);

  const showMissionSelection = useMissionStore(
    (state) => state.showMissionSelection,
  );

  const pendingMissionType = useMissionStore(
    (state) => state.pendingMissionType,
  );

  const pendingMissions = useMissionStore((state) => state.pendingMissions);

  const recommendedMissions = useMissionStore(
    (state) => state.pendingRecommendedMissions,
  );

  const applyMissionEdit = useMissionStore((state) => state.applyMissionEdit);

  const clearPendingMissionSelection = useMissionStore(
    (state) => state.clearPendingMissionSelection,
  );

  const isSetUpMode = activeTab === "evening" && !isEveningMissionSet;

  const handleMissionCheckBtn = (id, missions, tab) => {
    const next = missions.map((mission) =>
      mission.id === id
        ? { ...mission, completed: !mission.completed }
        : mission,
    );

    setMissionsByType(tab, next);

    const isAllCompleted = next.every((mission) => mission.completed);

    if (isAllCompleted && !awardedTabs.includes(tab)) {
      const earned = next.reduce((sum, mission) => sum + mission.point, 0);

      addPoint(earned);
      addAwardedTab(tab);
      setEarnedPoint(earned);
    }
  };

  const closeCelebration = useCallback(() => setEarnedPoint(null), []);

  const handleSetMissions = () => {
    setIsEveninMissionSet(true);
  };

  // 여기서 확정해야 홈 미션 섹션에 반영됨
  const handleConfirmMissions = () => {
    applyMissionEdit(pendingMissionType, pendingMissions, recommendedMissions);
    clearPendingMissionSelection();
  };

  // 수정본을 들고 수정 화면으로 되돌아가기
  const handleReselectCategory = () => {
    const missionType = pendingMissionType;
    const missions = pendingMissions;

    clearPendingMissionSelection();
    navigate("/edit", { state: { missionType, missions } });
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
        <WeatherTipSection />
        <WeekCalenderSection />

        {showMissionSelection && (
          <MissionSelection
            missions={recommendedMissions}
            onConfirm={handleConfirmMissions}
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
              handleMissionCheckBtn(id, morningMissions, "morning")
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
              handleMissionCheckBtn(id, eveningMissions, "evening")
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

      {showOverlay && <SyncCompleteOverlay onDone={hideSyncOverlay} />}

      {earnedPoint !== null && (
        <CelebrationOverlay
          title="미션 성공!"
          description={`총 ${earnedPoint}포인트를 획득했어요.`}
          onClose={closeCelebration}
        />
      )}
    </div>
  );
}

export default Home;
