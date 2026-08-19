import FirstIntro from "../../components/home/FirstIntro";
import SecondIntro from "../../components/home/SecondIntro";
import SyncConfirm from "../../components/home/SyncConfirm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import backButton from "../../assets/images/google_back.svg";

export default function GoogleCalendarSync() {
  const navigate = useNavigate();
  //현재 슬라이드 상태
  const [step, setStep] = useState(1);

  const toSecondSlide = () => {
    setStep(2);
  };

  const toThirdSlid = () => {
    setStep(3);
  };

  return (
    <div>
      <div className="flex items-center justify-between px-5.25 mt-4.25">
        <img src={backButton} className="cursor-pointer" onClick={() => navigate(-1)} />
        {step === 1 && (
          <button
            onClick={() => setStep(3)}
            className="underline text-zinc-300 text-xs font-medium cursor-pointer"
          >
            건너뛰기
          </button>
        )}
      </div>
      {step === 1 && <FirstIntro onClick={toSecondSlide} />}
      {step === 2 && <SecondIntro onClick={toThirdSlid} />}
      {step === 3 && <SyncConfirm />}
    </div>
  );
}
// 할 일 여기에서 슬라이드 조건부로 컴포넌트 보여주기
// 연동 후 상태로 홈화면 오버레이 효과
