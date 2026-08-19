import { useState } from "react";
import useOnboardingStore from "../../store/useOnboardingStore";
import useUserStore from "../../store/useUserStore";
import { createDiagnosis } from "../../api/diagnosis";
import { toDiagnosisRequest, findMissingStep } from "../../utils/user";

import InfoStep from "./steps/InfoStep";
import TimeStep from "./steps/TimeStep";
import SkinStep from "./steps/SkinStep";
import PurposeStep from "./steps/PurposeStep";
import RoutineStep from "./steps/RoutineStep";
import Loading from "./Loading";
import Result from "./Result";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Onboarding() {

  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchUser = useUserStore((state) => state.fetchUser);

  // 다음 페이지로 이동
  const nextPage = () => {
    setErrorMessage("");
    setPage((prev) => prev + 1);
  };

  // 이전 페이지로 이동
  const previousPage = () => {
    setErrorMessage("");
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const completeOnboarding = async () => {
    if (isSubmitting) return;

    const onboarding = useOnboardingStore.getState();
    const missingStep = findMissingStep(onboarding);

    if (missingStep) {
      setPage(missingStep);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setPage(7); // 로딩 화면

    const [saved] = await Promise.allSettled([
      createDiagnosis(toDiagnosisRequest(onboarding)),
      wait(2000),
    ]);

    if (saved.status === "rejected") {
      setErrorMessage("저장에 실패했어요. 잠시 후 다시 시도해주세요.");
      setPage(6);
      setIsSubmitting(false);
      return;
    }

    try {
      await fetchUser();
    } catch {
      // 무시
    }

    setIsSubmitting(false);
    setPage(8);
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
          disabled={isSubmitting}
          errorMessage={errorMessage}
        />
      );

    case 7:
      return <Loading />;

    case 8:
      return <Result />;
    default:
      return null;
  }
}