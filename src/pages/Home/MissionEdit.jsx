import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MissionNavBar from "../../components/home/MissionNavBar";
import MissionSection from "../../components/home/MissionSection";
import MissionCategorySection from "../../components/home/MissionCategorySection";
import { recommendedMissionData } from "../../constants/home/recommendedMissionData";
import useMissionStore from "../../store/useMissionStore";
import {
  deleteMorningRoutineItem,
  getMorningRoutine,
} from "../../api/mission";
import { formatApiDate } from "../../utils/getDate";

import backButton from "../../assets/images/back_button.svg";

function MissionProgressBtn({ onClick }) {
  return (
    <div className="flex justify-center mt-5.75 mb-8">
      <button
        onClick={onClick}
        className="w-32 h-10 text-base font-bold text-white bg-emerald-300 rounded-3xl cursor-pointer"
      >
        미션 진행하기
      </button>
    </div>
  );
}

export default function MissionEdit() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialTab = location.state?.missionType ?? "morning";

  // 카테고리 다시 선정하기로 되돌아온 경우에만 있음
  const restoredMissions = location.state?.missions;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [showCategory, setShowCategory] = useState(Boolean(restoredMissions));
  const [selectedCategories, setSelectedCategories] = useState([]);

  // 고정 아침 미션의 "문장 -> itemId".
  //
  // 화면의 미션은 오늘 미션 조회에서 와서 stepId 를 들고 있는데,
  // 삭제 API 는 고정 아침 미션의 itemId 를 받습니다. 두 값이 서로 다릅니다.
  // 다만 오늘 미션의 steps 는 고정 미션의 content 를 그대로 복사한 것이라
  // 문장으로 itemId 를 되찾을 수 있습니다.
  const [itemIdByContent, setItemIdByContent] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const fetchMorningRoutine = async () => {
      try {
        const routine = await getMorningRoutine();

        setItemIdByContent(
          Object.fromEntries(
            (routine?.items ?? []).map((item) => [item.content, item.itemId]),
          ),
        );
      } catch (error) {
        console.error("고정 아침 미션 조회 실패:", error);
      }
    };

    fetchMorningRoutine();
  }, []);

  const storedMorningMissions = useMissionStore(
    (state) => state.morningMissions,
  );

  const storedEveningMissions = useMissionStore(
    (state) => state.eveningMissions,
  );

  const awardedDate = useMissionStore((state) => state.awardedDate);

  const awardedMissionKeys = useMissionStore(
    (state) => state.awardedMissionKeys,
  );

  const setPendingMissionSelection = useMissionStore(
    (state) => state.setPendingMissionSelection,
  );

  const clearPendingMissionSelection = useMissionStore(
    (state) => state.clearPendingMissionSelection,
  );

  // 수정 화면에서만 쓰는 임시 목록. 미션 선정 화면에서 확정해야 실제로 반영
  const [morningMissions, setMorningMissions] = useState(
    restoredMissions && initialTab === "morning"
      ? restoredMissions
      : storedMorningMissions,
  );

  const [eveningMissions, setEveningMissions] = useState(
    restoredMissions && initialTab === "evening"
      ? restoredMissions
      : storedEveningMissions,
  );

  const currentMissions =
    activeTab === "morning" ? morningMissions : eveningMissions;

  // 포인트를 받은 탭은 수정 불가.
  // 미션 하나만 체크해도 그 순간 1점을 받으므로 그때부터 잠깁니다.
  // (수정을 허용하면 미션을 갈아끼우며 점수를 반복해서 받을 수 있습니다)
  //
  // 지급 이력은 오늘 것일 때만 봅니다. 어제 이력으로 오늘까지 잠그면 안 됩니다.
  const isTabLocked =
    awardedDate === formatApiDate() &&
    awardedMissionKeys.some((key) => key.startsWith(`${activeTab}-`));

  const morningRemovedCount = morningMissions.filter(
    (mission) => mission.removed,
  ).length;

  const eveningRemovedCount = eveningMissions.filter(
    (mission) => mission.removed,
  ).length;

  const currentRemovedCount =
    activeTab === "morning" ? morningRemovedCount : eveningRemovedCount;

  const handleMissionRemove = (id, setMissions) => {
    if (isTabLocked) {
      return;
    }

    setMissions((prev) =>
      prev.map((mission) =>
        // 이미 완료한 미션은 그대로 둠
        mission.id === id && !mission.completed
          ? { ...mission, removed: !mission.removed }
          : mission,
      ),
    );
  };

  const getRandomMissions = (missions, count) => {
    const shuffled = [...missions].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, count);
  };

  // 이미 목록에 있거나 방금 뽑은 미션은 후보에서 제외
  // 인기 미션처럼 카테고리는 달라도 내용이 같은 미션이 있어 제목으로 비교
  const getMissionPool = (categoryKey, pickedMissions = []) => {
    const pool = recommendedMissionData[categoryKey] ?? [];

    const usedTitles = [
      ...currentMissions.map((mission) => mission.title),
      ...pickedMissions.map((mission) => mission.title),
    ];

    return pool.filter((mission) => !usedTitles.includes(mission.title));
  };

  const getRecommendedMissions = () => {
    if (selectedCategories.length === 0 || currentRemovedCount === 0) {
      return [];
    }

    // 카테고리 1개 선택
    if (selectedCategories.length === 1) {
      const missions = getMissionPool(selectedCategories[0]);

      return getRandomMissions(missions, currentRemovedCount);
    }

    // 카테고리 2개 선택
    const firstMissions = getMissionPool(selectedCategories[0]);

    // 1개 추천
    if (currentRemovedCount === 1) {
      const selectedPool =
        Math.random() < 0.5
          ? firstMissions
          : getMissionPool(selectedCategories[1]);

      return getRandomMissions(selectedPool, 1);
    }

    // 2개 추천
    if (currentRemovedCount === 2) {
      const firstPicked = getRandomMissions(firstMissions, 1);

      return [
        ...firstPicked,
        ...getRandomMissions(
          getMissionPool(selectedCategories[1], firstPicked),
          1,
        ),
      ];
    }

    // 3개 추천
    const firstGetsTwo = Math.random() < 0.5;

    const firstPicked = getRandomMissions(firstMissions, firstGetsTwo ? 2 : 1);

    return [
      ...firstPicked,
      ...getRandomMissions(
        getMissionPool(selectedCategories[1], firstPicked),
        firstGetsTwo ? 1 : 2,
      ),
    ];
  };

  /**
   * 추천 미션을 고르러 넘어갑니다.
   *
   * 아침 탭에서는 이 시점에 지운 미션을 서버에서도 삭제합니다.
   * 서버 문서가 안내하는 순서(삭제 -> 추천 -> 저장)를 그대로 따릅니다.
   * 저녁 미션은 매일 새로 생성되는 것이라 삭제 API 가 없어 로컬에만 반영됩니다.
   */
  const handleAddClick = async () => {
    if (isDeleting) return;

    const removedMorning =
      activeTab === "morning"
        ? morningMissions.filter((mission) => mission.removed)
        : [];

    if (removedMorning.length > 0) {
      setIsDeleting(true);
      setDeleteError("");

      try {
        for (const mission of removedMorning) {
          const itemId = itemIdByContent[mission.title];

          // 직접 추가한 미션 등 고정 미션에서 못 찾은 것은 로컬에서만 지웁니다.
          if (itemId) {
            await deleteMorningRoutineItem(itemId);
          }
        }
      } catch {
        setDeleteError("미션을 지우지 못했어요. 잠시 후 다시 시도해주세요.");
        setIsDeleting(false);
        return;
      }

      setIsDeleting(false);
    }

    setShowCategory(true);
    setSelectedCategories([]);
  };

  const handleMissionProgress = () => {
    const newRecommendedMissions = getRecommendedMissions();

    // 미션 진행하기를 눌렀을 때만 true
    setPendingMissionSelection(
      activeTab,
      currentMissions,
      newRecommendedMissions,
    );

    navigate("/home");
  };

  const handleBackToHome = () => {
    clearPendingMissionSelection();
    navigate("/home");
  };

  return (
    <div className="min-h-[720px]">
      <img
        src={backButton}
        className="ml-[19px] mt-[50px] cursor-pointer"
        onClick={handleBackToHome}
      />

      <MissionNavBar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setShowCategory(false);
          setSelectedCategories([]);
        }}
      />

      {activeTab === "morning" ? (
        <MissionSection
          missionData={morningMissions}
          onClick={(id) => handleMissionRemove(id, setMorningMissions)}
          isEdit={true}
          isLocked={isTabLocked}
          addCount={morningRemovedCount}
          onAddClick={handleAddClick}
        />
      ) : (
        <MissionSection
          missionData={eveningMissions}
          onClick={(id) => handleMissionRemove(id, setEveningMissions)}
          isEdit={true}
          isLocked={isTabLocked}
          addCount={eveningRemovedCount}
          onAddClick={handleAddClick}
        />
      )}

      {deleteError && (
        <p className="mt-3 text-center text-[13px] font-medium text-sale">
          {deleteError}
        </p>
      )}

      {showCategory && !isTabLocked && (
        <>
          <MissionCategorySection
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />

          {selectedCategories.length > 0 && currentRemovedCount > 0 && (
            <MissionProgressBtn onClick={handleMissionProgress} />
          )}
        </>
      )}
    </div>
  );
}
