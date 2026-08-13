import OnboardingStatus from "../../../components/common/OnboardingStatus/OnboardingStatus";
import PurposeCard from "../../../components/common/PurposeCard/PurposeCard";
import { changes } from "../../../constants/onboardingData";
import InfoBox from "../../../components/common/InfoBox/InfoBox";
import OnboardingButton from "../../../components/common/OnboardingButton/OnboardingButton";
import useOnboardingStore from "../../../store/useOnboardingStore";

export default function PurposeStep({ onNext, onBack }) {

  const selectedPurpose = useOnboardingStore((state) => state.purpose);
  const setSelectedPurpose = useOnboardingStore((state) => state.setPurpose);

  return (
    <div className="relative min-h-[810px]">
      <OnboardingStatus
        step="purpose"
        onBack={onBack}
        progressWidth={270}
        characterLeft={220}
      />
      <header className="flex flex-col ml-[40px] mt-12">
        <p className="text-cyan-900 text-2xl font-semibold leading-10 tracking-wide">
          어떤 변화를 가장 원하세요?
        </p>
        <p className="mt-[2px] text-neutral-400 text-xs font-medium leading-5 tracking-tight">
          원하는 목표를 선택하면 맞춤 루틴을 추천해드릴게요
        </p>
      </header>
      <div className="grid grid-cols-2 ml-9 mt-[10px] gap-y-[12px]">
        {changes.map((change) => (
          <PurposeCard
            key={change.id}
            img={change.img}
            title={change.title}
            onClick={() => setSelectedPurpose(change.title)}
            selected={selectedPurpose === change.title}
          />
        ))}
      </div>
      <InfoBox type="change" />
      <OnboardingButton title="다음" onClick={onNext} />
    </div>
  );
}
