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
import useUserStore from "../../store/useUserStore";
import usePointStore from "../../store/usePointStore";

import {
  completeMissionStep,
  createEveningMission,
  createMorningMission,
  getMissionOptions,
  getMorningRoutine,
  getTodayMissions,
} from "../../api/mission";

import { formatApiDate } from "../../utils/getDate";

import { toCategoryByContent } from "../../utils/missionIcon";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const connect = useGoogleCalendarStore((state) => state.connect);

  const clearJustConnected = useGoogleCalendarStore(
    (state) => state.clearJustConnected,
  );

  const user = useUserStore((state) => state.user);

  const fetchUser = useUserStore((state) => state.fetchUser);

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
      fetchUser().catch(() => {});
    }

    setSearchParams(
      {},
      {
        replace: true,
      },
    );
  }, [searchParams, setSearchParams, connect, fetchUser]);

  useEffect(() => {
    if (user) return;

    fetchUser().catch(() => {});
  }, [user, fetchUser]);

  useEffect(() => {
    clearJustConnected();
  }, [clearJustConnected]);

  const hideSyncOverlay = useCallback(() => {
    setShowOverlay(false);
  }, []);

  const [activeTab, setActiveTab] = useState("morning");

  const [selected, setSelected] = useState([]);

  const [eveningConditions, setEveningConditions] = useState([]);

  const [earnedPoint, setEarnedPoint] = useState(null);

  const [isCreatingEvening, setIsCreatingEvening] = useState(false);

  const [completingIds, setCompletingIds] = useState([]);

  const setHideFooter = useLayoutStore((state) => state.setHideFooter);

  const fetchPoint = usePointStore((state) => state.fetchPoint);

  const setPoint = usePointStore((state) => state.setPoint);

  const morningMissions = useMissionStore((state) => state.morningMissions);

  const eveningMissions = useMissionStore((state) => state.eveningMissions);

  const setTodayMissions = useMissionStore((state) => state.setTodayMissions);

  const syncMissionDate = useMissionStore((state) => state.syncMissionDate);

  const setMissionsByType = useMissionStore((state) => state.setMissionsByType);

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

  const setEveningMission = useMissionStore((state) => state.setEveningMission);

  // 실제 저녁 미션 데이터가 있을 때만 미션 목록 표시
  const isEveningMissionSet = eveningMissions.length > 0;

  const isSetUpMode = activeTab === "evening" && !isEveningMissionSet;

  // 날짜 확인 -> 다음날이면 store의 전날 미션 데이터 초기화
  useEffect(() => {
    syncMissionDate(formatApiDate());
  }, [syncMissionDate]);

  // 오늘 미션 조회
  useEffect(() => {
    const fetchTodayMissions = async () => {
      try {
        const data = await getTodayMissions();

        console.log("오늘 미션 조회:", data);

        let { morningMission } = data;

        // 오늘 아침 미션이 없으면 생성
        if (!morningMission) {
          try {
            morningMission = await createMorningMission();
          } catch (error) {
            console.error("오늘 아침 미션 생성 실패:", error);
          }
        }

        // 아침 고정 루틴 category 조회
        let categoryByContent = {};

        try {
          categoryByContent = toCategoryByContent(await getMorningRoutine());
        } catch (error) {
          console.error("고정 아침 미션 조회 실패:", error);
        }

        setTodayMissions(
          {
            ...data,

            morningMission,

            eveningMission: data.eveningMission,
          },

          categoryByContent,
        );
      } catch (error) {
        console.error("오늘 미션 조회 실패:", error);
      }
    };

    fetchTodayMissions();
  }, [setTodayMissions]);

  // 미션 옵션 조회
  useEffect(() => {
    const fetchMissionOptions = async () => {
      try {
        const data = await getMissionOptions();

        setEveningConditions(data.eveningConditions ?? []);
      } catch (error) {
        console.error("미션 공통 옵션 조회 실패:", error);
      }
    };

    fetchMissionOptions();
  }, []);

  const handleMissionCheckBtn = async (id, missions, tab) => {
    const target = missions.find((mission) => mission.id === id);

    if (!target || target.completed) {
      return;
    }

    if (completingIds.includes(id)) {
      return;
    }

    // 화면에 먼저 완료 반영
    const next = missions.map((mission) =>
      mission.id === id
        ? {
            ...mission,
            completed: true,
          }
        : mission,
    );

    setMissionsByType(tab, next);

    setCompletingIds((prev) => [...prev, id]);

    let result;

    try {
      result = await completeMissionStep(id);
    } catch (error) {
      console.error("미션 완료 실패:", error.response?.data ?? error);

      // API 실패 시 완료 상태 되돌리기
      setMissionsByType(tab, missions);

      return;
    } finally {
      setCompletingIds((prev) => prev.filter((value) => value !== id));
    }

    if (typeof result?.totalPoint === "number") {
      setPoint(result.totalPoint);
    } else {
      fetchPoint();
    }

    if (result?.dailyMissionsCompleted && result.awardedPoint > 0) {
      const nextMorning = tab === "morning" ? next : morningMissions;

      const nextEvening = tab === "evening" ? next : eveningMissions;

      setEarnedPoint(
        nextMorning.length + nextEvening.length + (result.dailyBonusPoint ?? 0),
      );
    }
  };

  const closeCelebration = useCallback(() => {
    setEarnedPoint(null);
  }, []);

  // 저녁 맞춤 미션 생성
  const handleSetMissions = async () => {
    if (isCreatingEvening) {
      return;
    }

    if (selected.length === 0) {
      return;
    }

    setIsCreatingEvening(true);

    try {
      const mission = await createEveningMission(selected);

      setEveningMission(mission);

      markEveningMissionsSet(formatApiDate());
    } catch (error) {
      console.error("저녁 미션 생성 실패:", error.response?.data ?? error);
    } finally {
      setIsCreatingEvening(false);
    }
  };

  const handleConfirmMissions = () => {
    applyMissionEdit(pendingMissionType, pendingMissions, recommendedMissions);

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

          <StampProgressBtn
            title="스탬프 진행도"
            onClick={() => navigate("/stamp")}
          />
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

          <StampProgressBtn
            title="스탬프 진행도"
            onClick={() => navigate("/stamp")}
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
            text={isCreatingEvening ? "미션 받는 중..." : "맞춤 미션 받기"}
            onClick={handleSetMissions}
          />
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
