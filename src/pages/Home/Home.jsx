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

import {
  getMissionOptions,
  getTodayMissions,
} from "../../api/mission";

import { formatApiDate } from "../../utils/getDate";

const FULL_COMPLETION_BONUS = 2;

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const connect = useGoogleCalendarStore((state) => state.connect);

  const clearJustConnected = useGoogleCalendarStore(
    (state) => state.clearJustConnected,
  );

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

    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams, connect]);

  useEffect(() => {
    clearJustConnected();
  }, [clearJustConnected]);

  const hideSyncOverlay = useCallback(() => {
    setShowOverlay(false);
  }, []);

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("morning");
  const [selected, setSelected] = useState([]);
  const [eveningConditions, setEveningConditions] = useState([]);
  const [earnedPoint, setEarnedPoint] = useState(null);

  const setHideFooter = useLayoutStore((state) => state.setHideFooter);

  const addPoint = usePointStore((state) => state.addPoint);

  const morningMissions = useMissionStore(
    (state) => state.morningMissions,
  );

  const eveningMissions = useMissionStore(
    (state) => state.eveningMissions,
  );

  const setTodayMissions = useMissionStore(
    (state) => state.setTodayMissions,
  );

  const awardedDate = useMissionStore(
    (state) => state.awardedDate,
  );

  const awardedMissionKeys = useMissionStore(
    (state) => state.awardedMissionKeys,
  );

  const bonusAwarded = useMissionStore(
    (state) => state.bonusAwarded,
  );

  const isAwardedToday = awardedDate === formatApiDate();

  const awardedKeysToday = isAwardedToday
    ? awardedMissionKeys
    : [];

  const isBonusAwardedToday =
    isAwardedToday && bonusAwarded;

  const setMissionsByType = useMissionStore(
    (state) => state.setMissionsByType,
  );

  const addAwardedMissionKey = useMissionStore(
    (state) => state.addAwardedMissionKey,
  );

  const markBonusAwarded = useMissionStore(
    (state) => state.markBonusAwarded,
  );

  const showMissionSelection = useMissionStore(
    (state) => state.showMissionSelection,
  );

  const pendingMissionType = useMissionStore(
    (state) => state.pendingMissionType,
  );

  const pendingMissions = useMissionStore(
    (state) => state.pendingMissions,
  );

  const recommendedMissions = useMissionStore(
    (state) => state.pendingRecommendedMissions,
  );

  const applyMissionEdit = useMissionStore(
    (state) => state.applyMissionEdit,
  );

  const clearPendingMissionSelection = useMissionStore(
    (state) => state.clearPendingMissionSelection,
  );

  const eveningSetDate = useMissionStore(
    (state) => state.eveningSetDate,
  );

  const markEveningMissionsSet = useMissionStore(
    (state) => state.markEveningMissionsSet,
  );

  const isEveningMissionSet =
    eveningSetDate === formatApiDate();

  const isSetUpMode =
    activeTab === "evening" && !isEveningMissionSet;

  // 오늘 미션 조회
  useEffect(() => {
    const fetchTodayMissions = async () => {
      try {
        const data = await getTodayMissions();

        console.log("오늘 미션 조회:", data);

        setTodayMissions(data);
      } catch (error) {
        console.error("오늘 미션 조회 실패:", error);
      }
    };

    fetchTodayMissions();
  }, [setTodayMissions]);

  // 미션 공통 옵션 조회
  useEffect(() => {
    const fetchMissionOptions = async () => {
      try {
        const data = await getMissionOptions();

        setEveningConditions(
          data.eveningConditions ?? [],
        );
      } catch (error) {
        console.error(
          "미션 공통 옵션 조회 실패:",
          error,
        );
      }
    };

    fetchMissionOptions();
  }, []);

  const handleMissionCheckBtn = (
    id,
    missions,
    tab,
  ) => {
    const next = missions.map((mission) =>
      mission.id === id
        ? {
            ...mission,
            completed: !mission.completed,
          }
        : mission,
    );

    setMissionsByType(tab, next);

    const checked = next.find(
      (mission) => mission.id === id,
    );

    const missionKey = `${tab}-${id}`;
    const today = formatApiDate();

    if (
      checked.completed &&
      !awardedKeysToday.includes(missionKey)
    ) {
      addPoint(checked.point);

      addAwardedMissionKey(
        missionKey,
        today,
      );
    }

    const nextMorning =
      tab === "morning"
        ? next
        : morningMissions;

    const nextEvening =
      tab === "evening"
        ? next
        : eveningMissions;

    const isAllDone = [
      ...nextMorning,
      ...nextEvening,
    ].every((mission) => mission.completed);

    if (
      isAllDone &&
      !isBonusAwardedToday
    ) {
      addPoint(FULL_COMPLETION_BONUS);

      markBonusAwarded(today);

      const dailyTotal =
        nextMorning.length +
        nextEvening.length +
        FULL_COMPLETION_BONUS;

      setEarnedPoint(dailyTotal);
    }
  };

  const closeCelebration = useCallback(() => {
    setEarnedPoint(null);
  }, []);

  const handleSetMissions = () => {
    markEveningMissionsSet(
      formatApiDate(),
    );
  };

  const handleConfirmMissions = () => {
    applyMissionEdit(
      pendingMissionType,
      pendingMissions,
      recommendedMissions,
    );

    clearPendingMissionSelection();
  };

  const handleReselectCategory = () => {
    const missionType = pendingMissionType;
    const missions = pendingMissions;

    clearPendingMissionSelection();

    navigate("/edit", {
      state: {
        missionType,
        missions,
      },
    });
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

      <MissionNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "morning" ? (
        <>
          <MissionSection
            missionData={morningMissions}
            onClick={(id) =>
              handleMissionCheckBtn(
                id,
                morningMissions,
                "morning",
              )
            }
          />

          <IngredientRankSection />

          <StampProgressBtn
            title="스탬프 진행도"
            onClick={() =>
              navigate("/stamp")
            }
          />
        </>
      ) : isEveningMissionSet ? (
        <>
          <MissionSection
            missionData={eveningMissions}
            onClick={(id) =>
              handleMissionCheckBtn(
                id,
                eveningMissions,
                "evening",
              )
            }
          />

          <IngredientRankSection />

          <StampProgressBtn
            title="스탬프 진행도"
            onClick={() =>
              navigate("/stamp")
            }
          />
        </>
      ) : (
        <>
          <SetUpCharacterSection />

          <SkinConditionSection
            selected={selected}
            setSelected={setSelected}
            conditions={eveningConditions}
          />

          <BigBtn
            text="맞춤 미션 받기"
            onClick={handleSetMissions}
          />
        </>
      )}

      {showOverlay && (
        <SyncCompleteOverlay
          onDone={hideSyncOverlay}
        />
      )}

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