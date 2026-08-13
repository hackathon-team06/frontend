import OnboardingStatus from "../../../components/common/OnboardingStatus/OnboardingStatus";
import SkinCard from "../../../components/common/SkinCard/SkinCard";
import { SKINTYPE } from "../../../constants/onboardingData";
import OnboardingButton from "../../../components/common/OnboardingButton/OnboardingButton";
import useOnboardingStore from "../../../store/useOnboardingStore";

export default function SkinStep({ onNext, onBack }) {

  const selectedSkin = useOnboardingStore((state) => state.skinType);
  const setSelectedSkin = useOnboardingStore((state) => state.setSkinType);

  return (
    <div className="relative min-h-[1043px]">
      <OnboardingStatus
        step="skin"
        onBack={onBack}
        progressWidth={250}
        characterLeft={200}
      />
      <header className="flex flex-col ml-[40px] mt-12">
        <p className="text-cyan-900 text-base font-semibold leading-6 tracking-tight">
          내 피부에 대해 알려주세요
        </p>
        <p className="mt-[4px] text-cyan-900 text-2xl font-semibold leading-10 tracking-wide">
          평소 내 피부는 어떤가요?
        </p>
        <p className="mt-[10px] text-neutral-400 text-xs font-medium leading-5 tracking-tight">
          정확하지 않아도 괜찮아요.
          <br />
          평소 느끼는 피부 상태를 기준으로 선택해주세요.
        </p>
      </header>
      <div className="grid grid-cols-2 ml-9 mt-[37px] gap-y-[10px] whitespace-pre-line">
        {SKINTYPE.map((type) => (
          <SkinCard
            key={type.id}
            img={type.img}
            type={type.type}
            explain={type.explain}
            selected={selectedSkin === type.type}
            onClick={() => setSelectedSkin(type.type)}
          />
        ))}
      </div>
      <OnboardingButton title="다음" onClick={onNext} />
    </div>
  );
}
