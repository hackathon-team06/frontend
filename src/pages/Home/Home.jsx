import WeatherTipSection from "../../components/home/WeatherTipSection";
import WeekCalenderSection from "../../components/home/WeekCalendarSection";
import MissionNavBar from "../../components/home/MissionNavBar";
import MissionSection from "../../components/home/MissionSection";
import SetUpCharacterSection from "../../components/home/SetUpCharacterSection";
import SkinConditionSection from "../../components/home/SkinConditionSection";
import BigBtn from "../../components/home/BigBtn";
import useLayoutStore from "../../store/useLayoutStore";
import { weatherData } from "../../constants/home/weatherData";
import { weekData } from "../../constants/home/weekData";
import {
  morningMissionData,
  eveningMissionData,
} from "../../constants/home/missionData";
import { useState, useEffect } from "react";

function Home() {
  //오늘 date 임시 하드코딩
  const today = "2026-07-30";
  //아침, 저녁 미션 탭 상태
  const [activeTab, setActiveTab] = useState("morning");
  //아침 미션 상태
  const [morningMissions, setMorningMissions] = useState(morningMissionData);
  //저녁 미션 상태
  const [eveningMissions, setEveningMissions] = useState(eveningMissionData);
  // 저녁 미션 설정 여부 상태
  const [isEveningMissionSet, setIsEveninMissionSet] = useState(false);
  // 선택된 스킨 컨디션 담는 배열 상태
  const [selected, setSelected] = useState([]);
  // store hideFooter set 함수
  const setHideFooter = useLayoutStore((state) => state.setHideFooter);
  // 저녁 탭이면서 미션이 아직 안 정해진 상태
  const isSetUpMode = activeTab === "evening" && !isEveningMissionSet;

  //미션 체크하기 버튼 이벤트 핸들러
  const handleMissionCheckBtn = (id, setState) => {
    setState((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m)),
    );
  };
  //저녁 미션 설정하기 이벤트 핸들러
  const handleSetMissions = () => {
    setIsEveninMissionSet(true);
  };
  //hideFooter
  useEffect(() => {
    setHideFooter(isSetUpMode);
    return () => setHideFooter(false); // 클린업
  }, [isSetUpMode, setHideFooter]);

  return (
    <div>
      <WeatherTipSection weather={weatherData} />
      <WeekCalenderSection weekData={weekData} today={today} />
      <MissionNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "morning" ? (
        <MissionSection
          missionData={morningMissions}
          onClick={(id) => handleMissionCheckBtn(id, setMorningMissions)}
        />
      ) : isEveningMissionSet ? (
        <MissionSection
          missionData={eveningMissions}
          onClick={(id) => handleMissionCheckBtn(id, setEveningMissions)}
        />
      ) : (
        <>
          <SetUpCharacterSection />
          <SkinConditionSection selected={selected} setSelected={setSelected} />
          <BigBtn text="맞춤 미션 받기" onClick={handleSetMissions} />
        </>
      )}
    </div>
  );
}

export default Home;
