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

/** 로딩 화면이 깜빡이지 않도록 최소 노출 시간을 보장합니다. */
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

  // 온보딩 최종 완료. 진단 결과를 서버에 저장하고 내 정보를 받아옵니다.
  const completeOnboarding = async () => {
    if (isSubmitting) return;

    const onboarding = useOnboardingStore.getState();
    const missingStep = findMissingStep(onboarding);

    // 빠뜨린 항목이 있으면 그 단계로 되돌립니다.
    if (missingStep) {
      setPage(missingStep);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setPage(7); // 로딩 화면

    // Promise.all 은 요청이 실패하는 즉시 거부해서 최소 노출 시간이 무시됩니다.
    // allSettled 로 둘 다 끝나기를 기다려야 성공이든 실패든 로딩이 깜빡이지 않습니다.
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

    // 진단은 이미 저장됐으므로, 내 정보 조회가 실패해도 계속 진행합니다.
    // (마이페이지에서 다시 조회합니다)
    try {
      await fetchUser();
    } catch {
      // 무시합니다.
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