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
  completeMissionStep,
  createEveningMission,
  createMorningMission,
  getMissionOptions,
  getMorningRoutine,
  getTodayMissions,
} from "../../api/mission";

import { formatApiDate } from "../../utils/getDate";
import { toCategoryByContent } from "../../utils/missionIcon";

const FULL_COMPLETION_BONUS = 2;

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const connect = useGoogleCalendarStore((state) => state.connect);

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
  const [isCreatingEvening, setIsCreatingEvening] = useState(false);
  const [completingIds, setCompletingIds] = useState([]);
  const [isMorningBlocked, setIsMorningBlocked] = useState(false);

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

  const setEveningMission = useMissionStore(
    (state) => state.setEveningMission,
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

        let { morningMission } = data;

        // 오늘치가 없으면 생성
        if (!morningMission) {
          try {
            morningMission = await createMorningMission();
          } catch (error) {
            console.error("오늘 아침 미션 생성 실패:", error);
          }
        }

        // 아침 미션 아이콘은 고정 아침 미션의 category 로 정합니다.
        // 조회에 실패해도 문장에서 짐작하므로 화면은 그대로 뜹니다.
        let categoryByContent = {};

        try {
          categoryByContent = toCategoryByContent(await getMorningRoutine());
        } catch (error) {
          console.error("고정 아침 미션 조회 실패:", error);
        }

        setTodayMissions({ ...data, morningMission }, categoryByContent);
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

  // 오늘 채워야 할 미션 목록
  //
  // 아침 미션은 정오가 지나 만들어지면 서버가 실패 처리해서 완료가 안 됨.
  // 그대로 두면 보너스 조건을 영영 못 채우므로 완료할 수 있는 것만 셈.
  const getBonusTargets = (
    nextMorning,
    nextEvening,
    morningBlocked,
  ) =>
    morningBlocked
      ? nextEvening
      : [...nextMorning, ...nextEvening];

  // 오늘 받은 미션을 다 채웠으면 보너스 지급
  const awardBonusIfAllDone = (targets) => {
    if (targets.length === 0) return;

    if (isBonusAwardedToday) return;

    const isAllDone = targets.every(
      (mission) => mission.completed,
    );

    if (!isAllDone) return;

    addPoint(FULL_COMPLETION_BONUS);

    markBonusAwarded(formatApiDate());

    setEarnedPoint(
      targets.length + FULL_COMPLETION_BONUS,
    );
  };

  const handleMissionCheckBtn = async (
    id,
    missions,
    tab,
  ) => {
    const target = missions.find(
      (mission) => mission.id === id,
    );

    // 완료 취소 API 가 없어서 한 번 완료하면 되돌릴 수 없음
    if (!target || target.completed) return;

    if (completingIds.includes(id)) return;

    const next = missions.map((mission) =>
      mission.id === id
        ? { ...mission, completed: true }
        : mission,
    );

    // 먼저 화면에 반영하고 실패하면 되돌림
    setMissionsByType(tab, next);

    setCompletingIds((prev) => [...prev, id]);

    try {
      await completeMissionStep(id);
    } catch (error) {
      console.error(
        "미션 완료 실패:",
        error.response?.data ?? error,
      );

      setMissionsByType(tab, missions);

      // 아침이 막힌 걸 여기서 처음 알게 됨.
      // 저녁을 먼저 다 채워둔 경우가 있어 보너스를 다시 판정.
      if (tab === "morning") {
        setIsMorningBlocked(true);

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
      setCompletingIds((prev) =>
        prev.filter((value) => value !== id),
      );
    }

    // 포인트는 서버에 저장된 뒤에 적립
    const missionKey = `${tab}-${id}`;

    if (
      !awardedKeysToday.includes(missionKey)
    ) {
      addPoint(target.point);

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

  const closeCelebration = useCallback(() => {
    setEarnedPoint(null);
  }, []);

  const handleSetMissions = async () => {
    // 생성에 몇 초 걸려서 그동안 다시 눌리지 않게 막음
    if (isCreatingEvening) return;

    if (selected.length === 0) return;

    setIsCreatingEvening(true);

    try {
      const mission =
        await createEveningMission(selected);

      setEveningMission(mission);

      markEveningMissionsSet(
        formatApiDate(),
      );
    } catch (error) {
      console.error(
        "저녁 미션 생성 실패:",
        error.response?.data ?? error,
      );
    } finally {
      setIsCreatingEvening(false);
    }
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
            text={
              isCreatingEvening
                ? "미션 받는 중..."
                : "맞춤 미션 받기"
            }
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