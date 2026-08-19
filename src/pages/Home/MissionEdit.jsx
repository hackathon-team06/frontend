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
