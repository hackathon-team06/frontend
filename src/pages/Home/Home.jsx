import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
  const [searchParams, setSearchParams] = useSearchParams();

  const connect = useGoogleCalendarStore((state) => state.connect);

  const clearJustConnected = useGoogleCalendarStore(
    (state) => state.clearJustConnected,
  );

  // 구글 동의를 마치면 백엔드가 ?calendar=connected 를 붙여 여기로 돌려보냅니다.
  // 외부에서 들어오는 전체 페이지 로드라 스토어는 초기 상태이고,
  // 연동이 됐는지는 주소로만 알 수 있습니다. 그래서 첫 렌더에서 주소를 바로 읽습니다.
  const [showOverlay, setShowOverlay] = useState(
    () =>
      useGoogleCalendarStore.getState().justConnected ||
      searchParams.get("calendar") === "connected",
  );

  useEffect(() => {
    const result = searchParams.get("calendar");

    if (!result) return;

    if (result === "connected") {
      connect();
    }

    // 실패(calendar=failed)는 사용자가 동의 화면에서 취소한 경우가 대부분이라
    // 따로 알리지 않습니다. 함께 오는 message 는 "유효하지 않은 state 입니다" 같은
    // 개발자용 문구라 사용자에게 보여줄 내용이 아닙니다.
    //
    // 새로고침할 때 오버레이가 다시 뜨지 않도록 주소에서 지웁니다.
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams, connect]);

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
