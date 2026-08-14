import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MissionNavBar from "../../components/home/MissionNavBar";
import MissionSection from "../../components/home/MissionSection";
import MissionCategorySection from "../../components/home/MissionCategorySection";
import {
  morningMissionData,
  eveningMissionData,
} from "../../constants/home/missionData";
import { recommendedMissionData } from "../../constants/home/recommendedMissionData";
import useMissionStore from "../../store/useMissionStore";

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

  const [activeTab, setActiveTab] = useState(initialTab);
  const [showCategory, setShowCategory] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [morningMissions, setMorningMissions] = useState(morningMissionData);
  const [eveningMissions, setEveningMissions] = useState(eveningMissionData);

  const setPendingMissionSelection = useMissionStore(
    (state) => state.setPendingMissionSelection,
  );

  const clearPendingMissionSelection = useMissionStore(
    (state) => state.clearPendingMissionSelection,
  );

  const morningRemovedCount = morningMissions.filter(
    (mission) => mission.removed,
  ).length;

  const eveningRemovedCount = eveningMissions.filter(
    (mission) => mission.removed,
  ).length;

  const currentRemovedCount =
    activeTab === "morning" ? morningRemovedCount : eveningRemovedCount;

  const handleMissionRemove = (id, setMissions) => {
    setMissions((prev) =>
      prev.map((mission) =>
        mission.id === id ? { ...mission, removed: !mission.removed } : mission,
      ),
    );
  };

  const getRandomMissions = (missions, count) => {
    const shuffled = [...missions].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, count);
  };

  const getRecommendedMissions = () => {
    if (selectedCategories.length === 0 || currentRemovedCount === 0) {
      return [];
    }

    // 카테고리 1개 선택
    if (selectedCategories.length === 1) {
      const missions = recommendedMissionData[selectedCategories[0]] ?? [];

      return getRandomMissions(missions, currentRemovedCount);
    }

    // 카테고리 2개 선택
    const firstMissions = recommendedMissionData[selectedCategories[0]] ?? [];

    const secondMissions = recommendedMissionData[selectedCategories[1]] ?? [];

    // 1개 추천
    if (currentRemovedCount === 1) {
      const selectedPool = Math.random() < 0.5 ? firstMissions : secondMissions;

      return getRandomMissions(selectedPool, 1);
    }

    // 2개 추천
    if (currentRemovedCount === 2) {
      return [
        ...getRandomMissions(firstMissions, 1),
        ...getRandomMissions(secondMissions, 1),
      ];
    }

    // 3개 추천
    const firstGetsTwo = Math.random() < 0.5;

    return firstGetsTwo
      ? [
          ...getRandomMissions(firstMissions, 2),
          ...getRandomMissions(secondMissions, 1),
        ]
      : [
          ...getRandomMissions(firstMissions, 1),
          ...getRandomMissions(secondMissions, 2),
        ];
  };

  const handleMissionProgress = () => {
    const newRecommendedMissions = getRecommendedMissions().map((mission) => ({
      ...mission,
      removed: false,
      completed: false,
    }));

    // 미션 진행하기를 눌렀을 때만 true
    setPendingMissionSelection(activeTab, newRecommendedMissions);
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
          addCount={eveningRemovedCount}
          onAddClick={() => {
            setShowCategory(true);
            setSelectedCategories([]);
          }}
        />
      )}

      {showCategory && (
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
