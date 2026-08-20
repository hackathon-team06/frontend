import femaleIcon from "../../../assets/icons/female_icon.svg";
import maleIcon from "../../../assets/icons/male_icon.svg";
import selectedFemaleIcon from "../../../assets/icons/selectedFemaleIcon.svg";
import selectedMaleIcon from "../../../assets/icons/selectedMaleIcon.svg";

import OnboardingStatus from "../../../components/common/OnboardingStatus/OnboardingStatus";
import OnboardingButton from "../../../components/common/OnboardingButton/OnboardingButton";

import { AGE } from "../../../constants/onboardingData";
import useOnboardingStore from "../../../store/useOnboardingStore";

function OptionButton({ title, img, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer w-[147px] h-[44px] py-2 rounded-lg outline-1 outline-offset-[-1px] inline-flex justify-center items-center gap-2.5 text-base font-medium leading-6
        ${isSelected ? "bg-[#E1F3F4] text-[#57C1BE] outline-[#95DCDA]" : "bg-white text-zinc-300 outline-zinc-300"}`}
    >
      <img src={img} />
      {title}
    </button>
  );
}

export default function InfoStep({ onNext }) {

  const selectedGender = useOnboardingStore((state) => state.gender);
  const selectedAge = useOnboardingStore((state) => state.age);
  const setSelectedGender = useOnboardingStore((state) => state.setGender);
  const setSelectedAge = useOnboardingStore((state) => state.setAge);

  return (
    <div className="flex flex-col pt-[50px]">
      {/* 건너뛰기 + 진행바 */}
      <header>
        <OnboardingStatus />
      </header>
      <main>
        {/* 질문 */}
        <section>
          <p className="mt-9 ml-[40px] text-cyan-900 text-4xl font-bold leading-[57.60px]">
            먼저,
            <br />
            <span className="text-cyan-900 text-2xl font-semibold leading-10 tracking-wide">
              간단한 정보부터 알려주세요
            </span>
          </p>
        </section>
        {/* 성별 옵션 */}
        <section className="flex flex-col gap-4">
          <p className="ml-[40px] mt-12 text-cyan-900 text-sm font-medium leading-6">
            성별을 선택해주세요
          </p>
          <div className="flex gap-4 justify-center">
            <OptionButton
              title="여성"
              img={selectedGender === "여성" ? selectedFemaleIcon : femaleIcon}
              isSelected={selectedGender === "여성"}
              onClick={() => setSelectedGender("여성")}
            />
            <OptionButton
              title="남성"
              img={selectedGender === "남성" ? selectedMaleIcon : maleIcon}
              isSelected={selectedGender === "남성"}
              onClick={() => setSelectedGender("남성")}
            />
          </div>
        </section>
        {/* 나이 옵션 */}
        <section className="flex flex-col gap-4 mt-[62px]">
          <p className="ml-[40px] text-cyan-900 text-sm font-medium leading-6">
            나이를 선택해주세요
          </p>
          <div className="flex overflow-x-auto no-scrollbar">
            {AGE.map((age) => (
              <button
                key={age}
                onClick={() => setSelectedAge(age)}
                className={`shrink-0 w-[72px] h-[72px] flex items-center justify-center cursor-pointer
                    ${selectedAge === age ? "rounded-full bg-[#E1F3F4] text-[#57C1BE] text-2xl font-bold" : "text-[#A8A8A8] text-lg font-semibold"}
                    `}
              >
                {age}
                <span className="font-medium">세</span>
              </button>
            ))}
          </div>
        </section>
      </main>
      <OnboardingButton title="다음" onClick={onNext} />
    </div>
  );
}
