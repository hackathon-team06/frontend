import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MissionNavBar from "../../components/home/MissionNavBar";
import MissionSection from "../../components/home/MissionSection";
import MissionCategorySection from "../../components/home/MissionCategorySection";
import useMissionStore from "../../store/useMissionStore";
import {
  addEveningMissionSteps,
  deleteEveningMissionStep,
  deleteMorningRoutineItem,
  getEveningMissionRecommendations,
  getMorningRoutine,
  getMorningRoutineRecommendations,
  saveMorningRoutine,
} from "../../api/mission";
import { guessIconFromContent } from "../../utils/missionIcon";

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

  const isTabLocked = currentMissions.some((mission) => mission.completed);

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

  // 선택한 카테고리로 서버에서 미션을 추천받아 지운 개수만큼 사용
  const getRecommendedMissions = async () => {
    if (selectedCategories.length === 0 || currentRemovedCount === 0) {
      return [];
    }

    const data =
      activeTab === "morning"
        ? await getMorningRoutineRecommendations(selectedCategories)
        : await getEveningMissionRecommendations(selectedCategories);

    const usedTitles = currentMissions
      .filter((mission) => !mission.removed)
      .map((mission) => mission.title);

    return (data?.recommendations ?? [])
      .filter((content) => !usedTitles.includes(content))
      .slice(0, currentRemovedCount)
      .map((content) => ({
        id: content,
        icon: guessIconFromContent(content),
        title: content,
      }));
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

  const handleMissionProgress = async () => {
    let newRecommendedMissions;

    try {
      newRecommendedMissions = await getRecommendedMissions();
    } catch (error) {
      console.error("미션 추천 실패:", error);

      setDeleteError("미션을 추천받지 못했어요. 잠시 후 다시 시도해주세요.");

      return;
    }

    if (activeTab === "morning") {
      try {
        const keptMissions = currentMissions.filter(
          (mission) => !mission.removed,
        );

        const finalMorningMissions = [
          ...keptMissions,
          ...newRecommendedMissions,
        ].slice(0, 3);

        const currentRoutine = await getMorningRoutine();

        const routineItemByContent = Object.fromEntries(
          (currentRoutine?.items ?? []).map((item) => [item.content, item]),
        );

        const items = finalMorningMissions.map((mission) => {
          const existingItem = routineItemByContent[mission.title];

          return {
            content: mission.title,
            category: existingItem?.category ?? mission.category ?? null,
            source: existingItem?.source ?? mission.source ?? "CUSTOM",
          };
        });

        await saveMorningRoutine(items);
      } catch (error) {
        console.error("아침 미션 수정 저장 실패:", error);

        setDeleteError(
          "수정한 미션을 저장하지 못했어요. 잠시 후 다시 시도해주세요.",
        );

        return;
      }
    }

    if (activeTab === "evening") {
      try {
        const removedMissions = currentMissions.filter(
          (mission) => mission.removed,
        );

        for (const mission of removedMissions) {
          await deleteEveningMissionStep(mission.id);
        }

        const steps = newRecommendedMissions.map((mission) => mission.title);

        if (steps.length > 0) {
          await addEveningMissionSteps(steps);
        }
      } catch (error) {
        console.error("저녁 미션 수정 저장 실패:", error);

        setDeleteError(
          "수정한 미션을 저장하지 못했어요. 잠시 후 다시 시도해주세요.",
        );

        return;
      }
    }

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
