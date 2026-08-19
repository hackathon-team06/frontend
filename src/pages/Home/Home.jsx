import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

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
  completeMissionStep,
  createEveningMission,
  createMorningMission,
  getMissionOptions,
  getMorningRoutine,
  getTodayMissions,
} from "../../api/mission";

import {
  formatApiDate,
} from "../../utils/getDate";

import {
  toCategoryByContent,
} from "../../utils/missionIcon";

const FULL_COMPLETION_BONUS = 2;

function Home() {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const navigate = useNavigate();

  const connect =
    useGoogleCalendarStore(
      (state) => state.connect,
    );

  const clearJustConnected =
    useGoogleCalendarStore(
      (state) =>
        state.clearJustConnected,
    );

  const [
    showOverlay,
    setShowOverlay,
  ] = useState(
    () =>
      useGoogleCalendarStore.getState()
        .justConnected ||
      searchParams.get("calendar") ===
        "connected",
  );

  useEffect(() => {
    const result =
      searchParams.get("calendar");

    if (!result) return;

    if (result === "connected") {
      connect();
    }

    setSearchParams(
      {},
      {
        replace: true,
      },
    );
  }, [
    searchParams,
    setSearchParams,
    connect,
  ]);

  useEffect(() => {
    clearJustConnected();
  }, [clearJustConnected]);

  const hideSyncOverlay =
    useCallback(() => {
      setShowOverlay(false);
    }, []);

  const [
    activeTab,
    setActiveTab,
  ] = useState("morning");

  const [
    selected,
    setSelected,
  ] = useState([]);

  const [
    eveningConditions,
    setEveningConditions,
  ] = useState([]);

  const [
    earnedPoint,
    setEarnedPoint,
  ] = useState(null);

  const [
    isCreatingEvening,
    setIsCreatingEvening,
  ] = useState(false);

  const [
    completingIds,
    setCompletingIds,
  ] = useState([]);

  const [
    isMorningBlocked,
    setIsMorningBlocked,
  ] = useState(false);

  const setHideFooter =
    useLayoutStore(
      (state) =>
        state.setHideFooter,
    );

  const addPoint =
    usePointStore(
      (state) => state.addPoint,
    );

  const morningMissions =
    useMissionStore(
      (state) =>
        state.morningMissions,
    );

  const eveningMissions =
    useMissionStore(
      (state) =>
        state.eveningMissions,
    );

  const setTodayMissions =
    useMissionStore(
      (state) =>
        state.setTodayMissions,
    );

  const syncMissionDate =
    useMissionStore(
      (state) =>
        state.syncMissionDate,
    );

  const setMissionsByType =
    useMissionStore(
      (state) =>
        state.setMissionsByType,
    );

  const awardedDate =
    useMissionStore(
      (state) =>
        state.awardedDate,
    );

  const awardedMissionKeys =
    useMissionStore(
      (state) =>
        state.awardedMissionKeys,
    );

  const bonusAwarded =
    useMissionStore(
      (state) =>
        state.bonusAwarded,
    );

  const addAwardedMissionKey =
    useMissionStore(
      (state) =>
        state.addAwardedMissionKey,
    );

  const markBonusAwarded =
    useMissionStore(
      (state) =>
        state.markBonusAwarded,
    );

  const showMissionSelection =
    useMissionStore(
      (state) =>
        state.showMissionSelection,
    );

  const pendingMissionType =
    useMissionStore(
      (state) =>
        state.pendingMissionType,
    );

  const pendingMissions =
    useMissionStore(
      (state) =>
        state.pendingMissions,
    );

  const recommendedMissions =
    useMissionStore(
      (state) =>
        state
          .pendingRecommendedMissions,
    );

  const applyMissionEdit =
    useMissionStore(
      (state) =>
        state.applyMissionEdit,
    );

  const clearPendingMissionSelection =
    useMissionStore(
      (state) =>
        state
          .clearPendingMissionSelection,
    );

  const eveningSetDate =
    useMissionStore(
      (state) =>
        state.eveningSetDate,
    );

  const markEveningMissionsSet =
    useMissionStore(
      (state) =>
        state
          .markEveningMissionsSet,
    );

  const setEveningMission =
    useMissionStore(
      (state) =>
        state.setEveningMission,
    );

  const isAwardedToday =
    awardedDate ===
    formatApiDate();

  const awardedKeysToday =
    isAwardedToday
      ? awardedMissionKeys
      : [];

  const isBonusAwardedToday =
    isAwardedToday &&
    bonusAwarded;

  // 오늘 서버에 저녁 미션이 있거나 오늘 직접 생성한 기록이 있으면 표시
  const isEveningMissionSet =
    eveningSetDate ===
      formatApiDate() ||
    eveningMissions.length > 0;

  const isSetUpMode =
    activeTab === "evening" &&
    !isEveningMissionSet;

  // 날짜 확인 -> 다음날이면 store의 전날 미션 데이터 초기화
  useEffect(() => {
    syncMissionDate(
      formatApiDate(),
    );
  }, [syncMissionDate]);

  // 오늘 미션 조회
  useEffect(() => {
    const fetchTodayMissions =
      async () => {
        try {
          const data =
            await getTodayMissions();

          console.log(
            "오늘 미션 조회:",
            data,
          );

          let {
            morningMission,
          } = data;

          // 오늘 아침 미션이 없으면 생성
          if (!morningMission) {
            try {
              morningMission =
                await createMorningMission();
            } catch (error) {
              console.error(
                "오늘 아침 미션 생성 실패:",
                error,
              );
            }
          }

          // 아침 고정 루틴 category 조회
          let categoryByContent =
            {};

          try {
            categoryByContent =
              toCategoryByContent(
                await getMorningRoutine(),
              );
          } catch (error) {
            console.error(
              "고정 아침 미션 조회 실패:",
              error,
            );
          }

          setTodayMissions(
            {
              ...data,

              morningMission,

              eveningMission:
                data.eveningMission,
            },

            categoryByContent,
          );
        } catch (error) {
          console.error(
            "오늘 미션 조회 실패:",
            error,
          );
        }
      };

    fetchTodayMissions();
  }, [setTodayMissions]);

  // 미션 옵션 조회
  useEffect(() => {
    const fetchMissionOptions =
      async () => {
        try {
          const data =
            await getMissionOptions();

          setEveningConditions(
            data.eveningConditions ??
              [],
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

  const getBonusTargets = (
    nextMorning,
    nextEvening,
    morningBlocked,
  ) =>
    morningBlocked
      ? nextEvening
      : [
          ...nextMorning,
          ...nextEvening,
        ];

  const awardBonusIfAllDone = (
    targets,
  ) => {
    if (
      targets.length === 0
    ) {
      return;
    }

    if (
      isBonusAwardedToday
    ) {
      return;
    }

    const isAllDone =
      targets.every(
        (mission) =>
          mission.completed,
      );

    if (!isAllDone) return;

    addPoint(
      FULL_COMPLETION_BONUS,
    );

    markBonusAwarded(
      formatApiDate(),
    );

    setEarnedPoint(
      targets.length +
        FULL_COMPLETION_BONUS,
    );
  };

  const handleMissionCheckBtn =
    async (
      id,
      missions,
      tab,
    ) => {
      const target =
        missions.find(
          (mission) =>
            mission.id === id,
        );

      if (
        !target ||
        target.completed
      ) {
        return;
      }

      if (
        completingIds.includes(
          id,
        )
      ) {
        return;
      }

      // 화면에 먼저 완료 반영
      const next =
        missions.map(
          (mission) =>
            mission.id === id
              ? {
                  ...mission,
                  completed: true,
                }
              : mission,
        );

      setMissionsByType(
        tab,
        next,
      );

      setCompletingIds(
        (prev) => [
          ...prev,
          id,
        ],
      );

      try {
        await completeMissionStep(
          id,
        );
      } catch (error) {
        console.error(
          "미션 완료 실패:",
          error.response?.data ??
            error,
        );

        // API 실패 시 완료 상태 되돌리기
        setMissionsByType(
          tab,
          missions,
        );

        if (
          tab === "morning"
        ) {
          setIsMorningBlocked(
            true,
          );

          awardBonusIfAllDone(
            getBonusTargets(
              morningMissions,
              eveningMissions,
              true,
            ),
          );
        }

        return;
      } finally {
        setCompletingIds(
          (prev) =>
            prev.filter(
              (value) =>
                value !== id,
            ),
        );
      }

      const missionKey =
        `${tab}-${id}`;

      if (
        !awardedKeysToday.includes(
          missionKey,
        )
      ) {
        addPoint(
          target.point,
        );

        addAwardedMissionKey(
          missionKey,
          formatApiDate(),
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

      awardBonusIfAllDone(
        getBonusTargets(
          nextMorning,
          nextEvening,
          isMorningBlocked,
        ),
      );
    };

  const closeCelebration =
    useCallback(() => {
      setEarnedPoint(null);
    }, []);

  // 저녁 맞춤 미션 생성
  const handleSetMissions =
    async () => {
      if (
        isCreatingEvening
      ) {
        return;
      }

      if (
        selected.length === 0
      ) {
        return;
      }

      setIsCreatingEvening(
        true,
      );

      try {
        const mission =
          await createEveningMission(
            selected,
          );

        setEveningMission(
          mission,
        );

        markEveningMissionsSet(
          formatApiDate(),
        );
      } catch (error) {
        console.error(
          "저녁 미션 생성 실패:",
          error.response?.data ??
            error,
        );
      } finally {
        setIsCreatingEvening(
          false,
        );
      }
    };

  const handleConfirmMissions =
    () => {
      applyMissionEdit(
        pendingMissionType,
        pendingMissions,
        recommendedMissions,
      );

      clearPendingMissionSelection();
    };

  const handleReselectCategory =
    () => {
      const missionType =
        pendingMissionType;

      const missions =
        pendingMissions;

      clearPendingMissionSelection();

      navigate("/edit", {
        state: {
          missionType,
          missions,
        },
      });
    };

  useEffect(() => {
    setHideFooter(
      isSetUpMode,
    );

    return () => {
      setHideFooter(false);
    };
  }, [
    isSetUpMode,
    setHideFooter,
  ]);

  return (
    <div>
      <div className="relative">
        <WeatherTipSection />

        <WeekCalenderSection />

        {showMissionSelection && (
          <MissionSelection
            missions={
              recommendedMissions
            }
            onConfirm={
              handleConfirmMissions
            }
            onReselect={
              handleReselectCategory
            }
          />
        )}
      </div>

      <MissionNavBar
        activeTab={activeTab}
        setActiveTab={
          setActiveTab
        }
      />

      {activeTab ===
      "morning" ? (
        <>
          <MissionSection
            missionData={
              morningMissions
            }
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
              navigate(
                "/stamp",
              )
            }
          />
        </>
      ) : isEveningMissionSet ? (
        <>
          <MissionSection
            missionData={
              eveningMissions
            }
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
              navigate(
                "/stamp",
              )
            }
          />
        </>
      ) : (
        <>
          <SetUpCharacterSection />

          <SkinConditionSection
            selected={
              selected
            }
            setSelected={
              setSelected
            }
            conditions={
              eveningConditions
            }
          />

          <BigBtn
            text={
              isCreatingEvening
                ? "미션 받는 중..."
                : "맞춤 미션 받기"
            }
            onClick={
              handleSetMissions
            }
          />
        </>
      )}

      {showOverlay && (
        <SyncCompleteOverlay
          onDone={
            hideSyncOverlay
          }
        />
      )}

      {earnedPoint !==
        null && (
        <CelebrationOverlay
          title="미션 성공!"
          description={`총 ${earnedPoint}포인트를 획득했어요.`}
          onClose={
            closeCelebration
          }
        />
      )}
    </div>
  );
}

export default Home;