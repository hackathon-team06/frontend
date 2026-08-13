import { useState } from "react";
import useOnboardingStore from "../../store/useOnboardingStore";

import InfoStep from "./steps/InfoStep";
import TimeStep from "./steps/TimeStep";
import SkinStep from "./steps/SkinStep";
import PurposeStep from "./steps/PurposeStep";
import RoutineStep from "./steps/RoutineStep";


export default function Onboarding() {

  const [page, setPage] = useState(1);

  // 다음 페이지로 이동
  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  // 이전 페이지로 이동
  const previousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  // 온보딩 최종 완료 (API 연동 전 확인 용도)
  const completeOnboarding = () => {
    const {
      gender,
      age,
      morningTime,
      eveningTime,
      skinType,
      purpose,
      routine,
    } = useOnboardingStore.getState();

    const onboardingData = {
      gender,
      age,
      morningTime,
      eveningTime,
      skinType,
      purpose,
      routine,
    };

    console.log("최종 온보딩 데이터:", onboardingData);

    setPage((prev) => prev + 1);
  };

  switch (page) {
    case 1:
      return <InfoStep onNext={nextPage} />;

    case 2:
      return (
        <TimeStep
          key="wakeup"
          type="wakeup"
          onNext={nextPage}
          onBack={previousPage}
        />
      );

    case 3:
      return (
        <TimeStep
          key="return"
          type="return"
          onNext={nextPage}
          onBack={previousPage}
        />
      );

    case 4:
      return <SkinStep onNext={nextPage} onBack={previousPage} />;

    case 5:
      return <PurposeStep onNext={nextPage} onBack={previousPage} />;

    case 6:
      return (
        <RoutineStep
          onNext={completeOnboarding}
          onBack={previousPage}
        />
      );
    default:
      return null;
  }
}