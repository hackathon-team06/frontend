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
import { formatApiDate } from "../../utils/getDate";

/** 아침·저녁 미션을 모두 끝냈을 때 얹어주는 보너스 점수. */
const FULL_COMPLETION_BONUS = 2;


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

  const [selected, setSelected] = useState([]);
  const [earnedPoint, setEarnedPoint] = useState(null);

  const setHideFooter = useLayoutStore((state) => state.setHideFooter);
  const addPoint = usePointStore((state) => state.addPoint);

  const morningMissions = useMissionStore((state) => state.morningMissions);
  const eveningMissions = useMissionStore((state) => state.eveningMissions);
  const awardedDate = useMissionStore((state) => state.awardedDate);

  const awardedMissionKeys = useMissionStore(
    (state) => state.awardedMissionKeys,
  );

  const bonusAwarded = useMissionStore((state) => state.bonusAwarded);

  // 저장된 지급 이력은 오늘 것일 때만 유효합니다.
  // 날이 바뀌면 같은 미션이라도 포인트를 다시 받을 수 있어야 합니다.
  const isAwardedToday = awardedDate === formatApiDate();
  const awardedKeysToday = isAwardedToday ? awardedMissionKeys : [];
  const isBonusAwardedToday = isAwardedToday && bonusAwarded;

  const setMissionsByType = useMissionStore((state) => state.setMissionsByType);

  const addAwardedMissionKey = useMissionStore(
    (state) => state.addAwardedMissionKey,
  );

  const markBonusAwarded = useMissionStore((state) => state.markBonusAwarded);

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

  const eveningSetDate = useMissionStore((state) => state.eveningSetDate);

  const markEveningMissionsSet = useMissionStore(
    (state) => state.markEveningMissionsSet,
  );

  // 저녁 미션은 그날 피부 상태를 체크하고 받는 것이라 하루에 한 번만 받습니다.
  // 스토어에 받은 날짜를 두고 오늘과 비교하므로, 다른 화면에 갔다 와도 유지되고
  // 날이 바뀌면 다시 받게 됩니다.
  const isEveningMissionSet = eveningSetDate === formatApiDate();

  const isSetUpMode = activeTab === "evening" && !isEveningMissionSet;

  const handleMissionCheckBtn = (id, missions, tab) => {
    const next = missions.map((mission) =>
      mission.id === id
        ? { ...mission, completed: !mission.completed }
        : mission,
    );

    setMissionsByType(tab, next);

    const checked = next.find((mission) => mission.id === id);
    const missionKey = `${tab}-${id}`;
    const today = formatApiDate();

    // 미션 하나를 완료할 때마다 1점씩 줍니다.
    // 체크를 풀어도 회수하지 않고, 키가 남아 있어 다시 눌러도 중복 지급되지 않습니다.
    if (checked.completed && !awardedKeysToday.includes(missionKey)) {
      addPoint(checked.point);
      addAwardedMissionKey(missionKey, today);
    }

    // 아침·저녁을 모두 끝내면 보너스 2점을 얹고, 그때 한 번만 축하 효과를 띄웁니다.
    const nextMorning = tab === "morning" ? next : morningMissions;
    const nextEvening = tab === "evening" ? next : eveningMissions;

    const isAllDone = [...nextMorning, ...nextEvening].every(
      (mission) => mission.completed,
    );

    if (isAllDone && !isBonusAwardedToday) {
      addPoint(FULL_COMPLETION_BONUS);
      markBonusAwarded(today);

      const dailyTotal =
        nextMorning.length + nextEvening.length + FULL_COMPLETION_BONUS;

      setEarnedPoint(dailyTotal);
    }
  };

  const closeCelebration = useCallback(() => setEarnedPoint(null), []);

  const handleSetMissions = () => {
    markEveningMissionsSet(formatApiDate());
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
