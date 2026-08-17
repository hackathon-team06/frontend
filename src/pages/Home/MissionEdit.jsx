import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MissionNavBar from "../../components/home/MissionNavBar";
import MissionSection from "../../components/home/MissionSection";
import MissionCategorySection from "../../components/home/MissionCategorySection";
import { recommendedMissionData } from "../../constants/home/recommendedMissionData";
import useMissionStore from "../../store/useMissionStore";
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
          onAddClick={() => {
            setShowCategory(true);
            setSelectedCategories([]);
          }}
        />
      ) : (
        <MissionSection
          missionData={eveningMissions}
          onClick={(id) => handleMissionRemove(id, setEveningMissions)}
          isEdit={true}
          isLocked={isTabLocked}
          addCount={eveningRemovedCount}
          onAddClick={() => {
            setShowCategory(true);
            setSelectedCategories([]);
          }}
        />
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
