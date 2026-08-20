import character from "../../../assets/images/character.svg";
import flagIcon from "../../../assets/icons/flag_icon.svg";
import backButton from "../../../assets/images/back_button.svg";
import union from "../../../assets/images/union.svg";
import finishCharacter from "../../../assets/images/finish_character.svg";

import SkipModal from "../SkipModal/SkipModal";
import { useState } from "react";

export default function OnboardingStatus({
  progressWidth = 53,
  characterLeft = 12,
  step = "info",
  onBack,
}) {
  const [isSkipModalOpen, setIsSkipModalOpen] = useState(false);
  return (
    <div>
      {onBack && (
        <img
          src={backButton}
          onClick={onBack}
          className="absolute left-[20px] top-0 cursor-pointer"
        />
      )}
      {step === "return" && (
        <div className="relative">
          <img src={union} className="absolute top-[45px] left-[205px]" />
          <div className="text-slate-500 text-xs font-medium leading-5 absolute top-[48px] left-[213px]">
            휴. 다와간다..
          </div>
        </div>
      )}
      <p
        onClick={() => setIsSkipModalOpen(true)}
        className="text-zinc-300 text-xs font-medium underline leading-5 mt-[69px] ml-[319px] cursor-pointer"
      >
        건너뛰기
      </p>

      <div className="relative w-[330px] h-[10px] bg-neutral-100 rounded-lg mt-[84px] ml-[30px]">
        {/* 진행바 */}
        <div
          className="h-[10px] absolute top-0 left-0 bg-emerald-300 rounded-lg"
          style={{ width: `${progressWidth}px` }}
        />

        {/* 캐릭터 */}
        <img
          src={step === "routine" ? finishCharacter : character}
          className="w-[65px] h-[50px] absolute -top-[45px]"
          style={{ left: `${characterLeft}px` }}
        />

        {/* 깃발 */}
        {step !== "routine" && (
          <img src={flagIcon} className="absolute -top-[37px] right-0" />
        )}
      </div>
      {isSkipModalOpen && (
        <SkipModal
          onClose={() => setIsSkipModalOpen(false)}
          onSkip={() => {
            setIsSkipModalOpen(false);
          }}
          onContinue={() => {
            setIsSkipModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
